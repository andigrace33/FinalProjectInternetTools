const API = "http://localhost:3000";

//logout for download page
function downloadLogout(){
    alert("You have successfully logged out!");
    localStorage.removeItem("token");
    window.location="/index.html";
}

//logout for my files
function logout(){
    alert("You have successfully logged out!");
    localStorage.removeItem("token");
    window.location="/index.html";
}

//load downloads after logging in
/////////////////////////////////
async function loadMyDownloads(){
     const token = localStorage.getItem("token");

     if(!token) {
        alert("You need to login to access this page!");
        window.location="/index.html";
        return;
     }

     const res = await fetch(API+"/api/downloads-data",{

        headers:{
        Authorization:"Bearer "+token
        }

     });

     if(res.status!==200) {
        alert("Sesion Expired");
        localStorage.removeItem("token");
        window.location="/index.html";
        return;
     }

     const data = await res.json();

     loadStudents();
}

//load My Files page after authentication
/////////////////////////////////////////

async function loadMyFilesPage(){
     const token = localStorage.getItem("token");

     if(!token) {
        alert("You need to login to access this page!");
        window.location="/index.html";
        return;
     }

     const res = await fetch(API+"/api/myfiles-data",{

        headers:{
        Authorization:"Bearer "+token
        }

     });

     if(res.status!==200) {
        alert("Sesion Expired");
        localStorage.removeItem("token");
        window.location="/index.html";
        return;
     }

     const data = await res.json();

     loadMyFiles(); 
}

//to view and delete files on My Files Page
////////////////////////////////////////////

const form = document.getElementById("studentForm");
const list = document.getElementById("students");
const myFilesList = document.getElementById("filesList");

//fetch only user files from sql fileInfo table
async function loadMyFiles(){
const res = await fetch("/current");
const students = await res.json();
displayMyFiles(students);
}

//display only user files 
function displayMyFiles(students){
myFilesList.innerHTML = "";
students.forEach(student=>{
    console.log(student);
const li = document.createElement("li");
li.innerHTML =
"<b>Filename:</b> " +
student.filename +
" <b>Filesize:</b> " +
student.filesize +
" bytes " +
 "<b>Upload Timestamp:</b> " +
student.uploaded_at +
" <b>Owner:</b> " +
student.uploaded_by + 
" <b>Download Link:</b> " +
`<a href="/upload/${student.filename}" download>${student.filename}</a>` +
"  " +
 `<button onclick="deleteStudent(${student.id})">Delete</button>`;
myFilesList.appendChild(li);
});
}

//delete only user files
async function deleteStudent(id){
await fetch("/delete-student/" + id,{
method:"DELETE"
});
loadMyFiles();
}

//To view all files on My Downloads Page
///////////////////////////////////////////

//fetch all file information from sql fileInfo table
async function loadStudents(){
const res = await fetch("/students");
const students = await res.json();
displayStudents(students);
}

//display all files
function displayStudents(students){
list.innerHTML = "";
students.forEach(student=>{
    console.log(student);
const li = document.createElement("li");
li.innerHTML =
"<b>Filename:</b> " +
student.filename +
" <b>Filesize:</b> " +
student.filesize +
" bytes " +
 "<b>Upload Timestamp:</b> " +
student.uploaded_at +
" <b>Owner:</b> " +
student.uploaded_by + 
" <b>Download Link:</b> " +
`<a href="/upload/${student.filename}" download>${student.filename}</a>` +
"  " 
list.appendChild(li);
});
}


