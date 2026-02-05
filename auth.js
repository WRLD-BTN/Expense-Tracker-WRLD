// Simple auth.js - Minimal version
class AuthSystem {
    constructor() {
        console.log('Auth System Loaded');
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    
    login(username, password) {
        // Simple login - accepts any user
        const user = { username: username, token: 'demo-token' };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        location.reload();
        return true;
    }
    
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        location.reload();
    }
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.authSystem = new AuthSystem();
    
    // Setup login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value || 'demo';
            const password = document.getElementById('password').value || 'demo';
            authSystem.login(username, password);
        });
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            authSystem.logout();
        });
    }
    
    // Show/hide based on auth
    if (authSystem.isAuthenticated()) {
        document.getElementById('loginModal').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    } else {
        document.getElementById('loginModal').style.display = 'flex';
        document.querySelector('.container').style.display = 'none';
    }
});
