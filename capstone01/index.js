import express from "express";
import cors from "cors";
import {
  insertUser,
  selectUser,
  insertIntoAttendance,
  selectUserwithEmail,
  selectUserwithUsername,
  selectByusernameFromUser,
  selectAllByattendeeIdFromUser,
  selectuserTypeFromUserByUserName,
  insertAdmin,
  insertAttendee,
  selectUserByName,
  selectAttendeeIdFromAttendeeByUserId,
  selectByUsernameAndPasswordFromUser,
  selectByUsernameFromUser,
  selectByUsePasswordFromUser,
  selectAtendees,
  selectAllUsersFromsUser,
  selectAllByRegisterNameFromRegister,
  selectIdByUserNameFromAttendee,
  selectMaximumRegistrationId,
  insertIntoRegister,
  selectByAdminNameFromRegister,
  selectByRegisterIdFromRegister,
  deleteByRegisterIdFromRegister,
  selectByRegisterFromRegister,
  selectByattendeeIdFromUser,
  selectByattendeeNameFromUser,
  selectByUsernameFromRegister,
  selectRegisterNamesByUsernameFromRegister,
  selectByAttendanceIdFromRegister,
  selectuserTypeFromUser,
  suggestionsData,
  selectAllFromUserAndAttendanceById,
  selectDateFromAttendee,
} from "./sql.queries.js";
import {myCipher,myDecipher} from './encryption.js'
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
      
    } 
    else if(registerName==""){
      res.json({
        error: "please enter the name for your register",
      });
    }else if(userType.userType==="attendee"){

      res.json({
        error:"Attendee is not permitted to create register",
        message:"attendee"
      })
    }
    else {
      const highestRegistrationId = await selectMaximumRegistrationId();
      let newRegistrationId = 1;

  
      if (highestRegistrationId && highestRegistrationId.maxRegisterId !== null) {
        newRegistrationId = highestRegistrationId.maxRegisterId + 1;
      }
  
      for (let i = 0; i < selectedAttendees.length; i++) {
        let value = selectedAttendees[i];
        let id = attendeeId[i].attendeeId;
        //
        //if userType exist isert the following to database
        //
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
  const storedUsername=req.body.storedUsername
  try {
    const registers = await selectByAdminNameFromRegister(storedUsername);
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
  const username=req.body.username;
  
  const register = await selectByRegisterIdFromRegister(registerId);
  const user=await selectAllUsersFromsUser(username);
  console.log(register)
  console.log(user.userType)
  if (register.length>0) {
    ///
    ///if is Admin delete the register or else trigger error message to Attendee
    ///
    if(user.userType==="admin"){
      await deleteByRegisterIdFromRegister(registerId);
    res.json({
      success: true,
    });
  }
    else {
      res.json({
        error: "Attendee cannot delete any Register!",
      });
   }
   
  }
  
  else {
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
  registerName = register[0].registerName;

  const result = await selectByattendeeIdFromUser(registerName);
  
  if (result.length > 0) {
    res.json({
      success: true,
      registerName: registerName,
      register:register,
      attendance: result,
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
  const username = req.body.username;
  const registerId=req.body.registerId;
  const registerName=req.body.registerName
  const attendance = await selectByattendeeNameFromUser(username,registerId,registerName);
  console.log(username+" "+registerId+" "+registerName)
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
  const username = req.body.username;
  const registerId = req.body.registerId;
  const list=await selectuserTypeFromUser(username);
  ///
  ///
  ///
  const registerName = await selectByAttendanceIdFromRegister(registerId);
  
  if (registerName) {
    if(list){
      res.json({
        success: true,
        registerName: registerName.registerName,
        list:list
      });
    }
    else{
      res.json({
        success: true,
        registerName: registerName.registerName,
      });
    }
  } else {
    res.json({
      // Use a 404 status code for "Not Found"
      error: "No register with that name.",
    });
  }
});

//registerNames
app.post("/api/registerNames/",async (req,res)=>{
  const username=req.body.username;
  //get a list of registers under this username 
  const attendee = await selectRegisterNamesByUsernameFromRegister(username);

  if(attendee){
    res.json({
      registerName:attendee
    })
  }
  else{
    res.json({
      error:"not available"
    })
  }
})


//Add Attendance
app.post("/api/addAttendance/", async (req, res) => {
  const username = req.body.username;
  const selectedRegisterName=req.body.selectedRegisterName;
  
  //generate current time and date
  const checkInDate = dateGenerater();
  const checkInTime = timeGenerater();
  //get all row from attendance with username and checkInDate
  const results = await selectDateFromAttendee(username, selectedRegisterName);
  //serch registerName
  const attendee = await selectByUsernameFromRegister(username,selectedRegisterName);
  const output=await selectAllByattendeeIdFromUser(attendee.registerId)
  if(attendee && attendee.length!=0){
    //
    //if selected Register Name and username are not in the database
    //do the following, porpulate the database
    // 
    if(!results){

        const userInfo=await selectUserByName(username);
        const attendeeInfo =await selectAttendeeIdFromAttendeeByUserId(userInfo.id)
        
         if(attendeeInfo){
            await insertIntoAttendance(
              userInfo.id,
              attendee[0].registerId,
              attendee[0].registerName,
              attendeeInfo.attendeeId,
              attendee[0].attendee,
              checkInTime,
              checkInDate
            );
            res.json({
              attendee:attendee[0],
              userInfo:userInfo,
              success: true,
              attendees:attendee,
              output:output,
              message: "Attendance added successfully.",
            })
          }
             
    } else{
      //
      //loop around the attendance to check the date
      //and allow the user to submit attendance for another day
      //
      if(results.checkInDate!= checkInDate){
        
        const userInfo=await selectUserByName(username);
        const attendeeInfo =await selectAttendeeIdFromAttendeeByUserId(userInfo.id)
        
         if(attendeeInfo){
            await insertIntoAttendance(
              userInfo.id,
              attendee[0].registerId,
              attendee[0].registerName,
              attendeeInfo.attendeeId,
              attendee[0].attendee,
              checkInTime,
              checkInDate
            );
            res.json({
              attendee:attendee[0],
              userInfo:userInfo,
              success: true,
              attendees:attendee,
              output:output,
              message: "Attendance added successfully.",
            })
          }    
          }
          else{
            res.json({
              error:"Attendance has been submited for this Register "
            })
          } 
  }
}
else{
  res.json({
    error:"You are not registered to this Register Name"
  })
}
});

app.post('/api/suggest',async (req, res) => {
  const query = req.body.query;
  const suggestionQuery=await suggestionsData();
  const suggestions = suggestionQuery.filter((suggestion) => {
    if (typeof suggestion === 'string') {
      return suggestion.startsWith(query);
    }
    return false; // Exclude non-string values from the suggestions
  });
  if(suggestions){
    res.json({ suggestions })
  };
});

