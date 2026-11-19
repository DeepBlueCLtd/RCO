// Turns the raw Chromium coverage saved by e2e/fixtures.ts (E2E_COVERAGE=1)
// into an Istanbul report of the frontend source in src/.
//
//   node e2e/coverage-report.js   (or: yarn e2e:coverage)
//
// Vite serves each module with an inline source map, so coverage maps back
// to the original .ts/.tsx lines. Source files no test loaded are counted as
// 0% covered, so the total covers all of src/, not just what was loaded.
// Output: summary on the console, HTML + lcov + JSON in coverage-e2e/.

const fs = require('node:fs')
const path = require('node:path')
const esbuild = require('esbuild')
const traceMapping = require('@jridgewell/trace-mapping')
const v8toIstanbul = require('v8-to-istanbul')
const libCoverage = require('istanbul-lib-coverage')
const libReport = require('istanbul-lib-report')
const reports = require('istanbul-reports')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'coverage-e2e')
const RAW_DIR = path.join(OUT_DIR, 'raw')

// src files that are not app code
const EXCLUDE = [/\.d\.ts$/, /\.test\.tsx?$/, /\/tests?\//, /\/test-helpers\//]

const listSources = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return listSources(file)
    return /\.tsx?$/.test(entry.name) ? [file] : []
  })

const isAppSource = (file) => !EXCLUDE.some((re) => re.test(file))

const inlineSourceMap = (source) => {
  const match =
    /\/\/# sourceMappingURL=data:application\/json;base64,(\S+)\s*$/.exec(
      source
    )
  return match ? JSON.parse(Buffer.from(match[1], 'base64').toString()) : null
}

// Original lines that produce generated code. Others (types, interfaces,
// type-only imports, comments) are dropped from the count: v8-to-istanbul
// would otherwise count them as covered.
const codeLines = (sourcemap) => {
  const lines = new Set()
  traceMapping.eachMapping(new traceMapping.TraceMap(sourcemap), (m) => {
    if (m.originalLine !== null) lines.add(m.originalLine)
  })
  return lines
}

const onlyCodeLines = (coverage, lines) => {
  for (const fileCoverage of Object.values(coverage)) {
    for (const id of Object.keys(fileCoverage.statementMap)) {
      if (!lines.has(fileCoverage.statementMap[id].start.line)) {
        delete fileCoverage.statementMap[id]
        delete fileCoverage.s[id]
      }
    }
  }
  return coverage
}

const toIstanbul = async (file, source, functions) => {
  const sourcemap = inlineSourceMap(source)
  if (!sourcemap) return null
  const converter = v8toIstanbul(file, 0, {
    source,
    originalSource: fs.readFileSync(file, 'utf8'),
    sourceMap: { sourcemap }
  })
  await converter.load()
  converter.applyCoverage(functions)
  return onlyCodeLines(converter.toIstanbul(), codeLines(sourcemap))
}

// Coverage of the modules the tests loaded, from the raw Chromium data
const loadedCoverage = async () => {
  const entries = fs
    .readdirSync(RAW_DIR)
    .flatMap((name) =>
      JSON.parse(fs.readFileSync(path.join(RAW_DIR, name), 'utf8'))
    )
    .map((entry) => ({
      ...entry,
      file: path.join(ROOT, decodeURIComponent(new URL(entry.url).pathname))
    }))
    .filter((entry) => fs.existsSync(entry.file) && isAppSource(entry.file))
  const results = await Promise.all(
    entries.map((entry) =>
      toIstanbul(entry.file, entry.source, entry.functions)
    )
  )
  return entries
    .map((entry, i) => ({ file: entry.file, coverage: results[i] }))
    .filter((result) => result.coverage)
}

// A file never loaded: compile it as Vite would, with nothing executed
const unloadedCoverage = async (file) => {
  const result = await esbuild.transform(fs.readFileSync(file, 'utf8'), {
    loader: file.endsWith('x') ? 'tsx' : 'ts',
    jsx: 'automatic',
    sourcemap: 'inline',
    sourcefile: file
  })
  // v8-to-istanbul's marker for "report every line as not covered"
  const range = { startOffset: 0, endOffset: result.code.length, count: 0 }
  const functions = [
    { functionName: '(empty-report)', isBlockCoverage: true, ranges: [range] }
  ]
  return toIstanbul(file, result.code, functions)
}

const writeReports = (map) => {
  const context = libReport.createContext({ dir: OUT_DIR, coverageMap: map })
  for (const reporter of ['html', 'lcovonly', 'json-summary']) {
    reports.create(reporter).execute(context)
  }
  reports.create('text', { maxCols: 100 }).execute(context)
  reports.create('text-summary').execute(context)
}

const main = async () => {
  if (!fs.existsSync(RAW_DIR)) {
    console.error('No raw coverage: run `yarn e2e:coverage`')
    process.exit(1)
  }
  const map = libCoverage.createCoverageMap({})
  const seen = new Set()
  for (const result of await loadedCoverage()) {
    map.merge(result.coverage)
    seen.add(result.file)
  }

  const unloaded = listSources(path.join(ROOT, 'src'))
    .filter(isAppSource)
    .filter((file) => !seen.has(file))
  const empty = await Promise.all(unloaded.map(unloadedCoverage))
  empty.filter(Boolean).forEach((coverage) => map.merge(coverage))

  writeReports(map)
  const report = path.relative(process.cwd(), path.join(OUT_DIR, 'index.html'))
  console.log(
    `\n${seen.size} source files loaded by the tests, ` +
      `${unloaded.length} never loaded.\nHTML report: ${report}`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
