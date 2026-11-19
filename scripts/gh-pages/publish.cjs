#!/usr/bin/env node
// Publishes files to the gh-pages branch, which GitHub Pages serves.
// Used by .github/workflows/static.yml (main) and pr-preview.yml (PRs).
//
//   node scripts/gh-pages/publish.cjs [--copy <src>:<dest>]... [--pr]
//
// --copy  replaces <dest> on the site with the contents of directory <src>
//         (skipped, keeping what is there, if <src> does not exist)
// --pr    adds or updates this pull request's entry in prs.json, from the
//         environment: PR_NUMBER, PR_TITLE, PR_AUTHOR, PR_URL, PR_BRANCH,
//         PR_STATE (open | closed | merged) and PR_COVERAGE (true | false).
//         A closed PR keeps its preview; only its entry is updated.
//
// Every publish also refreshes the landing page (pages/index.html).
//
// The branch is kept to a single commit, replaced on each publish, so old
// previews do not pile up in the repository's history. Workflows may publish
// at the same time: the push uses --force-with-lease, and on a conflict the
// script starts again from the new branch tip.
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const BRANCH = 'gh-pages'
const ROOT = path.join(__dirname, '..', '..')
const WORK = path.join(ROOT, '.gh-pages-work')
const ATTEMPTS = 5
// a fixed path, not a PATH lookup: this runs on GitHub's Ubuntu runners
const GIT = '/usr/bin/git'

const git = (args, opts = {}) =>
  execFileSync(GIT, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...opts
  }).trim()

const parseArgs = (argv) => {
  const copies = []
  let pr = false
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--copy') {
      const [src, dest] = argv[++i].split(':')
      if (!src || !dest || dest.includes('..') || path.isAbsolute(dest)) {
        throw new Error(`Bad --copy ${argv[i]}`)
      }
      copies.push({ src: path.resolve(src), dest })
    } else if (argv[i] === '--pr') {
      pr = true
    } else {
      throw new Error(`Unknown argument ${argv[i]}`)
    }
  }
  return { copies, pr }
}

const prEntry = () => {
  const number = Number(process.env.PR_NUMBER)
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error('PR_NUMBER must be set for --pr')
  }
  const state = process.env.PR_STATE || 'open'
  if (!['open', 'closed', 'merged'].includes(state)) {
    throw new Error(`Bad PR_STATE ${state}`)
  }
  return {
    number,
    title: process.env.PR_TITLE || '',
    author: process.env.PR_AUTHOR || '',
    url: process.env.PR_URL || '',
    branch: process.env.PR_BRANCH || '',
    state,
    coverage: process.env.PR_COVERAGE === 'true',
    updatedAt: new Date().toISOString()
  }
}

// Returns true if prs.json changed
const updatePrList = (siteDir, entry) => {
  const file = path.join(siteDir, 'prs.json')
  let prs = []
  if (fs.existsSync(file)) {
    try {
      prs = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      console.warn('prs.json was not valid JSON: starting a new list')
    }
  }
  const existing = prs.find((p) => p.number === entry.number)
  if (entry.state !== 'open') {
    // closed or merged: keep the preview, record the new state
    if (!existing) return false
    Object.assign(existing, {
      state: entry.state,
      title: entry.title || existing.title,
      updatedAt: entry.updatedAt
    })
  } else if (existing) {
    Object.assign(existing, entry)
  } else {
    prs.push(entry)
  }
  prs.sort((a, b) => b.number - a.number)
  fs.writeFileSync(file, JSON.stringify(prs, null, 2) + '\n')
  return true
}

const fetchBranch = () => {
  try {
    git([
      'fetch',
      '--depth=1',
      'origin',
      `+refs/heads/${BRANCH}:refs/remotes/origin/${BRANCH}`
    ])
    return git(['rev-parse', `refs/remotes/origin/${BRANCH}`])
  } catch {
    return null // the branch does not exist yet
  }
}

const prepareWorktree = (base) => {
  if (fs.existsSync(WORK)) {
    git(['worktree', 'remove', '--force', WORK])
  }
  git(['worktree', 'prune'])
  git(['worktree', 'add', '--detach', WORK, base || 'HEAD'])
  if (!base) {
    // start an empty site
    for (const name of fs.readdirSync(WORK)) {
      if (name !== '.git') fs.rmSync(path.join(WORK, name), { recursive: true })
    }
  }
}

const applyChanges = ({ copies, pr }) => {
  fs.copyFileSync(
    path.join(ROOT, 'pages', 'index.html'),
    path.join(WORK, 'index.html')
  )
  fs.writeFileSync(path.join(WORK, '.nojekyll'), '')
  if (!fs.existsSync(path.join(WORK, 'prs.json'))) {
    fs.writeFileSync(path.join(WORK, 'prs.json'), '[]\n')
  }
  for (const { src, dest } of copies) {
    if (!fs.existsSync(src)) {
      console.warn(`${src} not found: keeping the site's ${dest}`)
      continue
    }
    const target = path.join(WORK, dest)
    fs.rmSync(target, { recursive: true, force: true })
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.cpSync(src, target, { recursive: true })
  }
  if (pr) updatePrList(WORK, pr)
}

const commitAndPush = (base, message) => {
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'github-actions[bot]',
    GIT_AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
    GIT_COMMITTER_NAME: 'github-actions[bot]',
    GIT_COMMITTER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com'
  }
  git(['add', '-A'], { cwd: WORK })
  const tree = git(['write-tree'], { cwd: WORK })
  if (base && tree === git(['rev-parse', `${base}^{tree}`])) {
    console.log('gh-pages is already up to date')
    return true
  }
  const commit = git(['commit-tree', tree, '-m', message], { cwd: WORK, env })
  try {
    git([
      'push',
      `--force-with-lease=refs/heads/${BRANCH}:${base || ''}`,
      'origin',
      `${commit}:refs/heads/${BRANCH}`
    ])
    return true
  } catch {
    return false
  }
}

const main = () => {
  const args = parseArgs(process.argv.slice(2))
  const changes = { copies: args.copies, pr: args.pr ? prEntry() : null }
  const what = [
    ...args.copies.map((c) => c.dest),
    ...(changes.pr ? [`PR #${changes.pr.number} (${changes.pr.state})`] : [])
  ].join(', ')
  const message = `Publish ${what || 'landing page'}\n\nSource: ${
    process.env.GITHUB_SHA || git(['rev-parse', 'HEAD'])
  }`
  try {
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
      const base = fetchBranch()
      prepareWorktree(base)
      applyChanges(changes)
      if (commitAndPush(base, message)) {
        console.log(`Published to ${BRANCH}: ${what || 'landing page'}`)
        return
      }
      console.warn(`Push rejected (attempt ${attempt}): retrying`)
      Atomics.wait(
        new Int32Array(new SharedArrayBuffer(4)),
        0,
        0,
        attempt * 3000
      )
    }
    throw new Error(`Could not publish to ${BRANCH}`)
  } finally {
    if (fs.existsSync(WORK)) git(['worktree', 'remove', '--force', WORK])
  }
}

if (require.main === module) {
  try {
    main()
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = { updatePrList }
