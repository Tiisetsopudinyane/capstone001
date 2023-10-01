import assert from 'assert';
import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import {selectUser,insertUser,selectByusernameFromUser,insertAdmin,insertAttendee,
    selectByUsernameAndPasswordFromUser,selectAtendees,selectAllByRegisterNameFromRegister,selectIdByUserNameFromAttendee,
    selectMaximumRegistrationId,insertIntoRegister,selectByAdminNameFromRegister,selectByRegisterIdFromRegister,
    deleteByRegisterIdFromRegister,selectByRegisterFromRegister,selectByattendeeIdFromUser,
    selectByattendeeNameFromUser,selectByAttendanceIdFromRegister,selectByUsernameFromAttendee,insertIntoAttendee} from '../sql.queries.js'
  import {dateGenerater,timeGenerater} from '../dateTimeGenerator.js'
  

//database initialization
const  db = await sqlite.open({
    filename:  './attendance.db',
    driver:  sqlite3.Database
});

await db.migrate();

it ('should return object of three values', async function() {

    //await selectUser(username,email,phoneNumber)
    const obj={username:"malva",email:"malva@gmail.com",phoneNumber:2767253780}

    assert.deepEqual(obj,await selectUser("malva","malva@gmail.com",2767253780));

});



it ('should return object of property id', async function() {

    //selectByusernameFromUser(username)
    
    const obj={id:23}

    assert.deepEqual(obj,await selectByusernameFromUser("malva"));

});



it ('should return object', async function() {

    //selectByUsernameAndPasswordFromUser(username,password)
    
    const obj={id:22,firstName:"Samuel",surname:"Pudinyane",email:"pudinyanesamueltiisetso@gmail.com",phoneNumber:27671563780,username:"user",password:1234,userType:"admin"}

    assert.deepEqual(obj,await selectByUsernameAndPasswordFromUser("user",1234));

});



it ('should return array of objects', async function() {

    //selectAtendees()
    
    const obj=[
        { attendeeId: 20, userId: 23, username: 'malva' },   
        { attendeeId: 19, userId: 21, username: 'sammy' },   
        { attendeeId: 18, userId: 20, username: '' },        
        { attendeeId: 17, userId: 19, username: 'lerato' },  
        { attendeeId: 16, userId: 17, username: 'sabeehah' },
        { attendeeId: 15, userId: 15, username: 'ethan_a' }, 
        { attendeeId: 14, userId: 14, username: 'ava_l' },
        { attendeeId: 13, userId: 13, username: 'james_h' },
        { attendeeId: 12, userId: 12, username: 'olivia_g' },
        { attendeeId: 11, userId: 11, username: 'william_m' },
        { attendeeId: 10, userId: 10, username: 'sophia_a' },
        { attendeeId: 9, userId: 9, username: 'robert_w' },
        { attendeeId: 8, userId: 8, username: 'linda_c' },
        { attendeeId: 7, userId: 7, username: 'michael_d' },
        { attendeeId: 6, userId: 6, username: 'emily_b' },
        { attendeeId: 5, userId: 5, username: 'david_lee' },
        { attendeeId: 4, userId: 4, username: 'sarah_w' },
        { attendeeId: 3, userId: 3, username: 'mike_j' },
        { attendeeId: 2, userId: 2, username: 'jane_smith' },
        { attendeeId: 1, userId: 1, username: 'john_doe1' }
      ]

    assert.deepEqual(obj,await selectAtendees());

});



it ('should return array of objects', async function() {

    //selectAllByRegisterNameFromRegister(registerName)
    
    const obj=[
        {registerId: 11,attendanceId: 20,registerName: 'Maths',attendee: 'malva',adminName: 'user'},
        {registerId: 11,attendanceId: 19,registerName: 'Maths',attendee: 'sammy',adminName: 'user'},
        {registerId: 11,attendanceId: 11,registerName: 'Maths',attendee: 'william_m',adminName: 'user'},
        {registerId: 11,attendanceId: 1,registerName: 'Maths',attendee: 'john_doe1',adminName: 'user'},
        {registerId: 11,attendanceId: 14,registerName: 'Maths',attendee: 'ava_l',adminName: 'user'},
        {registerId: 11,attendanceId: 17,registerName: 'Maths',attendee: 'lerato',adminName: 'user'},
        {registerId: 11,attendanceId: 3,registerName: 'Maths',attendee: 'mike_j',adminName: 'user'}
      ]

    assert.deepEqual(obj,await selectAllByRegisterNameFromRegister("Maths"));

});


it ('should return object', async function() {

    //selectIdByUserNameFromAttendee(username)
    
    const obj={ attendeeId: 19 }

    assert.deepEqual(obj,await selectIdByUserNameFromAttendee("sammy"));

});


it ('should return object of maximum registerId', async function() {

    //selectMaximumRegistrationId()
    
    const obj={ maxRegisterId: 11 }

    assert.deepEqual(obj,await selectMaximumRegistrationId());

});



it ('should return object of registerId and registerName', async function() {

    //selectByAdminNameFromRegister("user")
    
    const obj=[
        { registerId: 11, registerName: 'Maths' },      
        { registerId: 10, registerName: 'mathematics' },
        { registerId: 9, registerName: 'Register 9' },  
        { registerId: 9, registerName: 'Register 12' }, 
        { registerId: 8, registerName: 'Register 8' },  
        { registerId: 8, registerName: 'Register 13' }, 
        { registerId: 7, registerName: 'Register 7' },  
        { registerId: 6, registerName: 'Register 6' },  
        { registerId: 5, registerName: 'Register 5' },
        { registerId: 4, registerName: 'Register 4' },
        { registerId: 3, registerName: 'Register 3' },
        { registerId: 3, registerName: 'Register 17' },
        { registerId: 3, registerName: 'Register 18' },
        { registerId: 3, registerName: 'Register 19' },
        { registerId: 3, registerName: 'Register 20' },
        { registerId: 3, registerName: 'Register 21' },
        { registerId: 2, registerName: 'Register 15' },
        { registerId: 2, registerName: 'Register 16' },
        { registerId: 1, registerName: 'Register 14' }
      ]

    assert.deepEqual(obj,await selectByAdminNameFromRegister("user"));

});


it ('should return object of register ', async function() {

    //selectByRegisterIdFromRegister(registerId)
    
    const obj={
        registerId: 11,
        attendanceId: 20,
        registerName: 'Maths',
        attendee: 'malva',
        adminName: 'user'
      }

    assert.deepEqual(obj,await selectByRegisterIdFromRegister(11));

});



it ('should return object of attendance ', async function() {

    //selectByattendeeIdFromUser(attendeeId)
    
    const obj=[
        {
          attendanceId: 14,
          firstName: 'malva',
          surname: 'Pudding',
          email: 'malva@gmail.com',
          phoneNumber: 2767253780,
          checkInTime: '08:45:00',
          checkInDate: '2023-09-23'
        }
      ]

    assert.deepEqual(obj,await selectByattendeeIdFromUser(20));

});










