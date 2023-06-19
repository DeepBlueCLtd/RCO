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

-- Meta table - catHandling
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

--Resource table - User
CREATE TABLE IF NOT EXISTS user (
       id INTEGER PRIMARY KEY,

       name TEXT NOT NULL,
       password TEXT NOT NULL,
       adminRights INTEGER NOT NULL,
       active INTEGER NOT NULL,
       roles TEXT NOT NULL, /*Should be a json array string. Ex.: "['rco-user', 'rco-power-user']" or "['rco-user']" or "[]"*/
       staffNumber TEXT NOT NULL,
       departedDate TEXT,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,

       FOREIGN KEY (createdBy) REFERENCES user(id)
) WITHOUT ROWID;


--Resource table - Audit
CREATE TABLE IF NOT EXISTS audit (
       id INTEGER PRIMARY KEY,

       user INTEGER NOT NULL,
       resource TEXT NOT NULL,
       data INTEGER NOT NULL,
       activityType INTEGER NOT NULL,
       dateTime TEXT NOT NULL,
       label TEXT NOT NULL,
       activityDetail TEXT,
       securityRelated INTEGER,
       subject INTEGER,

       FOREIGN KEY (user) REFERENCES user(id),
       FOREIGN KEY (subject) REFERENCES user(id),
       FOREIGN KEY (activityType) REFERENCES activityType(id)
) WITHOUT ROWID;


--Resource table - Batch
CREATE TABLE IF NOT EXISTS batch (
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       startDate TEXT NOT NULL,
       endDate TEXT NOT NULL,
       projectCode TEXT NOT NULL,
       batchNumber TEXT NOT NULL,
       yearOfReceipt TEXT NOT NULL,
       department INT NOT NULL,
       project INT NOT NULL,
       platform INT NOT NULL,
       organisation INT NOT NULL,
       protectiveMarking INT NOT NULL,
       catCode INTEGER,
       catHandle INTEGER,
       catCave TEXT,
       remarks TEXT NOT NULL,
       receiptNotes TEXT NOT NULL,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,

       FOREIGN KEY (project) REFERENCES project(id),
       FOREIGN KEY (platform) REFERENCES platform(id),
       FOREIGN KEY (department) REFERENCES department(id),
       FOREIGN KEY (organisation) REFERENCES organisation(id),
       FOREIGN KEY (protectiveMarking) REFERENCES protectiveMarking(id),
       FOREIGN KEY (catCode) REFERENCES catCode(id),
       FOREIGN KEY (catHandle) REFERENCES catHandle(id),
       FOREIGN KEY (createdBy) REFERENCES user(id)
) WITHOUT ROWID;


-- Resoure table - Destruction
CREATE TABLE IF NOT EXISTS destruction(
       id INTEGER PRIMARY KEY,

       reference TEXT NOT NULL,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,
       finalisedAt TEXT,
       finalisedBy TEXT,
       remarks TEXT NOT NULL,

       FOREIGN KEY (createdBy) REFERENCES user(id),
       FOREIGN KEY (finalisedBy) REFERENCES user(id)
 ) WITHOUT ROWID;

-- Resoure table - Dispatch
CREATE TABLE IF NOT EXISTS dispatch(
       id INTEGER PRIMARY KEY,

       reference TEXT NOT NULL,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,
       remarks TEXT NOT NULL,
       dispatchedAt TEXT,
       toName TEXT NOT NULL,
       address INTEGER NOT NULL,
       receiptReceived TEXT,
       lastHastenerSent TEXT,

       FOREIGN KEY (createdBy) REFERENCES user(id),
       FOREIGN KEY (address) REFERENCES address(id)
 ) WITHOUT ROWID;

-- Resoure table - Item
CREATE TABLE IF NOT EXISTS item(
       id INTEGER PRIMARY KEY,
       mediaType INTEGER NOT NULL,
       startDate TEXT NOT NULL,
       endDate TEXT NOT NULL,
       batch INTEGER NOT NULL,
       itemNumber TEXT NOT NULL,
       consecPages TEXT,
       vaultLocation INTEGER NOT NULL,
       remarks TEXT NOT NULL,
       protectiveMarking INTEGER NOT NULL,
       catCode INTEGER,
       catHandle INTEGER,
       catCave TEXT, 
       musterRemarks TEXT NOT NULL,
       loanedTo INTEGER,
       loanedDate TEXT,
       
       dispatchJob INTEGER,
       dispatchedDate TEXT,
       destruction INTEGER,
       destructionDate TEXT,


       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,

       FOREIGN KEY (mediaType) REFERENCES mediaType(id),
       FOREIGN KEY (batch) REFERENCES batch(id),
       FOREIGN KEY (vaultLocation) REFERENCES vaultLocation(id),
       FOREIGN KEY (protectiveMarking) REFERENCES protectiveMarking(id),
       FOREIGN KEY (catCode) REFERENCES catCode(id),
       FOREIGN KEY (catHandle) REFERENCES catHandle(id),
       FOREIGN KEY (loanedTo) REFERENCES user(id),
       FOREIGN KEY (dispatchJob) REFERENCES dispatch(id),
       FOREIGN KEY (destruction) REFERENCES destruction(id),
       FOREIGN KEY (createdBy) REFERENCES user(id)

) WITHOUT ROWID;
