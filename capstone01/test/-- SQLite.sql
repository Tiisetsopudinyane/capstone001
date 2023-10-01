-- SQLite
SELECT adminId, userId, username
FROM admin;


--username=malva email=malva@gmail.com phoneNumber=2767253780
select username,email,phoneNumber from user where username ="malva" and email="malva@gmail.com" and phoneNumber=2767253780;


--select id
select id from user where username="malva";

--sect all from user
select * from user where username = "user" and password=1234

--select all attendance
SELECT * FROM attendee ORDER BY attendeeId DESC;

SELECT * FROM register WHERE registerName = "Maths"

SELECT attendeeId from attendee where username="sammy"

SELECT DISTINCT registerId, registerName FROM register WHERE adminName ="user" ORDER BY registerId DESC;


SELECT attendanceId,firstname,surname,email,phoneNumber,checkInTime,checkInDate FROM user join attendance on attendance.userId=user.id WHERE attendeeId =20 ORDER BY attendanceId DESC;