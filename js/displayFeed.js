let userId;
let userDisplayName;
let checkins = [];
commentsVisible = false;

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

async function fetchFollowing(){
    console.log('called fetch following');
    try{
        const response = await fetch(`http://localhost:8080/getFollowing/${userId}`);
        const following = await response.json();
        console.log('following', following);
        fetchCheckInsForEachFollower(following);
    }catch(err){
        console.error('Error fetching followers: ', err);
    }
}

async function fetchCheckInsForEachFollower(following){
    for(const follow of following){
        console.log('follow id:', follow.id);
        const response = await fetch(`http://localhost:8080/getPosts/${follow.id}`);
        const checkInsForFollowing = await response.json();
        console.log('checkins for following', checkInsForFollowing);
        checkins.push(checkInsForFollowing);
        console.log('check ins at current: ', checkins);
    }

    console.log('done');
    const sortedCheckIns = [...checkins].sort(sortByDateTime);
    console.log('sorted: ', sortedCheckIns);
    displayCheckIns(sortedCheckIns);


}


function sortByDateTime(a, b){
    const dateA = new Date(a.dateTime).toLocaleString();
    const dateB = new Date(b.dateTime).toLocaleString();

    return dateB.localeCompare(dateA);
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
    const checkInsContainer = document.createElement('div');
    checkInsContainer.classList.add("content");

    checkIns.forEach(checkIn => {
        checkIn.forEach(async checkInPost => {
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
    
            const footer = document.createElement('div');
            footer.classList.add('post-footer');
            footer.style.display = 'flex';
            footer.style.marginBottom = '20px'

            const reactBtn = document.createElement('button');
            reactBtn.textContent = 'React';
            reactBtn.addEventListener('click', () => toggleReactSection(reactSection));

            const commentBtn = document.createElement('button');
            commentBtn.textContent = 'Comment';
            commentBtn.addEventListener('click', () => toggleCommentSection(commentSection));

            footer.appendChild(reactBtn);
            footer.appendChild(commentBtn);

            const reactSection = document.createElement('div');
            reactSection.classList.add('react-section');
            reactSection.style.justifyContent ='space-between';
            reactSection.style.display = 'none';

            const emojiBtns = createEmojiBtns(checkInPost.postId, reactSection, checkInPost.data.userId);

            const commentSection = document.createElement('div');
            commentSection.classList.add('comment-section');
            commentSection.style.display = 'none'; //hide it

            const commentInput = document.createElement('input');
            commentInput.setAttribute('type', 'text');
            commentInput.setAttribute('placeholder', 'Add a comment');

            const commentSubmit = document.createElement('button');
            commentSubmit.textContent = 'Comment';
            commentSubmit.addEventListener('click', () => addComment(checkInPost.postId, commentInput.value, checkInPost.data.userId, commentSection));

            commentSection.appendChild(commentInput);
            commentSection.appendChild(commentSubmit);


            const metaData = document.createElement('div');
            metaData.textContent = `Posted on ${date} by ${checkInPost.data.userName}!`

            postContent.appendChild(orderRestaurant);
            postContent.appendChild(order);
            postContent.appendChild(reactSection);
            postContent.appendChild(interactionContainer);
            postContent.appendChild(footer);
            postContent.appendChild(commentSection);
            postContent.appendChild(metaData);


            post.appendChild(postContent);
            stamp.appendChild(post);
    
            postFeed.appendChild(stamp);

            checkInsContainer.appendChild(postFeed);
        })

        document.body.appendChild(checkInsContainer);
    })
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
        displayComments.appendChild(commentElement);


        const linebreak = document.createElement('hr');
        displayComments.appendChild(linebreak);
    })

    const toggleCommentsText = document.createElement('div');
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

function addComment(postId, commentVal, postUserId, commentSection){
    console.log('Commenting: ', commentVal + 'for post: ', postId);

    let payload = {
        postId: postId,
        comment: commentVal,
        userCommentingId: userId,
        userCommentingName: userDisplayName,
    }

    fetch(`http://localhost:8080/addPostComment/${postUserId}`,{
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).then(data => {
        console.log('Post added successfully: ', data);
    }).catch(err => {
        console.log('Error adding post: ', err);
    });

    location.reload();

    toggleCommentSection(commentSection);
}

function createEmojiBtns(checkInPostId, reactSection, checkInUserId){
    console.log('checkInPostId', checkInPostId);
    const emojis = ['😍', '👍', '😊', '❤️', '🔥', '👎', '🤮', '👀', '😋' ];

    const emojiBtns = emojis.map(emoji => {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.classList.add('emoji-react-buttons');
        btn.addEventListener('click', () => handleReaction(emoji, reactSection, checkInPostId, checkInUserId));
        reactSection.insertBefore(btn, reactSection.firstChild);
        return btn;
    })

    return emojiBtns;
}

function handleReaction(selectedEmoji, reactSection, checkInPostId, checkInUserId){
    console.log('PostId', checkInPostId);
    console.log(selectedEmoji + 'Was chosen');
    let payload = {
        postId: checkInPostId,
        reaction: selectedEmoji,
        userReactingId: userId,
        userReactingName: userDisplayName,
    }

    fetch(`http://localhost:8080/addPostReaction/${checkInUserId}`,{
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).then(data => {
        console.log('Post added successfully: ', data);
    }).catch(err => {
        console.log('Error adding post: ', err);
    });

    location.reload();

    toggleReactSection(reactSection)
}

function toggleReactSection(reactSection){
    reactSection.style.display = reactSection.style.display === 'none' ? 'flex' : 'none';
}

function toggleCommentSection(commentSection){
    commentSection.style.display = commentSection.style.display === 'none' ? 'flex' : 'none';
}
//document.addEventListener('DOMContentLoaded', fetchCheckIns);

function toggleDisplayComments(displayComments, toggleCommentsText){
    commentsVisible = !commentsVisible; // Toggle the visibility
    console.log(commentsVisible);
    displayComments.style.display = commentsVisible ? 'flex' : 'none';
    toggleCommentsText.textContent = commentsVisible ? 'Hide Comments' : 'View Comments';
}
