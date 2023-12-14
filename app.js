const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

var serviceAccount = require(path.join(__dirname, "resources", "serviceKey.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const app = express();
const port = 8080;
const db = admin.firestore();

app.use(express.static("assets"));
app.use("/", express.static(path.join(__dirname, "")));
//app.use(express.json());
app.use(express.static('public'));
// ------------------------
// Log user requests
// ------------------------
app.use(function (req, res, next) {
    const { url, path: routePath } = req;
    console.log(
        "Request: Timestamp:",
        new Date().toLocaleString(),
        ", URL (" + url + "), PATH (" + routePath + ")."
    );
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});


app.post('/initialUserInfo', async(req, res) => {
    try{
        const userUid = req.query.userUid || user.uid;
        console.log('Fetching check-ins for user UID:', userUid);

        const userInfo = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            posts: [],
            followers: [],
            following: [],
            requestedFollowers: [],
        }

        const userCollection = db.collection('users');
        const userDocRef = userCollection.doc(userUid);
        const response = await userDocRef.set(userInfo);

        res.send(response);
    }catch(err){
        res.send(err);
    }
})

app.get('/getBasicUserInfo/:userUid', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        console.log('Fetching user info for: ', userUid);

        const userDocRef = db.collection('users').doc(userUid);
        const userDoc = await userDocRef.get();

        if(!userDoc.exists){
            res.status(404).json({error: 'User not found'});
            return;
        }

        const userData = userDoc.data();
        res.json(userData);
    }catch(err){
        console.error('Error fetching user information');
        res.status(500).json({error: 'Internal Server Error'});
    }
})

app.post('/addPost/:userUid', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        console.log('Adding post for user: ', userUid);

        const postContents = {
            restaurant: req.body.restaurant,
            dateTime: req.body.dateTime,
            order: req.body.order,
            moneyRating: req.body.moneyRating,
            qualityRating: req.body.qualityRating,
            savedToHistory: req.body.savedToHistory,
            userName: req.body.userName,
            userId: req.body.userId,
        }

        const userDocRef = db.collection('users').doc(userUid);
        const postsCollection = userDocRef.collection('posts');

        const newPostRef = await postsCollection.add(postContents);

        //await initializeReactions(newPostRef);

        res.json({postId: newPostRef.id, message: 'Post added successfully'});
    }catch(err){
        console.error('Error adding post:', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

/* async function initializeReactions(postDocRef){
    const possibleReactions = ['😍', '👍', '😊', '❤️', '🔥', '👎', '🤮', '👀', '😋' ];
    const initialCount = 0;

    const reactionsCollection = postDocRef.collection('reactions');

    const promises = possibleReactions.map(async (reaction) => {
        await reactionsCollection.doc(reaction).set({ count: initialCount });
    });

} */

app.get('/getPosts/:userUid', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        console.log('Fetching posts for user: ', userUid);

        const userDocRef = db.collection('users').doc(userUid);
        const postsCollection = userDocRef.collection('posts');

        const postsSnapshot = await postsCollection.get();
        const posts = [];

        postsSnapshot.forEach(doc => {
            posts.push({
                postId: doc.id,
                data: doc.data(),
            });
        });

        res.json(posts);
    }catch(err){
        console.error('Error fetching posts: ', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

//just searching on name, can change this
app.get('/searchUsers', async(req, res) => {
    try{
        const searchTerm = req.query.searchTerm.toLowerCase();
        const usersCollection = db.collection('users');

        const snapshot = await usersCollection.where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();

        //const users = snapshot.docs.map(doc => doc.data());
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.json(users);
    }catch(err){
        console.error('Error searching users:', err);
        res.status(500).json({error: 'Internal server error'})
    }
})

app.post('/followRequest/:userUid', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        console.log('Adding follow request for user: ', userUid);

        const userRequesting = {
            userId: req.body.userId,
            userFullName: req.body.userFullName,
            username: req.body.username,
        }


        const userDocRef = db.collection('users').doc(userUid);
        const postsCollection = userDocRef.collection('followRequests');
        const postsCollectionRef = postsCollection.doc(req.body.userId);

        const newPostRef = await postsCollectionRef.set(userRequesting);

        res.json({postId: newPostRef.id, message: 'Follow Request added successfully'});
    }catch(err){
        console.error('Error adding post:', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

//follow requests for a given user
// Endpoint to get all follow requests for a user
app.get('/getFollowRequests/:userUid', async (req, res) => {
    try {
        const userUid = req.params.userUid;

        const followRequestsSnapshot = await db.collection('users').doc(userUid).collection('followRequests').get();
        const followRequests = [];

        followRequestsSnapshot.forEach(doc => {
            followRequests.push({
                id: doc.id,
                data: doc.data()
            });
        });

        res.json(followRequests);
    } catch (error) {
        console.error('Error getting follow requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//decline follow request
app.post('/declineFollowRequest/:userUid', async(req, res) => {
    try{
        //person who's logged in
        const userUid = req.params.userUid;
        console.log('deleting user for: ', userUid);
        const requestingUserId = req.body.requestingUserId;
        console.log('requesting user id: ', requestingUserId);

        //person requesting to follow
        await db.collection('users').doc(userUid).collection('followRequests').doc(requestingUserId).delete();

        res.json({message: 'Follow request declined succesfully'});
    } catch(err){
        console.error('Error declining follow request: ', err);
        res.status(500).json({error: 'Internal server error', err});
    }
})

app.post('/acceptFollowRequest/:userUid', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        const requestingUserId = req.body.requestingUserId;

        const userInfo = {
            userFullName: req.body.userFullName,
            username: req.body.username,
        }

        //add requesting user to followers subcollection
        await db.collection('users').doc(userUid).collection('followers').doc(requestingUserId).set(userInfo);

        //add the logged-in user to the following subcollection 
        await db.collection('users').doc(requestingUserId).collection('following').doc(userUid).set(userInfo);

        //remove from follow requests 
        await db.collection('users').doc(userUid).collection('followRequests').doc(requestingUserId).delete();

        res.json({message: 'Follow request accepted successfully'});
    }catch(err){
        console.error('Error accepting follow request:', err);
        res.status(500).json({error: 'Internal server error'});
    }
})

app.get('/getFollowers/:userUid', async (req, res) => {
    try {
        const userUid = req.params.userUid;
        console.log('Getting followers for: ', userUid)

        const followersSnapshot = await db.collection('users').doc(userUid).collection('followers').get();
        const followers = [];

        followersSnapshot.forEach(doc => {
            followers.push({
                id: doc.id,
                data: doc.data()
            });
        });

        res.json(followers);
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getFollowing/:userUid', async (req, res) => {
    try {
        const userUid = req.params.userUid;
        console.log('Getting following for: ', userUid)

        const followingSnapshot = await db.collection('users').doc(userUid).collection('following').get();
        const following = [];

        followingSnapshot.forEach(doc => {
            following.push({
                id: doc.id,
                data: doc.data()
            });
        });

        res.json(following);
    } catch (error) {
        console.error('Error getting following:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/addPostReaction/:userUid', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        console.log('Adding Reaction for user: ', userUid);

        const postId = req.body.postId;
        console.log('adding post for', postId);

/*         const info = {
            reaction: req.body.reaction,
            userReactingId: req.body.userReactingId,
            userReactingName: req.body.userReactingName,
        } */

        const reaction = req.body.reaction;

        const userDocRef = db.collection('users').doc(userUid);
        const postDocRef = userDocRef.collection('posts').doc(postId);

        postDocRef.update({
            [`reactions.${reaction}`]: admin.firestore.FieldValue.increment(1)
        });

        //console.log('adding post for', postId);

/*         const reactionCollection = postDocRef.collection('reactions');

        const newPostRef = await reactionCollection.add(info); */

        res.json({postId: postDocRef.id, message: 'Reaction added successfully'});
    }catch(err){
        console.error('Error adding reaction:', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/addPostComment/:userUid', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        console.log('Adding comment for user: ', userUid);

        const postId = req.body.postId;
        console.log('adding comment for post: ', postId);

        const info = {
            comment: req.body.comment,
            userCommentingId: req.body.userCommentingId,
            userCommentingName: req.body.userCommentingName,
        }

        const userDocRef = db.collection('users').doc(userUid);
        const postDocRef = userDocRef.collection('posts').doc(postId);

        //console.log('adding post for', postId);

        const commentsCollection = postDocRef.collection('comments');

        const newPostRef = await commentsCollection.add(info);

        res.json({postId: newPostRef.id, message: 'Comment added successfully'});
    }catch(err){
        console.error('Error adding reaction:', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getPostComments/:userUid/:postId', async(req, res) => {
    try{
        const userUid = req.params.userUid;
        const postId = req.params.postId;

        const userDocRef = db.collection('users').doc(userUid);
        const postDocRef = userDocRef.collection('posts').doc(postId);

        const commentsCollection = postDocRef.collection('comments');
        const commentsSnapshot = await commentsCollection.get();

        const comments = [];
        commentsSnapshot.forEach((doc) => {
            const commentData = doc.data();
            comments.push({
                commentId: doc.id,
                comment: commentData.comment,
                userCommentingId: commentData.userCommentingId,
                userCommentingName: commentData.userCommentingName
            })
        })

        res.json(comments);

    } catch(err){
        console.error('Error getting comments', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// ------------------------
// TODO: Load restaurant page from ID
// ------------------------
app.get("/restaurant/:id", function (req, res, next) {
    if (!req.params.id) next();

    res.send(`Restaurant ID: ${req.params.id}`);
});

// ------------------------
// Load your profile when no ID specified
// ------------------------
app.get("/profile", function (req, res) {
    res.sendFile("profile-page.html", { root: __dirname });
});

// ------------------------
// TODO: Load profile page from ID
// ------------------------
app.get("/profile/:id", function (req, res, next) {
    if (!req.params.id) next();

    res.send(`Profile ID: ${req.params.id}`);
});

// ------------------------
// Main page, render index.html
// ------------------------
app.get("/", function (req, res) {
    res.sendFile("index.html", { root: 'public' });
});

// ------------------------
// Any unimplemented URL's
// ------------------------
app.get("/login", function (req, res) {
    res.sendFile("login.html", { root: 'public' });
});

app.get("/friendsList", function (req, res) {
    res.sendFile("friendsList.html", { root: 'public' });
});

app.get("/userProfileTemplate/:id", function (req, res) {
    const userId = req.params.id;

    res.sendFile("userProfileTemplate.html", { userId });
});

app.get("/profile-page", function (req, res) {
    const userId = req.params.id;

    res.sendFile("profile-page.html", { userId });
});
/* app.get("*", function (req, res) {
    // Might be good for a 404 error, or just redirect to main page for now.
    res.redirect("/");
});  */
