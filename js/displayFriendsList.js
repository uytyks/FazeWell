let userUid;

auth.onAuthStateChanged(user => {
    if(user){
        console.log('there is a user logged in');
        userUid = user.uid;
        fetchFollowRequests();
    }
})

//get follow requests 
async function fetchFollowRequests(){
    try{
        const response = await fetch(`http://localhost:8080/getFollowRequests/${userUid}`);
        const followRequests = await response.json();
        console.log(followRequests);
        displayFollowRequests(followRequests);
    }catch(err){
        console.error('Error fetching follow requests: ', err);
    }
}
//get followers
//get following

function displayFollowRequests(followRequests){
    const mainContainer = document.getElementById('followRequestContainer');
    const followRequestsContainer = document.createElement('div');
    followRequestsContainer.classList.add("content");

    followRequests.forEach(request => {
        const followRequestFeed = document.createElement('div');
        followRequestFeed.id = "pf";
        followRequestFeed.classList.add("post-feed");

        const user = document.createElement('div');
        user.classList.add('post');

        const image = document.createElement('img');
        image.src = 'assets/profile.png';
        image.alt = 'User 1';
        image.classList.add('user-profile');
        
        user.appendChild(image);

        const userInfo = document.createElement('div');
        userInfo.classList.add('post-content');

        const requestName = document.createElement('h2');
        requestName.textContent = `Name: ${request.data.userFullName}`;

        userInfo.appendChild(requestName);

        const username = document.createElement('p');
        username.textContent = `Username: ${request.data.username}`;

        userInfo.appendChild(username);

        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Accept';
        acceptBtn.addEventListener('click', () => handleAccept(request.data.userId));

        const declineBtn = document.createElement('button');
        declineBtn.textContent = 'Decline';
        declineBtn.addEventListener('click', () => handleDecline(request.data.userId));

        userInfo.appendChild(acceptBtn);
        userInfo.appendChild(declineBtn);

        user.appendChild(userInfo);

        followRequestFeed.appendChild(user);

        followRequestsContainer.appendChild(followRequestFeed);

    })
    mainContainer.appendChild(followRequestsContainer);
}

function displayFollowers(followers){
    const mainContainer = document.getElementById('followRequestContainer');
    const followersContainer = document.createElement('div');
    followersContainer.classList.add("content");

    followers.forEach(request => {
        const followFeed = document.createElement('div');
        followFeed.id = "pf";
        followFeed.classList.add("post-feed");

        const user = document.createElement('div');
        user.classList.add('post');

        const image = document.createElement('img');
        image.src = 'assets/profile.png';
        image.alt = 'User 1';
        image.classList.add('user-profile');
        
        user.appendChild(image);

        const userInfo = document.createElement('div');
        userInfo.classList.add('post-content');

        const requestName = document.createElement('h2');
        requestName.textContent = `Order at ${request.data.name}`;

        userInfo.appendChild(requestName);

        const username = document.createElement('p');
        username.textContent = `${request.data.username}`;

        userInfo.appendChild(username);

        user.appendChild(userInfo);

        followFeed.appendChild(user);

        followersContainer.appendChild(followFeed);

    })
    mainContainer.appendChild(followersContainer);
}

function displayFollowing(following){
    const mainContainer = document.getElementById('followRequestContainer');
    const followingContainer = document.createElement('div');
    followingContainer.classList.add("content");

    following.forEach(request => {
        const followingFeed = document.createElement('div');
        followingFeed.id = "pf";
        followingFeed.classList.add("post-feed");

        const user = document.createElement('div');
        user.classList.add('post');

        const image = document.createElement('img');
        image.src = 'assets/profile.png';
        image.alt = 'User 1';
        image.classList.add('user-profile');
        
        user.appendChild(image);

        const userInfo = document.createElement('div');
        userInfo.classList.add('post-content');

        const requestName = document.createElement('h2');
        requestName.textContent = `Order at ${request.data.name}`;

        userInfo.appendChild(requestName);

        const username = document.createElement('p');
        username.textContent = `${request.data.username}`;

        userInfo.appendChild(username);

        user.appendChild(userInfo);

        followFeed.appendChild(user);

        followingContainer.appendChild(followingFeed);

    })
    mainContainer.appendChild(followingContainer);
}

function handleAccept(userId){
    console.log(`Accepted follow request for user ID: ${userId}`);
    fetch(`http://localhost:8080/acceptFollowRequest/${userUid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({requestingUserId: userId}),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
    })
    .catch(error => console.error('Error accepting follow request', error));
}

function handleDecline(userId){
    console.log(`Declined follow request for user ID: ${userId}`);
    fetch(`http://localhost:8080/declineFollowRequest/${userUid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({requestingUserId: userId}),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
    })
    .catch(err => console.error('Error declining follow request: ', err));
}