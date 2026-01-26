/* Import modern fonts - EXACT SAME AS PORTFOLIO */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Montserrat:wght@300;400;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap');

/* EXACT SAME CSS VARIABLES AS PORTFOLIO */
:root {
    --golden: #FFD700;
    --golden-glow: rgba(255, 215, 0, 0.9);
    --red-glow: rgba(255, 50, 50, 0.9);
    --deep-red: #B22222;
    --black: #000000;
    --darkest: #050505;
    --darker: #0a0a0a;
    --dark-bg: #0f0f0f;
    --card-bg: #121212;
    --text-bright: #ffffff;
    --text-primary: #f0f0f0;
    --text-secondary: #d0d0d0;
    --accent: #00ffff;
    --glow-intensity: 0.8;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* EXACT SAME BODY STYLING AS PORTFOLIO */
body {
    font-family: 'Montserrat', sans-serif;
    background: var(--black);
    color: var(--text-primary);
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
    line-height: 1.7;
    background-image: 
        radial-gradient(circle at 10% 20%, rgba(30, 30, 30, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(40, 40, 40, 0.1) 0%, transparent 20%);
}

/* EXACT SAME COSMIC BACKGROUND AS PORTFOLIO */
.cosmic-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -3;
    background: 
        linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0a0a0a 75%, #000000 100%);
    opacity: 0.9;
}

/* EXACT SAME GLOWING EDGES AS PORTFOLIO */
.glow-edge {
    position: fixed;
    pointer-events: none;
    z-index: -1;
    filter: brightness(1.5);
}

.glow-top {
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        var(--golden) 25%,
        var(--red-glow) 50%,
        var(--golden) 75%,
        transparent 100%);
    box-shadow: 
        0 0 30px var(--golden-glow),
        0 0 60px var(--red-glow),
        0 0 90px rgba(255, 50, 50, 0.5);
    animation: glow-pulse 3s ease-in-out infinite;
}

.glow-right {
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, 
        transparent 0%, 
        var(--red-glow) 25%,
        var(--golden) 50%,
        var(--red-glow) 75%,
        transparent 100%);
    box-shadow: 
        -10px 0 30px var(--red-glow),
        -20px 0 60px var(--golden-glow),
        -30px 0 90px rgba(255, 215, 0, 0.5);
    animation: glow-pulse 4s ease-in-out infinite reverse;
}

.glow-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        var(--golden) 25%,
        var(--red-glow) 50%,
        var(--golden) 75%,
        transparent 100%);
    box-shadow: 
        0 0 30px var(--golden-glow),
        0 0 60px var(--red-glow),
        0 0 90px rgba(255, 50, 50, 0.5);
    animation: glow-pulse 3.5s ease-in-out infinite;
}

.glow-left {
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, 
        transparent 0%, 
        var(--red-glow) 25%,
        var(--golden) 50%,
        var(--red-glow) 75%,
        transparent 100%);
    box-shadow: 
        10px 0 30px var(--red-glow),
        20px 0 60px var(--golden-glow),
        30px 0 90px rgba(255, 215, 0, 0.5);
    animation: glow-pulse 4.5s ease-in-out infinite reverse;
}

/* EXACT SAME CONTAINER STYLING AS PORTFOLIO */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 50px 20px;
    position: relative;
}

/* EXACT SAME HEADER STYLING AS PORTFOLIO */
header {
    text-align: center;
    padding: 60px 0;
    background: rgba(0, 0, 0, 0.95);
    border-radius: 15px;
    margin-bottom: 40px;
    border: 1px solid rgba(255, 215, 0, 0.1);
    box-shadow: 
        0 0 30px rgba(255, 215, 0, 0.1),
        inset 0 0 30px rgba(0, 0, 0, 0.5);
}

/* EXACT SAME LOGO STYLING AS PORTFOLIO */
.logo {
    font-family: 'Orbitron', sans-serif;
    font-size: 3.2rem;
    font-weight: 900;
    background: linear-gradient(45deg, 
        var(--golden) 0%, 
        #ff8c00 25%,
        var(--deep-red) 50%,
        #ff4500 75%,
        var(--golden) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 
        0 0 40px rgba(255, 215, 0, 0.5),
        0 0 80px rgba(255, 69, 0, 0.3);
    margin-bottom: 15px;
    letter-spacing: 1px;
}

/* EXACT SAME TAGLINE STYLING AS PORTFOLIO */
.tagline {
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-bright);
    font-size: 1.3rem;
    margin-bottom: 40px;
    letter-spacing: 2px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    font-weight: 600;
}

/* EXACT SAME CONTACT HIGHLIGHT AS PORTFOLIO */
.contact-highlight {
    display: inline-block;
    padding: 20px 40px;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 12px;
    border: 2px solid var(--golden);
    box-shadow: 
        0 0 25px var(--golden-glow),
        inset 0 0 15px rgba(255, 215, 0, 0.1);
    margin: 30px 0;
}

.contact-highlight p {
    margin: 12px 0;
    color: var(--text-bright);
    font-size: 1.1rem;
    font-weight: 600;
}

/* Dashboard Layout for Expense Tracker */
.dashboard {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 35px;
    margin-bottom: 40px;
}

@media (max-width: 1200px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
}

/* EXACT SAME SECTION STYLING AS PORTFOLIO */
section {
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(15px);
    border-radius: 18px;
    padding: 50px;
    margin: 40px 0;
    position: relative;
    border: 1px solid rgba(255, 215, 0, 0.15);
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.5),
        inset 0 0 20px rgba(0, 0, 0, 0.7);
    transition: all 0.4s ease;
}

section:hover {
    transform: translateY(-8px);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.7),
        0 0 50px rgba(255, 215, 0, 0.2),
        inset 0 0 20px rgba(0, 0, 0, 0.7);
    border-color: var(--golden);
}

/* EXACT SAME SECTION GLOW AS PORTFOLIO */
section::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 21px;
    background: linear-gradient(45deg, 
        var(--golden), 
        var(--red-glow), 
        var(--golden), 
        var(--red-glow), 
        var(--golden));
    z-index: -1;
    filter: blur(15px);
    opacity: 0.5;
    animation: section-glow 8s linear infinite;
}

/* EXACT SAME HEADING STYLING AS PORTFOLIO */
h2 {
    font-family: 'Orbitron', sans-serif;
    font-size: 2.3rem;
    color: var(--text-bright);
    margin-bottom: 35px;
    padding-bottom: 15px;
    border-bottom: 3px solid var(--golden);
    position: relative;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    font-weight: 700;
}

h2::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 150px;
    height: 3px;
    background: linear-gradient(90deg, var(--golden), var(--red-glow), var(--golden));
    box-shadow: 0 0 20px var(--golden-glow);
}

/* Expense Tracker Specific Styles */
/* Form Styles - Matching Portfolio Theme */
.form-group {
    margin-bottom: 25px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 16px;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(255, 215, 0, 0.2);
    border-radius: 10px;
    color: var(--text-bright);
    font-size: 1.1rem;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--golden);
    box-shadow: 0 0 20px var(--golden-glow);
    background: rgba(0, 0, 0, 0.9);
}

.form-group input::placeholder {
    color: var(--text-secondary);
}

.btn-add {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, var(--golden), var(--deep-red));
    color: var(--black);
    border: none;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: 700;
    font-family: 'Orbitron', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.4);
}

.btn-add:hover {
    background: linear-gradient(135deg, var(--golden-glow), var(--red-glow));
    transform: translateY(-3px);
    box-shadow: 0 0 40px var(--golden-glow);
}

.btn-add i {
    margin-right: 10px;
}

/* Summary Stats - Using Portfolio's Project Card Design */
.summary-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
}

.stat-item {
    background: linear-gradient(145deg, #0a0a0a, #111111);
    border-radius: 12px;
    padding: 25px;
    border: 1px solid rgba(255, 215, 0, 0.2);
    text-align: center;
    box-shadow: 
        0 5px 15px rgba(0, 0, 0, 0.5),
        inset 0 0 10px rgba(0, 0, 0, 0.7);
    transition: all 0.3s ease;
}

.stat-item:hover {
    transform: translateY(-5px);
    border-color: var(--golden);
    box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.7),
        0 0 30px rgba(255, 215, 0, 0.2);
}

.stat-label {
    display: block;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 900;
    color: var(--golden);
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 20px var(--golden-glow);
}

#topCategory {
    font-size: 1.3rem;
    color: var(--accent);
}

/* Expenses List - Using Portfolio's Project Card Design */
.expenses-list {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
}

.expense-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 15px;
    background: linear-gradient(145deg, #0a0a0a, #111111);
    border-radius: 12px;
    border: 1px solid rgba(255, 215, 0, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.expense-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(180deg, var(--golden), var(--red-glow), var(--golden));
    box-shadow: 0 0 20px var(--golden-glow);
}

.expense-item:hover {
    transform: translateX(5px);
    border-color: var(--golden);
    box-shadow: 
        0 5px 20px rgba(0, 0, 0, 0.7),
        0 0 30px rgba(255, 215, 0, 0.2);
}

.expense-info {
    flex: 1;
    margin-left: 15px;
}

.expense-name {
    font-weight: 600;
    color: var(--text-bright);
    font-size: 1.1rem;
    margin-bottom: 8px;
}

.expense-meta {
    display: flex;
    gap: 20px;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.expense-category {
    background: rgba(255, 215, 0, 0.1);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    border: 1px solid rgba(255, 215, 0, 0.3);
}

.expense-amount {
    font-weight: 700;
    font-size: 1.4rem;
    color: var(--golden);
    text-shadow: 0 0 10px var(--golden-glow);
    min-width: 100px;
    text-align: right;
}

.delete-btn {
    background: rgba(255, 50, 50, 0.1);
    border: 1px solid rgba(255, 50, 50, 0.3);
    color: var(--red-glow);
    cursor: pointer;
    font-size: 1.2rem;
    padding: 10px;
    border-radius: 8px;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-left: 15px;
}

.delete-btn:hover {
    background: rgba(255, 50, 50, 0.3);
    transform: scale(1.1);
    box-shadow: 0 0 20px var(--red-glow);
}

.empty-message {
    text-align: center;
    color: var(--text-secondary);
    padding: 40px 20px;
    font-style: italic;
    font-size: 1.1rem;
}

/* Chart Containers */
.chart-container {
    height: 320px;
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(255, 215, 0, 0.1);
}

/* Export Controls - Using Portfolio's Skill Tag Design */
.export-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.btn-export, .btn-clear, .btn-sample {
    padding: 18px;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    font-family: 'Orbitron', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.btn-export {
    background: linear-gradient(135deg, var(--golden), var(--deep-red));
    color: var(--black);
}

.btn-clear {
    background: linear-gradient(135deg, #ff416c, #ff4b2b);
    color: var(--text-bright);
}

.btn-sample {
    background: linear-gradient(135deg, #00b09b, #96c93d);
    color: var(--text-bright);
}

.btn-export:hover, .btn-clear:hover, .btn-sample:hover {
    transform: translateY(-5px);
    box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.7),
        0 0 30px rgba(255, 215, 0, 0.3);
}

/* EXACT SAME FOOTER STYLING AS PORTFOLIO */
footer {
    text-align: center;
    padding: 40px;
    margin-top: 80px;
    background: rgba(0, 0, 0, 0.95);
    border-top: 2px solid var(--golden);
    border-radius: 15px 15px 0 0;
    box-shadow: 0 -5px 30px rgba(255, 215, 0, 0.1);
}

footer p {
    color: var(--text-bright);
    margin: 10px 0;
    font-weight: 600;
}

.signature {
    color: var(--golden);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    letter-spacing: 1px;
    margin-top: 20px;
}

footer a {
    color: var(--golden);
    text-decoration: none;
    transition: all 0.3s ease;
}

footer a:hover {
    color: var(--accent);
    text-shadow: 0 0 20px var(--accent);
}

/* EXACT SAME PARTICLES AS PORTFOLIO */
.particle {
    position: fixed;
    pointer-events: none;
    z-index: -2;
    border-radius: 50%;
    background: var(--golden);
    box-shadow: 
        0 0 20px var(--golden-glow),
        0 0 40px var(--golden-glow);
    animation: float 25s infinite linear;
}

.particle.red {
    background: var(--red-glow);
    box-shadow: 
        0 0 20px var(--red-glow),
        0 0 40px var(--red-glow);
}

/* EXACT SAME ANIMATIONS AS PORTFOLIO */
@keyframes glow-pulse {
    0%, 100% { 
        opacity: 0.8;
        filter: brightness(1.2);
    }
    50% { 
        opacity: 1;
        filter: brightness(1.5);
    }
}

@keyframes section-glow {
    0% { 
        background-position: 0% 50%;
        opacity: 0.4;
    }
    50% { 
        background-position: 100% 50%;
        opacity: 0.7;
    }
    100% { 
        background-position: 0% 50%;
        opacity: 0.4;
    }
}

@keyframes float {
    0% {
        transform: translateY(100vh) translateX(-100px) scale(0.5);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) translateX(100px) scale(1.5);
        opacity: 0;
    }
}

/* EXACT SAME SCROLLBAR AS PORTFOLIO */
::-webkit-scrollbar {
    width: 12px;
    background: var(--black);
}

::-webkit-scrollbar-track {
    background: var(--darker);
    border-radius: 6px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(var(--golden), var(--deep-red));
    border-radius: 6px;
    border: 2px solid var(--black);
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(var(--golden-glow), var(--red-glow));
}

/* EXACT SAME RESPONSIVE DESIGN AS PORTFOLIO */
@media (max-width: 768px) {
    .container {
        padding: 20px 15px;
    }
    
    section {
        padding: 30px 20px;
        margin: 40px 0;
    }
    
    .logo {
        font-size: 2.2rem;
    }
    
    .tagline {
        font-size: 1rem;
    }
    
    .dashboard {
        grid-template-columns: 1fr;
        gap: 25px;
    }
    
    .summary-stats {
        grid-template-columns: 1fr;
    }
    
    .export-controls {
        grid-template-columns: 1fr;
    }
    
    h2 {
        font-size: 1.5rem;
    }
    
    .stat-value {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    .logo {
        font-size: 1.8rem;
    }
    
    .tagline {
        font-size: 0.9rem;
    }
    
    .contact-highlight {
        padding: 15px 20px;
    }
    
    .btn-add, .btn-export, .btn-clear, .btn-sample {
        padding: 15px;
        font-size: 1rem;
    }
}
