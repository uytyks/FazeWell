const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

var serviceAccount = require("../FazeWell/serviceKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const app = express();
const port = 8080;
const db = admin.firestore();

app.use(express.static("assets"));
app.use("/", express.static(path.join(__dirname, "")));
app.use(express.json());
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
        }

        const userDocRef = db.collection('users').doc(userUid);
        const postsCollection = userDocRef.collection('posts');

        const newPostRef = await postsCollection.add(postContents);

        res.json({postId: newPostRef.id, message: 'Post added successfully'});
    }catch(err){
        console.error('Error adding post:', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

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
        console.log('Adding post for user: ', userUid);

        const userRequesting = {
            userId: req.body.userId,
        }

        const userDocRef = db.collection('users').doc(userUid);
        const postsCollection = userDocRef.collection('followRequests');

        const newPostRef = await postsCollection.add(userRequesting);

        res.json({postId: newPostRef.id, message: 'Follow Request added successfully'});
    }catch(err){
        console.error('Error adding post:', err);
        res.status(500).json({error: 'Internal server error'});
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
    res.sendFile("index.html", { root: __dirname });
});

// ------------------------
// Any unimplemented URL's
// ------------------------
/* app.get("*", function (req, res) {
    // Might be good for a 404 error, or just redirect to main page for now.
    res.redirect("/");
});  */
