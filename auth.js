// SIMPLE WORKING AUTHENTICATION SYSTEM
// auth.js - Working Authentication for Expense Tracker

class AuthSystem {
    constructor() {
        console.log('🔐 Auth System Initializing...');
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.initAuth();
    }
    
    // Load users from localStorage
    loadUsers() {
        try {
            const users = localStorage.getItem('expenseTrackerUsers');
            console.log('📂 Loading users from localStorage:', users);
            return users ? JSON.parse(users) : [
                // Default demo user
                {
                    id: 1,
                    username: 'demo',
                    password: 'demo123',
                    expenses: []
                }
            ];
        } catch (e) {
            console.error('Error loading users:', e);
            return [
                {
                    id: 1,
                    username: 'demo',
                    password: 'demo123',
                    expenses: []
                }
            ];
        }
    }
    
    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem('expenseTrackerUsers', JSON.stringify(this.users));
            console.log('💾 Users saved:', this.users.length, 'users');
        } catch (e) {
            console.error('Error saving users:', e);
        }
    }
    
    // Register new user - SIMPLE VERSION
    register(username, password) {
        console.log('🔄 Register attempt:', username);
        
        // Basic validation
        if (!username || username.length < 3) {
            this.showAlert('Username must be at least 3 characters');
            return false;
        }
        
        if (!password || password.length < 6) {
            this.showAlert('Password must be at least 6 characters');
            return false;
        }
        
        // Check if user exists
        if (this.users.find(u => u.username === username)) {
            this.showAlert('Username already exists');
            return false;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            username: username,
            password: password, // In production, hash this!
            expenses: [],
            createdAt: new Date().toISOString()
        };
        
        // Add to users
        this.users.push(newUser);
        this.saveUsers();
        
        this.showAlert('Registration successful! Please login.', 'success');
        return true;
    }
    
    // Login user - SIMPLE VERSION
    login(username, password) {
        console.log('🔑 Login attempt:', username);
        
        // Basic validation
        if (!username || !password) {
            this.showAlert('Please enter username and password');
            return false;
        }
        
        // Find user
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            // Auto-create demo user if login fails
            if (username === 'demo' && password === 'demo123') {
                const demoUser = {
                    id: 999,
                    username: 'demo',
                    password: 'demo123',
                    expenses: []
                };
                this.users.push(demoUser);
                this.saveUsers();
                this.authenticateUser(demoUser);
                return true;
            }
            this.showAlert('Invalid username or password');
            return false;
        }
        
        // Authenticate user
        this.authenticateUser(user);
        return true;
    }
    
    // Authenticate user and save session
    authenticateUser(user) {
        console.log('✅ Authenticating user:', user.username);
        
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
        
        // Show success message
        this.showAlert('Login successful!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            this.showDashboard();
        }, 1000);
    }
    
    // Generate simple token
    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    // Get current user from session
    getCurrentUser() {
        try {
            const session = localStorage.getItem('expenseTrackerSession');
            if (!session) {
                console.log('No session found');
                return null;
            }
            
            const parsed = JSON.parse(session);
            
            // Check if session expired
            if (parsed.expiresAt < Date.now()) {
                console.log('Session expired');
                localStorage.removeItem('expenseTrackerSession');
                return null;
            }
            
            console.log('Current user found:', parsed.username);
            return parsed;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }
    
    // Logout user
    logout() {
        console.log('👋 Logging out user:', this.currentUser?.username);
        localStorage.removeItem('expenseTrackerSession');
        this.currentUser = null;
        this.showAlert('Logged out successfully');
        
        // Reload page to show login screen
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        const isAuth = this.currentUser !== null;
        console.log('🔐 Authentication check:', isAuth);
        return isAuth;
    }
    
    // Get current user's expenses
    getUserExpenses() {
        if (!this.currentUser) {
            console.log('No user logged in for expenses');
            return [];
        }
        
        const user = this.users.find(u => u.id === this.currentUser.userId);
        const expenses = user ? user.expenses : [];
        console.log('📊 User expenses:', expenses.length, 'items');
        return expenses;
    }
    
    // Save expenses for current user
    saveUserExpenses(expenses) {
        if (!this.currentUser) {
            console.error('Cannot save expenses: No user logged in');
            return false;
        }
        
        console.log('💾 Saving expenses:', expenses.length, 'items');
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.userId);
        if (userIndex !== -1) {
            this.users[userIndex].expenses = expenses;
            this.saveUsers();
            return true;
        }
        
        console.error('User not found for saving expenses');
        return false;
    }
    
    // Initialize authentication UI
    initAuth() {
        console.log('🖱️ Initializing auth UI...');
        
        // Password visibility toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('password');
                if (passwordInput) {
                    const type = passwordInput.type === 'password' ? 'text' : 'password';
                    passwordInput.type = type;
                    togglePassword.classList.toggle('fa-eye');
                    togglePassword.classList.toggle('fa-eye-slash');
                }
            });
        }
        
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Login button clicked');
                this.handleLogin();
            });
        }
        
        // Register button
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Register button clicked');
                this.handleRegister();
            });
        }
        
        // Show register form
        const showRegister = document.getElementById('showRegister');
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Show register clicked');
                this.showModal('register');
            });
        }
        
        // Show login form
        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Show login clicked');
                this.showModal('login');
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Logout button clicked');
                if (confirm('Are you sure you want to logout?')) {
                    this.logout();
                }
            });
        }
        
        // Enter key for forms
        const setupEnterKey = (inputId, callback) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        callback();
                    }
                });
            }
        };
        
        setupEnterKey('username', () => this.handleLogin());
        setupEnterKey('password', () => this.handleLogin());
        setupEnterKey('regUsername', () => this.handleRegister());
        setupEnterKey('regPassword', () => this.handleRegister());
        
        console.log('✅ Auth UI initialized');
    }
    
    // Handle login
    handleLogin() {
        console.log('🔄 Handling login...');
        
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (!usernameInput || !passwordInput) {
            console.error('Login inputs not found');
            this.showAlert('Login form error. Please refresh page.');
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        console.log('Login credentials:', { username, password: '***' });
        
        if (!username || !password) {
            this.showAlert('Please enter username and password');
            return;
        }
        
        // Attempt login
        const success = this.login(username, password);
        
        if (!success) {
            // Login failed
            console.log('Login failed');
        }
    }
    
    // Handle registration
    handleRegister() {
        console.log('🔄 Handling registration...');
        
        const usernameInput = document.getElementById('regUsername');
        const passwordInput = document.getElementById('regPassword');
        
        if (!usernameInput || !passwordInput) {
            console.error('Register inputs not found');
            this.showAlert('Registration form error. Please refresh page.');
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        console.log('Register credentials:', { username, password: '***' });
        
        // Attempt registration
        const success = this.register(username, password);
        
        if (success) {
            // Switch to login modal
            setTimeout(() => {
                this.showModal('login');
                // Clear registration form
                usernameInput.value = '';
                passwordInput.value = '';
            }, 1500);
        }
    }
    
    // Show modal
    showModal(modalType) {
        console.log('Showing modal:', modalType);
        
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        if (!loginModal || !registerModal) {
            console.error('Modals not found');
            return;
        }
        
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
        console.log('Hiding modals');
        
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'none';
    }
    
    // Show dashboard
    showDashboard() {
        console.log('🎯 Showing dashboard...');
        
        // Hide modals
        this.hideModal();
        
        // Show main container
        const container = document.querySelector('.container');
        if (container) {
            container.style.display = 'block';
            console.log('📱 Container shown');
        }
        
        // Display user info
        this.displayUserInfo();
        
        // Initialize expense tracker
        if (typeof initExpenseTracker === 'function') {
            console.log('🚀 Initializing expense tracker...');
            setTimeout(() => {
                initExpenseTracker();
            }, 500);
        } else {
            console.error('initExpenseTracker function not found');
        }
    }
    
    // Display user information
    displayUserInfo() {
        if (!this.currentUser) {
            console.log('No user to display');
            return;
        }
        
        console.log('👤 Displaying user info:', this.currentUser.username);
        
        // Create or update user info display
        let userInfo = document.getElementById('userInfo');
        if (!userInfo) {
            userInfo = document.createElement('div');
            userInfo.id = 'userInfo';
            userInfo.className = 'user-info';
            
            // Add to header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(userInfo);
            }
        }
        
        userInfo.style.display = 'flex';
        userInfo.innerHTML = `
            <div class="user-avatar">${this.currentUser.username.charAt(0).toUpperCase()}</div>
            <div>
                <div style="font-size: 1rem; color: #FFD700;">${this.currentUser.username}</div>
                <div style="font-size: 0.7rem; color: #d0d0d0;">Expense Tracker</div>
            </div>
        `;
    }
    
    // Show alert/notification
    showAlert(message, type = 'info') {
        console.log(`Alert [${type}]:`, message);
        
        // Remove existing alerts
        const existing = document.querySelector('.auth-alert');
        if (existing) existing.remove();
        
        // Create alert
        const alert = document.createElement('div');
        alert.className = `auth-alert auth-alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style alert
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'rgba(32, 201, 151, 0.9)' : 
                         type === 'info' ? 'rgba(0, 123, 255, 0.9)' : 'rgba(220, 53, 69, 0.9)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            max-width: 350px;
            border-left: 4px solid ${type === 'success' ? '#20c997' : 
                               type === 'info' ? '#007bff' : '#dc3545'};
        `;
        
        // Add animation styles if not present
        if (!document.querySelector('#auth-alert-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-alert-styles';
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
        }
        
        document.body.appendChild(alert);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
        
        return alert;
    }
}

// Initialize authentication when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    // Initialize auth system
    window.authSystem = new AuthSystem();
    
    // Check if user is already logged in
    if (authSystem.isAuthenticated()) {
        console.log('✅ User already authenticated, showing dashboard');
        
        // Hide login modal
        authSystem.hideModal();
        
        // Show dashboard immediately
        authSystem.showDashboard();
    } else {
        console.log('🔒 User not authenticated, showing login');
        
        // Show login modal
        const loginModal = document.getElementById('loginModal');
        const container = document.querySelector('.container');
        
        if (loginModal) {
            loginModal.style.display = 'flex';
            console.log('👁️ Login modal shown');
        }
        
        if (container) {
            container.style.display = 'none';
            console.log('📦 Container hidden');
        }
    }
    
    // Auto-fill demo credentials for testing
    setTimeout(() => {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput && passwordInput && 
            !usernameInput.value && !passwordInput.value) {
            usernameInput.value = 'demo';
            passwordInput.value = 'demo123';
            console.log('🧪 Demo credentials auto-filled');
        }
    }, 1000);
    
    console.log('🎉 Auth System Ready!');
});

// Make auth system accessible globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}
