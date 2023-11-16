
let userUid;
let userDisplayname;

auth.onAuthStateChanged(user => {
    if(user){
        console.log("user");
        userUid = user.uid;
        userDisplayname = user.DisplayName || 'Nameless User';
    }else{
        console.log("no user");
    }
});

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
});

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

//=======================FIREBASE LOGIC============================

let submitBtn = document.getElementById('check-in');
submitBtn.addEventListener("click", function(){
    saveOrderToDb().then((result) => {
        modal.style.display = 'none';
    })
}) 

async function saveOrderToDb(){
    let newCheckIn = {
        restaurant: document.getElementById('restaurantInput').value,
        dateTime: document.getElementById('dateTimeInput').value,
        order: document.getElementById('orderInput').value,
        moneyRating: moneyRating,
        qualityRating: qualityRating,
        savedToHistory: document.getElementById('saveOrder').checked,
        userId: userUid || 'anonymous',
        userName: userDisplayname || 'anonymous'
    }

    console.log("new check in: ", newCheckIn);

    const response = await fetch('http://localhost:8080/checkIns', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCheckIn),
    });

    const result = await response.json();
    console.log(result);
    return result;
}

document.addEventListener("DOMContentLoaded", function(){
    let profileLink = document.querySelector(".profile-link");
    if(profileLink){
        profileLink.addEventListener("click", isLoggedIn);
    }
})

function isLoggedIn(){
    if(!userUid){
        window.location.href = "../login.html";
    }
    else{
        window.location.href="../profile-page.html";
    }
}