import MainPage from "./pages/MainPage.js";
import GamePage from "./pages/GamePage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import Router from "./Router.js";
import HelpPage from "./pages/HelpPage.js";

/* ROUTER */
const pages = [
    new MainPage({key: 'main', title: 'Nonogram Game'}),
    new GamePage({key: 'game', title: 'Nonogram Game - Play'}),
    new HelpPage({key: 'help', title: 'Nonogram Game - Help'}),
    new NotFoundPage({key: '404', title: 'Nonogram Game | NOT FOUND'}),
];
const router = new Router({pages, defaultPage: 'main'});

// Header title to go to the main page
const headerH1 = document.querySelector('header h1');
headerH1.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState(null, null, '?page=main');
    window.dispatchEvent(new Event('popstate'));
});

/* LOADING PROFILE PICTURE */
function loadProfilePic() {
    // Get the Base64 string from localStorage
    const profilePicBase64 = localStorage.getItem('profilePic');

    // Get the profile-pic div
    const profilePicDiv = document.getElementById('header-profile-pic');

    // Clear the profile-pic div
    while (profilePicDiv.firstChild) {
        profilePicDiv.removeChild(profilePicDiv.firstChild);
    }

    if (profilePicBase64) {
        // Create an Image object from the Base64 string
        const profilePic = new Image();
        profilePic.src = profilePicBase64;
        profilePicDiv.appendChild(profilePic);
    } else {
        // Create a <span> element with the text "No profile picture"
        const noProfilePicSpan = document.createElement('span');
        noProfilePicSpan.textContent = '🤖';

        // Add the <span> element to the profile-pic div
        profilePicDiv.appendChild(noProfilePicSpan);
    }
}

loadProfilePic();
