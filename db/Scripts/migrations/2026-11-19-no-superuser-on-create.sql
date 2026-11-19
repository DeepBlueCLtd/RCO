-- New user accounts are always created as ordinary users.
--
-- Superuser status is granted only by promoting an existing account with
-- the soul CLI (an UPDATE, which this trigger does not affect). Refuse any
-- INSERT into _users that would create a superuser directly, whichever
-- route the request comes through.
--
-- soul reads is_superuser as true for true, 1 and 'true' (any case).
--
-- Apply once to each client database (db/RCO2.sqlite). Safe to re-run.

CREATE TRIGGER IF NOT EXISTS users_insert_not_superuser
BEFORE INSERT ON _users
WHEN lower(CAST(NEW.is_superuser AS TEXT)) IN ('1', 'true')
BEGIN
  SELECT RAISE(ABORT, 'new users cannot be superusers');
END;
