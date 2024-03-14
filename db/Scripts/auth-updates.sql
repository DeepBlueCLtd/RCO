PRAGMA foreign_keys = 0;

CREATE TABLE _users (
    id              INTEGER NOT NULL
                            UNIQUE,
    name            TEXT    NOT NULL,
    hashed_password        TEXT    NOT NULL,
    salt TEXT NOT NULL DEFAULT "",
    role            TEXT,
    is_superuser INTEGER NOT NULL DEFAULT 0,
    username     TEXT    NOT NULL,
    departedDate    TEXT,
    lastUpdatedAt   TEXT,
    createdAt       TEXT    NOT NULL,
    createdBy       INT     NOT NULL,
    lockoutAttempts INTEGER NOT NULL
                            DEFAULT 0,
    PRIMARY KEY (
        id AUTOINCREMENT
    ),
    FOREIGN KEY (
        createdBy
    )
    REFERENCES _users (id) 
);

INSERT INTO _users (
                       id,
                       name,
                       hashed_password,
                       role,
                       username,
                       departedDate,
                       lastUpdatedAt,
                       createdAt,
                       createdBy,
                       lockoutAttempts
                   )
                   SELECT id,
                          name,
                          password,
                          role,
                          staffNumber,
                          departedDate,
                          lastUpdatedAt,
                          createdAt,
                          createdBy,
                          lockoutAttempts
                     FROM user;

CREATE TABLE sqlitestudio_temp_table AS SELECT *
                                          FROM project;

DROP TABLE project;

CREATE TABLE project (
    id        INTEGER NOT NULL
                      UNIQUE,
    name      TEXT    NOT NULL,
    startDate TEXT    NOT NULL,
    endDate   TEXT    NOT NULL,
    remarks   TEXT,
    enduring  INTEGER NOT NULL,
    createdAt TEXT    NOT NULL,
    createdBy INT,
    active    INTEGER NOT NULL,
    PRIMARY KEY (
        id AUTOINCREMENT
    ),
    FOREIGN KEY (
        createdBy
    )
    REFERENCES _users (id) 
);

INSERT INTO project (
                        id,
                        name,
                        startDate,
                        endDate,
                        remarks,
                        enduring,
                        createdAt,
                        createdBy,
                        active
                    )
                    SELECT id,
                           name,
                           startDate,
                           endDate,
                           remarks,
                           enduring,
                           createdAt,
                           createdBy,
                           active
                      FROM sqlitestudio_temp_table;

DROP TABLE sqlitestudio_temp_table;

CREATE TABLE sqlitestudio_temp_table0 AS SELECT *
                                           FROM dispatch;

DROP TABLE dispatch;

CREATE TABLE dispatch (
    id               INTEGER NOT NULL
                             UNIQUE,
    vault            TEXT    NOT NULL,
    name             TEXT,
    createdAt        TEXT    NOT NULL,
    createdBy        INT     NOT NULL,
    reportPrintedAt  TEXT,
    dispatchedAt     TEXT,
    toName           TEXT    NOT NULL,
    toAddress        INTEGER NOT NULL,
    receiptReceived  TEXT,
    lastHastenerSent TEXT,
    remarks          TEXT,
    PRIMARY KEY (
        id AUTOINCREMENT
    ),
    FOREIGN KEY (
        toAddress
    )
    REFERENCES address (id),
    FOREIGN KEY (
        createdBy
    )
    REFERENCES _users (id) 
);

INSERT INTO dispatch (
                         id,
                         vault,
                         name,
                         createdAt,
                         createdBy,
                         reportPrintedAt,
                         dispatchedAt,
                         toName,
                         toAddress,
                         receiptReceived,
                         lastHastenerSent,
                         remarks
                     )
                     SELECT id,
                            vault,
                            name,
                            createdAt,
                            createdBy,
                            reportPrintedAt,
                            dispatchedAt,
                            toName,
                            toAddress,
                            receiptReceived,
                            lastHastenerSent,
                            remarks
                       FROM sqlitestudio_temp_table0;

DROP TABLE sqlitestudio_temp_table0;

CREATE TABLE sqlitestudio_temp_table1 AS SELECT *
                                           FROM destruction;

DROP TABLE destruction;

CREATE TABLE destruction (
    id              INTEGER NOT NULL
                            UNIQUE,
    vault           TEXT    NOT NULL,
    name            TEXT,
    createdAt       TEXT    NOT NULL,
    createdBy       INT     NOT NULL,
    reportPrintedAt TEXT,
    finalisedAt     TEXT,
    finalisedBy     TEXT,
    remarks         TEXT,
    FOREIGN KEY (
        finalisedBy
    )
    REFERENCES _users (id),
    FOREIGN KEY (
        createdBy
    )
    REFERENCES _users (id),
    FOREIGN KEY (
        vault
    )
    REFERENCES vault (id),
    PRIMARY KEY (
        id AUTOINCREMENT
    )
);

INSERT INTO destruction (
                            id,
                            vault,
                            name,
                            createdAt,
                            createdBy,
                            reportPrintedAt,
                            finalisedAt,
                            finalisedBy,
                            remarks
                        )
                        SELECT id,
                               vault,
                               name,
                               createdAt,
                               createdBy,
                               reportPrintedAt,
                               finalisedAt,
                               finalisedBy,
                               remarks
                          FROM sqlitestudio_temp_table1;

DROP TABLE sqlitestudio_temp_table1;

CREATE TABLE sqlitestudio_temp_table2 AS SELECT *
                                           FROM item;

DROP TABLE item;

CREATE TABLE item (
    id                INTEGER NOT NULL
                              UNIQUE,
    mediaType         INTEGER NOT NULL,
    legacyMediaType   INTEGER,
    startDate         TEXT,
    endDate           TEXT,
    batch             INTEGER NOT NULL,
    itemNumber        TEXT    NOT NULL,
    consecSheets      TEXT,
    vaultLocation     INTEGER,
    remarks           TEXT,
    protectiveMarking INTEGER NOT NULL,
    protectionString  TEXT    NOT NULL,
    musterRemarks     TEXT,
    loanedTo          INTEGER,
    loanedDate        TEXT,
    dispatchJob       INTEGER,
    dispatchedDate    TEXT,
    destruction       INTEGER,
    destructionDate   TEXT,
    createdAt         TEXT    NOT NULL,
    createdBy         INT     NOT NULL,
    PRIMARY KEY (
        id AUTOINCREMENT
    ),
    FOREIGN KEY (
        destruction
    )
    REFERENCES destruction (id),
    FOREIGN KEY (
        protectiveMarking
    )
    REFERENCES protectiveMarking (id),
    FOREIGN KEY (
        dispatchJob
    )
    REFERENCES dispatch (id),
    FOREIGN KEY (
        loanedTo
    )
    REFERENCES _users (id),
    FOREIGN KEY (
        batch
    )
    REFERENCES batch (id),
    FOREIGN KEY (
        vaultLocation
    )
    REFERENCES vaultLocation (id),
    FOREIGN KEY (
        createdBy
    )
    REFERENCES _users (id),
    FOREIGN KEY (
        mediaType
    )
    REFERENCES mediaType (id),
    FOREIGN KEY (
        legacyMediaType
    )
    REFERENCES mediaType (id) 
);

INSERT INTO item (
                     id,
                     mediaType,
                     legacyMediaType,
                     startDate,
                     endDate,
                     batch,
                     itemNumber,
                     consecSheets,
                     vaultLocation,
                     remarks,
                     protectiveMarking,
                     protectionString,
                     musterRemarks,
                     loanedTo,
                     loanedDate,
                     dispatchJob,
                     dispatchedDate,
                     destruction,
                     destructionDate,
                     createdAt,
                     createdBy
                 )
                 SELECT id,
                        mediaType,
                        legacyMediaType,
                        startDate,
                        endDate,
                        batch,
                        itemNumber,
                        consecSheets,
                        vaultLocation,
                        remarks,
                        protectiveMarking,
                        protectionString,
                        musterRemarks,
                        loanedTo,
                        loanedDate,
                        dispatchJob,
                        dispatchedDate,
                        destruction,
                        destructionDate,
                        createdAt,
                        createdBy
                   FROM sqlitestudio_temp_table2;

DROP TABLE sqlitestudio_temp_table2;

CREATE TABLE sqlitestudio_temp_table3 AS SELECT *
                                           FROM batch;

DROP TABLE batch;

CREATE TABLE batch (
    id            INTEGER NOT NULL
                          UNIQUE,
    vault         TEXT    NOT NULL,
    batchNumber   TEXT    NOT NULL,
    yearOfReceipt INTEGER NOT NULL,
    project       INT,
    platform      INT,
    organisation  TEXT,
    department    TEXT,
    remarks       TEXT,
    receiptNotes  TEXT,
    createdAt     TEXT    NOT NULL,
    createdBy     INT,
    FOREIGN KEY (
        department
    )
    REFERENCES department (id),
    FOREIGN KEY (
        platform
    )
    REFERENCES platform (id),
    FOREIGN KEY (
        organisation
    )
    REFERENCES organisation (id),
    FOREIGN KEY (
        vault
    )
    REFERENCES vault (id),
    FOREIGN KEY (
        project
    )
    REFERENCES project (id),
    FOREIGN KEY (
        createdBy
    )
    REFERENCES _users (id),
    PRIMARY KEY (
        id AUTOINCREMENT
    )
);

INSERT INTO batch (
                      id,
                      vault,
                      batchNumber,
                      yearOfReceipt,
                      project,
                      platform,
                      organisation,
                      department,
                      remarks,
                      receiptNotes,
                      createdAt,
                      createdBy
                  )
                  SELECT id,
                         vault,
                         batchNumber,
                         yearOfReceipt,
                         project,
                         platform,
                         organisation,
                         department,
                         remarks,
                         receiptNotes,
                         createdAt,
                         createdBy
                    FROM sqlitestudio_temp_table3;

DROP TABLE sqlitestudio_temp_table3;

CREATE TABLE sqlitestudio_temp_table4 AS SELECT *
                                           FROM audit;

DROP TABLE audit;

CREATE TABLE audit (
    id              INTEGER NOT NULL
                            UNIQUE,
    user            INTEGER NOT NULL,
    resource        TEXT,
    dataId          INTEGER,
    activityType    INTEGER,
    dateTime        TEXT    NOT NULL,
    label           TEXT    NOT NULL,
    activityDetail  TEXT,
    securityRelated INTEGER,
    subjectId       INTEGER,
    subjectResource TEXT,
    ip              TEXT,
    FOREIGN KEY (
        user
    )
    REFERENCES _users (id),
    PRIMARY KEY (
        id AUTOINCREMENT
    )
);

INSERT INTO audit (
                      id,
                      user,
                      resource,
                      dataId,
                      activityType,
                      dateTime,
                      label,
                      activityDetail,
                      securityRelated,
                      subjectId,
                      subjectResource,
                      ip
                  )
                  SELECT id,
                         user,
                         resource,
                         dataId,
                         activityType,
                         dateTime,
                         label,
                         activityDetail,
                         securityRelated,
                         subjectId,
                         subjectResource,
                         ip
                    FROM sqlitestudio_temp_table4;

DROP TABLE sqlitestudio_temp_table4;

DROP TABLE user;

DROP VIEW "main"."loanUsers";
CREATE VIEW loanUsers AS
SELECT
  i.loanedTo as id,
  COUNT(i.id) as numItems,
  u.staffNumber
from 
  item i
INNER JOIN "_users" u ON
  i.loanedTo = u.id
GROUP BY
  u.name,
  i.loanedTo;

PRAGMA foreign_keys = 1;
