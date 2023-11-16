async function fetchCheckIns(){
    try{
        const response = await fetch('http://localhost:8080/checkIns');
        const checkIns = await response.json();
        console.log(checkIns);
        displayCheckIns(checkIns);
    }catch(error){
        console.error('Error fetching check-ins', error);
    }
}

function displayCheckIns(checkIns){
    //const checkInsContainer = document.getElementById('content');
    const checkInsContainer = document.createElement('div');
    checkInsContainer.classList.add("content");

    checkIns.forEach(checkIn => {
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
        metaData.textContent = `Posted on (date) by ${checkIn.data.username}!`

        postContent.appendChild(metaData);

        post.appendChild(postContent);

        postFeed.appendChild(post);

        checkInsContainer.appendChild(postFeed);

    })

    document.body.appendChild(checkInsContainer);
}

document.addEventListener('DOMContentLoaded', fetchCheckIns);