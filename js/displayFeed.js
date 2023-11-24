//eventually 
//fetch everyone they're following 
//loop through following, fetch the users for each of them 
//sort by date? 
//display with most recent at the top 
let userId;
let userDisplayName;

auth.onAuthStateChanged(user => {
    if(user){
        console.log("user");
        userId = user.uid;
        console.log(userId);
        userDisplayName = user.displayName;
        console.log(userDisplayName);

        fetchCheckIns();
    }else{
        console.log("no user");
    }
});

async function fetchCheckIns(){
    try{
        console.log('right before end point: ', userId);
        const response = await fetch(`http://localhost:8080/getPosts/${userId}`);
        const checkIns = await response.json();
        console.log(checkIns);
        displayCheckIns(checkIns);
    }catch(error){
        console.error('Error fetching check-ins', error);
    }
}

function formatDateTime(jsonDateTime){
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    };

    const dateTime = new Date(jsonDateTime);
    return new Intl.DateTimeFormat('en-US', options).format(dateTime);
}

function displayCheckIns(checkIns){
    //const checkInsContainer = document.getElementById('content');
    const checkInsContainer = document.createElement('div');
    checkInsContainer.classList.add("content");

    checkIns.forEach(checkIn => {
        const date = formatDateTime(checkIn.data.dateTime);

        const postFeed = document.createElement('div');
        postFeed.id = "pf";
        postFeed.classList.add("post-feed");

        const post = document.createElement('div');
        post.classList.add('post');

        const image = document.createElement('img');
        image.src = 'assets/profile.png';
        image.alt = 'User 1';
        image.classList.add('user-profile');
        
        post.appendChild(image);

        const postContent = document.createElement('div');
        postContent.classList.add('post-content');

        const orderRestaurant = document.createElement('h2');
        orderRestaurant.textContent = `Order at ${checkIn.data.restaurant}`;

        postContent.appendChild(orderRestaurant);

        const order = document.createElement('p');
        order.textContent = `${checkIn.data.order}`;

        postContent.appendChild(order);

        const metaData = document.createElement('div');
        metaData.textContent = `Posted on ${date} by ${checkIn.data.userName}!`

        postContent.appendChild(metaData);

        post.appendChild(postContent);

        postFeed.appendChild(post);

        checkInsContainer.appendChild(postFeed);

    })

    document.body.appendChild(checkInsContainer);
}

document.addEventListener('DOMContentLoaded', fetchCheckIns);