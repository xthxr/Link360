// Authentication State Management

let currentUser = null;
let authToken = null;

// Auth UI Elements
const loginSection = document.getElementById('loginSection');
const userSection = document.getElementById('userSection');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const promptLoginBtn = document.getElementById('promptLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');

// Section Elements
const loginPrompt = document.getElementById('loginPrompt');
const dashboardSection = document.getElementById('dashboardSection');
const shortenerSection = document.querySelector('.shortener-section');

// Initialize Auth State Listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        authToken = await user.getIdToken();
        
        // Update UI
        userPhoto.src = user.photoURL || 'https://via.placeholder.com/40';
        userName.textContent = user.displayName || user.email;
        
        loginSection.style.display = 'none';
        userSection.style.display = 'block';
        loginPrompt.style.display = 'none';
        
        // Show dashboard by default - wait for app.js to load
        if (typeof showDashboard === 'function') {
            showDashboard();
        } else {
            // Fallback: wait for DOM to be ready and retry
            window.addEventListener('DOMContentLoaded', () => {
                if (typeof showDashboard === 'function') {
                    showDashboard();
                }
            });
        }
    } else {
        currentUser = null;
        authToken = null;
        
        loginSection.style.display = 'block';
        userSection.style.display = 'none';
        loginPrompt.style.display = 'block';
        dashboardSection.style.display = 'none';
        if (shortenerSection) shortenerSection.style.display = 'none';
        
        // Hide analytics if visible
        const analyticsSection = document.getElementById('analyticsSection');
        if (analyticsSection) analyticsSection.style.display = 'none';
    }
});

// Google Sign In
async function signInWithGoogle() {
    try {
        // Try redirect method first (better for embedded browsers)
        if (window.location !== window.parent.location) {
            // We're in an iframe/embedded browser, use redirect
            await auth.signInWithRedirect(googleProvider);
        } else {
            // Try popup method
            const result = await auth.signInWithPopup(googleProvider);
            console.log('Signed in:', result.user.displayName);
        }
    } catch (error) {
        console.error('Error signing in:', error);
        
        if (error.code === 'auth/popup-blocked') {
            // Fallback to redirect if popup is blocked
            console.log('Popup blocked, trying redirect...');
            await auth.signInWithRedirect(googleProvider);
        } else if (error.code === 'auth/popup-closed-by-user') {
            // User closed popup, do nothing
        } else if (error.code === 'auth/unauthorized-domain') {
            alert('This domain is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized domains');
        } else {
            alert('Error signing in: ' + error.message + '\n\nTip: Try opening in a regular browser instead of VS Code.');
        }
    }
}

// Handle redirect result
auth.getRedirectResult().then((result) => {
    if (result.user) {
        console.log('Signed in via redirect:', result.user.displayName);
    }
}).catch((error) => {
    console.error('Redirect error:', error);
});

// Sign Out
async function signOut() {
    try {
        await auth.signOut();
        console.log('Signed out');
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
}

// Event Listeners
googleLoginBtn.addEventListener('click', signInWithGoogle);
promptLoginBtn.addEventListener('click', signInWithGoogle);
logoutBtn.addEventListener('click', signOut);

// Get Auth Token (for API calls)
async function getAuthToken() {
    if (currentUser) {
        return await currentUser.getIdToken();
    }
    return null;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}
