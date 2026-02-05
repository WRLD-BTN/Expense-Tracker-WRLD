// auth.js - Authentication System for Expense Tracker
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.initAuth();
    }
    
    // Simple password hashing (for demo - use bcrypt in production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36) + Date.now().toString(36);
    }
    
    // Load users from localStorage
    loadUsers() {
        try {
            const users = localStorage.getItem('expenseTrackerUsers');
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error('Error loading users:', e);
            return [];
        }
    }
    
    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem('expenseTrackerUsers', JSON.stringify(this.users));
        } catch (e) {
            console.error('Error saving users:', e);
        }
    }
    
    // Register new user
    register(username, password) {
        // Validate input
        if (!username || username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters' };
        }
        
        if (!password || password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }
        
        // Check if user already exists
        if (this.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Username already exists' };
        }
        
        // Create new user
        const user = {
            id: Date.now(),
            username: username,
            passwordHash: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            expenses: []
        };
        
        // Add to users array and save
        this.users.push(user);
        this.saveUsers();
        
        return { 
            success: true, 
            message: 'Registration successful! Please login.' 
        };
    }
    
    // Login user
    login(username, password) {
        // Find user
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        // Verify password
        const inputHash = this.hashPassword(password);
        if (user.passwordHash !== inputHash) {
            return { success: false, message: 'Incorrect password' };
        }
        
        // Create session
        const session = {
            userId: user.id,
            username: user.username,
            token: this.generateToken(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        // Save session
        localStorage.setItem('expenseTrackerSession', JSON.stringify(session));
        this.currentUser = session;
        
        return { 
            success: true, 
            message: 'Login successful!', 
            user: session 
        };
    }
    
    // Generate token
    generateToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
    
    // Get current user from session
    getCurrentUser() {
        try {
            const session = localStorage.getItem('expenseTrackerSession');
            if (!session) return null;
            
            const parsed = JSON.parse(session);
            
            // Check if session expired
            if (parsed.expiresAt < Date.now()) {
                this.logout();
                return null;
            }
            
            return parsed;
        } catch (e) {
            return null;
        }
    }
    
    // Logout user
    logout() {
        localStorage.removeItem('expenseTrackerSession');
        this.currentUser = null;
        location.reload();
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // Get current user's expenses
    getUserExpenses() {
        if (!this.currentUser) return [];
        
        const user = this.users.find(u => u.id === this.currentUser.userId);
        return user ? user.expenses : [];
    }
    
    // Save expenses for current user
    saveUserExpenses(expenses) {
        if (!this.currentUser) return false;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.userId);
        if (userIndex !== -1) {
            this.users[userIndex].expenses = expenses;
            this.saveUsers();
            return true;
        }
        return false;
    }
    
    // Initialize authentication UI
    initAuth() {
        // Password visibility toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('password');
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                togglePassword.classList.toggle('fa-eye');
                togglePassword.classList.toggle('fa-eye-slash');
            });
        }
        
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Register button
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        
        // Show register form
        const showRegister = document.getElementById('showRegister');
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('register');
            });
        }
        
        // Show login form
        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('login');
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    this.logout();
                }
            });
        }
        
        // Enter key for login
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
    }
    
    // Handle login
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showNotification('Please fill in all fields', 'warning');
            return;
        }
        
        const result = this.login(username, password);
        
        if (result.success) {
            this.showNotification(result.message, 'success');
            setTimeout(() => {
                this.hideModal();
                this.showDashboard();
            }, 1000);
        } else {
            this.showNotification(result.message, 'danger');
        }
    }
    
    // Handle registration
    handleRegister() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        
        if (!username || !password) {
            this.showNotification('Please fill in all fields', 'warning');
            return;
        }
        
        const result = this.register(username, password);
        
        if (result.success) {
            this.showNotification(result.message, 'success');
            setTimeout(() => {
                this.showModal('login');
                // Clear registration form
                document.getElementById('regUsername').value = '';
                document.getElementById('regPassword').value = '';
            }, 1500);
        } else {
            this.showNotification(result.message, 'danger');
        }
    }
    
    // Show modal
    showModal(modalType) {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        if (modalType === 'login') {
            loginModal.style.display = 'flex';
            registerModal.style.display = 'none';
        } else if (modalType === 'register') {
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        }
    }
    
    // Hide modal
    hideModal() {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    }
    
    // Show dashboard
    showDashboard() {
        // Show main container
        const container = document.querySelector('.container');
        if (container) {
            container.style.display = 'block';
        }
        
        // Display user info
        this.displayUserInfo();
        
        // Initialize expense tracker
        if (typeof initExpenseTracker === 'function') {
            initExpenseTracker();
        }
    }
    
    // Display user information
    displayUserInfo() {
        if (!this.currentUser) return;
        
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.style.display = 'flex';
            userInfo.innerHTML = `
                <div class="user-avatar">${this.currentUser.username.charAt(0).toUpperCase()}</div>
                <div>
                    <div style="font-size: 1rem; color: var(--golden);">${this.currentUser.username}</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">Active User</div>
                </div>
            `;
        }
    }
    
    // Show notification
    showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'rgba(32, 201, 151, 0.9)' : 
                         type === 'warning' ? 'rgba(255, 193, 7, 0.9)' : 'rgba(220, 53, 69, 0.9)'};
            color: #000;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            max-width: 350px;
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize authentication when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth system
    window.authSystem = new AuthSystem();
    
    // Check if user is already logged in
    if (authSystem.isAuthenticated()) {
        // Hide login modal
        authSystem.hideModal();
        
        // Show dashboard
        setTimeout(() => {
            authSystem.showDashboard();
        }, 500);
    } else {
        // Show login modal
        document.getElementById('loginModal').style.display = 'flex';
        document.querySelector('.container').style.display = 'none';
    }
    
    // Log initialization
    console.log('🔐 Auth System Initialized');
    console.log('👤 Current User:', authSystem.currentUser);
});
