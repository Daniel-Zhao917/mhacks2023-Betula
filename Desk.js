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
var coin_count;


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
}

checkAuthState();

async function showCoinAmount() {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const docData = docSnap.data();
        // Update using the existing document data
        coin_count = docData.coin_count;
    }
    const coinCountDisplay = document.getElementById('coin-count-display');
    coinCountDisplay.textContent = `You have ${coin_count} coins.`;
    document.getElementById('coin-amount-popup').style.display = 'block';
}

async function showItemsPopup() {
    let items_array;
    const docSnap = await getDoc(docRef);
    try {
        if (docSnap.exists()) {
            const docData = docSnap.data();
            // Update using the existing document data
            items_array = [...docData.items_array];
        }
    } catch (error) {
        console.error("Error loading document: ", error);
    }

    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = ''; // Clear the container

    items_array.forEach((quantity, index) => {
        if (quantity > 0 && gachaItems[index]) {
            const item = gachaItems[index];
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}: ${quantity}</p>
            `;
            itemsContainer.appendChild(itemDiv);
        }
    });

    document.getElementById('desk-equipment-popup').style.display = 'block';
}

function closeItemsPopup() {
    document.getElementById('desk-equipment-popup').style.display = 'none';
}

function change() {
    window.location.href = 'Desk.html';
}

function closeCoinAmount() {
    document.getElementById('coin-amount-popup').style.display = 'none';
};

function retrieveCoinCount() {
    // Check if a user is signed in
    const user = firebase.auth().currentUser;

    if (user) {
        // User is signed in, get the user's UID
        const userId = user.uid;

        // Reference to the user's data in Firebase
        const userRef = firebase.database().ref('users/' + userId);

        // Retrieve the coin_count
        userRef.child('coin_count').once('value').then(snapshot => {
            const coin_count = snapshot.val();
        });
    } else {
        // User is not signed in
        console.log('User is not signed in.');
    }
}

function lol() {
    window.location = window.location.href = 'Summon.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for 'wish-button'
    const summonButton = document.getElementById('summon-button');
    if (summonButton) {
        summonButton.addEventListener('click', lol);
    }

    const deskEquipmentButton = document.getElementById('desk-equipment-button');
    if (deskEquipmentButton) {
        deskEquipmentButton.addEventListener('click', showItemsPopup);
    }

    const closeItemsButton = document.getElementById('close-items-button');
    if (closeItemsButton) {
        closeItemsButton.addEventListener('click', closeItemsPopup);
    }

    const coinAmountButton = document.getElementById('coin-amount-button');
    if (coinAmountButton) {
        coinAmountButton.addEventListener('click', showCoinAmount);
    }

    const closeCoinButton = document.getElementById('close-coin-button');
    if (closeCoinButton) {
        closeCoinButton.addEventListener('click', closeCoinAmount);
    }
});



const gachaItems = [
    { name: 'Enchiridion', probability: 0.05, image: '/images/fantasy book.png', value: 0 },
    { name: 'Quill-And-Ink', probability: 0.05, image: '/images/quill-and-ink.png', value: 1 },
    { name: 'pencil', probability: 0.1, image: '/images/pencil.png', value: 2 },
    { name: 'pen', probability: 0.1, image: '/images/pen.png', value: 3 },
    { name: 'eraser', probability: 0.1, image: '/images/eraser.png', value: 4 },
    { name: 'desk-light', probability: 0.1, image: '/images/desk-light.png', value: 5 },
    { name: 'ruler', probability: 0.1, image: '/images/ruler.png', value: 6 },
    { name: 'mug', probability: 0.1, image: '/images/mug.png', value: 7 },
    { name: 'sticky-notes', probability: 0.1, image: '/images/sticky-notes.png', value: 8 },
    { name: 'flower-pot', probability: 0.1, image: '/images/flower-pot.png', value: 9 },
    { name: 'notebook', probability: 0.1, image: '/images/notebook.png', value: 10 },
];