//update user information
/* let username = JSON.parse(localStorage.getItem('loguser')).username;
document.getElementById("huname").innerHTML = `${username}'s Profile`;
document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${username}`;
document.getElementById("pemail").innerHTML = `<strong>Email:</strong> ${JSON.parse(localStorage.getItem('loguser')).email}`; */
let userUid;
let userDisplayname;

auth.onAuthStateChanged(user => {
    if(user){
        console.log("user");
        userUid = user.uid;
        userDisplayname = user.DisplayName || 'Nameless User';
        document.getElementById("huname").innerHTML = `${user.displayName}'s Profile`;
        document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${user.displayName}`;
        document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${user.email}`;
    }else{
        console.log("no user");
    }
})

function getCheckIns(){
    return JSON.parse(localStorage.getItem('checkIns')) || [];
}

window.addEventListener("load", function(){
    let checkIns = getCheckIns();
    let feed = document.getElementById("pf");
    for(let i = 0; i < checkIns.length; i++){
        let month = checkIns[i].dateTime.substring(8,10);
        let year = checkIns[i].dateTime.substring(0,4);
        let day = checkIns[i].dateTime.substring(5,7);
        let html = "<div class='post'>"+
        `<h2>${checkIns[i].restaurant}</h2>`+
        `<p>${checkIns[i].order}</p>`+
        "<div class='metadata'>"+
            `Posted on ${month}/${day}/${year} by ${username}`+
        "</div>"+
    "</div>"
    feed.insertAdjacentHTML("afterbegin", html);
    }
})