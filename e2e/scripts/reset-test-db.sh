#!/bin/bash

# E2E Test Database Reset Script
#
# This script resets the test database to a clean state by reverting it to the
# committed version in git. This ensures consistent test data between test runs.
#
# Usage:
#   ./e2e/scripts/reset-test-db.sh
#
# Run this before executing e2e tests to ensure test isolation.

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DB_PATH="$PROJECT_ROOT/db/RCO2.sqlite"

echo "========================================="
echo "E2E Test Database Reset"
echo "========================================="
echo ""

# Check if we're in a git repository
if ! git -C "$PROJECT_ROOT" rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Error: Not in a git repository"
  echo "   This script requires git to revert database to clean state"
  exit 1
fi

# Check if database file exists
if [ ! -f "$DB_PATH" ]; then
  echo "❌ Error: Database file not found at: $DB_PATH"
  echo "   Please ensure the database exists before running tests"
  exit 1
fi

# Check if database file is tracked by git
if ! git -C "$PROJECT_ROOT" ls-files --error-unmatch db/RCO2.sqlite > /dev/null 2>&1; then
  echo "⚠️  Warning: Database file is not tracked by git"
  echo "   Cannot reset to clean state automatically"
  echo ""
  echo "   Options:"
  echo "   1. Commit a clean database state to git"
  echo "   2. Create a test fixture: db/test-fixtures/RCO2.test.sqlite"
  echo "   3. Manually reset database before each test run"
  exit 1
fi

# Check if database has uncommitted changes
if git -C "$PROJECT_ROOT" diff --quiet db/RCO2.sqlite; then
  echo "✅ Database is already in clean state (no uncommitted changes)"
  echo ""
else
  echo "🔄 Reverting database to committed version..."
  if git -C "$PROJECT_ROOT" checkout HEAD -- db/RCO2.sqlite; then
    echo "✅ Database reset successfully"
    echo ""
  else
    echo "❌ Error: Failed to reset database"
    exit 1
  fi
fi

# Verify database is not locked
if ! sqlite3 "$DB_PATH" "SELECT 1;" > /dev/null 2>&1; then
  echo "⚠️  Warning: Database may be locked"
  echo "   Please ensure no other processes are using the database:"
  echo "   - Stop all backend servers (yarn serve:dev)"
  echo "   - Close any database tools (SQLite browser, etc.)"
  echo ""
  echo "   To check for processes using the database:"
  echo "   lsof | grep RCO2.sqlite"
  echo ""
  exit 1
fi

echo "✅ Database is ready for testing"
echo ""
echo "You can now run e2e tests:"
echo "  yarn e2e"
echo "  yarn e2e-ui"
echo ""
