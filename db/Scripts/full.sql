PRAGMA foreign_keys = ON;

-- "_revoked_refresh_tokens" definition
CREATE TABLE _revoked_refresh_tokens (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	refresh_token TEXT NOT NULL,
	expires_at NUMERIC NOT NULL,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- "_roles" definition
CREATE TABLE _roles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- address definition
CREATE TABLE address (
	id INTEGER NOT NULL UNIQUE,
	createdAt TEXT NOT NULL,
	fullAddress TEXT NOT NULL,
	active INTEGER NOT NULL,
	remarks TEXT,
	PRIMARY KEY(id AUTOINCREMENT)
);
-- catCave definition
CREATE TABLE catCave (
	id TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id)
) WITHOUT ROWID;
-- catCode definition
CREATE TABLE catCode (
	id TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id)
) WITHOUT ROWID;
-- catHandle definition
CREATE TABLE catHandle (
	id TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id)
) WITHOUT ROWID;
-- configData definition
CREATE TABLE configData (
	projectName TEXT NOT NULL,
	projectsName TEXT NOT NULL,
	fromAddress TEXT NOT NULL,
	protectionName TEXT NOT NULL,
	catCode TEXT NOT NULL,
	catHandle TEXT NOT NULL,
	catCave TEXT NOT NULL,
	headerMarking TEXT NOT NULL,
	reportPrefix TEXT NOT NULL
);
-- department definition
CREATE TABLE department (
	id TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id)
) WITHOUT ROWID;
-- mediaType definition
CREATE TABLE mediaType (
	id INTEGER NOT NULL UNIQUE,
	active INTEGER NOT NULL,
	name TEXT NOT NULL,
	itemSize INTEGER NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
-- organisation definition
CREATE TABLE organisation (
	id TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id)
) WITHOUT ROWID;
-- platform definition
CREATE TABLE platform (
	id INTEGER NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
-- protectiveMarking definition
CREATE TABLE protectiveMarking (
	id INTEGER NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
-- vault definition
CREATE TABLE vault (
	id TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	PRIMARY KEY(id)
) WITHOUT ROWID;
-- vaultLocation definition
CREATE TABLE vaultLocation (
	id INTEGER NOT NULL UNIQUE,
	name TEXT NOT NULL,
	active INTEGER NOT NULL,
	shelfSize INTEGER,
	PRIMARY KEY(id AUTOINCREMENT)
);

-- "_roles_permissions" definition
CREATE TABLE _roles_permissions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	role_id NUMERIC NOT NULL REFERENCES _roles(id),
	table_name TEXT NOT NULL,
	'create' BOOLEAN NOT NULL,
	'read' BOOLEAN NOT NULL,
	'update' BOOLEAN NOT NULL,
	'delete' BOOLEAN NOT NULL,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT unique_ROLES_TABLE UNIQUE (role_id, table_name)
);
-- "_users" definition
CREATE TABLE _users (
	id INTEGER NOT NULL UNIQUE,
	name TEXT NOT NULL,
	hashed_password TEXT NOT NULL,
	salt TEXT,
	username TEXT NOT NULL,
	is_superuser INTEGER NOT NULL,
	departedDate TEXT,
	lastUpdatedAt TEXT,
	createdAt TEXT NOT NULL,
	createdBy INT NOT NULL,
	lockoutAttempts INTEGER NOT NULL DEFAULT 0,
	updateBefore TEXT,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(createdBy) REFERENCES _users(id)
);
-- "_users_roles" definition
CREATE TABLE _users_roles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id NUMERIC NOT NULL REFERENCES _users(id),
	role_id NUMERIC NOT NULL REFERENCES _roles(id),
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT unique_users_role UNIQUE (user_id, user_id)
);
-- audit definition
CREATE TABLE audit (
	id INTEGER NOT NULL UNIQUE,
	user INTEGER NOT NULL,
	resource TEXT,
	dataId INTEGER,
	activityType INTEGER,
	dateTime TEXT NOT NULL,
	label TEXT NOT NULL,
	activityDetail TEXT,
	securityRelated INTEGER,
	subjectId INTEGER,
	subjectResource TEXT,
	ip TEXT,
	FOREIGN KEY(user) REFERENCES _users(id),
	PRIMARY KEY(id AUTOINCREMENT)
);
-- destruction definition
CREATE TABLE destruction (
	id INTEGER NOT NULL UNIQUE,
	vault TEXT NOT NULL,
	name TEXT,
	createdAt TEXT NOT NULL,
	createdBy INT NOT NULL,
	reportPrintedAt TEXT,
	finalisedAt TEXT,
	finalisedBy TEXT,
	remarks TEXT,
	FOREIGN KEY(finalisedBy) REFERENCES _users(id),
	FOREIGN KEY(createdBy) REFERENCES _users(id),
	FOREIGN KEY(vault) REFERENCES vault(id),
	PRIMARY KEY(id AUTOINCREMENT)
);
-- "dispatch" definition
CREATE TABLE dispatch (
	id INTEGER NOT NULL UNIQUE,
	vault TEXT NOT NULL,
	name TEXT,
	createdAt TEXT NOT NULL,
	createdBy INT NOT NULL,
	reportPrintedAt TEXT,
	dispatchedAt TEXT,
	toName TEXT NOT NULL,
	toAddress INTEGER NOT NULL,
	receiptReceived TEXT,
	lastHastenerSent TEXT,
	remarks TEXT,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(toAddress) REFERENCES address(id),
	FOREIGN KEY(createdBy) REFERENCES _users(id)
);
-- project definition
CREATE TABLE project (
	id INTEGER NOT NULL UNIQUE,
	name TEXT NOT NULL,
	startDate TEXT NOT NULL,
	endDate TEXT NOT NULL,
	remarks TEXT,
	enduring INTEGER NOT NULL,
	createdAt TEXT NOT NULL,
	createdBy INT,
	active INTEGER NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(createdBy) REFERENCES _users(id)
);
-- batch definition
CREATE TABLE batch (
	id INTEGER NOT NULL UNIQUE,
	vault TEXT NOT NULL,
	batchNumber TEXT NOT NULL,
	yearOfReceipt INTEGER NOT NULL,
	project INT,
	platform INT,
	organisation TEXT,
	department TEXT,
	remarks TEXT,
	receiptNotes TEXT,
	createdAt TEXT NOT NULL,
	createdBy INT,
	FOREIGN KEY(department) REFERENCES department(id),
	FOREIGN KEY(platform) REFERENCES platform(id),
	FOREIGN KEY(organisation) REFERENCES organisation(id),
	FOREIGN KEY(vault) REFERENCES vault(id),
	FOREIGN KEY(project) REFERENCES project(id),
	FOREIGN KEY(createdBy) REFERENCES _users(id),
	PRIMARY KEY(id AUTOINCREMENT)
);
-- item definition
CREATE TABLE item (
	id INTEGER NOT NULL UNIQUE,
	mediaType INTEGER NOT NULL,
	legacyMediaType INTEGER,
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
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(destruction) REFERENCES destruction(id),
	FOREIGN KEY(protectiveMarking) REFERENCES protectiveMarking(id),
	FOREIGN KEY(dispatchJob) REFERENCES dispatch(id),
	FOREIGN KEY(loanedTo) REFERENCES _users(id),
	FOREIGN KEY(batch) REFERENCES batch(id),
	FOREIGN KEY(vaultLocation) REFERENCES vaultLocation(id),
	FOREIGN KEY(createdBy) REFERENCES _users(id),
	FOREIGN KEY(mediaType) REFERENCES mediaType(id),
	FOREIGN KEY(legacyMediaType) REFERENCES mediaType(id)
);
-- itemCave definition
CREATE TABLE itemCave (
	id INTEGER NOT NULL UNIQUE,
	item INTEGER NOT NULL,
	catCave TEXT NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(catCave) REFERENCES catCave(id),
	FOREIGN KEY(item) REFERENCES item(id)
);
-- itemCode definition
CREATE TABLE itemCode (
	id INTEGER NOT NULL UNIQUE,
	item INTEGER NOT NULL,
	catCode TEXT NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(catCode) REFERENCES catCode(id),
	FOREIGN KEY(item) REFERENCES item(id)
);
-- itemHandle definition
CREATE TABLE itemHandle (
	id INTEGER NOT NULL UNIQUE,
	item INTEGER NOT NULL,
	catHandle TEXT NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(catHandle) REFERENCES catHandle(id),
	FOREIGN KEY(item) REFERENCES item(id)
);
