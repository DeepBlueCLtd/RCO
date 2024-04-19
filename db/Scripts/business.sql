--Pragmas
-- We'll need to ensure either using a transaction block or declaring [foreign key enabled pragma](https://www.sqlite.org/pragma.html#:~:text=PRAGMA%20foreign_keys%20%3D%20boolean%3B,no%20pending%20BEGIN%20or%20SAVEPOINT.) in the client code to ensure foreign key constraints are respected.
PRAGMA foreign_keys = ON;

--Resource table - User
CREATE TABLE IF NOT EXISTS user (
       id INTEGER PRIMARY KEY,

       name TEXT NOT NULL,
       password TEXT NOT NULL,
       role TEXT, /* Should be string Ex.: 'rco-user, 'rco-power-user' */
       username TEXT NOT NULL,
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
       catCode INT NOT NULL,
       catHandle INT NOT NULL,
       catCave INT NOT NULL,
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
       FOREIGN KEY (catCave) REFERENCES catCave(id),
       FOREIGN KEY (createdBy) REFERENCES user(id)
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
       catCode INT NOT NULL,
       catHandle INT NOT NULL,
       catCave INT NOT NULL,
       musterRemarks TEXT NOT NULL,
       loanedTo INTEGER,
       loanedDate TEXT,
       consecPaegs TEXT,

       createdAt TEXT NOT NULL,
       createdBy INT NOT NULL,

       FOREIGN KEY (mediaType) REFERENCES mediaType(id),
       FOREIGN KEY (batch) REFERENCES batch(id),
       FOREIGN KEY (vaultLocation) REFERENCES vaultLocation(id),
       FOREIGN KEY (protectiveMarking) REFERENCES protectiveMarking(id),
       FOREIGN KEY (catCode) REFERENCES catCode(id),
       FOREIGN KEY (catHandle) REFERENCES catHandle(id),
       FOREIGN KEY (catCave) REFERENCES catCave(id),
       FOREIGN KEY (loanedTo) REFERENCES user(id),
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