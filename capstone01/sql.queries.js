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
    const sql="select * from user where username = ? and email=?";
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
export async function selectUserByName(username){
    const sql ="select id,firstName,surname,email,phoneNumber,userType from user where username=?";
    return await db.get(sql,username)
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
export async function selectAttendeeIdFromAttendeeByUserId(userId){
    const sql="select * from attendee where userId=?";
    return await db.get(sql,userId)
}
//join tables to get relevent data for table display
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
    return await db.all(sql,registerId);
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
export async function selectByattendeeNameFromUser(username){
        const sql="SELECT registerId,firstname,surname,email,username,phoneNumber,registerName,checkInTime,checkInDate FROM user join attendance on attendance.userId=user.id WHERE username = ?  ORDER BY attendanceId DESC;"
        return await db.all(sql,username);  
}

export async function selectAllFromUserAndAttendanceById(registerId,username){
    const sql='SELECT * FROM user join attendance on attendance.userId=user.id WHERE registerId =? and username=? ORDER BY attendanceId DESC;'
    return await db.get(sql,[registerId,username])
}

//api/viewRegisterName
export async function selectByAttendanceIdFromRegister(maxRegisterId){
    const sql="SELECT registerName FROM register WHERE registerId = ?;";
    return await db.get(sql, maxRegisterId);
}

export async function selectuserTypeFromUser(username){
    const sql="select registerId,username,userType,attendee from user join register on user.username=register.attendee where username=?";
    return await db.get(sql,username)
}

//api/addAttendance
export async function selectByUsernameFromAttendee(username){
    const sql="SELECT * FROM attendee WHERE attendee=?";
    return await db.get(sql, username);
}
export async function insertIntoAttendance(userId,registerId,registerName,attendeeId,attendee, checkInTime,checkInDate){
    const sql='INSERT INTO attendance (userId,registerId,registerName,attendeeId,attendee, checkInTime,checkInDate) VALUES (?,?, ?, ?,?,?,?)';
    return await db.run(sql,[userId,registerId,registerName,attendeeId,attendee, checkInTime,checkInDate]);
}

export async function selectDateFromAttendee(username,selectedRegisterName){
    const sql="select * from attendance where attendee=? and registerName=? ORDER BY attendanceId DESC";
    return await db.get(sql,[username,selectedRegisterName])
}  


export async function selectByUsernameFromRegister(username,selectedRegisterName){
    const sql="select * from register where attendee=? and registerName=?";
    return await db.all(sql,[username,selectedRegisterName])
}

export async function selectRegisterNamesByUsernameFromRegister(attendee){
    const sql="select registerName,registerId from register where attendee=?";
    return await db.all(sql,attendee)
}












