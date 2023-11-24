let userUid;
let username;
let usersName;
let email;
//let user;

auth.onAuthStateChanged(user => {
    if(user){
        console.log('there is a user logged in');
        userUid = user.uid;

        fetch(`http://localhost:8080/getBasicUserInfo/${userUid}`)
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
})

function updateProfilePage(){
    document.getElementById("huname").innerHTML = `${username}'s Profile`;
    document.getElementById("pusername").innerHTML = `<strong>Username:</strong> ${username}`;
    document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${usersName}`;
    document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${email}`;

}


/* authStateChangedPromise.then(authUser => {
    fetchProfileCheckIns();
}).catch(error => {
    console.error('error during auth state change: ', error);
}) */

/* async function fetchProfileCheckIns(){
    try{
        const response = await fetch(`http://localhost:8080/profileCheckIns?userUid=${userUid}`);
        const checkIns = await response.json();
        console.log(checkIns);
        displayCheckIns(checkIns);
    } catch(error){
        console.error('Error fetching check-ins', error);
    }
}

function displayCheckIns(checkIns){
    const mainDiv = document.getElementById("pp");
    const first = document.getElementById("first");
    const last = document.getElementById("last");

    mainDiv.appendChild(first);
    //const checkInsContainer = document.getElementById('content');
    const checkInsContainer = document.createElement('div');
    checkInsContainer.classList.add("middle-section");

    checkIns.forEach(checkIn => {
        const postFeed = document.createElement('div');
        postFeed.id = "pf";
        postFeed.classList.add("post-feed");

        const post = document.createElement('div');
        post.classList.add('post');

        const postContent = document.createElement('div');
        postContent.classList.add('post-content');

        const orderRestaurant = document.createElement('h2');
        orderRestaurant.textContent = `Order at ${checkIn.data.restaurant}`;

        postContent.appendChild(orderRestaurant);

        const order = document.createElement('p');
        order.textContent = `${checkIn.data.order}`;

        postContent.appendChild(order);

        const metaData = document.createElement('div');
        metaData.textContent = `Posted on (date) by ${checkIn.data.userName}!`

        postContent.appendChild(metaData);

        post.appendChild(postContent);

        postFeed.appendChild(post);

        checkInsContainer.appendChild(postFeed);

        mainDiv.append(checkInsContainer);
        mainDiv.append(last);

    })

    document.body.appendChild(mainDiv);
}

document.addEventListener('DOMContentLoaded', fetchProfileCheckIns); */