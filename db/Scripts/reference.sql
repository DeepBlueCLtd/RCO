--Pragmas
-- We'll need to ensure either using a transaction block or declaring [foreign key enabled pragma](https://www.sqlite.org/pragma.html#:~:text=PRAGMA%20foreign_keys%20%3D%20boolean%3B,no%20pending%20BEGIN%20or%20SAVEPOINT.) in the client code to ensure foreign key constraints are respected.
PRAGMA foreign_keys = ON;
-- Meta table - Platform
CREATE TABLE IF NOT EXISTS platform(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - catCave
CREATE TABLE IF NOT EXISTS catCave(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - catHandle
CREATE TABLE IF NOT EXISTS catHandle(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - catCode
CREATE TABLE IF NOT EXISTS catCode(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - platformOriginator
CREATE TABLE IF NOT EXISTS platformOriginator(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - protectiveMarking
CREATE TABLE IF NOT EXISTS protectiveMarking(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - vaultLocation
CREATE TABLE IF NOT EXISTS vaultLocation(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - department
CREATE TABLE IF NOT EXISTS department(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - organisation
CREATE TABLE IF NOT EXISTS organisation(
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

--Resource table - Project
CREATE TABLE IF NOT EXISTS project (
       id INTEGER PRIMARY KEY,

       name TEXT NOT NULL,
       remarks TEXT NOT NULL,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,

       FOREIGN KEY (createdBy) REFERENCES user(id)
) WITHOUT ROWID;


-- Meta table - Media Type
CREATE TABLE IF NOT EXISTS mediaType(
       id INTEGER PRIMARY KEY,
       active INTEGER NOT NULL,
       name TEXT NOT NULL
) WITHOUT ROWID;


-- Resoure table - Address
CREATE TABLE IF NOT EXISTS address(
       id INTEGER PRIMARY KEY,

       createdAt TEXT NOT NULL,
       fullAddress TEXT NOT NULL,
       active INTEGER NOT NULL,
       remarks TEXT NOT NULL
 ) WITHOUT ROWID;
