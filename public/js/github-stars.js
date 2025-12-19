/**
 * GitHub Stars Real-time Tracker
 * Fetches and displays live star count from GitHub repository
 */

class GitHubStarsTracker {
    constructor(repo, updateInterval = 60000) { // Default: update every 60 seconds
        this.repo = repo; // Format: 'owner/repo'
        this.updateInterval = updateInterval;
        this.starCount = 0;
        this.intervalId = null;
        this.cache = {
            count: 0,
            timestamp: 0,
            expiresIn: 30000 // Cache for 30 seconds
        };
    }

    /**
     * Initialize the tracker
     */
    async init() {
        await this.fetchStarCount();
        this.startPolling();
        this.setupVisibilityChange();
    }

    /**
     * Fetch star count from GitHub API
     */
    async fetchStarCount() {
        try {
            // Check cache first
            const now = Date.now();
            if (this.cache.timestamp && (now - this.cache.timestamp) < this.cache.expiresIn) {
                this.updateUI(this.cache.count);
                return this.cache.count;
            }

            const response = await fetch(`https://api.github.com/repos/${this.repo}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API responded with status: ${response.status}`);
            }

            const data = await response.json();
            this.starCount = data.stargazers_count;
            
            // Update cache
            this.cache = {
                count: this.starCount,
                timestamp: now,
                expiresIn: 30000
            };

            this.updateUI(this.starCount);
            return this.starCount;
        } catch (error) {
            console.error('Error fetching GitHub stars:', error);
            // If fetch fails, show cached count or default
            if (this.cache.count > 0) {
                this.updateUI(this.cache.count);
            }
            return this.cache.count || 0;
        }
    }

    /**
     * Update UI with star count
     */
    updateUI(count) {
        const formattedCount = this.formatStarCount(count);
        const starElements = document.querySelectorAll('.github-star-count');
        
        starElements.forEach(element => {
            const oldCount = element.textContent;
            element.textContent = formattedCount;
            
            // Add animation if count changed
            if (oldCount !== formattedCount && oldCount !== '') {
                element.classList.add('star-count-updated');
                setTimeout(() => {
                    element.classList.remove('star-count-updated');
                }, 600);
            }
        });
    }

    /**
     * Format star count (e.g., 1234 -> 1.2k)
     */
    formatStarCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'k';
        }
        return count.toString();
    }

    /**
     * Start polling for updates
     */
    startPolling() {
        // Clear any existing interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // Poll for updates
        this.intervalId = setInterval(() => {
            this.fetchStarCount();
        }, this.updateInterval);
    }

    /**
     * Stop polling
     */
    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Handle page visibility changes to save API calls
     */
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopPolling();
            } else {
                // Fetch immediately when tab becomes visible
                this.fetchStarCount();
                this.startPolling();
            }
        });
    }

    /**
     * Destroy tracker and cleanup
     */
    destroy() {
        this.stopPolling();
    }
}

// Initialize tracker when DOM is ready
let githubTracker = null;

function initGitHubStars() {
    const repo = 'xthxr/piik.me';
    githubTracker = new GitHubStarsTracker(repo, 60000); // Update every 60 seconds
    githubTracker.init();
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGitHubStars);
} else {
    initGitHubStars();
}

// Export for manual control if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubStarsTracker;
}
