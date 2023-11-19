// Assuming that the register function is exported from another module (e.g., index.js)
import { register } from "../../index.js";
import { login } from "../../index.js";

document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('registerButton');
    const registerForm = document.getElementById('registerForm');

    registerButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        register();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginForm = document.getElementById('loginForm');

    loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        login();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Get the "Remember me" checkbox element
    const rememberMeCheckbox = document.querySelector('.remember-forgot input[type="checkbox"]');

    // Check if the checkbox is found
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('change', (event) => {
            if (!event.target.checked) {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            } 
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if remembered email and password are stored in localStorage
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');

    if (rememberedEmail && rememberedPassword) {
        // If both are found, auto-fill the login form fields
        document.getElementById('lemail').value = rememberedEmail;
        document.getElementById('lpassword').value = rememberedPassword;
    }

    // Rest of your code, including event listeners...
});
