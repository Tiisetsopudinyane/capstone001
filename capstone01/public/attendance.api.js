document.addEventListener('alpine:init', () => {

	Alpine.data('Attendance', () => {

		return {
			firstName:'',
			surname:'',
			email:'',
			username:'',
			password:'',
			validPassword:true,
			confirmPassword:'',
			selectedRegisterName:'',
			userType:'',
			validUsername:true,
			phoneNumber:'',
			specificAttendanceList:[],
			searchUser:'',
			manualAttendanceUsername:'',
			emailValid: true,
			registeredList:[],
			attendeeList: [],
			selectedAttendees: [],
			registerList:'',
			validPhoneNumber:true,
			registerName:'',
			attendanceList:[],
			attendanceName:'',
			suggestions: [],
			query: '',
			savedUserType:localStorage.getItem("userType"),
			id:'',
			displayName:localStorage.getItem('username'),

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
				this.attendanceName=localStorage.getItem('registerName');

				//get list of registered Names under this username
				this.getRegisterNames(storedUsername);
				//Get Register
				axios.post("/api/suggest", {
					query: this.searchUser
				  }).then((result) => {
					this.suggestions = result.suggestions;
				  }).catch((error) => {
					console.error('Error fetching suggestions:', error);
				  });
				  
				axios.post("/api/getRegisters/", {
					storedUsername: storedUsername
			    }).then((result) => {
					if (result.data.success) {
					  this.registeredList= result.data.registers;
				      
					} else {
					  console.error("No registers found or error occurred.");
					}
	    		});
                
				//Get specific register name
				
				this.attendanceList = JSON.parse(localStorage.getItem('attendanceList'));
				console.log(this.attendanceList)
				axios.post("/api/viewRegisterName/", {
					registerId : this.id,
					username:storedUsername
				}).then((result)=>{
					if(result.data.success){
					const type=result.data.list
					
						
					this.attendanceName =result.data.registerName;
					
					}
					
				});
                
			},
		       getSuggestions() {
				// Clear previous suggestions
				this.suggestions = [];
			
				const query = this.searchUser.trim();
			
				if (query.length === 0) {
				  // If the query is empty, exit early
				  return;
				}},
			//get list of registerNames
			getRegisterNames(displayName){
				axios.post('/api/registerNames/',{
					username:displayName
			   }).then((result)=>{
				
				   this.registeredList=result.data.registerName
				   localStorage.setItem('registeredList',this.registerList)
				   this.registerList=localStorage.getItem('registeredList')
			   })
			},
			validateEmail() {
				const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
				this.emailValid = emailPattern.test(this.email);
            },
			isValidPhoneNumber(){
				const phoneRegex = /^(?:\+\d{1,3}|0)\d{8,}$/;
				this.validPhoneNumber= phoneRegex.test(this.phoneNumber);
			  },
			  isValidUsername() {
				const usernameRegex = /^\S+$/;
				this.validUsername=usernameRegex.test(this.username);
				
			  },
			  isValidPassword() {
				const passwordRegex = /^\S+$/;
				this.validPassword=passwordRegex.test(this.password);
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
				else if(!this.validPhoneNumber){
					alert(`Invalid phone numbers include country code 
					      .eg: +276748... or 06748...`)
				}
				else if(!this.validUsername){
					console.log(this.validUsername)
					alert(`Username should have no spaces between`)
				}
				else if (!this.validPassword){
					alert(`.At least one letter (uppercase or lowercase).
					       .At least one digit.
					       .A minimum length of 8 characters.`)
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
							if(this.userType=="admin"){
								window.location.href = './index.html';
							}
							else{
								window.location.href = './registrationScanner.html';
							}
							this.firstName = '';
							this.surname = '';
							this.email = '';
							this.password = '';
							this.username='';
							this.confirmPassword = '';
							this.userType = '';
							this.phoneNumber = '';
							
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
				this.registerSubimt();
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
registerSubimt(){
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
			viewRegister(registerId) {
				localStorage.setItem('id',registerId)
				this.registerView();
				
			},
			registerView(){
				axios.post("/api/viewRegister/", {
					registerId: this.id,
				  }).then((result) => {
					if (result.data.success) {
					  this.id=0;

					  // Save attendanceList to localStorage
					  localStorage.setItem('attendanceList', JSON.stringify(result.data.attendance));
					  this.attendanceList=localStorage.getItem('attendanceList');
					  localStorage.setItem('registerName',result.data.registerName)
					  const list=localStorage.getItem('attendanceList')
					  this.id=list.registerId
					  this.attendanceName=localStorage.getItem('registerName')
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
				window.location.href = './registerLists.html';          
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
				this.registerName;
				this.id=0;
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
					username : this.searchUser,
					registerId:this.id,
					registerName:this.attendanceName
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
						this.registerView();
						window.location.href = './attendanceList.html';
					  }
					  else{
						  alert(result.data.error)
						  this.attendanceList=localStorage.getItem('attendees')
						  this.manualAttendanceUsername=""
						  this.getRegisterNames(storedUsername);
						  this.registerView();
						  window.location.href = './attendanceList.html';
					  }
					  
				  })
				}
				else{
					this.manualAttendanceUsername=""
					alert("As admin you can not submit your attandance")
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