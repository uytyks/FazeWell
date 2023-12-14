# FazeWell
Goodbye old FaZe, welcome new FaZe :sunglassesemoji:

# To Run Locally 
- Clone this repository (git clone https://github.com/uytyks/FazeWell.git)
- Navigate to this directory on your computer (cd FazeWell)
- Enter an API key in your .env config for Spoonacular
```
npm install firebase-admin
npm install express
```
- Start the Backend - `node app.js`
- Navigate to a browser of your choice, go to localhost:8080

# Overview 
Welcome to Eat'n - a social media platform where users can post about their recent visit to a restaurant. Users have the ability to share their go to orders to save them for later or to inspire others! Users also have the ability to react and/or comment on their friends' recent posts! Navigate to your profile to see your recent orders, and navigate to the home page to view your friends recent posts! 

# Technological Overview 
We utilized HTML, CSS, Node.js, Express.Js, Spoonacular API, Bootstrap, and Firebase to create Eat'n!

# API Description 
We chose to use the Spoonacular API to pull menu items similar to the user's input. The top five suggestions are shown in hopes that it is the menu item that the user ordered at their restaurant. For every three characters typed, the suggestions are updated to fit the current query.

# Style and Organization
Our overall style is based on a PowerPoint slide theme we found online that resembled food and many colors from that theme. Our background is mostly warm colors alongside a clean white for modals and input fields. Files are organized into three subdirectories: assets, CSS files, and javascript files. All other files are present in the main directory. Comments giving brief explanations of what sections of code do what and specific functions are present in the javascript files!
