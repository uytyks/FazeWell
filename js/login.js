let regbtn = document.getElementById("register");
regbtn.addEventListener("click",register);
let logbtn = document.getElementById("login");
regbtn.addEventListener("click",login);

function isEmail(email) {
    let regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|net|org|edu|gov|dev)$/;
    return regex.test(String(email).toLowerCase());
   }

function register(){
    if(!(document.getElementById("psw").value == document.getElementById("psw-repeat").value)){
        alert("Passwords do not Match!");
        return false;
    }
    if(!isEmail(document.getElementById("email").value)){
        alert("Not Valid Email!");
        return false;
    }
    let userData = {
        username: document.getElementById("user").value,
        email: document.getElementById("email").value,
        password: document.getElementById("psw").value
    }
    /*
    storeUser(userData);
    let allUsers = getUsers();
    console.log(allUsers); 
    */
}
/*
function storeUser(userData){
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
}
function getUsers(){
    return JSON.parse(localStorage.getItem('users')) || [];
}
function login(){

}
*/