let userUid;
let userDisplayname;
let user;

const authStateChangedPromise = new Promise((resolve, reject) => {
    auth.onAuthStateChanged(authUser => {
        if(authUser){
            console.log("user");
            userUid = authUser.uid;
            userDisplayname = authUser.displayName || 'Nameless User';
            document.getElementById("huname").innerHTML = `${authUser.displayName}'s Profile`;
            document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${authUser.displayName}`;
            document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${authUser.email}`;
            user = authUser
            resolve(user);
        }else{
            console.log("no user");
            reject(new Error("no user logged in"));
        }
    });
});

authStateChangedPromise.then(authUser => {
    fetchProfileCheckIns();
}).catch(error => {
    console.error('error during auth state change: ', error);
})

/* auth.onAuthStateChanged(user => {
    if(user){
        console.log("user");
        userUid = user.uid;
        console.log(userUid);
        userDisplayname = user.DisplayName || 'Nameless User';
        document.getElementById("huname").innerHTML = `${user.displayName}'s Profile`;
        document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${user.displayName}`;
        document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${user.email}`;
    }else{
        console.log("no user");
    }
})
 */
/* function getCheckIns(){
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
}) */

async function fetchProfileCheckIns(){
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

document.addEventListener('DOMContentLoaded', fetchProfileCheckIns);