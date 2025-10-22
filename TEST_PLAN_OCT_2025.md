# Test Plan: Pre-Release Testing for Changes Since October 15, 2025

## Overview
Testing plan for release validation covering commits from October 15-21, 2025. Focus on surgical changes to minimize regression risk.

## Key Changes to Test
1. **Pagination Fix** (f098b6a) - Dispatch/destruction workflows now handle >25 items correctly
2. **Dual-Flow Authorization** (f7210de) - Password expiration management with self-service and admin flows
3. **Login Security** (40ba354) - Empty password bypass removed
4. **Infrastructure** - GitHub Actions updates, husky hooks removed

## Success Criteria
- ✅ All items >25 receive timestamps in dispatch/destruction
- ✅ All items >25 have audit entries created
- ✅ Self-service password expiration clearance works
- ✅ Admin cross-user password expiration clearance works
- ✅ Authorization blocks unauthorized actions appropriately
- ✅ No regression in basic workflows (<25 items)
- ✅ No unexpected errors or warnings

---

## Phase 1: Local Testing (Standard Database)

### Setup Steps
- [ ] Ensure clean state: `git checkout main && git pull`
- [ ] Install dependencies: `yarn`
- [ ] Build the application: `yarn build`
- [ ] Start local server: `yarn serve`
- [ ] Verify automated tests pass: `yarn test`

---

## Priority 1: Critical - Pagination Fix (>25 Items)

### Test Setup: Create Large Batch Data
**Goal**: Create dispatch and destruction records with >25 items (test with 30, 50, and 100 items)

**Setup Steps**:
- [ ] Login to local test instance (http://localhost:8000)
- [ ] Create a batch with 30+ items OR identify/create items to dispatch/destroy
- [ ] Create test dispatch record with 30 items
- [ ] Create test destruction record with 30 items

### Test Case 1.1: Dispatch with >25 Items
**Location**: `src/resources/dispatch/DispatchShow.tsx:226-228` & `dispatch-operations.ts:30-82`

**Test Steps**:
- [ ] Navigate to Dispatch Show page for the test dispatch (30 items)
- [ ] Click "Complete Dispatch" button
- [ ] **Verify Success Notification**: "Element dispatched"
- [ ] **Verify ALL 30 Items Updated**:
  - [ ] Query database or check Items list
  - [ ] Confirm ALL items have `dispatchedDate` set (not just first 25)
  - [ ] Check timestamps are identical/very close for all items
- [ ] **Verify Audit Trail**:
  - [ ] Navigate to Audit log
  - [ ] Confirm 31 audit entries created (1 for dispatch + 30 for items)
  - [ ] All entries have `activityType: "SENT"`
  - [ ] All item entries reference the dispatch record

**Verification SQL**:
```sql
-- Check all items have dispatchedDate
SELECT id, dispatchedDate FROM _items WHERE id IN ([item_ids]);

-- Check audit entries
SELECT * FROM _audit WHERE resource = 'items' AND activityType = 'SENT' ORDER BY createdAt DESC LIMIT 50;
```

**Success Criteria**:
- [ ] All 30 items have dispatchedDate
- [ ] 31 audit entries present
- [ ] No console errors
- [ ] Success notification displayed

### Test Case 1.2: Destruction with >25 Items
**Location**: `src/resources/destruction/DestructionShow.tsx:163-165` & `destruction-operations.ts:30-82`

**Test Steps**:
- [ ] Navigate to Destruction Show page for the test destruction (30 items)
- [ ] Click "Complete Destruction" button
- [ ] **Verify Success Notification**: "Element destroyed"
- [ ] **Verify ALL 30 Items Updated**:
  - [ ] Query database or check Items list
  - [ ] Confirm ALL items have `destructionDate` set (not just first 25)
  - [ ] Check timestamps are identical/very close for all items
- [ ] **Verify Audit Trail**:
  - [ ] Navigate to Audit log
  - [ ] Confirm 31 audit entries created (1 for destruction + 30 for items)
  - [ ] All entries have `activityType: "DESTROY"`
  - [ ] All item entries reference the destruction record

**Verification SQL**:
```sql
-- Check all items have destructionDate
SELECT id, destructionDate FROM _items WHERE id IN ([item_ids]);

-- Check audit entries
SELECT * FROM _audit WHERE resource = 'items' AND activityType = 'DESTROY' ORDER BY createdAt DESC LIMIT 50;
```

**Success Criteria**:
- [ ] All 30 items have destructionDate
- [ ] 31 audit entries present
- [ ] No console errors
- [ ] Success notification displayed

### Test Case 1.3: Edge Case - 100 Items
**Repeat Test 1.1 or 1.2 with 100 items to verify no performance issues**

**Test Steps**:
- [ ] Create dispatch or destruction with 100 items
- [ ] Complete the operation
- [ ] Verify operation completes in reasonable time (<10 seconds)
- [ ] Verify browser doesn't freeze/hang
- [ ] Verify all 101 audit entries created

---

## Priority 2: Critical - Dual-Flow Authorization

**Note**: This testing will be done in **staging environment** with production user accounts.

### Test Setup: Staging Environment
- [ ] Deploy to staging
- [ ] Identify test user accounts:
  - User A: Regular user (default role, ID=1)
  - User B: rco-user (ID=2) or rco-power-user (ID=3)
  - User C: Target user for password operations

### Test Case 2.1: Self-Service Password Expiration Clearance
**Location**: `_devExtensions/updateBefore-controller.js:34-36` (Flow 1)

**Test Steps**:
- [ ] Login as User C (any role)
- [ ] If User C doesn't have password expiration, manually set `updateBefore` in database:
  ```sql
  UPDATE _users SET updateBefore = '2025-10-23T12:00:00.000Z' WHERE id = [User C ID];
  ```
- [ ] Navigate to User C's profile/password management screen
- [ ] Click "Clear Password Expiration" or equivalent button
- [ ] **Verify**:
  - [ ] Operation succeeds with 201 status
  - [ ] `updateBefore` field cleared in database
  - [ ] No error messages

**Success Criteria**:
- [ ] User C can clear their own password expiration
- [ ] Database updated correctly
- [ ] No authentication errors

### Test Case 2.2: Admin Password Expiration Clearance (Cross-User)
**Location**: `_devExtensions/updateBefore-controller.js:37-42` (Flow 2)

**Test Steps**:
- [ ] Set User C's `updateBefore` again (as in 2.1)
- [ ] Login as User B (rco-user or rco-power-user)
- [ ] Navigate to User C's profile (admin view)
- [ ] Click "Clear Password Expiration" for User C
- [ ] **Verify**:
  - [ ] Operation succeeds with 201 status
  - [ ] User C's `updateBefore` field cleared
  - [ ] User B receives success message

**Verification SQL**:
```sql
SELECT id, username, updateBefore FROM _users WHERE id = [User C ID];
```

**Success Criteria**:
- [ ] Admin can clear other users' password expiration
- [ ] Database updated correctly
- [ ] Audit trail shows who performed the action (if applicable)

### Test Case 2.3: Authorization Rejection - Insufficient Permissions
**Location**: `_devExtensions/updateBefore-controller.js:39-42`

**Test Steps**:
- [ ] Set User C's `updateBefore` again
- [ ] Login as User A (default role, no special permissions)
- [ ] Attempt to navigate to User C's profile admin view
- [ ] Attempt to clear User C's password expiration
- [ ] **Verify**:
  - [ ] Operation returns 403 Forbidden
  - [ ] Error message: "Insufficient permissions. Can only clear your own password expiration unless you have rco-user or rco-power-user role."
  - [ ] User C's `updateBefore` remains unchanged

**Success Criteria**:
- [ ] Unauthorized user blocked from admin action
- [ ] Appropriate error message displayed
- [ ] No data changes occur

### Test Case 2.4: Password Reset Cross-User Protection
**Location**: `_devExtensions/editPassword-controller.js:45-51`

**Test Steps**:
- [ ] Login as User B (rco-user or rco-power-user)
- [ ] Navigate to password reset admin interface
- [ ] Attempt to reset User C's password (should succeed)
- [ ] Attempt to reset User B's own password via admin endpoint
- [ ] **Verify**:
  - [ ] User C password reset succeeds
  - [ ] User B self-reset via admin endpoint FAILS with 403
  - [ ] Error message: "Cannot reset your own password using this endpoint. Use the password change form instead."

**Success Criteria**:
- [ ] Admin can reset other users' passwords
- [ ] Admin blocked from resetting own password via admin endpoint
- [ ] Self-service flow enforced for own password

---

## Priority 3: Important - Regression Testing

### Test Case 3.1: Basic Smoke Tests
**Goal**: Verify core functionality still works

**Test Steps** (Local or Staging):

**Authentication**:
- [ ] Login with valid credentials
- [ ] Logout
- [ ] Login with invalid credentials (should fail)

**Items Management**:
- [ ] View Items list
- [ ] Create new item
- [ ] Edit existing item
- [ ] View item details

**Batches**:
- [ ] View Batches list
- [ ] Create new batch
- [ ] Add items to batch

**Dispatch/Destruction (Small Batches <25)**:
- [ ] Create dispatch with 10 items
- [ ] Complete dispatch
- [ ] Verify all 10 items updated
- [ ] Create destruction with 10 items
- [ ] Complete destruction
- [ ] Verify all 10 items updated

**Audit Log**:
- [ ] View audit log
- [ ] Filter by date/type
- [ ] Verify recent operations logged

**Success Criteria**:
- [ ] All basic operations work as before
- [ ] No console errors
- [ ] No unexpected behavior changes

### Test Case 3.2: Login Controller Security
**Location**: `_devExtensions/login-controller.js` (empty password bypass removed)

**Test Steps** (Staging):
- [ ] Verify you cannot login with empty password
- [ ] Verify you cannot login with username that has null/empty hashed_password in database
- [ ] **If possible**: Check that the 434 new unit tests pass: `yarn test _devExtensions/__tests__/login-controller.test.js`

**Success Criteria**:
- [ ] Empty password login blocked
- [ ] Unit tests pass
- [ ] Security bypass eliminated

---

## Phase 2: Staging Environment Testing

**Prerequisites**:
- [ ] Phase 1 (Local) complete with all Priority 1 & 2 tests passing
- [ ] Code deployed to staging
- [ ] Production user accounts available
- [ ] Staging database backed up

**Execute**:
- [ ] Repeat Priority 1 tests (pagination) with staging data
- [ ] Execute ALL Priority 2 tests (authentication/authorization)
- [ ] Execute Priority 3 tests (regression)
- [ ] Perform exploratory testing of changed areas

---

## Test Execution Checklist

### Before Testing
- [ ] Backup staging database
- [ ] Verify `yarn test` passes locally (especially new tests)
- [ ] Document test user accounts and roles
- [ ] Prepare SQL queries for verification

### During Testing
- [ ] Take screenshots of key verification steps
- [ ] Note any console errors/warnings
- [ ] Record actual vs expected behavior
- [ ] Test with Chrome, Firefox, or primary browser

### After Testing - Final Validation
- [ ] All items >25 receive timestamps in dispatch/destruction
- [ ] All items >25 have audit entries created
- [ ] Self-service password expiration clearance works
- [ ] Admin cross-user password expiration clearance works
- [ ] Authorization blocks unauthorized actions appropriately
- [ ] No regression in basic workflows (<25 items)
- [ ] No unexpected errors or warnings

---

## Quick Rollback Plan

**If critical issues found**:
1. Document the issue with screenshots/logs
2. Rollback deployment: `git revert <commit>` or redeploy previous version
3. Verify rollback successful
4. Fix issue in development
5. Repeat test plan

---

## Time Estimate
- Local testing: 1-2 hours (including test data setup)
- Staging testing: 1-2 hours
- **Total: 2-4 hours**

---

## Related Commits
- `f098b6a` - fix: resolve 25-item pagination limit in dispatch/destruction workflows
- `f7210de` - Merge commit from fork (auth-helper, password management)
- `40ba354` - Merge commit from fork (login controller tests, security fix)
- `a1b133f` - chore: update GitHub Actions
- `6e1085f` - feat: update permissions in settings.local.json

---

## Additional Notes

### Boundary Testing Recommendations
Consider testing with exactly 25 items and exactly 26 items to verify the boundary conditions where the bug occurred.

### Database Verification Queries

**Check user roles**:
```sql
SELECT u.id, u.username, r.id as role_id, r.name as role_name
FROM _users u
LEFT JOIN _users_roles ur ON u.id = ur.user_id
LEFT JOIN _roles r ON ur.role_id = r.id
WHERE u.id IN ([user_ids]);
```

**Check dispatch/destruction completion**:
```sql
-- Dispatch items
SELECT d.id as dispatch_id, COUNT(i.id) as item_count,
       SUM(CASE WHEN i.dispatchedDate IS NOT NULL THEN 1 ELSE 0 END) as completed_count
FROM _dispatch d
LEFT JOIN _items i ON i.id IN (SELECT item_id FROM dispatch_items WHERE dispatch_id = d.id)
WHERE d.id = [dispatch_id]
GROUP BY d.id;

-- Destruction items
SELECT d.id as destruction_id, COUNT(i.id) as item_count,
       SUM(CASE WHEN i.destructionDate IS NOT NULL THEN 1 ELSE 0 END) as completed_count
FROM _destruction d
LEFT JOIN _items i ON i.id IN (SELECT item_id FROM destruction_items WHERE destruction_id = d.id)
WHERE d.id = [destruction_id]
GROUP BY d.id;
```

**Audit trail verification**:
```sql
SELECT activityType, resource, COUNT(*) as entry_count
FROM _audit
WHERE createdAt > '2025-10-22T00:00:00.000Z'
GROUP BY activityType, resource
ORDER BY entry_count DESC;
```

### Performance Monitoring
For the 100-item test, monitor:
- Browser console for any timeout warnings
- Network tab for API call durations
- Database query performance (if accessible)
- Memory usage during operation

---

**Prepared by**: Claude Code Assistant
**Date**: 2025-10-22
**Target Release**: Changes from October 15-21, 2025
