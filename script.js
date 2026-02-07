// Enhanced Sample Data
const sampleExpenses = [
    { id: 1, name: "Groceries", amount: 75.50, category: "food", date: "2026-01-15" },
    { id: 2, name: "Fuel", amount: 45.00, category: "transport", date: "2026-01-16" },
    { id: 3, name: "Movie Tickets", amount: 32.00, category: "entertainment", date: "2026-01-17" },
    { id: 4, name: "Electricity Bill", amount: 120.75, category: "bills", date: "2026-01-18" },
    { id: 5, name: "Gym Membership", amount: 60.00, category: "health", date: "2026-01-19" },
    { id: 6, name: "Online Course", amount: 89.99, category: "education", date: "2026-01-20" },
    { id: 7, name: "New Shoes", amount: 65.25, category: "shopping", date: "2026-01-21" },
    { id: 8, name: "Restaurant Dinner", amount: 52.40, category: "food", date: "2026-01-22" },
    { id: 9, name: "Taxi Ride", amount: 28.50, category: "transport", date: "2026-01-23" },
    { id: 10, name: "Netflix Subscription", amount: 15.99, category: "entertainment", date: "2026-01-24" }
];

// Global variables
let expenses = [];
let charts = {
    categoryChart: null,
    monthlyChart: null,
    dailyChart: null
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadExpenses();
    initializeForm();
    initializeButtons();
    updateAll();
    setDefaultDate();
});

// Set today's date as default in date input
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
}

// Load expenses from localStorage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenseTrackerData');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    }
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenseTrackerData', JSON.stringify(expenses));
}

// Initialize form submission
function initializeForm() {
    const form = document.getElementById('expenseForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('expenseName').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const date = document.getElementById('expenseDate').value;
        
        if (!name || isNaN(amount) || amount <= 0 || !category || !date) {
            showNotification('Please fill all fields correctly!', 'error');
            return;
        }
        
        const newExpense = {
            id: Date.now(),
            name: name,
            amount: amount,
            category: category,
            date: date
        };
        
        expenses.unshift(newExpense); // Add to beginning
        saveExpenses();
        updateAll();
        
        // Reset form
        form.reset();
        setDefaultDate();
        document.getElementById('expenseName').focus();
        
        showNotification('Expense added successfully!', 'success');
    });
}

// Initialize all buttons
function initializeButtons() {
    // Clear all data button
    document.getElementById('clearBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear ALL expense data? This action cannot be undone.')) {
            expenses = [];
            saveExpenses();
            updateAll();
            showNotification('All data cleared successfully!', 'info');
        }
    });
    
    // Load sample data button
    document.getElementById('sampleBtn').addEventListener('click', function() {
        expenses = [...sampleExpenses];
        saveExpenses();
        updateAll();
        showNotification('Sample data loaded successfully!', 'info');
    });
    
    // Export as CSV button
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add notification styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 100, 0, 0.9)' : type === 'error' ? 'rgba(178, 34, 34, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        border: 1px solid var(--golden);
        box-shadow: 0 0 20px ${type === 'success' ? 'rgba(0, 255, 0, 0.3)' : type === 'error' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 215, 0, 0.3)'};
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Montserrat', sans-serif;
        animation: slideIn 0.3s ease-out;
    `;
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update all UI components
function updateAll() {
    updateExpensesList();
    updateSummaryStats();
    updateCharts();
}

// Update expenses list
function updateExpensesList() {
    const container = document.getElementById('expensesList');
    
    if (expenses.length === 0) {
        container.innerHTML = '<p class="empty-message">No expenses yet. Add your first expense!</p>';
        return;
    }
    
    container.innerHTML = '';
    const recentExpenses = expenses.slice(0, 10); // Show only 10 most recent
    
    recentExpenses.forEach(expense => {
        const expenseEl = document.createElement('div');
        expenseEl.className = 'expense-item';
        expenseEl.innerHTML = `
            <div class="expense-info">
                <span class="expense-name">${expense.name}</span>
                <span class="expense-category ${expense.category}">${getCategoryEmoji(expense.category)} ${getCategoryName(expense.category)}</span>
            </div>
            <div class="expense-details">
                <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
                <span class="expense-date">${formatDate(expense.date)}</span>
                <button class="btn-delete" data-id="${expense.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(expenseEl);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteExpense(id);
        });
    });
}

// Delete an expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    updateAll();
    showNotification('Expense deleted successfully!', 'info');
}

// Update summary statistics
function updateSummaryStats() {
    if (expenses.length === 0) {
        document.getElementById('totalExpenses').textContent = '$0.00';
        document.getElementById('monthlyExpenses').textContent = '$0.00';
        document.getElementById('dailyAverage').textContent = '$0.00';
        document.getElementById('topCategory').textContent = '-';
        return;
    }
    
    // Total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('totalExpenses').textContent = `$${total.toFixed(2)}`;
    
    // Monthly expenses (current month)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyTotal = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            return sum + expense.amount;
        }
        return sum;
    }, 0);
    
    document.getElementById('monthlyExpenses').textContent = `$${monthlyTotal.toFixed(2)}`;
    
    // Daily average (based on last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= thirtyDaysAgo;
    });
    
    const recentTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const dailyAverage = recentExpenses.length > 0 ? recentTotal / 30 : 0;
    document.getElementById('dailyAverage').textContent = `$${dailyAverage.toFixed(2)}`;
    
    // Top category
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    let topCategory = '-';
    let maxAmount = 0;
    
    for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > maxAmount) {
            maxAmount = amount;
            topCategory = getCategoryName(category);
        }
    }
    
    document.getElementById('topCategory').textContent = topCategory;
}

// Update all charts
function updateCharts() {
    updateCategoryChart();
    updateMonthlyChart();
    updateDailyChart();
}

// Update category distribution chart
function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Destroy existing chart
    if (charts.categoryChart) {
        charts.categoryChart.destroy();
    }
    
    if (expenses.length === 0) {
        // Show empty state
        charts.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(100, 100, 100, 0.5)'],
                    borderColor: ['rgba(255, 215, 0, 0.5)'],
                    borderWidth: 2
                }]
            },
            options: getChartOptions('No spending data available')
        });
        return;
    }
    
    // Calculate category totals
    const categoryData = {};
    const categoryColors = {
        'food': 'rgba(255, 99, 132, 0.8)',
        'transport': 'rgba(54, 162, 235, 0.8)',
        'shopping': 'rgba(255, 206, 86, 0.8)',
        'entertainment': 'rgba(75, 192, 192, 0.8)',
        'bills': 'rgba(153, 102, 255, 0.8)',
        'health': 'rgba(255, 159, 64, 0.8)',
        'education': 'rgba(199, 199, 199, 0.8)',
        'other': 'rgba(83, 102, 255, 0.8)'
    };
    
    expenses.forEach(expense => {
        categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });
    
    const labels = Object.keys(categoryData).map(getCategoryName);
    const data = Object.values(categoryData);
    const backgroundColors = Object.keys(categoryData).map(cat => categoryColors[cat] || 'rgba(169, 169, 169, 0.8)');
    
    charts.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                borderWidth: 2,
                hoverOffset: 20
            }]
        },
        options: getChartOptions('Spending by Category')
    });
}

// Update monthly trend chart
function updateMonthlyChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    if (charts.monthlyChart) {
        charts.monthlyChart.destroy();
    }
    
    // Calculate monthly totals for last 6 months
    const monthlyData = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = 0;
    }
    
    // Populate with actual data
    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const key = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData.hasOwnProperty(key)) {
            monthlyData[key] += expense.amount;
        }
    });
    
    const labels = Object.keys(monthlyData).map(key => {
        const [year, month] = key.split('-');
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    
    const data = Object.values(monthlyData);
    
    charts.monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Spending',
                data: data,
                borderColor: 'rgba(255, 215, 0, 0.8)',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                pointBorderColor: 'rgba(0, 0, 0, 0.8)',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: getChartOptions('Monthly Spending Trend', true)
    });
}

// Update daily spending chart
function updateDailyChart() {
    const ctx = document.getElementById('dailyChart').getContext('2d');
    
    if (charts.dailyChart) {
        charts.dailyChart.destroy();
    }
    
    // Calculate daily totals for last 7 days
    const dailyData = {};
    const today = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        dailyData[key] = 0;
    }
    
    // Populate with actual data
    expenses.forEach(expense => {
        if (dailyData.hasOwnProperty(expense.date)) {
            dailyData[expense.date] += expense.amount;
        }
    });
    
    const labels = Object.keys(dailyData).map(date => {
        const d = new Date(date);
        return `${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}`;
    });
    
    const data = Object.values(dailyData);
    
    charts.dailyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Spending',
                data: data,
                backgroundColor: 'rgba(178, 34, 34, 0.8)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 2,
                borderRadius: 5,
                hoverBackgroundColor: 'rgba(255, 50, 50, 0.9)'
            }]
        },
        options: getChartOptions('Daily Spending', false)
    });
}

// Get chart options with dark theme
function getChartOptions(title, isLineChart = false) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'var(--text-primary)',
                    font: {
                        family: "'Montserrat', sans-serif",
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: title,
                color: 'var(--golden)',
                font: {
                    family: "'Orbitron', sans-serif",
                    size: 18,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: 'var(--golden)',
                bodyColor: 'var(--text-primary)',
                borderColor: 'var(--golden)',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return `$${context.parsed.toFixed(2)}`;
                    }
                }
            }
        },
        scales: isLineChart ? {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'var(--text-secondary)'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'var(--text-secondary)',
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        } : {}
    };
}

// Helper functions
function getCategoryEmoji(category) {
    const emojis = {
        'food': '🍕',
        'transport': '🚗',
        'shopping': '🛍️',
        'entertainment': '🎬',
        'bills': '💡',
        'health': '🏥',
        'education': '📚',
        'other': '📦'
    };
    return emojis[category] || '📝';
}

function getCategoryName(category) {
    const names = {
        'food': 'Food & Dining',
        'transport': 'Transport',
        'shopping': 'Shopping',
        'entertainment': 'Entertainment',
        'bills': 'Bills & Utilities',
        'health': 'Health',
        'education': 'Education',
        'other': 'Other'
    };
    return names[category] || 'Other';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Export data as CSV
function exportToCSV() {
    if (expenses.length === 0) {
        showNotification('No data to export!', 'error');
        return;
    }
    
    const headers = ['ID', 'Name', 'Amount ($)', 'Category', 'Date'];
    const csvData = [
        headers.join(','),
        ...expenses.map(expense => [
            expense.id,
            `"${expense.name}"`,
            expense.amount.toFixed(2),
            getCategoryName(expense.category),
            expense.date
        ].join(','))
    ];
    
    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data exported successfully as CSV!', 'success');
}
