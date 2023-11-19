import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { doc, getDoc, updateDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


const firebaseConfig = ({
  apiKey: "AIzaSyBgMRNCjkMGdGp9_pzhFFlj6lZLSNTtAAg",
  authDomain: "betula-5e30f.firebaseapp.com",
  projectId: "betula-5e30f",
  storageBucket: "betula-5e30f.appspot.com",
  messagingSenderId: "799313338712",
  appId: "1:799313338712:web:7ef9791228b5c2b947c52d",
  measurementId: "G-50GZK6TK3E",
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var auth = getAuth(app);
var docRef;

var startTime; // to keep track of the start time
var stopwatchInterval; // to keep track of the interval
var elapsedPausedTime = 0; // to keep track of the elapsed time while stopped

var count = 0;

async function checkAuthState() {
  const authState = localStorage.getItem('authState');
  if (authState) {
    const userData = JSON.parse(authState);
    // Create the docRef using the UID
    if (userData.uid) {
      docRef = doc(db, "users", userData.uid);
    }
    // Now you have the coin_count and can use it as needed
  } else {
    alert("No user logged in");
    // Handle the case where the user is not logged in
    window.location.href = "index.html";
  }
  
}
checkAuthState();

async function addOne(){
  const docSnap = await getDoc(docRef);
  try {
    if (docSnap.exists()) {
      const docData = docSnap.data();
      // Update using the existing document data
      await updateDoc(docRef, {
        username: docData.username,
        email: docData.email,
        last_login: docData.last_login,
        coin_count: docData.coin_count + count,
        items_array: docData.items_array,
      });
      alert(docData.coin_count + count);
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      count = 0;
    }
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
function startStopwatch() {
  if (!stopwatchInterval) {
    startTime = new Date().getTime() - elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
    stopwatchInterval = setInterval(updateStopwatch, 1000); // update every second
    timerInterval = setInterval(count++, 30* 60 * 1000); // 1 coin every 30 minutes
  }
}

function stopStopwatch() {
  clearInterval(stopwatchInterval); // stop the interval
  elapsedPausedTime = new Date().getTime() - startTime; // calculate elapsed paused time
  stopwatchInterval = null; // reset the interval variable
  addOne();
}

function resetStopwatch() {
  stopStopwatch(); // stop the interval
  elapsedPausedTime = 0; // reset the elapsed paused time variable
  document.getElementById("stopwatch").innerHTML = "00:00:00"; // reset the display
  addOne();
}

function updateStopwatch() {
  var currentTime = new Date().getTime(); // get current time in milliseconds
  var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds
  var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
  var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
  var hours = Math.floor(elapsedTime / 1000 / 60 / 60); // calculate hours
  var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
  document.getElementById("stopwatch").innerHTML = displayTime; // update the display
}

function pad(number) {
  // add a leading zero if the number is less than 10
  return (number < 10 ? "0" : "") + number;
}

document.addEventListener('DOMContentLoaded', () => {

  const startStopwatch1 = document.getElementById('startStopwatch');
  if (startStopwatch1) {
    startStopwatch1.addEventListener('click', startStopwatch);
  }

  const stopStopwatch1 = document.getElementById('stopStopwatch');
  if(stopStopwatch1){
    stopStopwatch1.addEventListener('click', stopStopwatch);
  }

  const resetStopwatch1 = document.getElementById('resetStopwatch');
  if(resetStopwatch1){
    resetStopwatch1.addEventListener('click', resetStopwatch);
  }
});