-- The role and permission tables are read-only for every role.
--
-- The app only reads _roles (role id by name) and _roles_permissions (the
-- permission matrix, loaded at login). rco-power-user (role 3) also had
-- create and update on both, which the app never uses and which would let
-- a power user change what any role may do. Role assignment (_users_roles)
-- is unchanged: power users still set users' roles.
--
-- Changing roles or permissions is an administrator task (superuser or
-- a migration like this one).
--
-- Apply once to each client database (db/RCO2.sqlite). Safe to re-run.

UPDATE _roles_permissions
SET "create" = 0,
    "update" = 0,
    "delete" = 0,
    updatedAt = CURRENT_TIMESTAMP
WHERE role_id = 3
  AND table_name IN ('_roles', '_roles_permissions');
