-- Create the user table
CREATE TABLE if not exists user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phoneNumber INTEGER,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    userType TEXT NOT NULL CHECK (userType IN ('admin', 'attendee'))
);


-- Create the attendee table linked to the user table
CREATE TABLE if not exists attendee (
    attendeeId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    FOREIGN KEY (userId) REFERENCES user (id)
);

-- Create the register table
-- Allows admin to create a register an assign attendees to it.
CREATE TABLE register (
    registerId INTEGER NOT NULL,
    attendanceId INTEGER NOT NULL,
    registerName VARCHAR(255) NOT NULL,
    attendee VARCHAR(255) NOT NULL,
    adminName VARCHAR(255) NOT NULL,
    FOREIGN KEY (adminName) REFERENCES admin (username)
    FOREIGN KEY (attendee) REFERENCES attendee (username)
    FOREIGN KEY (attendanceId) REFERENCES attendance (attendanceId)
);



-- Create the admin table linked to the user table
CREATE TABLE if not exists admin (
    adminId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    FOREIGN KEY (userId) REFERENCES user (id)
);

-- Create the attendance table
CREATE TABLE if not exists attendance(
    attendanceId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    registerId INTEGER NOT NULL,
    registerName VARCHAR(255) NOT NULL,
    attendeeId INTEGER NOT NULL,
    attendee VARCHAR(255) NOT NULL,
    checkInTime TIMESTAMP NOT NULL,
    checkInDate TIMESTAMP NOT NULL,
    FOREIGN KEY (attendeeId) REFERENCES attendee (attendeeId)
    FOREIGN KEY (userId) REFERENCES user (id)
    FOREIGN KEY (registerId) REFERENCES register (registerId)
);



<<<<<<< HEAD
-- drop table register
=======
-- drop table attendee
>>>>>>> 86144682cadc9aa32bee76968316a07bd5f0255c

