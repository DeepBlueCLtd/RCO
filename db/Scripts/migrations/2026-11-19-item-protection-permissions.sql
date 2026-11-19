-- Let rco-user (role 2) and rco-power-user (role 3) save an item's
-- protective-marking codes, caves and handles.
--
-- These live in the itemCode / itemCave / itemHandle bridging tables. The
-- app saves them by deleting an item's rows and inserting the new ones
-- (src/hooks/useRefTable.ts), but neither role could delete, and rco-user
-- could not insert. So an rco-user's codes were silently dropped when
-- adding an item, and no one but a superuser could change an item's codes.
-- Both roles can already create and edit items; this matches that.
--
-- Apply once to each client database (db/RCO2.sqlite). Safe to re-run.

UPDATE _roles_permissions
SET "create" = 1,
    "update" = 1,
    "delete" = 1,
    updatedAt = CURRENT_TIMESTAMP
WHERE role_id IN (2, 3)
  AND table_name IN ('itemCode', 'itemCave', 'itemHandle');
