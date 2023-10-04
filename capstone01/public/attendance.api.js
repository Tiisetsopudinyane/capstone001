document.addEventListener('alpine:init', () => {

	Alpine.data('Attendance', () => {

		return {
			firstName:'',
			surname:'',
			email:'',
			username:'',
			password:'',
			confirmPassword:'',
			selectedRegisterName:'',
			userType:'',
			phoneNumber:'',
			searchUser:'',
			manualAttendanceUsername:'',
			emailValid: true,
			registeredList:[],
			attendeeList: [],
			selectedAttendees: [],
			registerList:'',
			registerName:'',
			attendanceList:[],
			attendanceName:'',
			savedUserType:localStorage.getItem("userType"),
			id:'',
			displayName:localStorage.getItem('username'),
			i:[],

			init(){
				this.id=localStorage.getItem('id')
				// Get Attendance
				axios.get("/api/getAttendees/").then((result) => {
					if (result.data.success) {
						// Assuming result.data.attendees is an array of attendees
						localStorage.setItem('attendees',result.data.attendees)
						this.attendeeList = result.data.attendees;
					} else {
						// Handle the case when no attendees are found or an error occurs
						console.error("No attendees found or error occurred.");
					}
				});
				const storedUsername = localStorage.getItem("username");
				this.attendanceName=localStorage.getItem('attendanceName');

				//get list of registered Names under this username
				this.getRegisterNames(storedUsername);
                
				//Get Register
				
				axios.post("/api/getRegisters/", {
					storedUsername: storedUsername
			    }).then((result) => {
					if (result.data.success) {
					  this.registerList = result.data.registers;
					  
					} else {
					  console.error("No registers found or error occurred.");
					}
	    		});
                
				//Get specific register name
				
				this.attendanceList = JSON.parse(localStorage.getItem('attendanceList'));
				axios.post("/api/viewRegisterName/", {
					registerId : this.id,
					username:storedUsername
				}).then((result)=>{
					if(result.data.success){
					const type=result.data.list
					if(type.userType=="admin"){
						this.attendanceName =`Attendance for ${result.data.registerName}`;
					}
					else{
						this.attendanceName="Attendance"
					}

					}
				});
                
			},
			//get list of registerNames
			getRegisterNames(displayName){
				axios.post('/api/registerNames/',{
					username:displayName
			   }).then((result)=>{
				
				   this.registeredList=result.data.registerName
				   console.log(this.registeredList)
			   })
			},
			validateEmail() {
				const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
				this.emailValid = emailPattern.test(this.email);
            },
           
			//Signup
			signup(event){
				event.preventDefault();
				if (this.password !== this.confirmPassword) {
					alert(`Please ensure Passwords match.`);
				} else if(this.userType == ''){
					alert(`Please ensure 'User type' is selected.`)
				}
				else if(!this.emailValid){
					alert(`Please ensure valid email address is entered.`)
				}
				else if(!this.username){
					alert(`Please enter a username.`)
				}
				else {
					axios.post('/api/addUser/', {
						firstName : this.firstName,
						surname : this.surname,
						email : this.email,
						username : this.username,
						password : this.password,
						userType : this.userType,
						phoneNumber : this.phoneNumber
					  }).then((result)=>{
						if(result.data.error){
						alert(result.data.error);
						}
						else
						{
							alert(result.data.success);
							this.firstName = '';
							this.surname = '';
							this.email = '';
							this.password = '';
							this.username='';
							this.confirmPassword = '';
							this.userType = '';
							this.phoneNumber = '';
							window.location.href = './index.html';
						}
					  })
				}
			},
			//SignUp Button functionaliy
            

			//Login
			login(event){
				event.preventDefault();
				
				axios.post("/api/login/", {
					username : this.username,
					password : this.password
				}).then((result)=>{
					if(result.data.success){
						localStorage.setItem("username", this.username);
						localStorage.setItem('userType',result.data.userType);
						this.username = '';
						this.password = '';
						if(result.data.userType==="admin")
						{
							window.location.href = './registerLists.html';
						}
						else
						{
							window.location.href = './scanner.html';
						}
						   	 
					}
					else
					{
						alert(result.data.error)
					}
				})
			},
			goToAutoScanner(){
				window.location.href= "./scanner.html";
			},
			submitRegister(event){
				event.preventDefault();
				const storedUsername = localStorage.getItem("username");
				axios.post("/api/submitRegister/", {
					selectedAttendees : this.selectedAttendees,
					registerName : this.registerName,
					storedUsername : storedUsername
				}).then((result)=>{
						if(result.data.success){
							this.selectedAttendees=[];
							this.registerName=''; 
							alert("Register has been created, successfully!")
							window.location.href = './registerLists.html';  	 
						}else if(result.data.error){
							if(result.data.message==="attendee"){
								this.registerName='';
								alert(result.data.error);
								window.location.href = './registerLists.html';
							}
							else{
								this.registerName='';
								alert(result.data.error);
							}
						}
						this.registerName=''
						this.selectedAttendees=[]
				})
			},

			deleteRegister(registerId){
				axios.post("/api/deleteRegister/", {
					registerId : registerId,
					username:this.displayName
				}).then((result)=>{
					if(result.data.success){
						window.location.href = './registerLists.html';  	 
					}else{
						alert(result.data.error);
					}
				})
			},

			viewRegister(registerId) {
				localStorage.setItem('id',registerId)
				
				axios.post("/api/viewRegister/", {
				  registerId: this.id,
				}).then((result) => {
				  if (result.data.success) {
			        
					// Save attendanceList to localStorage
					localStorage.setItem('attendanceList', JSON.stringify(result.data.attendance));
					this.attendanceList=localStorage.getItem('attendanceList');
				    localStorage.setItem('registerName',result.data.registerName)
				    this.attendanceName=localStorage.getItem('registerName')
					console.log(this.attendanceName)
					window.location.href = './attendanceList.html';
					
				  } else {
					alert(result.data.error);
				  }
				}).catch((error) => {
				  console.error("Error:", error);
				});
			},
			
			//Attendance List button functionality
			showFullAttendance: true,
			showAutomatedAttendance: false,
			showSearchAttendee: false,
			showSearch : true,
			showManualAttendance: false,
			searchUser : '',
			specificAttendanceList : '',
			manualAttendanceUsername: '',
            manualAttendanceAttendeeId: '',
            manualAttendanceCheckInTime: '',

			viewEntireRegister(){
				this.showFullAttendance = true; 
				this.showSearch=true; 
				this.showSearchAttendee = false;
				this.showAutomatedAttendance = false;
				this.showManualAttendance = false;           
			},
			
            automatedAttendance() {
				this.showAutomatedAttendance = true;     
				this.showSearchAttendee = false;           
				this.showManualAttendance = false; 
				window.location.href= "./scanner.html";          
			},
       
			searchAttendee() {          
				this.showAutomatedAttendance = false;      
				this.showSearchAttendee = true;
				this.showManualAttendance = false;
				this.showSearch = false;
			},
			viewAttendanceList(){
				this.registerName
               window.location.href="./attendanceList.html";
			},

			manualAttendance() {
				this.showAutomatedAttendance = false;
				this.showSearchAttendee = false;		
				this.showManualAttendance = true;
				window.location.href='./manualScanner.html';
		    },
    
			deleteAttendance() {
				this.showAutomatedAttendance = false;
				this.showSearchAttendee = false;
				this.showManualAttendance = false;
			},
            
			submitSearch(event){
				event.preventDefault();
				axios.post("/api/viewSpecificRegister/", {
					attendeeName : this.searchUser
				}).then((result) => {
					if (result.data.success) {
						// Assuming result.data.attendees is an array of attendees
						this.specificAttendanceList = result.data.attendance;
						this.showFullAttendance = false;
						this.searchUser='';
					} else {
						alert(result.data.error);
						this.searchUser='';
						console.error("No attendance found or error occurred.");

					}
				});
			},

			// 
			submitManualAttendance(event) {
				event.preventDefault();
				 //if attendee registered must submit attandance once for that selected register
				 //attendee cannot sumbit attendance for other user
				 //admin cannot submit attendance
				 //selectedRegisterName
				 
				 const username=localStorage.getItem('username')
				 if(username===this.manualAttendanceUsername){
				     if(this.savedUserType!="admin"){
					axios
					.post("/api/addAttendance/", {
					  username: this.manualAttendanceUsername,
					  selectedRegisterName:this.selectedRegisterName
					})
					.then((result) => {
						localStorage.setItem('attendees',result.data.attendees)
						  if (result.data.success) {
						alert(result.data.message);
						this.id=localStorage.getItem('registerId')
						this.manualAttendanceUsername='';
						this.attendanceList=localStorage.getItem('attendees')
						this.getRegisterNames(storedUsername);
						window.location.href = './attendanceList.html';
					  }
					  else{
						  alert(result.data.error)
						  this.attendanceList=localStorage.getItem('attendees')
						  this.manualAttendanceUsername=""
						  this.getRegisterNames(storedUsername);
						  window.location.href = './attendanceList.html';
					  }
					  
				  })
				}
				else{
					this.manualAttendanceUsername=""
					alert("As admin you cant submit your attandance")
					window.location.href = './attendanceList.html';
				}
				 }
				 else{
					this.manualAttendanceUsername='';
					alert("you cant register attendance for other user or if you are admin")
				 }
			  },
			  
		}

	});
})