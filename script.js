// Expense Tracker with Identical Dark Theme
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles - EXACT SAME AS PORTFOLIO
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
        
        // Add scroll effect for glow intensity - EXACT SAME AS PORTFOLIO
        setupScrollEffects();
    }

    // Setup event listeners
    function setupEventListeners() {
        expenseForm.addEventListener('submit', handleAddExpense);
        exportBtn.addEventListener('click', exportToCSV);
        clearBtn.addEventListener('click', clearAllData);
        sampleBtn.addEventListener('click', loadSampleData);
    }
