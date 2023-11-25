//eventually 
//fetch everyone they're following 
//loop through following, fetch the users for each of them 
//sort by date? 
//display with most recent at the top 
let userId;
let userDisplayName;
let checkins = [];

console.log('displayfeed.js!')

auth.onAuthStateChanged(user => {
    if(user){
        console.log("user");
        userId = user.uid;
        userDisplayName = user.displayName;

        fetchFollowing();
    }else{
        console.log("no user");
    }
});

//1. fetch followers
async function fetchFollowing(){
    console.log('called fetch following');
    try{
        const response = await fetch(`http://localhost:8080/getFollowing/${userId}`);
        const following = await response.json();
        console.log('following', following);
        //displayFollowers(followers);
        fetchCheckInsForEachFollower(following);
    }catch(err){
        console.error('Error fetching followers: ', err);
    }
}

//2. for each follower, fetch their checkins
async function fetchCheckInsForEachFollower(following){
    for(const follow of following){
        console.log('follow id:', follow.id);
        const response = await fetch(`http://localhost:8080/getPosts/${follow.id}`);
        const checkInsForFollowing = await response.json();
        console.log('checkins for following', checkInsForFollowing);
        checkins.push(checkInsForFollowing);
        console.log('check ins at current: ', checkins);
        //sort by date/time
    }

    console.log('done');
    const sortedCheckIns = [...checkins].sort(sortByDateTime);
    console.log('sorted: ', sortedCheckIns);
    displayCheckIns(sortedCheckIns);


}

//3. Sort by time -- this isn't working
function sortByDateTime(a, b){
    const dateA = new Date(a.dateTime).toLocaleString();
    const dateB = new Date(b.dateTime).toLocaleString();

    return dateB.localeCompare(dateA);
}


/* async function fetchCheckIns(){
    try{
        console.log('right before end point: ', userId);
        const response = await fetch(`http://localhost:8080/getPosts/${userId}`);
        const checkIns = await response.json();
        console.log(checkIns);
        displayCheckIns(checkIns);
    }catch(error){
        console.error('Error fetching check-ins', error);
    }
} */

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
        checkIn.forEach(checkInPost => {
            console.log(checkInPost);
            const date = formatDateTime(checkInPost.data.dateTime);

            const postFeed = document.createElement('div');
            postFeed.id = "pf";
            postFeed.classList.add("post-feed");

            const stamp = document.createElement('div');
            stamp.classList.add('stamp');
    
            const post = document.createElement('div');
            post.classList.add('post');
    
/*             const image = document.createElement('img');
            image.src = 'assets/user.svg';
            image.alt = 'User 1';
            image.classList.add('user-profile');
            
            post.appendChild(image); */
            //stamp.appendChild(post);
    
            const postContent = document.createElement('div');
            postContent.classList.add('post-content');
    
            const orderRestaurant = document.createElement('h2');
            orderRestaurant.textContent = `Order at ${checkInPost.data.restaurant}`;
    
            postContent.appendChild(orderRestaurant);
    
            const order = document.createElement('p');
            order.textContent = `${checkInPost.data.order}`;
    
            postContent.appendChild(order);
    
            const metaData = document.createElement('div');
            metaData.textContent = `Posted on ${date} by ${checkInPost.data.userName}!`
    
            postContent.appendChild(metaData);
    
            post.appendChild(postContent);
            stamp.appendChild(post);
    
            postFeed.appendChild(stamp);
    
            checkInsContainer.appendChild(postFeed);
        })

        document.body.appendChild(checkInsContainer);
    })
}

//document.addEventListener('DOMContentLoaded', fetchCheckIns);