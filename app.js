const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

var serviceAccount = require("../FazeWell/serviceKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const app = express();
const port = 8080;

app.use(express.static("assets"));
app.use("/", express.static(path.join(__dirname, "")));

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});

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
