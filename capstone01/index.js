import express from 'express';
import cors from 'cors';
import {selectUser,insertUser,selectByusernameFromUser,insertAdmin,insertAttendee,
  selectByUsernameAndPasswordFromUser,selectAtendees,selectAllByRegisterNameFromRegister,selectIdByUserNameFromAttendee,
  selectMaximumRegistrationId,insertIntoRegister,selectByAdminNameFromRegister,selectByRegisterIdFromRegister,
  deleteByRegisterIdFromRegister,selectByRegisterFromRegister,selectByattendeeIdFromUser,
  selectByattendeeNameFromUser,selectByAttendanceIdFromRegister,selectByUsernameFromAttendee,insertIntoAttendance} from './sql.queries.js'
import {dateGenerater,timeGenerater} from './dateTimeGenerator.js'


//express initialization
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => console.log(`Attendance App started on port: ${PORT}`))

// Sign-up API
app.post("/api/addUser/", async (req,res)=>{
     
    const username = req.body.username
    const email = req.body.email 
    const phoneNumber =req.body.phoneNumber 

    //extract values values from the table
    const output= await selectUser(username,email,phoneNumber)

    if (output.email)
    {
        res.json({
            error : "Email address already exist! Change your email."
        })
    }
    else if(output.phoneNumber)
    {
        res.json({
            error : "Phone number already exist! Change your phone number."
        })
    }
    else if(output.username)
    {
        res.json({
            error : "Username already exist! Change your username."
        })
    }
    else 
    {
        const firstName =req.body.firstName
        const surname=req.body.surname
        const email=req.body.email
        const phoneNumber=req.body.phoneNumber
        const username=req.body.username
        const password=req.body.password
        const userType=req.body.userType

        await insertUser(firstName,surname,email,phoneNumber,username,password,userType)
        if(userType=="admin")
          {
            const username= req.body.username
            const userId = await selectByusernameFromUser(username)
            await insertAdmin(userId.id,username)
          }
          else
          {
            const userId=await  selectByusernameFromUser(username) 
            await insertAttendee(userId.id,username)
          }
        res.json({
            success : "Registration successful!"
        })
    }
});

//Login
app.post("/api/login/", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const output=await selectByUsernameAndPasswordFromUser(username,password)
    if (output.username && output.password)
    {
        res.json({
            success : "Login successful!",
            userType:output.userType,
            firstName:output.firstName,
            surname:output.surname
        })
    }
    else if(!output.username)
    {
        res.json({
            error : "User does not exist!"
        })
    }
    else if(!output.password)
    {
        res.json({
            error : "Incorrect password!"
        })
    }
});

// Get all attendees
app.get("/api/getAttendees/", async (req, res) => {
    try {
        const attendees = await selectAtendees()

        if (attendees.length > 0) 
        {
            res.json({
                success: true,
                attendees: attendees,
            });
        } 
        else 
        {
            res.json({
                message: "No attendees found.",
            });
        }
    } 
    catch (error) 
    {
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
    const existingRegister = await selectAllByRegisterNameFromRegister(registerName)
    const attendeeId=[]

    for(let i=0;i<selectedAttendees.length;i++)
  {
    attendeeId.push(await selectIdByUserNameFromAttendee(selectedAttendees[i])); 
  }
    if (existingRegister) 
    {
      res.json({
        error: "Register name already exists, please change it."
      });
    }
    else if(selectedAttendees.length===0)
    {
        res.json({
            error: "please select atleast one attendee."
          });
    }
     else 
     {
  
      const highestRegistrationId = await selectMaximumRegistrationId();
      let newRegistrationId = 1;
  
      if (highestRegistrationId && highestRegistrationId.maxRegisterId !== null)
      {
        newRegistrationId = highestRegistrationId.maxRegisterId + 1;
      }
  
      for (let i = 0; i < selectedAttendees.length; i++) 
      {
        let value = selectedAttendees[i];
        let id=attendeeId[i].attendeeId 
        await insertIntoRegister(newRegistrationId,id, registerName, value, storedUsername)
      }
  
      res.json({
        success: "Register creation successful!"
      });
    }
  });
  
  
// Get list of registers
app.post("/api/getRegisters/", async (req, res) => {
    try {
      const registers = await selectByAdminNameFromRegister(req.body.storedUsername)
      if (registers.length > 0) 
      {
        res.json({
          success: true,
          registers: registers,
        });
      } 
      else 
      {
        res.json({
          error: "No registers found.",
        });
      }
    } 
    catch (error) 
    {
      console.error("Error fetching registers:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });
  

//Delete register
  app.post("/api/deleteRegister/" , async (req, res)=>{
   const registerId=req.body.registerId
    const register = await selectByRegisterIdFromRegister(registerId);
    
    if(register)
    {
      await deleteByRegisterIdFromRegister(registerId)
      res.json({
        success: true,
      })
    }
    else 
    {
      res.json({
        error: "Register does not exist!",
      })
    }
  });

  //globalized variable:usable 
  let registerName=""
  //View entire register
  app.post("/api/viewRegister/", async (req, res) => {
    const registerId = req.body.registerId;
    const register= await selectByRegisterFromRegister(registerId);
    const attendance=[]
    let attendeeId=""

    for(let i=0;i<register.length;i++)
    {
      registerName=register[i].registerName
      attendeeId=register[i].attendanceId
      let result= await selectByattendeeIdFromUser(attendeeId)

      //continue if registered on register but not attended else collect the data of attendees
      if(result[0]===undefined)
      {
        continue;
      }
      else
      {
        attendance.push(result[0])
      }
    }
   console.log(attendance)
    if (attendance.length > 0) 
    {
      res.json({
        success: true,
        registerName:registerName,
        attendance: attendance,
      });
    } 
    else
     {
      res.json({  // Use a 404 status code for "Not Found"
        error: "No attendance recorded for this register.",
      });
    }
  });
  
  //Get specifc register
  app.post("/api/viewSpecificRegister/", async (req, res) => {
    const attendeeName = req.body.attendeeName;

    const attendance = await selectByattendeeNameFromUser(attendeeName)
       console.log("2 "+attendance)
    if (attendance.length > 0) 
    {
      res.json({
        success: true,
        attendance: attendance,
      });
    }
     else
      {
      res.json({  // Use a 404 status code for "Not Found"
        error: "No attendance recorded for this user.",
      });
    }
  });

  //view register name
  app.post("/api/viewRegisterName/", async (req, res) => {
    const attendanceId = req.body.attendanceId;
    const registerName = await selectByAttendanceIdFromRegister(attendanceId)
    
    if (registerName) 
    {
      res.json({
        success: true,
        registerName: registerName.registerName,
      });
    } 
    else 
    {
      res.json({  // Use a 404 status code for "Not Found"
        error: "No register with that name.",
      });
    }
  });

//Add Attendance
app.post("/api/addAttendance/", async (req, res) => {
    //const attendanceId = req.body.attendanceId;
    const username=req.body.username;

    //generate currrnt time and date
    const checkInDate=dateGenerater()
    const checkInTime=timeGenerater()
    // Check if both username and attendeeId exist
    const usernameRow = await selectByUsernameFromAttendee(username)
    if (!usernameRow.username) 
    {
      res.json({
        error: "Invalid username. The username does not exist.",
      });
    }
    else
    {
      
      await insertIntoAttendance(usernameRow.username,usernameRow.userId, usernameRow.attendeeId, checkInTime,checkInDate);
      //await insertIntoAttendee(usernameRow.username,usernameRow.userId, usernameRow.attendeeId, timeGenerater(),dateGenerater());
      res.json({
        success: true,
        message: "Attendance added successfully.",
      });
    }
});
//const usernameRow=await selectByUsernameFromAttendee('lerato')
//console.log(await insertIntoAttendance(usernameRow.username,usernameRow.userId, usernameRow.attendeeId, timeGenerater(),dateGenerater()))
//console.log(usernameRow.username+" "+dateGenerater()+ " "+!usernameRow.username)
  