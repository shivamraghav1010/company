// DOM elements
const linkForm = document.getElementById('link-form');
const originalUrlInput = document.getElementById('original-url');
const customCodeInput = document.getElementById('custom-code');
const submitBtn = document.getElementById('submit-btn');
const messageDiv = document.getElementById('message');
const linksTableBody = document.getElementById('links-tbody');
const searchInput = document.getElementById('search');

// Generate or get user ID
let userId = localStorage.getItem('tinylink_userId');
if (!userId) {
  userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  localStorage.setItem('tinylink_userId', userId);
}

// Load links on page load
document.addEventListener('DOMContentLoaded', loadLinks);

// Form submission
linkForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalUrl = originalUrlInput.value.trim();
    const customCode = customCodeInput.value.trim();

    if (!originalUrl) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    try {
        const response = await fetch('/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                originalUrl,
                shortCode: customCode || undefined,
                userId
            }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Link created successfully!', 'success');
            linkForm.reset();
            loadLinks();
        } else {
            showMessage(data.error || 'Failed to create link', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Link';
    }
});

// Search functionality
searchInput.addEventListener('input', filterLinks);

// Load all links
async function loadLinks() {
    try {
        const response = await fetch(`/api/links?userId=${encodeURIComponent(userId)}`);
        const links = await response.json();

        displayLinks(links);
    } catch (error) {
        console.error('Failed to load links:', error);
    }
}

// Display links in table
function displayLinks(links) {
    linksTableBody.innerHTML = '';

    if (links.length === 0) {
        const row = linksTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No links found';
        cell.style.textAlign = 'center';
        cell.style.padding = '2rem';
        return;
    }

    links.forEach(link => {
        const row = linksTableBody.insertRow();

        // Short code
        const codeCell = row.insertCell();
        const codeLink = document.createElement('a');
        codeLink.href = `/${link.shortCode}`;
        codeLink.textContent = link.shortCode;
        codeLink.target = '_blank';
        codeCell.appendChild(codeLink);

        // Original URL
        const urlCell = row.insertCell();
        const urlDiv = document.createElement('div');
        urlDiv.className = 'url-truncate';
        urlDiv.title = link.originalUrl;
        urlDiv.textContent = link.originalUrl;
        urlCell.appendChild(urlDiv);

        // Clicks
        const clicksCell = row.insertCell();
        clicksCell.textContent = link.clicks;

        // Last clicked
        const lastClickedCell = row.insertCell();
        lastClickedCell.textContent = link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'Never';

        // Actions
        const actionsCell = row.insertCell();
        const statsBtn = document.createElement('button');
        statsBtn.className = 'btn-small';
        statsBtn.textContent = 'Stats';
        statsBtn.onclick = () => window.location.href = `/code/${link.shortCode}`;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-small btn-copy';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => copyToClipboard(window.location.origin + '/' + link.shortCode);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-small btn-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteLink(link.shortCode);

        actionsCell.appendChild(statsBtn);
        actionsCell.appendChild(copyBtn);
        actionsCell.appendChild(deleteBtn);
    });
}

// Filter links based on search
function filterLinks() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = linksTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const code = row.cells[0]?.textContent.toLowerCase() || '';
        const url = row.cells[1]?.textContent.toLowerCase() || '';

        if (code.includes(searchTerm) || url.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showMessage('Link copied to clipboard!', 'success');
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showMessage('Link copied to clipboard!', 'success');
    }
}

// Delete link
async function deleteLink(code) {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
        const response = await fetch(`/api/links/${code}?userId=${encodeURIComponent(userId)}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showMessage('Link deleted successfully!', 'success');
            loadLinks();
        } else {
            showMessage('Failed to delete link', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}