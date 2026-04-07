const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const multer  = require('multer');
const path = require('path');

//username and password capabilities 
const SECRET = "supersecretkey"; 

app.use(express.json());

//global variable for current logged in user 
let currentUsername = null;

//database creation and table initialization
////////////////////////////////////////////
const db = new sqlite3.Database("./users.db");

db.serialize(()=>{

//table for authentication information
db.run(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

//table for authentication token
db.run(`
CREATE TABLE IF NOT EXISTS tokens(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
token TEXT,
FOREIGN KEY(user_id) REFERENCES users(id)
)`);

//table for file metadata
db.run(`
CREATE TABLE IF NOT EXISTS fileInfo(
id INTEGER PRIMARY KEY AUTOINCREMENT,
filename TEXT,
filepath TEXT,
filesize INTEGER,
uploaded_by TEXT, 
uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(uploaded_by) REFERENCES users(username)
)`);

});


//get only current user files
////////////////////////////
app.get("/current",(req,res)=>{
db.all("SELECT * FROM fileInfo WHERE uploaded_by = ?",[currentUsername],(err,rows)=>{
if(err){
return res.status(500).json({message:"Database error"});
}
res.json(rows);
});
});

//get all user files
///////////////////////
app.get("/students",(req,res)=>{
db.all("SELECT * FROM fileInfo",(err,rows)=>{
if(err){
return res.status(500).json({message:"Database error"});
}
res.json(rows);
});
});

//delete files
///////////////
app.delete("/delete-student/:id",(req,res)=>{
const id = req.params.id;
db.run("DELETE FROM fileInfo WHERE id=?",[id],function(err){
if(err){
return res.status(500).json({message:"Database error"});
}
res.json({message:"file deleted"});
});
});

//register features
///////////////////
app.post("/register",async (req,res)=>{

const {username,password}=req.body;

const hash = await bcrypt.hash(password,10);

db.run(
  "INSERT INTO users(username,password) VALUES (?,?)",
  [username,hash],
  function(err) {

    if(err) {
      return res.status(400).json({message: "User already registered!"});

    }

res.json({message: "New User Registered!"});

  });

});

//login capability
/////////////////////
app.post("/login",(req,res)=>{

const {username,password}=req.body;

db.get(
"SELECT * FROM users WHERE username=?",
[username],
async(err,user)=>{

if(!user){
  return res.status(400).json({message:"Invalid username"});
}

const valid = await bcrypt.compare(password,user.password);

if (!valid) {
  return res.status(400).json({message: "Invalid password"});
}

const token = jwt.sign(
  {userId:user.id,username:user.username},
  SECRET,
  {expiresIn:"2m"}
);

db.run(
  "INSERT INTO tokens(user_id,token) VALUES(?,?)",
  [user.id,token]
);

res.json({token:token});
currentUsername = user.username;

});

});

//go to my files after login
/////////////////////////////
app.get("/myfiles.html", (req, res) => {
    res.sendFile(path.join(__dirname, "private", "myfiles.html"));
});

//private access to myfiles
/////////////////////////////
app.get("/api/myfiles-data",authenticateToken,(req,res)=>{

res.json({
message:"My Files Access Granted",
user:req.user.username

});

});

//private access to downloads
////////////////////////////////
app.get("/api/downloads-data",authenticateToken,(req,res)=>{

res.json({
message:"Downloads Access Granted",
user:req.user.username

});

});

//private access to upload
////////////////////////////
app.get("/api/upload-data",authenticateToken,(req,res)=>{

res.json({
message:"Upload Access Granted",
user:req.user.username

});

});

//private access to error
///////////////////////////
app.get("/api/error-data",authenticateToken,(req,res)=>{

res.json({
message:"Error Access Granted",
user:req.user.username

});

});

//private access to success
////////////////////////////
app.get("/api/success-data",authenticateToken,(req,res)=>{

res.json({
message:"Success Access Granted",
user:req.user.username

});

});

//authentication
/////////////////
function authenticateToken(req,res,next) {

const authHeader = req.headers["authorization"];

if(!authHeader) {
  return res.status(401).json({message:"Token missing"});
}

const token = authHeader.split(" ")[1];

jwt.verify(token,SECRET,(err,user)=>{

  if(err){
    return res.status(403).json({message:"Invalid or expired token"});
  }

req.user=user;
next();

});


}

//multer upload capabilities
//////////////////////////////
const storage = multer.diskStorage({
  
  destination: function (req,file, cb) {
    cb(null, path.join(__dirname, "/public/upload"));
  },
  filename: function (req, file, cb) {
    let filename = req.body.filename;
    let extension = path.extname(file.originalname);
    cb(null, filename + extension);
    
  }

})

//multer check filesize and use function filefilter to check for mp4 or PDF extension
const upload = multer({ storage: storage,  limits: {fileSize: 20 * 1024 * 1024 }, fileFilter: fileFilter })

app.use(express.json());
app.use(express.static("public")); 

  function fileFilter (req, file, cb) {
    let extension = path.extname(file.originalname).toLowerCase();
    if ((extension == ".pdf")||(extension == ".mp4")) {
       cb(null, true); 
    }
    else {
    
      cb(new Error("INVALID file format"));

    }
  }


//multer upload with error check AND save file into SQL fileInfo table
app.post('/api/upload', (req, res) => {
  upload.single('userFile')(req, res, function(err) {
    if (err) {
      console.log(err);
      return res.redirect("/error.html");
    }
    console.log(req.file);
    
  const filename = req.file.filename; 
  const filepath = req.file.path;
  const filesize = req.file.size;

  db.run(
  "INSERT INTO fileInfo(filename,filepath,filesize,uploaded_by) VALUES(?,?,?,?)",
  [filename, filepath, filesize,currentUsername],
    function(err) {
       if (err) {
        console.log(err);
        return res.status(500).json({message: "Database error"});
        }
      }   
    );

  return res.redirect("/success.html");

  });

});


// Start server
////////////////
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});


