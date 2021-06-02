const functions = require("firebase-functions"); // eslint-disable-line no-unused-vars

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.scheduledDataUpdate = functions.pubsub
  .schedule("every day 00:00") // Run once a day
  .onRun((context) => {
    // Get data from api and update Firestore DB
    console.log("scheduledDataUpdate run!");
    return null;
  });
