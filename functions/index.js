// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// const firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// const NYC_COVID_DATA_JSON =
//   "https://data.cityofnewyork.us/resource/rc75-m7u3.json";

// /**
//  * Run once a day at midnight, to fetch fresh data
//  */
// exports.scheduledDataUpdate = functions.pubsub
//   .schedule("every day 00:00") // Run once a day
//   .onRun(async (context) => {
//     // Get data from api
//     const data = await fetch(NYC_COVID_DATA_JSON)
//       .then((res) => res.json())
//       .then((data) => data);

//     // Firestore ref
//     const covidDataFirestoreRef = firestore.doc("/covid-data");
//     // Write the newly fetched data to our Firestore doc
//     covidDataFirestoreRef.set();

//     console.log("scheduledDataUpdate has run!");
//     return null;
//   });
