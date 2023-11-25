let userUid;

auth.onAuthStateChanged(user => {
    if(user){
        console.log('there is a user logged in');
        userUid = user.uid;
        fetchFollowRequests();
        fetchFollowers();
        fetchFollowing();
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
async function fetchFollowers(){
    try{
        const response = await fetch(`http://localhost:8080/getFollowers/${userUid}`);
        const followers = await response.json();
        console.log(followers);
        displayFollowers(followers);
    }catch(err){
        console.error('Error fetching followers: ', err);
    }
}
//get following
async function fetchFollowing(){
    try{
        const response = await fetch(`http://localhost:8080/getFollowing/${userUid}`);
        const following = await response.json();
        console.log(following);
        displayFollowing(following);
    }catch(err){
        console.error('Error fetching following: ', err);
    }
}

function displayFollowRequests(followRequests) {
    const mainContainer = document.getElementById('followRequests');
    const followRequestsContainer = document.createElement('div');
    followRequestsContainer.classList.add("content");

    if (followRequests.length == 0) {
        const msg = document.createElement('span');
        msg.innerHTML = 'You have no follow requests';
        followRequestsContainer.appendChild(msg);
        mainContainer.append(followRequestsContainer);
    }

    followRequests.forEach(request => {
        const followRequestFeed = document.createElement('div');
        followRequestFeed.id = "pf";
        followRequestFeed.classList.add("post-feed");

        const user = document.createElement('div');
        user.classList.add('post');

        const image = document.createElement('img');
        image.src = '../assets/user.svg';
        image.alt = `${request.userId}`;
        image.classList.add('user-profile');
        
        user.appendChild(image);

        const userInfo = document.createElement('div');
        userInfo.classList.add('post-content');
        userInfo.style.display = 'flex'; 
        userInfo.style.alignItems = 'flex-start';
        userInfo.style.justifyContent = 'space-between';
        //userInfo.style.marginLeft='auto'; 

        const textContainer = document.createElement('div');
        textContainer.style.marginRight = '10px'; 

        const requestName = document.createElement('h2');
        requestName.textContent = `Name: ${request.data.userFullName}`;

        const username = document.createElement('p');
        username.textContent = `Username: ${request.data.username}`;

        textContainer.appendChild(requestName);
        textContainer.appendChild(username);

        userInfo.appendChild(textContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');


        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Accept';
        acceptBtn.id = 'acceptBtn';
        acceptBtn.addEventListener('click', () => handleAccept(request.data));

        const declineBtn = document.createElement('button');
        declineBtn.textContent = 'Decline';
        declineBtn.addEventListener('click', () => handleDecline(request.data));
        declineBtn.style.backgroundColor = '#FF2405';

        buttonContainer.appendChild(acceptBtn);
        buttonContainer.appendChild(declineBtn);

        userInfo.appendChild(buttonContainer);

        user.appendChild(userInfo);

        followRequestFeed.appendChild(user);

        followRequestsContainer.appendChild(followRequestFeed);
    })

    mainContainer.appendChild(followRequestsContainer);
}


/* function displayFollowRequests(followRequests){
    const mainContainer = document.getElementById('followRequests');
    const followRequestsContainer = document.createElement('div');
    followRequestsContainer.classList.add("content");

    if(followRequests.length == 0){
        const msg = document.createElement('span');
        msg.innerHTML = 'You have no follow requests';
        followRequestsContainer.appendChild(msg);
        mainContainer.append(followRequestsContainer);
    }

    followRequests.forEach(request => {
        const followRequestFeed = document.createElement('div');
        followRequestFeed.id = "pf";
        followRequestFeed.classList.add("post-feed");

        const user = document.createElement('div');
        user.classList.add('post');

        const image = document.createElement('img');
        image.src = '../assets/user.svg';
        image.alt = `${request.userId}`;
        image.classList.add('user-profile');
        
        user.appendChild(image);

        const userInfo = document.createElement('div');
        userInfo.classList.add('post-content');
        userInfo.style.display = 'flex';
        userInfo.style.alignItems = 'flex-start';

        const textContainer = document.createElement('div');
        textContainer.style.marginRight = '10px';

        const requestName = document.createElement('h2');
        requestName.textContent = `Name: ${request.data.userFullName}`;

        const username = document.createElement('p');
        username.textContent = `Username: ${request.data.username}`;

        textContainer.appendChild(requestName);
        textContainer.appendChild(username);

        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '10px';

        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Accept';
        console.log( 'Accept request data: ', request.data);
        acceptBtn.addEventListener('click', () => handleAccept(request.data));

        const declineBtn = document.createElement('button');
        declineBtn.textContent = 'Decline';
        console.log('Decline request data: ', request.data);
        declineBtn.addEventListener('click', () => handleDecline(request.data));

        btnContainer.appendChild(acceptBtn);
        btnContainer.appendChild(declineBtn);

        //acceptBtn.style.marginLeft = '10px';

        userInfo.appendChild(btnContainer);
        //userInfo.appendChild(declineBtn);

        user.appendChild(userInfo);

        followRequestFeed.appendChild(user);

        followRequestsContainer.appendChild(followRequestFeed);

    })
    mainContainer.appendChild(followRequestsContainer);
} */

function displayFollowers(followers){
    const mainContainer = document.getElementById('followers');
    const followersContainer = document.createElement('div');
    followersContainer.classList.add("content");

    followers.forEach(request => {
        const followFeed = document.createElement('div');
        followFeed.id = "pf";
        followFeed.classList.add("post-feed");

        const user = document.createElement('div');
        user.classList.add('post');

        const image = document.createElement('img');
        image.src = '../assets/user.svg';
        image.alt = `${request.userId}`;
        image.classList.add('user-profile');
        
        user.appendChild(image);

        const userInfo = document.createElement('div');
        userInfo.classList.add('post-content');

        const requestName = document.createElement('h2');
        requestName.textContent = `Name: ${request.data.userFullName}`;

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
    const mainContainer = document.getElementById('following');
    const followingContainer = document.createElement('div');
    followingContainer.classList.add("content");

    following.forEach(request => {
        const followingFeed = document.createElement('div');
        followingFeed.id = "pf";
        followingFeed.classList.add("post-feed");

        const user = document.createElement('div');
        user.classList.add('post');

        const image = document.createElement('img');
        image.src = '../assets/user.svg';
        image.alt = 'User 1';
        image.classList.add('user-profile');
        
        user.appendChild(image);

        const userInfo = document.createElement('div');
        userInfo.classList.add('post-content');

        const requestName = document.createElement('h2');
        requestName.textContent = `Name: ${request.data.userFullName}`;

        userInfo.appendChild(requestName);

        const username = document.createElement('p');
        username.textContent = `${request.data.username}`;

        userInfo.appendChild(username);

        user.appendChild(userInfo);

        followingFeed.appendChild(user);

        followingContainer.appendChild(followingFeed);

    })
    mainContainer.appendChild(followingContainer);
}

function handleAccept(user){
    console.log(`Accepted follow request for user ID: ${user.userId}`);

    let userInfo = {
        requestingUserId: user.userId,
        userFullName: user.userFullName,
        username: user.username,
    }

    fetch(`http://localhost:8080/acceptFollowRequest/${userUid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
    })
    .catch(error => console.error('Error accepting follow request', error));
}

function handleDecline(user){
    console.log(`Declined follow request for user ID: ${user.Id}`);
    fetch(`http://localhost:8080/declineFollowRequest/${userUid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({requestingUserId: user.userId, userFullName: user.userFullName, username: user.userName}),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
    })
    .catch(err => console.error('Error declining follow request: ', err));
}

function openTab(tabId, elmnt) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
    }

    document.getElementById(tabId).style.display = "block";
    elmnt.className += " active-tab";
}

document.getElementsByClassName("tablink")[0].click();