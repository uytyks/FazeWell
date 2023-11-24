const db = firebase.firestore();
const user = firebase.auth().currentUser;

let loggedInUserId;
let userPageId;
let userPageUsername;
let userPageName;
let userPageEmail;


firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log('user is signed in');
        loggedInUserId = user.uid;

        userPageId = getUserIdFromURL();
        console.log(userPageId);

        getBasicDetails();
    }else{
        console.log('The user is not signed in');
    }
});

function getUserIdFromURL(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function getBasicDetails(){
    fetch(`http://localhost:8080/getBasicUserInfo/${userPageId}`)
    .then(response => {
        if(!response.ok){
            throw new Error('User not found');
        }
        return response.json();
    })
    .then(userData => {
        console.log('User information', userData);
        username = userData.username;
        usersName = userData.name;
        email = userData.email;
        updateProfilePage();
    })
    .catch(err => {
        console.log('Error fetching user information:', err);
    })
}

function updateProfilePage(){
    document.getElementById("huname").innerHTML = `${username}'s Profile`;
    document.getElementById("pusername").innerHTML = `<strong>Username:</strong> ${username}`;
    document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${usersName}`;
    document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${email}`;
}

const followButton = document.getElementById('followUserBtn');
followButton.addEventListener('click', async() => {
    try{
        let loggedInUser = {
            userId: loggedInUserId
        };
        
        const response = await fetch(`http://localhost:8080/followRequest/${userPageId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loggedInUser),
        });

        const result = await response.json();
        console.log(result);
    }catch(err){
        console.error('Error sending follow request', err);
    }
})