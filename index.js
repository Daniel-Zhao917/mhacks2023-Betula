import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
const auth = getAuth(app);
// const auth = getAuth();
// const database = getDatabase(app);
const db = getFirestore(app);

// const colRef = collection(db, 'four_array');

// export function getDocRef() {
//     const user = auth.currentUser;
//     if (user) {
//         return doc(db, "users", user.uid);
//     } else {
//         // Handle the case where there is no user logged in
//         return null;
//     }
// }

function storeAuthState(user){
    const userData = {
        uid: user.uid,
    };
    localStorage.setItem('authState', JSON.stringify(userData));
}

export async function login() {
    var email = document.getElementById('lemail').value;
    var password = document.getElementById('lpassword').value;
    var rememberMeChecked = document.getElementById('rememberme').checked;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        var user = userCredential.user;

        if(rememberMeChecked){
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        }

        // Add any code to handle the user after successful login (e.g., redirect, display user data, etc.)

        var docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
            last_login: Date.now(),
        });
    
        storeAuthState(user); // Store auth state with correct coin_count
        
        alert('Login successful!');
        
        window.location.href = 'Summon.html'; // Redirect to the logged-in page
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

function validate_email(email){
    var expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true){
        return true;
    }
    else{
        return false;
    }
}

function validate_password(password){
    //Firebase only accepts lengths greater than 6
    if (password < 6){
        alert("Please make your password 6 characters or longer.")
        return false;
    }
    else{
        return true;
    }
}

function validate_field(field){
    if (field == null){
        return false;
    }
    if (field.length <= 0){
        return false;
    }
    return true;
}


export async function register() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var username = document.getElementById('username').value;

    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is Invalid');
        return;
    }

    if (!validate_field(username)) {
        alert('Username is invalid');
        return;
    }

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        var user = cred.user;
        var docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
            username: username,
            email: email,
            last_login: Date.now(),
            coin_count: 3,
            items_array: [0,0,0,0,0,0,0,0,0,0,0]
        });

        alert('User Created!!');
        storeAuthState(user);
        window.location.href = 'Summon.html';
    } catch (error) {
        alert(error.message);
        window.location.href = 'index.html';
    }
}
