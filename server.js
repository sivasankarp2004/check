const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt=require("jsonwebtoken")
const {Leave}=require("./schema/pass");
const {WLeave}=require("./schema/wpass");
const { Warden } = require('./schema/warden');
const {AccessModel}=require("./schema/Access")
const {Smodel}=require("./schema/student")
const {Wmodels}=require("./schema/wstudents")
const {Rmodels}=require("./schema/RegularAccess")
const {RLeave}=require("./schema/Regular")
const {Announcement}=require("./schema/Announcement")
const {v4:uuidv4}=require("uuid")
const cron = require('node-cron');

// MongoDB Connection URL
const mongoURI = 'mongodb+srv://kaschostel4:sivasankar@kaschostelcluster0.nopfs.mongodb.net/studentform';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    regNo: String,
    courseYear: String,
    educationType: String,
    course: String,
    dob: Date,
    gender: String,
    studentPhone: String,
    studentEmail: String,
    roomNo: String,
    nativePlace: String,
    address: String,
    religion: String,
    caste: String,
    nationality: String,
    bloodgroup: String,
    motherName: String,
    fatherName: String,
    parentsno: String,
    accountNo: String,
    accountHolder: String,
    ifsc: String,
    branch: String,
    username: String,
    password: String,
    photo: String ,
    Ypass:{
        type:Number,
        default:0
    }
});

// Create the model
const Student = mongoose.model('Student', studentSchema);

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for storing uploaded photos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

const upload = multer({ storage: storage });

// Define API endpoint to handle form submission with file upload


const verifyToken = (req, res, next) => {
    try {
    
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        return res.status(401).json({ message: "Token required" });
      }
  
      const token = authHeader.split(" ")[1];
  
        if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
  
       
      const decode = jwt.verify(token, "Secret_key");
     
      req.user = decode;
      next();
     
      
     
     
    } catch (err) {
       if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  };



app.post("/addPass",verifyToken,async(req,res)=>{
    const Id=req.user.Id;
    const Details=await Student.findOne({_id:Id})
    if(Details.Ypass==0){
    Details.Ypass=1
    }
    else{
        console.log("No Authorized Activity")
        return res.json({message:"No Access"})
    }
    await Details.save()
    const {name,
        regNo,
        gender,courseYear,
        course,
        roomNo,       
studentPhone,
parentsno,}=Details
       
    const {
        reason,
        fromDate,
        toDate,
        days,
        currentTime
    }=req.body
    console.log({   Id,
        name,
        regNo,
        gender,
        year:courseYear,
        department:course,
        roomNo,
        phone:studentPhone,
        parentsno,
        reason,
        fromDate,
        toDate,
        days,
        currentTime})
    try{
      const response=await Leave({ 
        Id,
        name,
        regNo,
        gender,
        year:courseYear,
        department:course,
        roomNo,
        phone:studentPhone,
        parentsno,
        reason,
        fromDate,
        toDate,
        days,
        currentTime})
      await response.save()
      res.json({response})
    }
    catch(err){
        res.json({message:err.message})
    }
})





app.post("/addWPass",verifyToken,async(req,res)=>{
    const Id=req.user.Id;
    const Details=await Student.findOne({_id:Id})
    const {name,
        regNo,
        gender,courseYear,
        course,
        roomNo,       
studentPhone,
parentsno,}=Details
       
    const {
        reason,
        fromTime,
        toTime,
        Hours,
        currentTime
    }=req.body
    console.log({   Id,
        name,
        regNo,
        gender,
        year:courseYear,
        department:course,
        roomNo,
        phone:studentPhone,
        parentsno,
        reason,
        fromTime,
        toTime,
        Hours,
        currentTime})
    try{
      const response=await WLeave({ 
        Id,
        name,
        regNo,
        gender,
        year:courseYear,
        department:course,
        roomNo,
        phone:studentPhone,
        parentsno,
        reason,
        fromTime,
        toTime,
        Hours,
        currentTime})
      await response.save()
      res.json({response})
    }
    catch(err){
        res.json({message:err.message})
    }
})



app.post("/addRPass",verifyToken,async(req,res)=>{
    const Id=req.user.Id;
    const Details=await Student.findOne({_id:Id})
    const {name,
        regNo,
        gender,courseYear,
        course,
        roomNo,       
studentPhone,
parentsno,}=Details
       
    const {
        reason,
        fromTime,
        toTime,
        Hours,
        currentTime
    }=req.body
    console.log({   Id,
        name,
        regNo,
        gender,
        year:courseYear,
        department:course,
        roomNo,
        phone:studentPhone,
        parentsno,
        reason,
        fromTime,
        toTime,
        Hours,
        currentTime})
    try{
      const response=await RLeave({ 
        Id,
        name,
        regNo,
        gender,
        year:courseYear,
        department:course,
        roomNo,
        phone:studentPhone,
        parentsno,
        reason,
        fromTime,
        toTime,
        Hours,
        currentTime})
      await response.save()
      res.json({response})
    }
    catch(err){
        res.json({message:err.message})
    }
})















  app.post('/warden/add', upload.single('photo'), async (req, res) => {
    // Retrieve form data
    const { wardenName, wardenPhone, gender, hostel, username, password } = req.body;
    const photo = req.file; // File data for the photo

    // Debugging: Log received data
    console.log('Received Data:', { wardenName, wardenPhone, gender, hostel, username, password });
    console.log('Photo File:', photo);

    // Check if all required data is present
    if (!wardenName || !wardenPhone || !gender || !hostel || !username || !password || !photo) {
        return res.status(400).json({ message: 'All fields, including photo, are required.' });
    }
    const response=new Warden({wardenName, wardenPhone, gender, hostel, username, password ,photo:photo.path})
    await response.save()
    res.status(200).json({ message: 'Warden registration successful!' });
});






app.post('/register', upload.single('photo'), async (req, res) => {
    try {
        const studentData = req.body;
        const photoPath = req.file ? req.file.path : null; // Get the photo path

        // Create a new student record
        const newStudent = new Student({
            ...studentData,
            photo: photoPath // Save the photo path in the database
        });

        // Save to the database
        await newStudent.save();

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error while registering student:', error);
        res.status(500).json({ message: 'Error occurred during registration' });
    }
});


app.post("/login",async(req,res)=>{
    const {username,password}=req.body
    const response=await Student.findOne({username})
    console.log(response)
    if(!response){
        return res.status(404).json({message:"user not found"})
    }
        if(response.password==password){
          const token=jwt.sign({User:username,Id:response._id,regNo:response.regNo},"Secret_key",{expiresIn:"3h"})
          res.json({token})
        }  
    else{
        res.status(404).json({message:"Password Incorrect"})
    }
})






app.post("/warden/login",async(req,res)=>{
    const {username,password}=req.body
    const response=await Warden.findOne({username})
    if(!response){
        return res.status(404).json({message:"user not found"})
    }
        if(response.password==password){
          const token=jwt.sign({User:username,Id:response._id,gender:response.gender},"Warden_Secret",{expiresIn:"3h"})
          res.json({token})
        }  
    else{
        res.status(404).json({message:"Password Incorrect"})
    }
})



const verifyWarden = (req, res, next) => {
    try {
    
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        return res.status(401).json({ message: "Token required" });
      }
  
      const token = authHeader.split(" ")[1];
  
        if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
  
       
      const decode = jwt.verify(token, "Warden_Secret");
      req.user = decode;
      next();
     
      
     
     
    } catch (err) {
       if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  };


  app.post("/messages",verifyWarden,async(req,res)=>{
    const id=uuidv4()
    const {message}=req.body
    const response= new Announcement({id,message})
    await response.save()
    res.json({response})
  })
  app.put("/editmessages",verifyWarden,async(req,res)=>{
    const {id,message}=req.body
    const response= await Announcement.findOne({id})
    response.message=message
    await response.save()
    res.json({response})
  })
  app.delete("/deletemessages/:id",verifyWarden,async(req,res)=>{
    const id=req.params.id
    const response= await Announcement.findOneAndDelete({id})
    res.json({response})
  })

  app.get("/getmessage",verifyToken,async(req,res)=>{
    const response=await Announcement.find({})
    res.json({response})
  })
  app.get("/wardengetmessage",verifyWarden,async(req,res)=>{
    const response=await Announcement.find({})
    res.json({response})
  })

  app.post("/addAccess",verifyWarden,async(req,res)=>{
    const {status}=req.body
    try{
        const Check=await AccessModel.find({})
        if(Check.length>0){
           Check[0].status=status
           await Check[0].save()
           return res.json({message:"updated"}) 
        }
        const response=await AccessModel({status})
        await response.save()
        res.json({response})
    }
    catch(err){
        res.json({message:err.message}) 
    }
  })

  app.get("/access",async(req,res)=>{
    const response=await AccessModel.findOne({})
    res.json({response})
  })




  app.get("/getPass",verifyWarden,async(req,res)=>{
    try{
        const gender=req.user.gender
        console.log(gender)
        const response=await Leave.find({gender})
        res.json({response})
    }
    catch(err){
        res.json({err})
    }
  })



  app.post("/sAccess",verifyWarden,async(req,res)=>{
    try{
        const {regNo,status}=req.body
        const resp=await Smodel.findOne({regNo})
        if(!resp){
        const response=new Smodel({regNo,status})
        await response.save()
        res.json({response})
        }
        else{
            resp.status=status
            await resp.save();
            res.json({resp})
        }
    }
    catch(err){
        res.json({err})
    }
  })
  

  app.post("/wAccess",verifyWarden,async(req,res)=>{
    try{
        const {regNo,status}=req.body
        const resp=await Wmodels.findOne({regNo})
        if(!resp){
        const response=new Wmodels({regNo,status})
        await response.save()
        res.json({response})
        }
        else{
            resp.status=status
            await resp.save();
            res.json({resp})
        }
    }
    catch(err){
        res.json({err})
    }
  })

  app.post("/rAccess",verifyWarden,async(req,res)=>{
    try{
        const {regNo,status}=req.body
        const resp=await Rmodels.findOne({regNo})
        if(!resp){
        const response=new Rmodels({regNo,status})
        await response.save()
        res.json({response})
        }
        else{
            resp.status=status
            await resp.save();
            res.json({resp})
        }
    }
    catch(err){
        res.json({err})
    }
  })



  app.get("/yps",verifyWarden,async(req,res)=>{
    const response=await Smodel.find({})
    res.json({response})
  })

  app.get("/yp",verifyToken,async(req,res)=>{
    const regNo=req.user.regNo
    const response=await Smodel.findOne({regNo})
    res.json({response})
  })

  app.get("/wps",verifyWarden,async(req,res)=>{
    const response=await Wmodels.find({})
    res.json({response})
  })

  app.get("/wp",verifyToken,async(req,res)=>{
    const regNo=req.user.regNo
    const response=await Wmodels.findOne({regNo})
    res.json({response})
  })

  app.get("/rps",verifyWarden,async(req,res)=>{
    const response=await Rmodels.find({})
    res.json({response})
  })

  app.get("/rpss",verifyToken,async(req,res)=>{
    const regNo=req.user.regNo
    const response=await Rmodels.findOne({regNo})
    res.json({response})
  })




  app.get("/getWPass",verifyWarden,async(req,res)=>{
    try{
        const gender=req.user.gender
        console.log(gender)
        const response=await WLeave.find({gender})
        res.json({response})
    }
    catch(err){
        res.json({err})
    }
  })


  app.get("/getRPass",verifyWarden,async(req,res)=>{
    try{
        const gender=req.user.gender
        console.log(gender)
        const response=await RLeave.find({gender})
        res.json({response})
    }
    catch(err){
        res.json({err})
    }
  })


  app.get("/warden/get",verifyWarden,async(req,res)=>{
    const id=req.user.Id;
    const response=await Warden.findOne({_id:id})
    try{
    if(!response){
        return res.status(404).json({message:"Warden record not found"})
    }
    res.status(201).json({response})
}
catch(err){
    res.json({message:err.message})
}
})

app.put('/warden/update', verifyWarden,async (req, res) => {
    const WardenId = req.user.Id; // Get student ID from URL params
    const {wardenPhone, gender, hostel} = req.body;    // Get updated data from request body
    try {
        // Find student by ID and update with the new data
        const updatedStudent = await Warden.findByIdAndUpdate(WardenId, {wardenPhone, gender, hostel} , { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student' });
    }
});






// Define API endpoint to fetch all students
app.get('/students',verifyWarden,async (req, res) => {
    try {
        
        const students = await Student.find({}); // Fetch all student records
        console.log(students)
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error occurred while fetching students' });
    }
});

// Define API endpoint to fetch a single student by ID
app.get('/student', verifyToken,async (req, res) => {
    try {
        const username=req.user.User
        const student = await Student.findOne({username}); // Fetch the student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Error occurred while fetching student' });
    }
});


// Define API endpoint to fetch a single student by ID
app.get('/student/:id', verifyWarden,async (req, res) => {
    try {
        const id=req.params.id
        const student = await Student.findOne({_id:id}); // Fetch the student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Error occurred while fetching student' });
    }
});


app.get('/remove/:id', verifyWarden,async (req, res) => {
    try {
        const id=req.params.id
        const student = await Student.findOne({_id:id}); // Fetch the student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.deleteOne({_id:id})
        res.status(200).json({message:"deleted"});
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Error occurred while fetching student' });
    }
});



app.put('/editStudent', verifyWarden,async (req, res) => {

        const { id, title, value } = req.body; // Get updated data from request body
        
    
        try {
            // Find the student by ID
            const student = await Student.findById(id);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
    
            // Update the relevant field based on title
            if (title === "name") {
                student.name = value;
            } else if (title === "regNo") {
                student.regNo = value;
            } else if (title === "courseYear") {
                student.courseYear = value;
            } else if (title === "educationType") {
                student.educationType = value;
            } else if (title === "course") {
                student.course = value;
            } else if (title === "dob") {
                student.dob = new Date(value); // Convert string to date
            } else if (title === "gender") {
                student.gender = value;
            } else if (title === "studentPhone") {
                student.studentPhone = value;
            } else if (title === "studentEmail") {
                student.studentEmail = value;
            } else if (title === "roomNo") {
                student.roomNo = value;
            } else if (title === "nativePlace") {
                student.nativePlace = value;
            } else if (title === "address") {
                student.address = value;
            } else if (title === "religion") {
                student.religion = value;
            } else if (title === "caste") {
                student.caste = value;
            } else if (title === "nationality") {
                student.nationality = value;
            } else if (title === "bloodgroup") {
                student.bloodgroup = value;
            } else if (title === "motherName") {
                student.motherName = value;
            } else if (title === "fatherName") {
                student.fatherName = value;
            } else if (title === "parentsno") {
                student.parentsno = value;
            } else if (title === "accountNo") {
                student.accountNo = value;
            } else if (title === "accountHolder") {
                student.accountHolder = value;
            } else if (title === "ifsc") {
                student.ifsc = value;
            } else if (title === "branch") {
                student.branch = value;
            } else if (title === "username") {
                student.username = value;
            } else if (title === "password") {
                student.password = value; // Consider hashing before saving
            } else if (title === "photo") {
                student.photo = value;
            } else {
                return res.status(400).json({ message: 'Invalid field title' });
            }
    
            // Save the updated student document
            await student.save();
            res.status(200).json({ message: 'Student updated successfully', student });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error });
        }
    });
    











// Define API endpoint to update student details by ID
app.put('/students', verifyToken,async (req, res) => {
    const studentId = req.user.Id; // Get student ID from URL params
    const {address,studentPhone,course} = req.body;    // Get updated data from request body
    console.log(address)
    try {
        // Find student by ID and update with the new data
        const updatedStudent = await Student.findByIdAndUpdate(studentId, {address,studentPhone,course} , { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student' });
    }
});



//  app.post("/add",async(req,res)=>{
//     const email=req.body.email
//  })









// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// DELETE endpoint for deleting students by course year
app.delete('/students/delete', async (req, res) => {
    const year = req.query.year; // Get the year from query parameters
    try {
        // Delete students with the matching courseYear
        const result = await Student.deleteMany({ courseYear: year });
        
        // Check if any documents were deleted
        if (result.deletedCount > 0) {
            res.status(200).send({ message: `${result.deletedCount} students deleted successfully.` });
        } else {
            res.status(404).send({ message: 'No students found for the specified year.' });
        }
    } catch (error) {
        console.error('Error deleting students:', error);
        res.status(500).send({ message: 'Failed to delete students.' });
    }
});






async function callApi() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    const istDate = new Date(now.getTime() + istOffset);

    const hours = istDate.getUTCHours().toString().padStart(2, '0');  
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = istDate.getUTCSeconds().toString().padStart(2, '0');
    

    if ((hours == 9 && minutes == 0) || (hours == 13 && minutes == 0) || (hours == 16 && minutes == 0)) {
        let response1 = await Smodel.find({});
        for (let i = 0; i < response1.length; i++) {
            response1[i].status = "on";
            await response1[i].save();
        }
    }

    if ((hours == 9 && minutes == 50) || (hours == 14 && minutes == 0) || (hours == 20 && minutes == 6)) {
        let response2 = await Smodel.find({});
        for (let i = 0; i < response2.length; i++) {
            response2[i].status = "off";
            await response2[i].save();
        }
    }
}


async function Limit(){
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    const istDate = new Date(now.getTime() + istOffset);

    const hours = istDate.getUTCHours().toString().padStart(2, '0');  
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = istDate.getUTCSeconds().toString().padStart(2, '0');
    if(hours==23 && minutes==59){
    const response=await Student.find({})
    
    for(let i=0;i<response.length;i++){
         response[i].Ypass=0
         await response[i].save()
    }
    }
}


cron.schedule('* * * * * *', () => { // Cron pattern for every second
    callApi();
    Limit()
});








// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


