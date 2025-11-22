// Get code from URL path
const code = window.location.pathname.split('/').pop();

const loadingDiv = document.getElementById('loading');
const statsContent = document.getElementById('stats-content');
const errorMessage = document.getElementById('error-message');

const shortCodeEl = document.getElementById('short-code');
const originalUrlEl = document.getElementById('original-url');
const clicksEl = document.getElementById('clicks');
const lastClickedEl = document.getElementById('last-clicked');
const createdAtEl = document.getElementById('created-at');
const copyLinkBtn = document.getElementById('copy-link');

// Load stats on page load
document.addEventListener('DOMContentLoaded', loadStats);

// Copy link functionality
copyLinkBtn.addEventListener('click', () => {
    const link = window.location.origin + '/' + code;
    copyToClipboard(link);
});

// Load link stats
async function loadStats() {
    if (!code) {
        showError();
        return;
    }

    try {
        const response = await fetch(`/api/links/${code}`);
        const data = await response.json();

        if (response.ok) {
            displayStats(data);
        } else {
            showError();
        }
    } catch (error) {
        showError();
    }
}

// Display stats
function displayStats(link) {
    loadingDiv.style.display = 'none';
    statsContent.style.display = 'block';

    shortCodeEl.textContent = link.shortCode;
    originalUrlEl.textContent = link.originalUrl;
    clicksEl.textContent = link.clicks;
    lastClickedEl.textContent = link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'Never';
    createdAtEl.textContent = new Date(link.createdAt).toLocaleString();
}

// Show error
function showError() {
    loadingDiv.style.display = 'none';
    errorMessage.style.display = 'block';
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert('Link copied to clipboard!');
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
    }
}