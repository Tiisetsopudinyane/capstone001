-- -- SQLite
-- -- SELECT adminId, userId, username
-- -- FROM admin;


-- -- --username=malva email=malva@gmail.com phoneNumber=2767253780
-- -- select username,email,phoneNumber from user where username ="malva" and email="malva@gmail.com" and phoneNumber=2767253780;


-- -- --select id
-- -- select id from user where username="malva";

-- -- --sect all from user
-- -- select * from user where username = "malva" and password=1234

-- -- select * from user;

-- -- SELECT * FROM user join attendance on attendance.userId=user.id WHERE attendeeId =20 ORDER BY attendanceId DESC;

-- -- --select all attendance
-- -- SELECT * FROM attendee ORDER BY attendeeId DESC;

-- -- SELECT * FROM register WHERE registerName = "Maths"

-- -- SELECT attendeeId from attendee where username="sammy"

-- -- SELECT DISTINCT registerId, registerName FROM register WHERE adminName ="user" ORDER BY registerId DESC;


-- -- SELECT attendanceId,firstName,surname,username,email,phoneNumber,checkInTime,checkInDate FROM user join attendance on attendance.userId=user.id WHERE attendeeId =20 ORDER BY attendanceId DESC;

-- -- SELECT * FROM register WHERE registerName ="maths"


-- -- select * from register where attendee="lerato";


-- -- [
-- --   { attendeeId: 22,registerId:1, userId: 32, username: 'sam' },
-- --   { attendeeId: 23,registerId:1, userId: 33, username: 'pudding' },
-- --   { attendeeId: 24,registerId:1, userId: 35, username: 'sam1' },
-- --   { attendeeId: 25,registerId:1, userId: 37, username: 'lerato' },
-- --   { attendeeId: 26,registerId:1, userId: 38, username: 'xolani' }
-- -- ]

-- -- select userType from user where username="sam";
-- -- drop table attendee;

--         SELECT firstname,surname,email,phoneNumber,checkInTime,checkInDate FROM user join attendance on attendance.userId=user.id WHERE surname = "Sibisi"  ORDER BY attendanceId DESC;

-- SELECT registerName FROM register WHERE registerId =1

-- delete from attendance;
