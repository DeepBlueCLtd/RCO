import { execSync } from 'child_process'
import path from 'path'

/**
 * Global teardown script for Playwright tests
 * Resets the test database after all tests complete
 */
async function globalTeardown(): Promise<void> {
  console.log('\n🔄 Resetting test database...')

  try {
    const scriptPath = path.join(__dirname, 'scripts', 'reset-test-db.sh')
    execSync(`bash "${scriptPath}"`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    })
    console.log('✅ Test database reset complete\n')
  } catch (error) {
    console.error('❌ Failed to reset test database:', error)
    // Don't fail teardown - just warn
  }
}

export default globalTeardown
