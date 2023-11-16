function isEmail(email) {
    let regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|net|org|edu|gov|dev)$/;
    return regex.test(String(email).toLowerCase());
}

//on register
document.getElementById("register").addEventListener("click", function(e){
    e.preventDefault();
    if(!(document.getElementById("psw").value == document.getElementById("psw-repeat").value)){
        alert("Passwords do not Match!");
        return false;
    }
    if(!isEmail(document.getElementById("email").value)){
        alert("Not Valid Email!");
        return false;
    }

    let username = document.getElementById("user").value;
    let email = document.getElementById("email").value;
    let pwd = document.getElementById("psw").value;


    firebase.auth().createUserWithEmailAndPassword(email, pwd)
    .then((userCredential) => {
      var user = userCredential.user;
      return user.updateProfile({
        displayName: username
      });
    })
    .then(() => {
      console.log("User registered successfully!");
      return firebase.auth().signInWithEmailAndPassword(email, pwd);
    })
    .then(() => {
      console.log("User signed in");
      window.location.href = "../profile-page.html";
      //window.open("../profile-page.html");
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
  

})

//on login
document.getElementById("login").addEventListener("click", function(e){
    e.preventDefault();
    let email = document.getElementById("eml").value;
    let pwd = document.getElementById("pswl").value;

    firebase.auth().signInWithEmailAndPassword(email, pwd).then((userCredential) => {
        //signed in
        var user = userCredential.user;
        window.location.href = "../profile-page.html";
        //window.open("../profile-page.html");
    }).catch((error) => {
        console.log("there was an error", error);
    })

})

document.getElementById('forgotPassword').addEventListener('click', function(event){
    event.preventDefault();

    const emailAddress = document.getElementById('eml').value;
    if(!emailAddress){
        alert("Please enter your email address in the login form");
        return;
    }

    firebase.auth().sendPasswordResetEmail(emailAddress).then(function(){
        alert('password reset email sent! check your inbox');
    }).catch(function(err){
        var errorCode = err.code;
        var errorMessage = err.message;
        console.error('error sending pw reset email: ', errorMessage);
        alert("error sending password reset email. Please try again");
    })
})

firebase.auth().onAuthStateChanged(user => {
    if(user){
        console.log("user");
        document.getElementById("huname").innerHTML = `${user.displayName}'s Profile`;
        document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${user.displayName}`;
        document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${user.email}`;
    }else{
        console.log("no user");
    }
})

function logOut(){
    firebase.auth().signOut().then(() => {
        console.log("User signed out");
        window.location.href = "../login.html";
    }).catch((error) => {
        console.error("Error signing out: ", error);
    })
}


