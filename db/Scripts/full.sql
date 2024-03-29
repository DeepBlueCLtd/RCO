--Pragmas
-- We'll need to ensure either using a transaction block or declaring [foreign key enabled pragma](https://www.sqlite.org/pragma.html#:~:text=PRAGMA%20foreign_keys%20%3D%20boolean%3B,no%20pending%20BEGIN%20or%20SAVEPOINT.) in the client code to ensure foreign key constraints are respected.
PRAGMA foreign_keys = ON;
-- Meta table - Platform
CREATE TABLE IF NOT EXISTS platform(
       id INTEGER NOT NULL PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - catCave
CREATE TABLE IF NOT EXISTS catCave(
       id TEXT NOT NULL PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - catHandle
CREATE TABLE IF NOT EXISTS catHandle(
       id TEXT NOT NULL PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;


-- Meta table - vault
CREATE TABLE IF NOT EXISTS vault(
       id TEXT NOT NULL PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;


-- Meta table - catCode
CREATE TABLE IF NOT EXISTS catCode(
       id TEXT NOT NULL PRIMARY KEY,
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
       active INTEGER NOT NULL,
       shelfSize INTEGER
) WITHOUT ROWID;

-- Meta table - department
CREATE TABLE IF NOT EXISTS department(
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

-- Meta table - organisation
CREATE TABLE IF NOT EXISTS organisation(
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL,
       active INTEGER NOT NULL
) WITHOUT ROWID;

--Resource table - Project
CREATE TABLE IF NOT EXISTS project (
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       remarks TEXT,
       createdAt TEXT NOT NULL,
       createdBy INT,
       startDate TEXT NOT NULL,
       endDate TEXT NOT NULL,
       enduring INTEGER NOT NULL,
       active INTEGER NOT NULL,
       FOREIGN KEY (createdBy) REFERENCES user(id)
) WITHOUT ROWID;


-- Meta table - Media Type
CREATE TABLE IF NOT EXISTS mediaType(
       id INTEGER PRIMARY KEY,
       active INTEGER NOT NULL,
       name TEXT NOT NULL,
       itemSize INTEGER /* storage volume required */
) WITHOUT ROWID;


-- Resource table - Address
CREATE TABLE IF NOT EXISTS address(
       id INTEGER PRIMARY KEY,
       createdAt TEXT NOT NULL,
       fullAddress TEXT NOT NULL,
       active INTEGER NOT NULL,
       remarks TEXT
 ) WITHOUT ROWID;

--Resource table - User
CREATE TABLE IF NOT EXISTS user (
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       password TEXT NOT NULL,
       role TEXT,  /* Should be string Ex.: 'rco-user, 'rco-power-user' */
       staffNumber TEXT NOT NULL,
       departedDate TEXT,
       lastUpdatedAt TEXT,
       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,
       lockoutAttempts INTEGER NOT NULL DEFAULT 0,

       FOREIGN KEY (createdBy) REFERENCES user(id)
) WITHOUT ROWID;


--Resource table - Audit
CREATE TABLE IF NOT EXISTS audit (
       id INTEGER PRIMARY KEY,

       user INTEGER NOT NULL,
       resource TEXT,
       dataId INTEGER,
       activityType INTEGER,
       dateTime TEXT NOT NULL,
       label TEXT NOT NULL,
       activityDetail TEXT,
       securityRelated INTEGER,
       subjectId INTEGER,
       subjectResource: TEXT,
       ip TEXT,

       FOREIGN KEY (user) REFERENCES user(id),
       FOREIGN KEY (subject) REFERENCES user(id),
       FOREIGN KEY (activityType) REFERENCES activityType(id)
) WITHOUT ROWID;


--Resource table - Batch
CREATE TABLE IF NOT EXISTS batch (
       id INTEGER PRIMARY KEY,
       batchNumber TEXT NOT NULL,
       yearOfReceipt INT NOT NULL,
       project INT,
       platform INT,
       organisation TEXT,
       vault TEXT NOT NULL,
       department TEXT,
       remarks TEXT,
       receiptNotes TEXT,
       createdAt TEXT NOT NULL,
       createdBy INT, 

       FOREIGN KEY (project) REFERENCES project(id),
       FOREIGN KEY (platform) REFERENCES platform(id),
       FOREIGN KEY (department) REFERENCES department(id),
       FOREIGN KEY (organisation) REFERENCES organisation(id),
       FOREIGN KEY (protectiveMarking) REFERENCES protectiveMarking(id),
       FOREIGN KEY (createdBy) REFERENCES user(id),
       FOREIGN KEY (vault) REFERENCES vault(id)
) WITHOUT ROWID;

-- Resource table - Destruction
CREATE TABLE IF NOT EXISTS destruction(
       id INTEGER PRIMARY KEY,

       name TEXT,
       vault TEXT NOT NULL,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,
       reportPrintedAt TEXT,
       finalisedAt TEXT,
       finalisedBy TEXT,
       remarks TEXT,

       FOREIGN KEY (createdBy) REFERENCES user(id),
       FOREIGN KEY (finalisedBy) REFERENCES user(id),
       FOREIGN KEY (vault) REFERENCES vault(id)
 ) WITHOUT ROWID;

-- Resource table - Dispatch
CREATE TABLE IF NOT EXISTS dispatch(
       id INTEGER PRIMARY KEY,

       name TEXT,
       vault TEXT NOT NULL,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,
       reportPrintedAt TEXT,
       dispatchedAt TEXT,
       toName TEXT NOT NULL,
       toAddress INTEGER NOT NULL,
       receiptReceived TEXT,
       lastHastenerSent TEXT,

       remarks TEXT,

       FOREIGN KEY (createdBy) REFERENCES user(id),
       FOREIGN KEY (address) REFERENCES address(id),
       FOREIGN KEY (vault) REFERENCES vault(id)
 ) WITHOUT ROWID;

-- Resource table - Item
CREATE TABLE IF NOT EXISTS item(
       id INTEGER PRIMARY KEY,
       mediaType INTEGER NOT NULL,
       legacyMediaType INTEGER, /* not present for new data */
       startDate TEXT,
       endDate TEXT,
       batch INTEGER NOT NULL,
       itemNumber TEXT NOT NULL,
       consecSheets TEXT,
       vaultLocation INTEGER,
       remarks TEXT,
       protectiveMarking INTEGER NOT NULL,
       protectionString TEXT NOT NULL,
       musterRemarks TEXT,
       loanedTo INTEGER,
       loanedDate TEXT,
       
       dispatchJob INTEGER,
       dispatchedDate TEXT,
       destruction INTEGER,
       destructionDate TEXT,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,

       FOREIGN KEY (mediaType) REFERENCES mediaType(id),
       FOREIGN KEY (legacyMediaType) REFERENCES mediaType(id),
       FOREIGN KEY (batch) REFERENCES batch(id),
       FOREIGN KEY (vaultLocation) REFERENCES vaultLocation(id),
       FOREIGN KEY (protectiveMarking) REFERENCES protectiveMarking(id),
       FOREIGN KEY (loanedTo) REFERENCES user(id),
       FOREIGN KEY (dispatchJob) REFERENCES dispatch(id),
       FOREIGN KEY (destruction) REFERENCES destruction(id),
       FOREIGN KEY (createdBy) REFERENCES user(id)

) WITHOUT ROWID;


-- DDL for Table itemCode

CREATE TABLE if not exists itemCode (
    id INTEGER PRIMARY KEY,
    item INTEGER NOT NULL,
    catCode TEXT NOT NULL,
    FOREIGN KEY (item) REFERENCES item(id),
    FOREIGN KEY (catCode) REFERENCES catCode(id)
);

-- DDL for Table itemHandle

CREATE TABLE if not exists itemHandle (
    id INTEGER PRIMARY KEY,
    item INTEGER NOT NULL,
    catHandle TEXT NOT NULL,
    FOREIGN KEY (item) REFERENCES item(id),
    FOREIGN KEY (catHandle) REFERENCES catHandle(id)
);

-- DDL for Table ItemCaves

CREATE TABLE if not exists itemCave (
    id INTEGER PRIMARY KEY,
    item INTEGER NOT NULL,
    catCave TEXT NOT NULL,
    FOREIGN KEY (item) REFERENCES item(id),
    FOREIGN KEY (catCave) REFERENCES catCave(id)
);

CREATE TABLE if not exists  configData (
  projectName  TEXT NOT NULL,
  projectsName  TEXT NOT NULL,
  fromAddress  TEXT NOT NULL,
  protectionName  TEXT NOT NULL,
  catCode  TEXT NOT NULL,
  catHandle  TEXT NOT NULL,
  catCave  TEXT NOT NULL,
  headerMarking TEXT NOT NULL,
  reportPrefix TEXT NOT NULL
)

