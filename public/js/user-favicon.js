// Dynamic favicon for /user page using Firebase Storage profile picture
// This script should be included only on /user or loaded conditionally

// Wait for Firebase to be ready
function setDynamicFavicon() {
    if (typeof firebase === 'undefined' || !firebase.auth || !firebase.storage) {
        setTimeout(setDynamicFavicon, 300);
        return;
    }

    firebase.auth().onAuthStateChanged(async (user) => {
        let faviconUrl = '/assets/images/favicon.png'; // default
        if (user && user.photoURL) {
            // If user.photoURL is a Firebase Storage URL, get the download URL
            try {
                if (user.photoURL.startsWith('gs://')) {
                    const storageRef = firebase.storage().refFromURL(user.photoURL);
                    faviconUrl = await storageRef.getDownloadURL();
                } else {
                    faviconUrl = user.photoURL;
                }
            } catch (e) {
                // fallback to default
                faviconUrl = '/assets/images/favicon.png';
            }
        }
        updateFavicon(faviconUrl);
    });
}

function updateFavicon(url) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = url;
}

// Run on any root-level user profile route (e.g., /username, but not /, /home, /about, etc.)
const path = window.location.pathname;
const isProfileRoute = /^\/[a-zA-Z0-9_-]+$/.test(path) && !['/home','/about','/pricing','/features','/dashboard','/login','/signup','/'].includes(path);
if (isProfileRoute) {
    console.log('[Favicon] Detected user profile route:', path);
    setDynamicFavicon();
} else {
    console.log('[Favicon] Not a user profile route:', path);
}
