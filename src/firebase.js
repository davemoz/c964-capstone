/**
 * This file contains all Google Firebase config and db(Firestore) functions
 * 
 * @author Dave Mozdzanowski
 */
'use strict';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
// import "firebase/auth";
import "firebase/firestore";

// firebaseConfig
// https://console.firebase.google.com/u/1/project/projectID/settings/general/
const firebaseConfig = {
  apiKey: "AIzaSyD2IIJ2kdbt9UZtKJv0QlM28Q1ReIwcEZg",
  authDomain: "dmoz-c964-capstone.firebaseapp.com",
  projectId: "dmoz-c964-capstone",
  storageBucket: "dmoz-c964-capstone.appspot.com",
  messagingSenderId: "833467142570",
  appId: "1:833467142570:web:28d43015fd0a08555adbd3"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

db.collection('notifications').where("is_read", "==", false).onSnapshot(function
	(querySnapshot) {
	var undreaded_box = document.getElementById('undreaded_box');
	undreaded_box.innerHTML = '';
	querySnapshot.forEach(function (snapshot) {
		undreaded_box.innerHTML +=
			`<div id="` + snapshot.id + `" class="alert alert-success" role="alert">
				<h4 class="alert-heading">New Message</h4>
				<p>` + snapshot.data().message + `</p>
				<hr>
				<a href="#" class="make_as_read_link">Make As Read</a>
			</div>`;
		$('.make_as_read_link').click(function (e) {
			e.preventDefault();
			makeAsRead(snapshot.id);
		});
	});
});

db.collection('notifications').where("is_read", "==", true).onSnapshot(function
	(querySnapshot) {
	var readed_box = document.getElementById('readed_box');
	readed_box.innerHTML = '';
	querySnapshot.forEach(function (snapshot) {
		readed_box.innerHTML +=
			`<div id="` + snapshot.id + `" class="alert alert-primary" role="alert">
				<h4 class="alert-heading">Old Message</h4>
				<p>` + snapshot.data().message + `</p>
			</div>`;
	});
});

function makeAsRead(snapshot_id) {
	$.ajax("/ajax/make-as-read/?snapshot_id=" + snapshot_id, {
		success: function (data) {
			console.log(data);
		}
	});
}

function sendMessage() {
	var message_element = document.getElementById('id_message');
	$.ajax('/ajax/send-message?message=' + message_element.value, {
		success: function (data) {
			console.log(data);
			message_element.value = '';
		}
	});
}