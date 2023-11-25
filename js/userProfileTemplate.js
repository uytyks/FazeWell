const db = firebase.firestore();
const user = firebase.auth().currentUser;

let loggedInUserId;
let loggedInUserFullName;
let loggedInUsername;
let userPageId;
let userPageUsername;
let userPageName;
let userPageEmail;


firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log('user is signed in');
        loggedInUserId = user.uid;

        fetch(`http://localhost:8080/getBasicUserInfo/${loggedInUserId}`)
        .then(response => {
            if(!response.ok){
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(userData => {
            console.log('User information', userData);
            loggedInUsername = userData.username;
            loggedInUserFullName = userData.name;
        })
        .catch(err => {
            console.log('Error fetching user information:', err);
        })

        userPageId = getUserIdFromURL();
        console.log(userPageId);

        getBasicDetails();
        fetchFollowRequests();
        fetchFollowers();
        disableIfUser();
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
        let followRequest = {
            userId: loggedInUserId,
            userFullName: loggedInUserFullName,
            username: loggedInUsername,
        };

        const response = await fetch(`http://localhost:8080/followRequest/${userPageId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(followRequest),
        });

        const result = await response.json();
        console.log(result);
        alert('Follow Request Submitted');
        location.reload();
    }catch(err){
        console.error('Error sending follow request', err);
    }
})

function disableIfUser(){
    if(loggedInUserId == userPageId){
        followButton.style.display = 'none';
    }
}

async function fetchFollowRequests(){
    try{
        const response = await fetch(`http://localhost:8080/getFollowRequests/${userPageId}`);
        const followRequests = await response.json();
        console.log(followRequests);
        isLoggedInUserInRequestedFollowers(followRequests);
    }catch(err){
        console.error('Error fetching follow requests: ', err);
    }
}

async function fetchFollowers(){
    try{
        const response = await fetch (`http://localhost:8080/getFollowers/${userPageId}`);
        const followers = await response.json();
        console.log(followers);
        isLoggedInUserInFollowers(followers)
    }catch(err){
        console.error('Error fetching followers: ', err);
    }
}

function isLoggedInUserInFollowers(followers){
    followers.forEach(follower => {
        if(follower.data.userId == loggedInUserId){
            console.log('you have already put in a follow request');
            followButton.innerText = 'Following';
            followButton.disabled = true;
        }
    })
}

function isLoggedInUserInRequestedFollowers(followRequests){
    followRequests.forEach(request => {
        if(request.data.userId == loggedInUserId){
            console.log('you have already put in a follow request');
            followButton.innerText = 'Pending Request';
            followButton.disabled = true;
        }
    })

}
