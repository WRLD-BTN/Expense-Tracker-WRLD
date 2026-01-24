// Expense Tracker with Dark Theme
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles
    createEnhancedParticles();
    
    // DOM Elements
    const expenseForm = document.getElementById('expenseForm');
    const expensesList = document.getElementById('expensesList');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const monthlyExpensesEl = document.getElementById('monthlyExpenses');
    const dailyAverageEl = document.getElementById('dailyAverage');
    const topCategoryEl = document.getElementById('topCategory');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sampleBtn = document.getElementById('sampleBtn');

    // Initialize expenses from localStorage or empty array
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Chart instances
    let categoryChart, monthlyChart, dailyChart;

    // Category colors matching the dark theme
    const categoryColors = {
        food: '#FFD700',       // Golden
        transport: '#ff8c00',  // Dark Orange
        shopping: '#B22222',   // Firebrick Red
        entertainment: '#ff4500', // Orange Red
        bills: '#00ffff',      // Cyan
        health: '#32CD32',     // Lime Green
        education: '#9370DB',  // Medium Purple
        other: '#6c757d'       // Gray
    };

    // Category icons
    const categoryIcons = {
        food: '🍕',
        transport: '🚗',
        shopping: '🛍️',
        entertainment: '🎬',
        bills: '💡',
        health: '🏥',
        education: '📚',
        other: '📦'
    };

    // Category labels
    const categoryLabels = {
        food: 'Food & Dining',
        transport: 'Transport',
        shopping: 'Shopping',
        entertainment: 'Entertainment',
        bills: 'Bills & Utilities',
        health: 'Health',
        education: 'Education',
        other: 'Other'
    };

    // Set default date to today
    document.getElementById('expenseDate').valueAsDate = new Date();

    // Initialize the app
    function initApp() {
        renderExpenses();
        updateSummary();
        initializeCharts();
        updateCharts();
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        expenseForm.addEventListener('submit', handleAddExpense);
        exportBtn.addEventListener('click', exportToCSV);
        clearBtn.addEventListener('click', clearAllData);
        sampleBtn.addEventListener('click', loadSampleData);
    }

    // Handle Add Expense
    function handleAddExpense(e) {
        e.preventDefault();
        
        const expense = {
            id: Date.now(),
            name: document.getElementById('expenseName').value.trim(),
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            date: document.getElementById('expenseDate').value
        };

        if (!expense.name || isNaN(expense.amount) || expense.amount <= 0 || !expense.category) {
            showNotification('Please fill in all fields correctly', 'warning');
            return;
        }

        expenses.push(expense);
        saveToLocalStorage();
        renderExpenses();
        updateSummary();
        updateCharts();
        
        // Reset form
        expenseForm.reset();
        document.getElementById('expenseDate').valueAsDate = new Date();
        
        // Show success feedback
        showNotification(`Added $${expense.amount.toFixed(2)} for ${expense.name}`, 'success');
    }

    // Delete Expense
    function deleteExpense(id) {
        const expense = expenses.find(e => e.id === id);
        if (expense && confirm(`Delete "${expense.name}" for $${expense.amount.toFixed(2)}?`)) {
            expenses = expenses.filter(e => e.id !== id);
            saveToLocalStorage();
            renderExpenses();
            updateSummary();
            updateCharts();
            showNotification('Expense deleted', 'danger');
        }
    }

    // Render Expenses List
    function renderExpenses() {
        if (expenses.length === 0) {
            expensesList.innerHTML = '<p class="empty-message">No expenses yet. Add your first expense!</p>';
            return;
        }

        // Sort by date (newest first)
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        expensesList.innerHTML = sortedExpenses.map(expense => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-name">${expense.name}</div>
                    <div class="expense-meta">
                        <span class="expense-date">${formatDate(expense.date)}</span>
                        <span class="expense-category">${categoryIcons[expense.category]} ${categoryLabels[expense.category]}</span>
                    </div>
                </div>
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})" title="Delete expense">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    }

    // Update Summary Statistics
    function updateSummary() {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        totalExpensesEl.textContent = `$${total.toFixed(2)}`;

        // Current month expenses
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthlyTotal = expenses.reduce((sum, exp) => {
            const expDate = new Date(exp.date);
            if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
                return sum + exp.amount;
            }
            return sum;
        }, 0);
        
        monthlyExpensesEl.textContent = `$${monthlyTotal.toFixed(2)}`;

        // Daily average (this month)
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const currentDay = now.getDate();
        const dailyAvg = monthlyTotal / currentDay;
        dailyAverageEl.textContent = `$${dailyAvg.toFixed(2)}`;

        // Top category
        const categoryTotals = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });
        
        const entries = Object.entries(categoryTotals);
        if (entries.length > 0) {
            const [topCategory, topAmount] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
            topCategoryEl.textContent = `${categoryIcons[topCategory]} ${categoryLabels[topCategory]}`;
        } else {
            topCategoryEl.textContent = '-';
        }
    }

    // Initialize Charts
    function initializeCharts() {
        // Category Distribution Chart (Doughnut)
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 3,
                    borderColor: '#000',
                    hoverBorderColor: '#FFD700',
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#fff',
                            font: {
                                family: 'Montserrat',
                                size: 12
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#FFD700',
                        bodyColor: '#fff',
                        borderColor: '#FFD700',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Monthly Trend Chart (Line)
        const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        monthlyChart = new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [],
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FFD700',
                    pointBorderColor: '#000',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 215, 0, 0.1)'
                        },
                        ticks: {
                            color: '#fff'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 215, 0, 0.1)'
                        },
                        ticks: {
                            color: '#fff',
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#FFD700',
                        bodyColor: '#fff',
                        borderColor: '#FFD700',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });

        // Daily Spending Chart (Bar)
        const dailyCtx = document.getElementById('dailyChart').getContext('2d');
        dailyChart = new Chart(dailyCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Spending',
                    data: [],
                    backgroundColor: 'rgba(255, 215, 0, 0.6)',
                    borderColor: '#FFD700',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(255, 215, 0, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 215, 0, 0.1)'
                        },
                        ticks: {
                            color: '#fff'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 215, 0, 0.1)'
                        },
                        ticks: {
                            color: '#fff',
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#FFD700',
                        bodyColor: '#fff',
                        borderColor: '#FFD700',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Update Charts with Data
    function updateCharts() {
        updateCategoryChart();
        updateMonthlyChart();
        updateDailyChart();
    }

    // Update Category Chart
    function updateCategoryChart() {
        const categoryData = {};
        
        expenses.forEach(exp => {
            categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
        });

        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);
        const colors = categories.map(cat => categoryColors[cat]);

        categoryChart.data.labels = categories.map(cat => categoryLabels[cat]);
        categoryChart.data.datasets[0].data = amounts;
        categoryChart.data.datasets[0].backgroundColor = colors;
        categoryChart.update();
    }

    // Update Monthly Chart (last 6 months)
    function updateMonthlyChart() {
        const monthlyData = {};
        const now = new Date();
        
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[key] = 0;
        }

        // Aggregate expenses by month
        expenses.forEach(exp => {
            const expDate = new Date(exp.date);
            const key = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
            
            if (monthlyData[key] !== undefined) {
                monthlyData[key] += exp.amount;
            }
        });

        const months = Object.keys(monthlyData).map(key => {
            const [year, month] = key.split('-');
            return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        });
        
        const amounts = Object.values(monthlyData);

        monthlyChart.data.labels = months;
        monthlyChart.data.datasets[0].data = amounts;
        monthlyChart.update();
    }

    // Update Daily Chart (last 7 days)
    function updateDailyChart() {
        const dailyData = {};
        const now = new Date();
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            dailyData[key] = 0;
        }

        // Aggregate expenses by day
        expenses.forEach(exp => {
            if (dailyData[exp.date] !== undefined) {
                dailyData[exp.date] += exp.amount;
            }
        });

        const days = Object.keys(dailyData).map(date => 
            new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        );
        
        const amounts = Object.values(dailyData);

        dailyChart.data.labels = days;
        dailyChart.data.datasets[0].data = amounts;
        dailyChart.update();
    }

    // Export to CSV
    function exportToCSV() {
        if (expenses.length === 0) {
            showNotification('No expenses to export', 'warning');
            return;
        }

        const headers = ['Date', 'Name', 'Category', 'Amount'];
        const csvData = expenses.map(exp => [
            exp.date,
            exp.name,
            categoryLabels[exp.category],
            `$${exp.amount.toFixed(2)}`
        ]);

        const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Expenses exported as CSV', 'success');
    }

    // Clear All Data
    function clearAllData() {
        if (expenses.length === 0) {
            showNotification('No expenses to clear', 'warning');
            return;
        }

        if (confirm('Are you sure you want to delete ALL expenses? This cannot be undone.')) {
            expenses = [];
            saveToLocalStorage();
            renderExpenses();
            updateSummary();
            updateCharts();
            showNotification('All expenses cleared', 'danger');
        }
    }

    // Load Sample Data
    function loadSampleData() {
        const sampleExpenses = [
            { id: 1, name: 'Groceries', amount: 85.50, category: 'food', date: getDateString(-2) },
            { id: 2, name: 'Gas', amount: 45.00, category: 'transport', date: getDateString(-1) },
            { id: 3, name: 'Netflix', amount: 15.99, category: 'entertainment', date: getDateString(-3) },
            { id: 4, name: 'Electricity Bill', amount: 120.75, category: 'bills', date: getDateString(-5) },
            { id: 5, name: 'Coffee', amount: 4.50, category: 'food', date: getDateString(0) },
            { id: 6, name: 'New Shoes', amount: 89.99, category: 'shopping', date: getDateString(-4) },
            { id: 7, name: 'Gym Membership', amount: 35.00, category: 'health', date: getDateString(-10) },
            { id: 8, name: 'Online Course', amount: 199.99, category: 'education', date: getDateString(-15) },
            { id: 9, name: 'Restaurant Dinner', amount: 65.25, category: 'food', date: getDateString(-1) },
            { id: 10, name: 'Uber Ride', amount: 18.75, category: 'transport', date: getDateString(0) }
        ];

        expenses = sampleExpenses;
        saveToLocalStorage();
        renderExpenses();
        updateSummary();
        updateCharts();
        showNotification('Sample data loaded', 'success');
    }

    // Helper Functions
    function saveToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    function getDateString(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() + daysAgo);
        return date.toISOString().split('T')[0];
    }

    function showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 20px 25px;
            background: ${type === 'success' ? 'rgba(32, 201, 151, 0.9)' : 
                         type === 'warning' ? 'rgba(255, 193, 7, 0.9)' : 'rgba(220, 53, 69, 0.9)'};
            color: var(--black);
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 600;
            max-width: 400px;
            border: 2px solid ${type === 'success' ? '#20c997' : 
                              type === 'warning' ? '#ffc107' : '#dc3545'};
        `;
        
        // Add CSS animations
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

    // Create floating particles
    function createEnhancedParticles() {
        const particleCount = 40;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Alternate colors
            if (i % 3 === 0) {
                particle.classList.add('red');
            }
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random size with enhanced glow
            const size = Math.random() * 6 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Enhanced glow based on size
            if (size > 6) {
                particle.style.boxShadow = 
                    `0 0 ${size*5}px var(--golden-glow), 
                     0 0 ${size*10}px var(--golden-glow)`;
            }
            
            // Random animation
            const duration = Math.random() * 30 + 15;
            const delay = Math.random() * 10;
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            
            // Random movement direction
            const xStart = Math.random() * 200 - 100;
            const xEnd = Math.random() * 200 - 100;
            
            const keyframes = `
                @keyframes float-${i} {
                    0% {
                        transform: translateY(100vh) translateX(${xStart}px) scale(0.5);
                        opacity: 0;
                    }
                    10% {
                        opacity: ${Math.random() * 0.8 + 0.2};
                    }
                    90% {
                        opacity: ${Math.random() * 0.8 + 0.2};
                    }
                    100% {
                        transform: translateY(-100px) translateX(${xEnd}px) scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            particle.style.animationName = `float-${i}`;
            document.body.appendChild(particle);
        }
    }

    // Make deleteExpense globally accessible
    window.deleteExpense = deleteExpense;

    // Initialize the application
    initApp();
});
