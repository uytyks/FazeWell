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

//Save checkins to firebase
app.post('/checkIns', async(req, res) => {
    try{
        console.log(req.body);
        const userJson = {
            restaurant: req.body.restaurant,
            dateTime: req.body.dateTime,
            order: req.body.order,
            moneyRating: req.body.moneyRating,
            qualityRating: req.body.qualityRating,
            savedToHistory: req.body.savedToHistory,
            userId: req.body.userId,
            userName: req.body.userName,
        };

        const response = await db.collection("checkins").add(userJson);
        res.send(response);
    }catch(error){
        res.send(error);
    }
});

//get all checkins - will eventually change this to whoever you're following
app.get('/checkIns', async(req, res) => {
    try{
        const checkInsSnapshot = await db.collection("checkins").get();
        const checkIns = [];

        checkInsSnapshot.forEach(doc => {
            checkIns.push({
                id: doc.id,
                data: doc.data()
            });
        });

        console.log(checkIns);
        res.json(checkIns);
    } catch(error){
        console.error('Error retrieving checkIns from Firestore: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//get all YOUR checkins (will be displayed on your profile)
app.get('/profileCheckIns', async (req, res) => {
    try {

        const userUid = req.query.userUid || user.uid;
        console.log

        console.log('Fetching check-ins for user UID:', userUid);

        const checkInsSnapshot = await db.collection("checkins")
            .where('userId', '==', userUid)
            .get();

        const checkIns = [];

        checkInsSnapshot.forEach(doc => {
            checkIns.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        console.log(checkIns);

        res.json(checkIns);
    } catch (error) {
        console.error('Error in /profileCheckIns route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
app.get("*", function (req, res) {
    // Might be good for a 404 error, or just redirect to main page for now.
    res.redirect("/");
}); 
