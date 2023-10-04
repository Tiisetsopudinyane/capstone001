import assert from 'assert';
import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import {selectUser,insertUser,selectByusernameFromUser,insertAdmin,insertAttendee,
    selectByUsernameAndPasswordFromUser,selectAtendees,selectAllByRegisterNameFromRegister,selectIdByUserNameFromAttendee,
    selectMaximumRegistrationId,insertIntoRegister,selectByAdminNameFromRegister,selectByRegisterIdFromRegister,
    deleteByRegisterIdFromRegister,selectByRegisterFromRegister,selectByattendeeIdFromUser,
    selectByattendeeNameFromUser,insertIntoAttendance,selectByAttendanceIdFromRegister,selectByUsernameFromAttendee} from '../sql.queries.js'
  import {dateGenerater,timeGenerater} from '../dateTimeGenerator.js'
  

//database initialization
const  db = await sqlite.open({
    filename:  './attendance.db',
    driver:  sqlite3.Database
});

await db.migrate();

it ('(1)=> should return object of three values', async function() {

    //await selectUser(username,email,phoneNumber)
    const obj={
      id: 34,
      firstName: 'Samuel',
      surname: 'Pudinyane',
      email: 'tiisetso@gmail.com',
      phoneNumber: 27671876780,
      username: 'sam',
      password: '1234',
      userType: 'admin'
    }

    assert.deepEqual(obj,await selectUser("sam","tiisetso@gmail.com"));

});



it ('(2)=> should return object of property id', async function() {

    //selectByusernameFromUser(username)
    
    const obj={id:34}

    assert.deepEqual(obj,await selectByusernameFromUser("sam"));

});



it ('(3)=> should return object', async function() {

    //selectByUsernameAndPasswordFromUser(username,password)
    
    const obj={  id: 34,
      firstName: 'Samuel',
      surname: 'Pudinyane',
      email: 'tiisetso@gmail.com',
      phoneNumber: 27671876780,
      username: 'sam',
      password: '1234',
      userType: 'admin'
    }

    assert.deepEqual(obj,await selectByUsernameAndPasswordFromUser("sam",1234));

});



it ('(4)=> should return array of objects', async function() {

    //selectAtendees()
    
    const obj=[
      { attendeeId: 5, registerId: 1, userId: 38, username: 'xolani' },
      { attendeeId: 4, registerId: 1, userId: 37, username: 'lerato' },
      { attendeeId: 3, registerId: 1, userId: 35, username: 'sam1' },
      { attendeeId: 2, registerId: 1, userId: 33, username: 'pudding' },
      { attendeeId: 1, registerId: 1, userId: 32, username: 'sam' }
    ]

    assert.deepEqual(obj,await selectAtendees());

});



it ('(5)=> should return array of objects', async function() {

    //selectAllByRegisterNameFromRegister(registerName)
    
    const obj=[
      {
        registerId: 1,
        attendanceId: 5,
        registerName: 'Maths',
        attendee: 'xolani',
        adminName: 'sam1'
      },
      {
        registerId: 1,
        attendanceId: 4,
        registerName: 'Maths',
        attendee: 'lerato',
        adminName: 'sam1'
      },
      {
        registerId: 1,
        attendanceId: 3,
        registerName: 'Maths',
        attendee: 'sam1',
        adminName: 'sam1'
      }
    ]

    assert.deepEqual(obj,await selectAllByRegisterNameFromRegister("Maths"));

});


it ('(6)=> should return object', async function() {

    //selectIdByUserNameFromAttendee(username)
    
    const obj={ attendeeId: 4 }

    assert.deepEqual(obj,await selectIdByUserNameFromAttendee("lerato"));

});


it ('(7)=> should return object of maximum registerId', async function() {

    //selectMaximumRegistrationId()
    
    const obj={ maxRegisterId: 9 }

    assert.deepEqual(obj,await selectMaximumRegistrationId());

});



it ('(8)=> should return object of registerId and registerName', async function() {

    //selectByAdminNameFromRegister("user")
    
    const obj=[
      { registerId: 9, registerName: 'Setswana' },
      { registerId: 8, registerName: 'Science' }
    ]

    assert.deepEqual(obj,await selectByAdminNameFromRegister("sam"));

});


it ('(9)=> should return object of register ', async function() {

    //selectByRegisterIdFromRegister(registerId)
    
    const obj=[
      {
        registerId: 9,
        attendanceId: 5,
        registerName: 'Setswana',
        attendee: 'xolani',
        adminName: 'sam'
      },
      {
        registerId: 9,
        attendanceId: 4,
        registerName: 'Setswana',
        attendee: 'lerato',
        adminName: 'sam'
      },
      {
        registerId: 9,
        attendanceId: 1,
        registerName: 'Setswana',
        attendee: 'sam',
        adminName: 'sam'
      },
      {
        registerId: 9,
        attendanceId: 2,
        registerName: 'Setswana',
        attendee: 'pudding',
        adminName: 'sam'
      }
    ]

    assert.deepEqual(obj,await selectByRegisterIdFromRegister(9));

});



it ('(10)=> should return object of attendance ', async function() {

    //selectByattendeeIdFromUser(attendeeId)
    
    const obj=[
      {
        registerId: 9,
        attendanceId: 11,
        firstName: 'lerato',
        surname: 'malebo',
        email: 'malebo@gmail.com',
        phoneNumber: 736746376,
        checkInTime: '09:54:42',
        checkInDate: '2023/10/04'
      },
      {
        registerId: 8,
        attendanceId: 10,
        firstName: 'lerato',
        surname: 'malebo',
        email: 'malebo@gmail.com',
        phoneNumber: 736746376,
        checkInTime: '09:22:05',
        checkInDate: '2023/10/04'
      },
      {
        registerId: 1,
        attendanceId: 9,
        firstName: 'lerato',
        surname: 'malebo',
        email: 'malebo@gmail.com',
        phoneNumber: 736746376,
        checkInTime: '09:08:17',
        checkInDate: '2023/10/04'
      },
      {
        registerId: 1,
        attendanceId: 8,
        firstName: 'lerato',
        surname: 'malebo',
        email: 'malebo@gmail.com',
        phoneNumber: 736746376,
        checkInTime: '09:06:28',
        checkInDate: '2023/10/04'
      },
      {
        registerId: 1,
        attendanceId: 7,
        firstName: 'lerato',
        surname: 'malebo',
        email: 'malebo@gmail.com',
        phoneNumber: 736746376,
        checkInTime: '09:06:00',
        checkInDate: '2023/10/04'
      },
      {
        registerId: 1,
        attendanceId: 4,
        firstName: 'lerato',
        surname: 'malebo',
        email: 'malebo@gmail.com',
        phoneNumber: 736746376,
        checkInTime: '14:29:15',
        checkInDate: '2023/10/02'
      }
    ]

    assert.deepEqual(obj,await selectByattendeeIdFromUser(4));

});










