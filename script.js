const API = "http://localhost:3000";


//Register function
///////////////////

async function register(){

//const email=document.getElementById("emailRegister").value;
const username=document.getElementById("usernameRegister").value;
const password=document.getElementById("passwordRegister").value;

if (username.includes(' ') || password.includes(' ') ) {
    alert("The email or username or password cannot be blank or contain spaces");
    return;
}

const res = await fetch(API+"/register",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})

});

const data = await res.json();

alert(data.message);

}

//login function
/////////////////

async function login(){

//const email=document.getElementById("emailLogin").value;
const username=document.getElementById("usernameLogin").value;
const password=document.getElementById("passwordLogin").value;

const res = await fetch(API+"/login",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})

});

const data = await res.json();

if(data.token){
    localStorage.setItem("token",data.token);

    window.location="/myfiles.html";
}
else {
    alert(data.message);
}

}

//load my files page after logging in
/////////////////////////////////

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

//load upload page after logging in
////////////////////////////////////

async function loadMyUpload(){
     const token = localStorage.getItem("token");

     if(!token) {
        alert("You need to login to access this page!");
        window.location="/index.html";
        return;
     }

     const res = await fetch(API+"/api/upload-data",{

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

}

//give access to Error page after logging in
////////////////////////////////////////////

async function loadError(){
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
}

//give access to success page after logging in
///////////////////////////////////////////////

async function loadSuccess(){
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
}



//logout function for html pages that use script.js
////////////////////////////////////////////////////

function logout(){
    alert("You have successfully logged out!");
    localStorage.removeItem("token");
    window.location="/index.html";
}



