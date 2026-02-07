// auth.js - Complete Authentication System with User Data Storage
class AuthSystem {
    constructor() {
        console.log('🔐 Auth System Initialized');
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.initAuth();
    }
    
    // ================= PASSWORD HASHING =================
    // Simple but effective password hashing
    hashPassword(password) {
        // Create a more secure hash with salt
        const salt = 'expense-tracker-2024'; // Add your own salt
        let hash = 0;
        
        // Combine password with salt
        const saltedPassword = password + salt;
        
        // Create hash
        for (let i = 0; i < saltedPassword.length; i++) {
            const char = saltedPassword.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Add timestamp to make unique
        const timestamp = Date.now();
        return hash.toString(36) + timestamp.toString(36);
    }
    
    // Verify password
    verifyPassword(inputPassword, storedHash) {
        // For demo purposes - in production use proper hashing
        // Since we're using simple hashing, we'll create new hash and compare
        const salt = 'expense-tracker-2024';
        const saltedPassword = inputPassword + salt;
        let hash = 0;
        
        for (let i = 0; i < saltedPassword.length; i++) {
            const char = saltedPassword.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        // Extract the hash part (before timestamp)
        const inputHash = hash.toString(36);
        const storedHashPart = storedHash.substring(0, storedHash.length - 13); // Remove timestamp
        
        return inputHash === storedHashPart;
    }
    
    // ================= USER DATA STORAGE =================
    // Load users from localStorage
    loadUsers() {
        try {
            const users = localStorage.getItem('expenseTrackerUsers');
            if (users) {
                const parsed = JSON.parse(users);
                console.log('📂 Loaded users:', parsed.length);
                return parsed;
            } else {
                console.log('📂 No users found, creating demo user');
                // Create demo user
                const demoUser = {
                    id: 1,
                    username: 'demo',
                    passwordHash: this.hashPassword('demo123'),
                    expenses: [],
                    createdAt: new Date().toISOString()
                };
                return [demoUser];
            }
        } catch (error) {
            console.error('❌ Error loading users:', error);
            return [];
        }
    }
    
    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem('expenseTrackerUsers', JSON.stringify(this.users));
            console.log('💾 Users saved:', this.users.length, 'users');
            return true;
        } catch (error) {
            console.error('❌ Error saving users:', error);
            return false;
        }
    }
    
    // ================= USER REGISTRATION =================
    register(username, password) {
        console.log('🔄 Registration attempt:', username);
        
        // Input validation
        if (!username || username.trim().length < 3) {
            this.showAlert('Username must be at least 3 characters', 'error');
            return false;
        }
        
        if (!password || password.length < 6) {
            this.showAlert('Password must be at least 6 characters', 'error');
            return false;
        }
        
        const cleanUsername = username.trim();
        
        // Check if username already exists
        const existingUser = this.users.find(u => 
            u.username.toLowerCase() === cleanUsername.toLowerCase()
        );
        
        if (existingUser) {
            this.showAlert('Username already exists', 'error');
            return false;
        }
        
        // Create new user object
        const newUser = {
            id: Date.now(), // Unique ID based on timestamp
            username: cleanUsername,
            passwordHash: this.hashPassword(password),
            expenses: [], // Start with empty expenses
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        // Add to users array
        this.users.push(newUser);
        
        // Save to localStorage
        const saved = this.saveUsers();
        
        if (saved) {
            console.log('✅ User registered:', cleanUsername);
            this.showAlert('Registration successful! You can now login.', 'success');
            return true;
        } else {
            this.showAlert('Registration failed. Please try again.', 'error');
            return false;
        }
    }
    
    // ================= USER LOGIN =================
    login(username, password) {
        console.log('🔑 Login attempt:', username);
        
        // Input validation
        if (!username || !password) {
            this.showAlert('Please enter username and password', 'error');
            return false;
        }
        
        const cleanUsername = username.trim();
        
        // Find user by username
        const user = this.users.find(u => 
            u.username.toLowerCase() === cleanUsername.toLowerCase()
        );
        
        if (!user) {
            this.showAlert('User not found', 'error');
            return false;
        }
        
        // Verify password
        const passwordValid = this.verifyPassword(password, user.passwordHash);
        
        if (!passwordValid) {
            this.showAlert('Incorrect password', 'error');
            return false;
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();
        
        // Create session
        const session = {
            userId: user.id,
            username: user.username,
            token: this.generateToken(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        
        // Save session to localStorage
        localStorage.setItem('expenseTrackerSession', JSON.stringify(session));
        this.currentUser = session;
        
        console.log('✅ Login successful:', user.username);
        this.showAlert('Login successful!', 'success');
        
        // Show dashboard after delay
        setTimeout(() => {
            this.showDashboard();
        }, 1000);
        
        return true;
    }
    
    // ================= USER DATA MANAGEMENT =================
    // Get current user's expenses
    getUserExpenses() {
        if (!this.currentUser) {
            console.log('⚠️ No user logged in');
            return [];
        }
        
        const user = this.users.find(u => u.id === this.currentUser.userId);
        if (user) {
            console.log('📊 Found user expenses:', user.expenses.length);
            return user.expenses;
        }
        
        return [];
    }
    
    // Save expenses for current user
    saveUserExpenses(expenses) {
        if (!this.currentUser) {
            console.error('❌ Cannot save: No user logged in');
            return false;
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.userId);
        
        if (userIndex === -1) {
            console.error('❌ User not found');
            return false;
        }
        
        // Update user's expenses
        this.users[userIndex].expenses = expenses;
        
        // Save to localStorage
        const saved = this.saveUsers();
        
        if (saved) {
            console.log('💾 Expenses saved for user:', this.currentUser.username);
            return true;
        }
        
        return false;
    }
    
    // ================= SESSION MANAGEMENT =================
    generateToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
    
    getCurrentUser() {
        try {
            const sessionData = localStorage.getItem('expenseTrackerSession');
            
            if (!sessionData) {
                return null;
            }
            
            const session = JSON.parse(sessionData);
            
            // Check if session is expired
            if (session.expiresAt < Date.now()) {
                localStorage.removeItem('expenseTrackerSession');
                return null;
            }
            
            console.log('👤 Current user session:', session.username);
            return session;
            
        } catch (error) {
            console.error('❌ Error getting current user:', error);
            return null;
        }
    }
    
    logout() {
        console.log('👋 Logging out user:', this.currentUser?.username);
        
        // Remove session
        localStorage.removeItem('expenseTrackerSession');
        this.currentUser = null;
        
        this.showAlert('Logged out successfully', 'success');
        
        // Reload page after delay
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // ================= UI CONTROLS =================
    initAuth() {
        console.log('🖱️ Setting up auth UI...');
        
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
        
        // Modal navigation
        const showRegister = document.getElementById('showRegister');
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('register');
            });
        }
        
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
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    this.logout();
                }
            });
        }
        
        // Enter key support
        this.setupEnterKey('username', () => this.handleLogin());
        this.setupEnterKey('password', () => this.handleLogin());
        this.setupEnterKey('regUsername', () => this.handleRegister());
        this.setupEnterKey('regPassword', () => this.handleRegister());
        
        console.log('✅ Auth UI ready');
    }
    
    setupEnterKey(inputId, callback) {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    callback();
                }
            });
        }
    }
    
    handleLogin() {
        const username = document.getElementById('username')?.value || '';
        const password = document.getElementById('password')?.value || '';
        
        this.login(username, password);
    }
    
    handleRegister() {
        const username = document.getElementById('regUsername')?.value || '';
        const password = document.getElementById('regPassword')?.value || '';
        
        const success = this.register(username, password);
        
        if (success) {
            // Clear form and switch to login
            setTimeout(() => {
                this.showModal('login');
                document.getElementById('regUsername').value = '';
                document.getElementById('regPassword').value = '';
            }, 1500);
        }
    }
    
    showModal(modalType) {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        if (modalType === 'login') {
            if (loginModal) loginModal.style.display = 'flex';
            if (registerModal) registerModal.style.display = 'none';
        } else {
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'flex';
        }
    }
    
    showDashboard() {
        // Hide login modal
        this.showModal('none');
        
        // Show main content
        const container = document.querySelector('.container');
        if (container) {
            container.style.display = 'block';
        }
        
        // Show user info
        this.displayUserInfo();
        
        // Initialize expense tracker
        if (typeof initExpenseTracker === 'function') {
            setTimeout(() => {
                initExpenseTracker();
            }, 500);
        }
    }
    
    displayUserInfo() {
        if (!this.currentUser) return;
        
        const userInfoDiv = document.getElementById('userInfo');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = `
                <div class="user-avatar">${this.currentUser.username.charAt(0).toUpperCase()}</div>
                <div>
                    <div style="color: #FFD700; font-size: 1rem;">${this.currentUser.username}</div>
                    <div style="color: #d0d0d0; font-size: 0.7rem;">Expense Tracker</div>
                </div>
            `;
            userInfoDiv.style.display = 'flex';
        }
    }
    
    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existing = document.querySelector('.auth-alert');
        if (existing) existing.remove();
        
        // Create alert
        const alert = document.createElement('div');
        alert.className = `auth-alert auth-alert-${type}`;
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        alert.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Style alert
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'rgba(32, 201, 151, 0.95)' : 
                         type === 'error' ? 'rgba(220, 53, 69, 0.95)' : 
                         'rgba(0, 123, 255, 0.95)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            max-width: 400px;
            border-left: 4px solid ${type === 'success' ? '#20c997' : 
                               type === 'error' ? '#dc3545' : '#007bff'};
        `;
        
        // Add animations
        const styleId = 'auth-alert-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
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
    }
}

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing authentication system...');
    
    // Create global auth system
    window.authSystem = new AuthSystem();
    
    // Check if user is already logged in
    if (authSystem.isAuthenticated()) {
        console.log('✅ User is logged in, showing dashboard');
        authSystem.showDashboard();
    } else {
        console.log('🔒 Showing login screen');
        document.getElementById('loginModal').style.display = 'flex';
        document.querySelector('.container').style.display = 'none';
    }
    
    // Demo credentials hint
    setTimeout(() => {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput && passwordInput && 
            !usernameInput.value && !passwordInput.value) {
            usernameInput.placeholder = 'demo';
            passwordInput.placeholder = 'demo123';
        }
    }, 500);
    
    console.log('🎉 Authentication system ready!');
});
