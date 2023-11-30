let userUid;
let username;
let usersName;
let email;
//let user;
let commentsVisible = false;

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

        fetchProfileCheckIns();
    }
})

function updateProfilePage(){
    document.getElementById("huname").innerHTML = `${username}'s Profile`;
    document.getElementById("pusername").innerHTML = `<strong>Username:</strong> ${username}`;
    document.getElementById("pname").innerHTML = `<strong>Name:</strong> ${usersName}`;
    document.getElementById('pemail').innerHTML = `<strong>Email:</strong> ${email}`;
}

async function fetchProfileCheckIns(){
    try{
        const response = await fetch(`http://localhost:8080/getPosts/${userUid}`);
        const checkIns = await response.json();
        console.log(checkIns);
        displayCheckIns(checkIns);
    } catch(error){
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
    const postContainer = document.getElementById('post-container');
    const checkInsContainer = document.createElement('div');
    checkInsContainer.classList.add("content");

    checkIns.forEach(checkInPost => {
            console.log(checkInPost);
            const date = formatDateTime(checkInPost.data.dateTime);

            const postFeed = document.createElement('div');
            postFeed.id = "pf";
            postFeed.classList.add("post-feed");

            const stamp = document.createElement('div');
            stamp.classList.add('stamp');
    
            const post = document.createElement('div');
            post.classList.add('post');
    
            const postContent = document.createElement('div');
            postContent.classList.add('post-content');
    
            const orderRestaurant = document.createElement('h2');
            orderRestaurant.textContent = `Order at ${checkInPost.data.restaurant}`;
    
            const order = document.createElement('p');
            order.textContent = `${checkInPost.data.order}`;

            const interactionContainer = document.createElement('div');
            interactionContainer.style.display = 'flex'; 
            interactionContainer.style.justifyContent = 'space-between';

            const reactionsContainer = document.createElement('div');
            reactionsContainer.classList.add('reactions-container');

            const reactions = checkInPost.data.reactions;
            console.log(reactions);

            for(const reaction in reactions){
                console.log('key: ', reaction);
                console.log('value: ', reactions[reaction])
                displayReaction(reaction, reactions[reaction], reactionsContainer);
            }

            const commentsContainer = document.createElement('div');

            getComments(checkInPost, commentsContainer);

            interactionContainer.appendChild(reactionsContainer);
            interactionContainer.appendChild(commentsContainer);


            const metaData = document.createElement('div');
            metaData.textContent = `Posted on ${date} by ${checkInPost.data.userName}!`

            postContent.appendChild(orderRestaurant);
            postContent.appendChild(order);
            postContent.appendChild(interactionContainer);
            postContent.appendChild(metaData);


            post.appendChild(postContent);
            stamp.appendChild(post);
    
            postFeed.appendChild(stamp);

            checkInsContainer.appendChild(postFeed);
        })
        postContainer.appendChild(checkInsContainer);
}


function displayMessage(comments, commentsContainer){

    const displayComments = document.createElement('div');
    displayComments.style.flexDirection = 'column';
    displayComments.style.display = 'none';

    commentsContainer.appendChild(displayComments);

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.textContent = `${comment.comment} by`;
        var italicElement = document.createElement('i');
        italicElement.textContent = ` ${comment.userCommentingName}`;
        commentElement.appendChild(italicElement);

        commentElement.style.fontSize = '14';
        commentElement.style.color = 'gray';
        //commentsContainer.appendChild(commentElement);
        displayComments.appendChild(commentElement);


        const linebreak = document.createElement('hr');
        displayComments.appendChild(linebreak);
    })

    const toggleCommentsText = document.createElement('div');
    //toggleCommentsText.textContent = commentsVisible ? 'Hide Comments' : `View ${comments.length} comments`;
    toggleCommentsText.classList.add('toggle-comments');
    toggleCommentsText.style.color = '#55566C';
    toggleCommentsText.addEventListener('click', () => toggleDisplayComments(displayComments, toggleCommentsText));
    toggleCommentsText.textContent = commentsVisible ? 'Hide Comments' : `View ${comments.length} comments`;

    //
    commentsContainer.appendChild(toggleCommentsText);

}

function getComments(postData, container){
    fetch(`http://localhost:8080/getPostComments/${postData.data.userId}/${postData.postId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Comments retrieved successfully', data);
            //return data;
            if(data.length > 0){
                displayMessage(data, container);
            }
        })
        .catch(error => console.error('Error Getting Comments:', error));
}

function displayReaction(reaction, count, container){
    const reactionElement = document.createElement('div');
    reactionElement.classList.add('reaction');

    const emojiElement = document.createElement('span');
    emojiElement.textContent = reaction;

    const countElement = document.createElement('span');
    countElement.textContent = count;

    reactionElement.appendChild(countElement);
    reactionElement.appendChild(emojiElement);

    container.appendChild(reactionElement);
}


function toggleDisplayComments(displayComments, toggleCommentsText){
    commentsVisible = !commentsVisible; // Toggle the visibility
    console.log(commentsVisible);
    displayComments.style.display = commentsVisible ? 'flex' : 'none';
    toggleCommentsText.textContent = commentsVisible ? 'Hide Comments' : 'View Comments';
}
