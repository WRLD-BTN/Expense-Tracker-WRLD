// ========== ADD THESE FUNCTIONS TO YOUR EXISTING script.js ==========

// Load user-specific expenses
function loadUserExpenses() {
    if (window.authSystem && authSystem.isAuthenticated()) {
        expenses = authSystem.getUserExpenses();
        renderExpenses();
        updateSummary();
        updateCharts();
    }
}

// Modified save function
function saveToLocalStorage() {
    if (window.authSystem && authSystem.isAuthenticated()) {
        authSystem.saveUserExpenses(expenses);
    }
    // Keep backup
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Modified handleAddExpense function
function handleAddExpense(e) {
    e.preventDefault();
    
    // Check authentication
    if (!window.authSystem || !authSystem.isAuthenticated()) {
        alert('Please login to add expenses');
        return;
    }
    
    const expense = {
        id: Date.now(),
        name: document.getElementById('expenseName').value.trim(),
        amount: parseFloat(document.getElementById('expenseAmount').value),
        category: document.getElementById('expenseCategory').value,
        date: document.getElementById('expenseDate').value,
        userId: authSystem.currentUser.userId
    };

    if (!expense.name || isNaN(expense.amount) || expense.amount <= 0 || !expense.category) {
        alert('Please fill in all fields correctly');
        return;
    }

    expenses.push(expense);
    saveToLocalStorage();
    renderExpenses();
    updateSummary();
    updateCharts();
    
    expenseForm.reset();
    document.getElementById('expenseDate').valueAsDate = new Date();
    
    alert(`Added $${expense.amount.toFixed(2)} for ${expense.name}`);
}

// Modified deleteExpense function
function deleteExpense(id) {
    if (!window.authSystem || !authSystem.isAuthenticated()) {
        alert('Please login to delete expenses');
        return;
    }
    
    const expense = expenses.find(e => e.id === id);
    if (expense && confirm(`Delete "${expense.name}" for $${expense.amount.toFixed(2)}?`)) {
        expenses = expenses.filter(e => e.id !== id);
        saveToLocalStorage();
        renderExpenses();
        updateSummary();
        updateCharts();
        alert('Expense deleted');
    }
}

// Modified export function
function exportToCSV() {
    if (!window.authSystem || !authSystem.isAuthenticated()) {
        alert('Please login to export data');
        return;
    }
    
    if (expenses.length === 0) {
        alert('No expenses to export');
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
    
    alert('Expenses exported as CSV');
}

// Modified clear function
function clearAllData() {
    if (!window.authSystem || !authSystem.isAuthenticated()) {
        alert('Please login to clear data');
        return;
    }
    
    if (expenses.length === 0) {
        alert('No expenses to clear');
        return;
    }

    if (confirm('Are you sure you want to delete ALL expenses? This cannot be undone.')) {
        expenses = [];
        saveToLocalStorage();
        renderExpenses();
        updateSummary();
        updateCharts();
        alert('All expenses cleared');
    }
}

// Modified sample data function
function loadSampleData() {
    if (!window.authSystem || !authSystem.isAuthenticated()) {
        alert('Please login to load sample data');
        return;
    }
    
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
    alert('Sample data loaded');
    
}
