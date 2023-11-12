
let userUid;
let userDisplayname;

auth.onAuthStateChanged(user => {
    if(user){
        console.log("user");
        userUid = user.uid;
        userDisplayname = user.DisplayName || 'Nameless User';
/*         document.getElementById("huname").innerHTML = `${user.displayName}'s Profile`;
        document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${user.displayName}`;
        document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${user.email}`; */
    }else{
        console.log("no user");
    }
})
//modal logic
var modal = document.getElementById('myModal');
var btn = document.getElementById('openModal');
var span = document.getElementById('closeModal');


btn.onclick = function(){
    modal.style.display="block";
}
span.onclick = function(){
    modal.style.display = "none";
}
window.onclick = function(event){
    if(event.target==modal){
        modal.style.display = "none";
    }
}

//this will auto generate the current date and time into the field
window.addEventListener("load", function() {
    var now = new Date();
    var offset = now.getTimezoneOffset() * 60000;
    var adjustedDate = new Date(now.getTime() - offset);
    var formattedDate = adjustedDate.toISOString().substring(0, 16);
    var dateTimeField = document.getElementById("dateTimeInput");
    dateTimeField.value = formattedDate;
})

//rating system
let moneyRating = 0;
let qualityRating = 0;

const dollarSigns = document.querySelectorAll(".dollar-sign");
const stars = document.querySelectorAll(".star");

dollarSigns.forEach((sign) => {
    sign.addEventListener("click", function() {
        let value = this.getAttribute("data-value");
        resetRating(dollarSigns);
        highlightRating(dollarSigns, value);
        moneyRating = value;
        console.log(`Money rating selected: ${value}`);
    });
});

stars.forEach((star) => {
    star.addEventListener("click", function() {
        let value = this.getAttribute("data-value");
        resetRating(stars);
        highlightRating(stars, value);
        qualityRating = value;
        console.log(`Quality rating selected: ${value}`);
    });
});

function resetRating(elements) {
    elements.forEach((elem) => {
        elem.classList.remove('active');
    });
}

function highlightRating(elements, value) {
    for (let i = 0; i < value; i++) {
        elements[i].classList.add('active');
    }
}

let submitBtn = document.getElementById('check-in');
submitBtn.addEventListener("click", function(){
    let newCheckIn = {
        restaurant: document.getElementById('restaurantInput').value,
        dateTime: document.getElementById('dateTimeInput').value,
        order: document.getElementById('orderInput').value,
        moneyRating: moneyRating,
        qualityRating: qualityRating,
        savedToHistory: document.getElementById('saveOrder').checked
    }

    storeCheckIn(newCheckIn);
    let allCheckIns = getCheckIns();
    console.log(allCheckIns); 

    modal.style.display = 'none';

    //new content
    let feed = document.getElementById("pf");
    let month = newCheckIn.dateTime.substring(8,10);
    let year = newCheckIn.dateTime.substring(0,4);
    let day = newCheckIn.dateTime.substring(5,7);
    let html = "<div class='post'>"+
    "<img src='assets/profile.png' alt='User 1' class='user-profile'>"+
    "<div class=' post-content'>"+
        `<h2>Order at ${newCheckIn.restaurant}</h2>`+
        `<p>${newCheckIn.order}</p>`+
        "<div class='metadata'>"+
            `Posted on ${month}/${day}/${year} by me!`+
        "</div>"+
    "</div>"+
"</div>"
feed.insertAdjacentHTML("afterbegin", html);
})

function storeCheckIn(checkIn){
    let checkIns = JSON.parse(localStorage.getItem('checkIns')) || [];
    checkIns.push(checkIn);
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
}

function getCheckIns(){
    return JSON.parse(localStorage.getItem('checkIns')) || [];
}

function isLoggedIn(){
    //let loguser = JSON.parse(localStorage.getItem('loguser'));
    if(!userUid){
        window.location.href = "../login.html";
        //window.open("../login.html");
    }
    else{
        window.location.href="../profile-page.html";
    }
}

/* auth.onAuthStateChanged(user => {
    if(user){
        console.log("user");
        document.getElementById("huname").innerHTML = `${user.displayName}'s Profile`;
        document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${user.displayName}`;
        document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${user.email}`;
    }else{
        console.log("no user");
    }
}) */

document.addEventListener("DOMContentLoaded", function(){
    let profileLink = document.querySelector(".profile-link");
    if(profileLink){
        profileLink.addEventListener("click", isLoggedIn);
    }
})
