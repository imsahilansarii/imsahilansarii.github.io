// 1. Random Quotes Logic
const quotes = [
    "Today's forecast: 100% chance of patching",
    "Keep calm and update your apps",
    "New features are just a patch away",
    "May your bugs be few and updates fast"
];

function setRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote-text').innerText = quotes[randomIndex];
}

// 2. Pre-defined Gradients Array
// You can add more color combinations here as per your preference
const gradients = [
    "linear-gradient(135deg, #e5735c, #54b4c5)", // Orange to Teal
    "linear-gradient(135deg, #d84572, #55b6c8)", // Pink to Teal
    "linear-gradient(135deg, #3db39e, #5db2cd)", // Green to Teal
    "linear-gradient(135deg, #2b323d, #52a8c3)", // Dark to Teal
    "linear-gradient(135deg, #2874f0, #5db2cd)", // Blue to Teal
    "linear-gradient(135deg, #8E2DE2, #4A00E0)", // Purple shades
    "linear-gradient(135deg, #FF416C, #FF4B2B)"  // Red shades
];

// 3. Cookie Management System
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 4. App Loading & Update Logic
async function loadApps() {
    const appListContainer = document.getElementById('app-list');
    
    try {
        // Fetching data from the JSON file
        const response = await fetch('public/apps.json');
        const apps = await response.json();

        apps.forEach(app => {
            // Check the previously downloaded version from cookies
            const downloadedVersion = getCookie(app.id);
            
            // Check if user downloaded the app and if a new version is available in JSON
            const isUpdateAvailable = downloadedVersion && downloadedVersion !== app.version;

            // Pick a random gradient from the array
            const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

            // Generate the App Card
            const card = document.createElement('div');
            card.className = 'app-card';
            
            // Assign the random gradient
            card.style.background = randomGradient;
            
            // Simulate download on click (sets a cookie for 30 days)
            card.onclick = () => {
                setCookie(app.id, app.version, 30);
                alert(`${app.name} (${app.version}) is downloading...\nNext time the version changes, an Update tag will appear!`);
                location.reload(); // Refresh to hide the update badge instantly
            };

            card.innerHTML = `
                <img src="${app.icon}" alt="${app.name}" class="app-icon">
                <div class="app-info">
                    <div class="app-name">${app.name}</div>
                    <div class="app-version">${app.version}</div>
                </div>
                ${isUpdateAvailable ? `
                    <div class="update-badge">
                        <span class="material-symbols-rounded">arrow_upward</span> Update
                    </div>
                ` : ''}
            `;
            
            appListContainer.appendChild(card);
        });
    } catch (error) {
        // Fallback error message if JSON fails to load
        appListContainer.innerHTML = '<p style="text-align:center;">Failed to load apps. If you are running this locally, please use a Live Server.</p>';
    }
}

// 5. Dark Mode Logic
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    let isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    themeIcon.innerText = isDark ? 'light_mode' : 'dark_mode';
}

// Check saved theme preference on load
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeIcon.innerText = 'light_mode';
}

themeBtn.addEventListener('click', toggleTheme);

// Initialize everything when the page loads
window.onload = () => {
    setRandomQuote();
    loadApps();
};
