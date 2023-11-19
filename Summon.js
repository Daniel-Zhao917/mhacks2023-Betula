// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { doc, getDoc, updateDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { GachaSystem } from '../gacha.js';

const firebaseConfig = ({
    apiKey: "AIzaSyBgMRNCjkMGdGp9_pzhFFlj6lZLSNTtAAg",
    authDomain: "betula-5e30f.firebaseapp.com",
    projectId: "betula-5e30f",
    storageBucket: "betula-5e30f.appspot.com",
    messagingSenderId: "799313338712",
    appId: "1:799313338712:web:7ef9791228b5c2b947c52d",
    measurementId: "G-50GZK6TK3E",
  });

var app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var auth = getAuth(app);

var coin_count = 0;
var docRef;

async function checkAuthState() {
    const authState = localStorage.getItem('authState');
    if (authState) {
        const userData = JSON.parse(authState);
    
        // Create the docRef using the UID
        if (userData.uid) {
            docRef = doc(db, "users", userData.uid);
        }

        const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const docData = docSnap.data();
                // Update using the existing document data
                coin_count = docData.coin_count;
            }


        console.log("User is already logged in. Coin count:", coin_count);

        // Now you have the coin_count and can use it as needed
    } else {
        alert("No user logged in");
        // Handle the case where the user is not logged in
        window.location.href = "index.html";
    }
    updateCoinCount();
}

checkAuthState();


    // Function to update and display the coin count
function updateCoinCount() {
    const coinCountElement = document.getElementById('coinCount');
    coinCountElement.textContent = `Coins: ${coin_count}`;
}

// Function to show the rates popup
function showRatesPopup() {
    const ratesPopup = document.getElementById('ratesPopup');
    const ratesPopupMessage = document.getElementById('ratesPopupMessage');

    ratesPopupMessage.textContent = "5% chance for a 5-star (Enchiridion, Darkness Quill-and-Ink): 95% chance for a 4-star (everything else).";

    // Display the rates popup
    ratesPopup.style.display = 'block';
}

    // Function to close the rates popup
function closeRatesPopup() {
    const ratesPopup = document.getElementById('ratesPopup');
    ratesPopup.style.display = 'none';
}

    // Function to show the coin popup
async function showPopup() {
    const popup = document.getElementById('coinPopup');
    const popupMessage = document.getElementById('popupMessage');
    const singlePullResult = gacha.pull();

    if (coin_count > 0 && docRef) {
        let itemName = gachaItems[singlePullResult['value']]?.name || "";
        let itemImageSrc = gachaItems[singlePullResult['value']]?.image || "";

        // Capitalize the first letter of the item's name
        itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

        // Display the message and the image
        popupMessage.innerHTML = `<p>You Got ${itemName}</p>`;
        if (itemImageSrc) {
            const itemImage = document.createElement("img");
            itemImage.src = itemImageSrc;
            itemImage.alt = itemName;
            popupMessage.appendChild(itemImage);
        }

        // ...existing Firestore update code...
         try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const docData = docSnap.data();
                let items_array = docData.items_array || [];
        
                // Increment the count of the pulled item in items_array
                if (typeof items_array[singlePullResult['value']] === 'number') {
                    items_array[singlePullResult['value']]++;
                } else {
                    // If the item doesn't exist in the array, add it
                    items_array[singlePullResult['value']] = 1;
                }
        
                await updateDoc(docRef, {
                    coin_count: coin_count - 1, // Decrement coin count
                    items_array: items_array // Update the items array
                });
            } else {
                console.log("Document does not exist!");
            }
        } catch (error) {
            console.error("Error updating document: ", error);
        }
        // Update the local coin_count
        coin_count--;
        updateCoinCount();
    } else {
        // If no coins are available, display "insufficient coins"
        popupMessage.textContent = "Insufficient coins.";
    }

    // Display the coin popup
    popup.style.display = 'block';
}

    // Function to close the coin popup
function closePopup() {
        const popup = document.getElementById('coinPopup');
        popup.style.display = 'none';
}

function change(){
    window.location = window.location.href ='Desk.html';
}
const gachaItems = [
  { name: 'Enchiridion', probability: 0.05, image: '/images/fantasy book.png', value: 0},
  { name: 'Quill-And-Ink', probability: 0.05, image: '/images/quill-and-ink.png', value: 1},
  { name: 'pencil', probability: 0.1, image: '/images/pencil.png', value: 2},
  { name: 'pen', probability: 0.1, image: '/images/pen.png', value: 3},
  { name: 'eraser', probability: 0.1, image: '/images/eraser.png', value: 4},
  { name: 'desk-light', probability: 0.1, image: '/images/desk-light.png', value: 5},
  { name: 'ruler', probability: 0.1, image: '/images/ruler.png',value: 6},
  { name: 'mug', probability: 0.1, image: '/images/mug.png', value: 7},
  { name: 'sticky-notes', probability: 0.1, image: '/images/sticky-notes.png', value: 8},
  { name: 'flower-pot', probability: 0.1, image: '/images/flower-pot.png', value: 9},
  { name: 'notebook', probability: 0.1, image: '/images/notebook.png', value: 10},
];

const gacha = new GachaSystem(gachaItems);

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for 'wish-button'
    const wishButton = document.getElementById('wish-button');
    if (wishButton) {
        wishButton.addEventListener('click', showPopup);
    }

    // Event listener for 'rates-button'
    const ratesButton = document.getElementById('rates-button');
    if (ratesButton) {
        ratesButton.addEventListener('click', showRatesPopup);
    }

    // Event listener for closing the rates popup
    const closeRatesButton = document.getElementById('close-rates-popup');
    if (closeRatesButton) {
        closeRatesButton.addEventListener('click', closeRatesPopup);
    }

    // Event listener for closing the coin popup
    const closeCoinButton = document.getElementById('close-coin-popup');
    if (closeCoinButton) {
        closeCoinButton.addEventListener('click', closePopup);
    }

    const studyButton = document.getElementById('study-button');
    if (studyButton) {
        studyButton.addEventListener('click', change);
    }
});