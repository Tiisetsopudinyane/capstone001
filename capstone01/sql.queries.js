import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';

//database initialization
const  db = await sqlite.open({
    filename:  './attendance.db',
    driver:  sqlite3.Database
});
console.log('You are now connected to the database!');
await db.migrate(); 

//api/addUser/ end-point
export async function selectUser(username,email){
    const sql="select username,email from user where username = ? and email=?";
    return await db.get(sql,[username,email]);
}
export async function selectUserwithUsername(username){
    const sql="select username from user where username=?";
    return await db.get(sql,username)
}
  export async function selectUserwithEmail(email){
    const sql="select email from user where email=?";
    return await db.get(sql,email)
  }

export async function selectUsername(email){
    const sql="select username from user where email=?";
    return await db.get(sql,email);
}
export async function insertUser(firstName,surname,email,phoneNumber,username,password,userType){
    const sql="insert into user (firstName,surname,email,phoneNumber,username,password,userType) values (?, ?, ?,?, ?, ?, ?);";
   return await db.run(sql, [firstName,surname,email,phoneNumber,username,password,userType]);
}
export async function selectByusernameFromUser(username){
    const sql="select id from user where username=?";
    return await db.get(sql,username);
}
export async function insertAdmin(userId,username){
    const sql="insert into admin (userId, username) values (?, ?);";
    return await db.run(sql, [userId,username]);
}
export async function insertAttendee(userId,username){
    const sql="insert into attendee (userId, username) values (?, ?);";
    return await db.run(sql, [userId,username]);
}

//api/login end-point
export async function selectByUsernameAndPasswordFromUser(username,password){
    const sql="select * from user where username = ? and password=?";
    return await db.get(sql,[username,password]);
}
export async function selectByUsernameFromUser(username){
    const sql="select username from user where username=?";
    return await db.get(sql,username)
}
export async function selectByUsePasswordFromUser(password){
  const sql="select password from user where password=?";
  return await db.get(sql,password)
}

//api/getAttendees
export async function selectAtendees(){
    const sql="SELECT * FROM attendee ORDER BY attendeeId DESC"
    return await db.all(sql);
}
export async function selectAllByattendeeIdFromUser(registerId){
    const sql="SELECT registerId,attendanceId,firstname,surname,email,phoneNumber,checkInTime,checkInDate FROM user join attendance on attendance.userId=user.id WHERE registerId = ? ORDER BY attendanceId DESC;";
    return await db.all(sql, registerId);
}

//api/submitRegister
export async function selectAllByRegisterNameFromRegister(registerName){
    const sql="SELECT * FROM register WHERE registerName = ?";
    return await db.all(sql, registerName);
}
export async function selectuserTypeFromUserByUserName(username){
    const sql="select userType from user where username=?";
    return await db.get(sql,username)
}
export async function selectIdByUserNameFromAttendee(username){
    const sql='SELECT attendeeId from attendee where username=?';
    return await db.get(sql,username)
}
export async function selectMaximumRegistrationId(){
    const sql="SELECT MAX(registerId) AS maxRegisterId FROM register";
    return await db.get(sql);
}
export async function insertIntoRegister(registerId,attendanceId, registerName, attendee, adminName){
    const sql="INSERT INTO register (registerId,attendanceId, registerName, attendee, adminName) VALUES (?, ?, ?, ?, ?);"
    return await db.run(sql, [registerId,attendanceId, registerName, attendee, adminName]);
}

//api/getRegisters
export async function selectByAdminNameFromRegister(adminName){
    const sql="SELECT DISTINCT registerId, registerName FROM register WHERE adminName =? ORDER BY registerId DESC;";
    return await db.all(sql,adminName);
}

//api/deleteRegister
export async function selectByRegisterIdFromRegister(registerId){
    const sql="SELECT * FROM register WHERE registerId = ?;";
    return await db.get(sql,registerId);
}
export async function deleteByRegisterIdFromRegister(registerId){
    const sql="DELETE FROM register WHERE registerId = ? ;";
    return await db.run(sql,registerId);
}

//api/viewRegister
export async function selectByRegisterFromRegister(registerId){
    const sql="select registerName,attendanceId from register where registerId=?";
    return await db.all(sql,registerId);
}
export async function selectByattendeeIdFromUser(attendeeId){
    const sql="SELECT registerId,attendanceId,firstname,surname,email,phoneNumber,checkInTime,checkInDate FROM user join attendance on attendance.userId=user.id WHERE attendeeId = ? ORDER BY attendanceId DESC;";
    return await db.all(sql, attendeeId);
}

export async function selectAllWithRegisterNameOfFromattendee(registerId){
    const sql="select * from attendee where registerId=?"
    return await db.all(sql,registerId)
}

//api/viewSpecificRegister
export async function selectByattendeeNameFromUser(surname){
        const sql="SELECT firstname,surname,email,phoneNumber,checkInTime,checkInDate FROM user join attendance on attendance.userId=user.id WHERE surname = ?  ORDER BY attendanceId DESC;"
        return await db.all(sql,surname);  
}

export async function selectAllFromUserAndAttendanceById(attendeeId){
    const sql='SELECT * FROM user join attendance on attendance.userId=user.id WHERE attendeeId =20 ORDER BY attendanceId DESC;'
    await db.all(sql,attendeeId)
}

//api/viewRegisterName
export async function selectByAttendanceIdFromRegister(maxRegisterId){
    const sql="SELECT registerName FROM register WHERE registerId = ?;";
    return await db.get(sql, maxRegisterId);
}

//api/addAttendance
export async function selectByUsernameFromAttendee(username){
    const sql="SELECT * FROM attendee WHERE username=?";
    return await db.get(sql, username);
}
export async function insertIntoAttendance(username,registerId,userId,attendeeId, checkInTime,checkInDate){
    const sql='INSERT INTO attendance (username,registerId,userId, attendeeId, checkInTime,checkInDate) VALUES (?,?,?,?, ?, ?)';
    return await db.run(sql,[username,registerId,userId,attendeeId, checkInTime,checkInDate]);
}

export async function selectByUsernameFromRegister(username){
    const sql="select * from register where attendee=?";
    return await db.get(sql,username)
}

export async function selectDateFromAttendee(username,checkInDate){
    const sql="select * from attendance where username=? and checkInDate=?";
    return await db.get(sql,[username,checkInDate])
}









