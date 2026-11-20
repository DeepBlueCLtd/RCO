-- Users' roles are set only through the /api/set-user-role endpoint.
--
-- The endpoint lets a user assign roles up to their own level, and only to
-- users at or below their own level. rco-power-user (role 3) could also
-- write _users_roles directly, bypassing those checks, so direct create and
-- update are removed for every role. Reading stays (the app shows roles).
--
-- Apply once to each client database (db/RCO2.sqlite). Safe to re-run.

UPDATE _roles_permissions
SET "create" = 0,
    "update" = 0,
    "delete" = 0,
    updatedAt = CURRENT_TIMESTAMP
WHERE table_name = '_users_roles';
