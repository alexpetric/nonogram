import Page from "./Page.js";
import {loadProfilePic} from "../script.js";

export default class MainPage extends Page {
    constructor(settings) {
        super(settings);
    }

    render() {
        // Check if there is a saved user
        const savedUser = localStorage.getItem('username');
        if (savedUser) {
            // If there is a saved user, check if there is a saved game
            const savedGame = localStorage.getItem('savedGame');
            const savedLevel = localStorage.getItem('level') ?? 1;
            const message = savedGame ? `Click the button below to continue level ${savedLevel}.` : `Click the button below to start a new game - Level ${savedLevel}.`;
            const buttonText = savedGame ? 'Continue Game' : 'Start Game';
            return `
                <section class="main-page">
                    <h1>Welcome, ${savedUser}!</h1>
                    <p>If you're new to Nonograms and don't know how to play, <br>click <a id="help-link">here for help</a>.</p>
                    <p>${message}</p>
                    <button id="start-game">${buttonText}</button>
                </section>
            `;
        } else {
            // If there is no saved user, show the user info form
            return `
                <section id="user-info-form">
                    <h1>Welcome to Nonogram Game!</h1>
                    <p>Since this is your first time playing the game, we would like you to fill out the form.</p>
                    <p>Please, enter your name and upload a profile picture.</p>
                    <form>
                        <label for="input-username">NAME</label>
                        <input type="text" id="input-username" name="username" placeholder="John Does Nonogram" required autofocus>
                        <label for="input-profile-pic">PROFILE PICTURE</label>
                        <span>You can drag & drop your image here.</span>
                        <div id="drop-zone">
                            <input type="file" id="input-profile-pic" name="profile-pic" accept="image/*">
                        </div>
                        <button type="submit" class="main-button" id="user-form-save-button">Save</button>
                    </form>
                </section>
            `;
        }
    }

    showPage() {
        super.showPage();

        // If there is a user form on the page, add an event listener for the form submission
        const userInfoForm = document.getElementById('user-info-form');
        if (userInfoForm) {
            userInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Get the username and profile picture
                const username = document.getElementById('input-username').value;
                const profilePic = document.getElementById('input-profile-pic').files[0];

                // Save the username
                localStorage.setItem('username', username);

                // Read the profile picture as a Base64 string and save it to localStorage
                const reader = new FileReader();
                reader.onloadend = function() {
                    localStorage.setItem('profilePic', reader.result);
                    this.showPage();
                }.bind(this);
                reader.readAsDataURL(profilePic);

                // Save the level to localStorage
                localStorage.setItem('level', 1);

                // Render profile picture
                loadProfilePic();

                // Re-render the MainPage
                location.reload();
            });
        }
        // If there is a start game button on the page, add an event listener for the button click
        const startGameButton = document.getElementById('start-game');
        if (startGameButton) {
            document.getElementById('start-game').addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState(null, null, '?page=game');
                window.dispatchEvent(new Event('popstate'));
            });
        }
        // If there is a help link on the page, add an event listener for the link click
        const helpLink = document.getElementById('help-link');
        if (helpLink) {
            helpLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState(null, null, '?page=help');
                window.dispatchEvent(new Event('popstate'));
            });
        }
    }

    setUpFileReader() {
        // Get the drop zone element
        const profilePicInput = document.getElementById('input-profile-pic');

        // Add event listeners for drag and drop
        profilePicInput.addEventListener('dragover', function (e) {
            e.preventDefault();
            profilePicInput.classList.add('dragging');
        });
        profilePicInput.addEventListener('dragleave', function () {
            profilePicInput.classList.remove('dragging');
        });
        profilePicInput.addEventListener('drop', function (e) {
            e.preventDefault();
            profilePicInput.classList.remove('dragging');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                document.getElementById('input-profile-pic').files = files;
            }
        });

        // Add an event listener for the file input click event to remove the dragging class
        document.getElementById('input-profile-pic').addEventListener('click', function () {
            profilePicInput.classList.remove('dragging');
        });

        // Add an event listener for the form submission
        document.querySelector('#user-info-form form').addEventListener('submit', function (e) {
            e.preventDefault();

            // Get the user's name and profile picture
            const username = document.getElementById('input-username').value;
            const profilePic = document.getElementById('input-profile-pic').files[0];

            // Save the user's name and profile picture to localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('profilePic', profilePic);
        });
    }
}