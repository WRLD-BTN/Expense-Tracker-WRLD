// Expense Tracker with Ultra Dark Theme
document.addEventListener('DOMContentLoaded', function() {
    // Initialize floating dollar signs
    createFloatingDollars();
    
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

    // High contrast colors for dark background
    const categoryColors = [
        '#FFD700',    // Golden
        '#ff8c00',    // Dark Orange
        '#B22222',    // Firebrick Red
        '#ff4500',    // Orange Red
        '#00ffff',    // Cyan
        '#32CD32',    // Lime Green
        '#9370DB',    // Medium Purple
        '#FF69B4',    // Hot Pink
        '#00CED1',    // Dark Turquoise
        '#FF6347'     // Tomato
    ];

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
        
        // Add pulsing effect for edges
        setupGlowEffects();
    }

    // Create floating dollar signs
    function createFloatingDollars() {
        const container = document.getElementById('floatingDollars');
        const dollarCount = 25;
        
        for (let i = 0; i < dollarCount; i++) {
            const dollar = document.createElement('div');
            dollar.classList.add('dollar-sign');
            
            // Alternate colors
            if (i % 3 === 0) {
                dollar.classList.add('red');
            }
            
            // Random position
            dollar.style.left = Math.random() * 100 + '%';
            dollar.style.top = Math.random() * 100 + '%';
            
            // Random size
            const size = Math.random() * 2 + 1;
            dollar.style.fontSize = size + 'rem';
            
            // Random animation
            const duration = Math.random() * 30 +
