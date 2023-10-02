import express from "express";
import cors from "cors";
import {
  selectUser,
  insertUser,
  selectUsername,
  selectUserwithEmail,
  selectUserwithUsername,
  selectByusernameFromUser,
  selectAllByattendeeIdFromUser,
  selectuserTypeFromUserByUserName,
  insertAdmin,
  insertAttendee,
  selectByUsernameAndPasswordFromUser,
  selectByUsernameFromUser,
  selectByUsePasswordFromUser,
  selectAtendees,
  selectAllByRegisterNameFromRegister,
  selectIdByUserNameFromAttendee,
  selectMaximumRegistrationId,
  insertIntoRegister,
  selectAllWithRegisterNameOfFromattendee,
  selectByAdminNameFromRegister,
  selectByRegisterIdFromRegister,
  deleteByRegisterIdFromRegister,
  selectByRegisterFromRegister,
  selectByattendeeIdFromUser,
  selectByattendeeNameFromUser,
  selectByUsernameFromRegister,
  selectByAttendanceIdFromRegister,
  selectByUsernameFromAttendee,
  insertIntoAttendance,
  selectDateFromAttendee,
} from "./sql.queries.js";
import { dateGenerater, timeGenerater } from "./dateTimeGenerator.js";

//express initialization
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => console.log(`Attendance App started on port: ${PORT}`));

// Sign-up API
app.post("/api/addUser/", async (req, res) => {
  const firstName = req.body.firstName;
  const surname = req.body.surname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const username = req.body.username;
  const password = req.body.password;
  const userType = req.body.userType;
  //extract values values from the table
  const outputUsername = await selectUserwithUsername(username)
  const outputEmail = await selectUserwithEmail(email);
  
    if (outputEmail) {
      res.json({
        error: "Email address already exist!",
      });
    } else if (outputUsername) {
      res.json({
        error: "Username already exist! Change your username.",
      });
    
  } 
  else {
    await insertUser(
      firstName,
      surname,
      email,
      phoneNumber,
      username,
      password,
      userType
    );
    if (userType == "admin") {
      const username = req.body.username;
      const userId = await selectByusernameFromUser(username);
      await insertAdmin(userId.id, username);
    } else {
      const userId = await selectByusernameFromUser(username);
      await insertAttendee(userId.id, username);
    }
    res.json({
      success: "Registration successful!",
    });
  }
});

//Login
app.post("/api/login/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const outputName = await selectByUsernameFromUser(username);
  const outputPass = await selectByUsePasswordFromUser(password);
  const output = await selectByUsernameAndPasswordFromUser(username, password);
  if (outputName && outputPass) {
    res.json({
      success: "Login successful!",
      userType: output.userType,
      firstName: output.firstName,
      surname: output.surname,
      username: output.username,
    });
  } else if (!outputName) {
    res.json({
      error: "User does not exist!",
    });
  } else if (!outputPass) {
    res.json({
      error: "Incorrect password!",
    });
  }
});

// Get all attendees
app.get("/api/getAttendees/", async (req, res) => {
  try {
    const attendees = await selectAtendees();

    if (attendees.length > 0) {
      res.json({
        success: true,
        attendees: attendees,
      });
    } else {
      res.json({
        message: "No attendees found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// Submit register
app.post("/api/submitRegister/", async (req, res) => {
  const registerName = req.body.registerName;
  const selectedAttendees = req.body.selectedAttendees;
  const storedUsername = req.body.storedUsername;
  const userType=await selectuserTypeFromUserByUserName(storedUsername)
  const existingRegister = await selectAllByRegisterNameFromRegister(registerName);
  const attendeeId = [];
  for (let i = 0; i < selectedAttendees.length; i++) {
    attendeeId.push(await selectIdByUserNameFromAttendee(selectedAttendees[i]));
  }
  if (existingRegister) {
   if(existingRegister.length!=0){
    if(registerName){
      res.json({
        error: "Register name already exists, please change it.",
      });
     }
    } else if (selectedAttendees.length === 0) {
      res.json({
        error: "please select atleast one attendee.",
      });
    } else {
      const highestRegistrationId = await selectMaximumRegistrationId();
      let newRegistrationId = 1;

  
      if (highestRegistrationId && highestRegistrationId.maxRegisterId !== null) {
        newRegistrationId = highestRegistrationId.maxRegisterId + 1;
      }
  
      for (let i = 0; i < selectedAttendees.length; i++) {
        let value = selectedAttendees[i];
        let id = attendeeId[i].attendeeId;
        //if userType exist
        console.log(userType)
        if(userType){
            await insertIntoRegister(
              newRegistrationId,
              id,
              registerName,
              value,
              storedUsername
            );
           
        }

      }
  
      res.json({
        userType:userType.userType,
        success: "Register creation successful!",
      })
    }
   }
});

// Get list of registers
app.post("/api/getRegisters/", async (req, res) => {
  try {
    const registers = await selectByAdminNameFromRegister(
      req.body.storedUsername
    );
    if (registers.length > 0) {
      res.json({
        success: true,
        registers: registers,
      });
    } else {
      res.json({
        error: "No registers found.",
      });
    }
  } catch (error) {
    console.error("Error fetching registers:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//Delete register
app.post("/api/deleteRegister/", async (req, res) => {
  const registerId = req.body.registerId;
  const register = await selectByRegisterIdFromRegister(registerId);

  if (register) {
    await deleteByRegisterIdFromRegister(registerId);
    res.json({
      success: true,
    });
  } else {
    res.json({
      error: "Register does not exist!",
    });
  }
});


//View entire register
app.post("/api/viewRegister/", async (req, res) => {
  const registerId = req.body.registerId;

  
  let registerName = "";
  const register = await selectByRegisterFromRegister(registerId);
  console.log(register)
  const attendance = [];
  let attendeeId = "";
  for (let i = 0; i < register.length; i++) {
    registerName = register[i].registerName;
    attendeeId = register[i].attendanceId;
    let result = await selectByattendeeIdFromUser(attendeeId);
    //continue if registered on register but not attended else collect the data of attendees
    if (result[0] === undefined) {
      continue;
    } else {
      attendance.push(result[0]);
    }
  }
  
  if (attendance.length > 0) {
    res.json({
      success: true,
      registerName: registerName,
      register:register,
      attendance: attendance,
    });
  } else {
    res.json({
      // Use a 404 status code for "Not Found"
      error: "No attendance recorded for this register.",
    });
  }
});

//Get specifc register
app.post("/api/viewSpecificRegister/", async (req, res) => {
  const attendeeName = req.body.attendeeName;

  const attendance = await selectByattendeeNameFromUser(attendeeName);
  if (attendance.length > 0) {
    res.json({
      success: true,
      attendance: attendance,
    });
  } else {
    res.json({
      // Use a 404 status code for "Not Found"
      error: "No attendance recorded for this user.",
    });
  }
});

//view register name
app.post("/api/viewRegisterName/", async (req, res) => {
  const attendanceId = req.body.attendanceId;

  //KEATLA
  const registerName = await selectByAttendanceIdFromRegister(attendanceId);

  if (registerName) {
    res.json({
      success: true,
      registerName: registerName.registerName,
    });
  } else {
    res.json({
      // Use a 404 status code for "Not Found"
      error: "No register with that name.",
    });
  }
});

//Add Attendance
app.post("/api/addAttendance/", async (req, res) => {
  //const attendanceId = req.body.attendanceId;
  const username = req.body.username;

  //generate currrnt time and date
  const checkInDate = dateGenerater();
  const checkInTime = timeGenerater();
  const results = await selectDateFromAttendee(username, checkInDate);
  const attendeeId = await selectByUsernameFromRegister(username);
  
  // Check if both username and attendeeId exist
  const usernameRow = await selectByUsernameFromAttendee(username);
  
  
  const attendees=await selectAllByattendeeIdFromUser(usernameRow.registerId)
  
  if (!usernameRow) {
    res.json({
      error: "Invalid username. The username does not exist.",
    });
  } else {
    //if the user hasnt submited attendance yet else return message
    if (!results) {
      await insertIntoAttendance(
        usernameRow.username,
        usernameRow.registerId,
        usernameRow.userId,
        usernameRow.attendeeId,
        checkInTime,
        checkInDate
      );
      res.json({
        success: true,
        attendees:attendees,
        message: "Attendance added successfully.",
      });
    } else {
      //TODO
      //
      //make attendee to attend different classes per day
      //
      res.json({
        allertMessage: `you have taken your attendance at ${results.checkInTime}`,
        attendees:attendees[0]
      });
    }
    
  }
});


// const p=await selectByUsernameAndPasswordFromUser("pudding",1234)
 console.log(await selectuserTypeFromUserByUserName("sam"))



