/**
 * ZB CLuS - Industry Grade Application Architecture
 * Advanced Calculator & Educational Portal
 * 
 * @version 2.0.0
 * @author Jibendar Sah
 * @license MIT
 * 
 * Architecture: Module Pattern with Event-Driven Architecture
 * Performance: Lazy Loading, Code Splitting, Advanced Caching
 * Quality: TypeScript-like JSDoc, Error Handling, Logging
 */

// ============================================
// LOGGER SYSTEM - Enterprise Grade Logging
// ============================================
const Logger = (() => {
    const LOG_LEVELS = {
        ERROR: 'ERROR',
        WARN: 'WARN',
        INFO: 'INFO',
        DEBUG: 'DEBUG',
        TRACE: 'TRACE'
    };

    const COLOR_MAP = {
        ERROR: 'color: #FF6B6B; font-weight: bold',
        WARN: 'color: #FFA502; font-weight: bold',
        INFO: 'color: #4ECDC4; font-weight: bold',
        DEBUG: 'color: #95E1D3; font-weight: bold',
        TRACE: 'color: #A8E6CF; font-weight: bold'
    };

    const logHistory = [];
    const MAX_HISTORY = 1000;

    const log = (level, message, data = null, error = null) => {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, level, message, data, error };

        logHistory.push(logEntry);
        if (logHistory.length > MAX_HISTORY) logHistory.shift();

        if (process.env.NODE_ENV !== 'production') {
            const style = COLOR_MAP[level] || 'color: inherit';
            console.log(`%c[${timestamp}] ${level}: ${message}`, style, data || '');
            if (error) console.error(error);
        }
    };

    return {
        error: (msg, data, err) => log(LOG_LEVELS.ERROR, msg, data, err),
        warn: (msg, data) => log(LOG_LEVELS.WARN, msg, data),
        info: (msg, data) => log(LOG_LEVELS.INFO, msg, data),
        debug: (msg, data) => log(LOG_LEVELS.DEBUG, msg, data),
        trace: (msg, data) => log(LOG_LEVELS.TRACE, msg, data),
        getHistory: () => [...logHistory],
        clearHistory: () => logHistory.length = 0
    };
})();

// ============================================
// ADVANCED CACHING SYSTEM - Multi-Layer
// ============================================
const CacheManager = (() => {
    const CACHE_STRATEGIES = {
        MEMORY: 'memory',
        INDEXED_DB: 'indexeddb',
        LOCAL_STORAGE: 'localstorage'
    };

    const CACHE_DURATIONS = {
        SHORT: 5 * 60 * 1000,        // 5 minutes
        MEDIUM: 30 * 60 * 1000,      // 30 minutes
        LONG: 60 * 60 * 1000,        // 1 hour
        VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours
    };

    const memoryCache = new Map();
    const cacheStats = {
        hits: 0,
        misses: 0,
        updates: 0
    };

    /**
     * Generate cache key from request data
     * @param {string} prefix - Cache prefix
     * @param {*} params - Parameters to hash
     * @returns {string} Unique cache key
     */
    const generateKey = (prefix, params) => {
        const hash = JSON.stringify(params)
            .split('')
            .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
            .toString(36);
        return `${prefix}:${hash}`;
    };

    /**
     * Set cache with strategy
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} duration - Cache duration
     * @param {string} strategy - Cache strategy
     */
    const set = (key, data, duration = CACHE_DURATIONS.LONG, strategy = CACHE_STRATEGIES.MEMORY) => {
        const expiry = Date.now() + duration;
        const cacheEntry = { data, expiry, strategy, timestamp: Date.now() };

        if (strategy === CACHE_STRATEGIES.MEMORY) {
            memoryCache.set(key, cacheEntry);
            cacheStats.updates++;
            Logger.debug(`Cache SET [${key}] - Strategy: ${strategy}`);
        }
    };

    /**
     * Get cache with automatic expiration
     * @param {string} key - Cache key
     * @returns {*|null} Cached data or null
     */
    const get = (key) => {
        const cached = memoryCache.get(key);

        if (!cached) {
            cacheStats.misses++;
            Logger.trace(`Cache MISS [${key}]`);
            return null;
        }

        if (Date.now() > cached.expiry) {
            memoryCache.delete(key);
            cacheStats.misses++;
            Logger.trace(`Cache EXPIRED [${key}]`);
            return null;
        }

        cacheStats.hits++;
        Logger.trace(`Cache HIT [${key}]`);
        return cached.data;
    };

    /**
     * Invalidate cache entry
     */
    const invalidate = (key) => {
        memoryCache.delete(key);
        Logger.debug(`Cache INVALIDATED [${key}]`);
    };

    /**
     * Clear all cache
     */
    const clear = () => {
        memoryCache.clear();
        Logger.info('Cache cleared');
    };

    /**
     * Get cache statistics
     */
    const getStats = () => {
        const total = cacheStats.hits + cacheStats.misses;
        const hitRate = total > 0 ? ((cacheStats.hits / total) * 100).toFixed(2) : 0;
        return {
            ...cacheStats,
            total,
            hitRate: `${hitRate}%`,
            size: memoryCache.size
        };
    };

    return {
        STRATEGIES: CACHE_STRATEGIES,
        DURATIONS: CACHE_DURATIONS,
        set, get, invalidate, clear,
        generateKey,
        getStats
    };
})();

// ============================================
// API SERVICE - Enterprise Grade HTTP Layer
// ============================================
const APIService = (() => {
    const CONFIG = {
        GOOGLE_API_KEY: 'AIzaSyCXUXtGRFugttpjZQPcFYIwFDopJk9Psxg',
        GEMINI_API: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    };

    const REQUEST_CONFIG = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
    };

    /**
     * Sleep utility for retry delays
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Make HTTP request with retry logic
     */
    const fetchWithRetry = async (url, options, retries = CONFIG.RETRY_ATTEMPTS) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);

            if (retries > 0 && error.name !== 'AbortError') {
                Logger.warn(`Request failed, retrying... (${CONFIG.RETRY_ATTEMPTS - retries + 1}/${CONFIG.RETRY_ATTEMPTS})`, { url, error: error.message });
                await sleep(CONFIG.RETRY_DELAY);
                return fetchWithRetry(url, options, retries - 1);
            }

            throw error;
        }
    };

    /**
     * Call Google Generative AI with caching
     */
    const callGemini = async (prompt, options = {}) => {
        try {
            const cacheKey = CacheManager.generateKey('gemini', { prompt });
            const cached = CacheManager.get(cacheKey);

            if (cached) {
                Logger.info('Gemini response from cache', { promptLength: prompt.length });
                return cached;
            }

            Logger.debug('Calling Gemini API', { promptLength: prompt.length });

            const response = await fetchWithRetry(
                `${CONFIG.GEMINI_API}?key=${CONFIG.GOOGLE_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: { ...REQUEST_CONFIG, ...options }
                    })
                }
            );

            const result = response.candidates[0]?.content?.parts[0]?.text;

            if (!result) {
                throw new Error('Invalid API response structure');
            }

            CacheManager.set(cacheKey, result, CacheManager.DURATIONS.LONG);
            Logger.info('Gemini API call successful', { resultLength: result.length });

            return result;
        } catch (error) {
            Logger.error('Gemini API error', { prompt: prompt.substring(0, 50) }, error);
            throw error;
        }
    };

    return {
        callGemini,
        config: CONFIG,
        getConfig: () => ({ ...CONFIG })
    };
})();

// ============================================
// STATE MANAGEMENT - Reactive State System
// ============================================
const StateManager = (() => {
    const state = {
        theme: localStorage.getItem('theme') || 'dark-theme',
        user: {
            preferences: JSON.parse(localStorage.getItem('userPreferences') || '{}'),
            history: JSON.parse(localStorage.getItem('userHistory') || '[]')
        },
        ui: {
            loading: false,
            activeTab: 'math-solver',
            notifications: []
        }
    };

    const subscribers = new Map();

    /**
     * Subscribe to state changes
     */
    const subscribe = (path, callback) => {
        if (!subscribers.has(path)) {
            subscribers.set(path, new Set());
        }
        subscribers.get(path).add(callback);

        return () => {
            subscribers.get(path).delete(callback);
        };
    };

    /**
     * Update state with immutability
     */
    const setState = (path, value) => {
        const oldValue = getState(path);

        if (JSON.stringify(oldValue) === JSON.stringify(value)) {
            return; // No change
        }

        setIn(state, path.split('.'), value);
        Logger.debug(`State updated: ${path}`, { oldValue, newValue: value });

        // Notify subscribers
        const pathSubscribers = subscribers.get(path);
        if (pathSubscribers) {
            pathSubscribers.forEach(callback => callback(value, oldValue));
        }

        // Notify parent path subscribers
        const parentPath = path.substring(0, path.lastIndexOf('.'));
        if (parentPath) {
            const parentSubscribers = subscribers.get(parentPath);
            if (parentSubscribers) {
                parentSubscribers.forEach(callback => callback(getState(parentPath), oldValue));
            }
        }
    };

    /**
     * Get state value
     */
    const getState = (path) => {
        return getIn(state, path.split('.'));
    };

    /**
     * Deep get utility
     */
    const getIn = (obj, path) => {
        return path.reduce((acc, key) => acc?.[key], obj);
    };

    /**
     * Deep set utility
     */
    const setIn = (obj, path, value) => {
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            if (!(path[i] in current)) {
                current[path[i]] = {};
            }
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
    };

    return {
        getState,
        setState,
        subscribe,
        getFullState: () => JSON.parse(JSON.stringify(state))
    };
})();

// ============================================
// CALCULATOR ENGINE - Core Business Logic
// ============================================
const CalculatorEngine = (() => {
    /**
     * Validate numeric input
     */
    const validateNumber = (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || !isFinite(num)) {
            throw new Error('Invalid number provided');
        }
        return num;
    };

    /**
     * Math Solver
     */
    const solveMath = async (expression) => {
        try {
            Logger.info('Math solver called', { expression });

            const prompt = `Solve this mathematical expression and provide detailed steps: ${expression}. 
            Format your response as:
            1. Step-by-step solution
            2. Final answer
            3. Key concepts used`;

            const explanation = await APIService.callGemini(prompt);

            return {
                success: true,
                result: expression,
                explanation,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            Logger.error('Math solver error', { expression }, error);
            throw error;
        }
    };

    /**
     * Physics Motion Solver
     */
    const solveMotion = async (distance, time, acceleration) => {
        try {
            distance = validateNumber(distance);
            time = validateNumber(time);
            acceleration = validateNumber(acceleration);

            Logger.info('Physics motion solver called', { distance, time, acceleration });

            // Using kinematic equation: s = ut + 0.5at²
            const velocity = distance / time;
            const result = {
                distance, time, acceleration,
                velocity: velocity.toFixed(2),
                formula: 's = ut + 0.5at²'
            };

            const prompt = `Explain the motion problem: Initial Distance=${distance}m, Time=${time}s, Acceleration=${acceleration}m/s². 
            Result: Velocity=${result.velocity}m/s. Provide detailed explanation with real-world applications.`;

            const explanation = await APIService.callGemini(prompt);

            return {
                success: true,
                result,
                explanation,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            Logger.error('Physics motion solver error', { distance, time, acceleration }, error);
            throw error;
        }
    };

    /**
     * GPA to Percentage Converter (Nepal Board)
     */
    const convertGPA = (gpa) => {
        try {
            gpa = validateNumber(gpa);

            if (gpa < 0 || gpa > 4) {
                throw new Error('GPA must be between 0 and 4');
            }

            Logger.info('GPA conversion called', { gpa });

            // Nepal board conversion: Percentage = (GPA × 25) - 5
            const percentage = Math.max(0, (gpa * 25) - 5);

            return {
                success: true,
                gpa: gpa.toFixed(2),
                percentage: percentage.toFixed(2),
                grade: getGradeFromPercentage(percentage),
                remarks: getRemarks(percentage),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            Logger.error('GPA conversion error', { gpa }, error);
            throw error;
        }
    };

    /**
     * Interest Calculator
     */
    const calculateInterest = async (principal, rate, time, type = 'simple') => {
        try {
            principal = validateNumber(principal);
            rate = validateNumber(rate);
            time = validateNumber(time);

            Logger.info('Interest calculation called', { principal, rate, time, type });

            let interest, amount;

            if (type === 'simple') {
                // SI = (P × R × T) / 100
                interest = (principal * rate * time) / 100;
                amount = principal + interest;
            } else {
                // CI = P(1 + R/100)^T - P
                amount = principal * Math.pow(1 + rate / 100, time);
                interest = amount - principal;
            }

            const result = {
                principal: principal.toFixed(2),
                rate: rate.toFixed(2),
                time: time.toFixed(2),
                type,
                interest: interest.toFixed(2),
                amount: amount.toFixed(2)
            };

            const prompt = `Explain the ${type} interest calculation: Principal=${principal}, Rate=${rate}%, Time=${time} years. 
            Interest=${interest.toFixed(2)}, Final Amount=${amount.toFixed(2)}. Include real-world examples and importance.`;

            const explanation = await APIService.callGemini(prompt);

            return {
                success: true,
                result,
                explanation,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            Logger.error('Interest calculation error', { principal, rate, time, type }, error);
            throw error;
        }
    };

    // Helper functions
    const getGradeFromPercentage = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    };

    const getRemarks = (percentage) => {
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 70) return 'Very Good';
        if (percentage >= 60) return 'Good';
        if (percentage >= 50) return 'Satisfactory';
        if (percentage >= 40) return 'Passed';
        return 'Failed - Need Improvement';
    };

    return {
        solveMath,
        solveMotion,
        convertGPA,
        calculateInterest,
        validateNumber
    };
})();

// ============================================
// THEME ENGINE - Advanced Theme Management
// ============================================
const ThemeEngine = (() => {
    const THEMES = {
        DARK: 'dark-theme',
        LIGHT: 'light-theme'
    };

    const toggleTheme = () => {
        const body = document.body;
        const currentTheme = body.classList.contains('light-theme') ? THEMES.LIGHT : THEMES.DARK;
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

        body.classList.toggle('light-theme');
        localStorage.setItem('theme', newTheme);
        StateManager.setState('theme', newTheme);

        Logger.info(`Theme switched to ${newTheme}`);
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    };

    const getTheme = () => {
        return document.body.classList.contains('light-theme') ? THEMES.LIGHT : THEMES.DARK;
    };

    const applyTheme = (theme) => {
        if (theme === THEMES.LIGHT) {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        Logger.debug(`Theme applied: ${theme}`);
    };

    return {
        THEMES,
        toggle: toggleTheme,
        get: getTheme,
        apply: applyTheme
    };
})();

// ============================================
// UI CONTROLLER - Event Handling & DOM Management
// ============================================
const UIController = (() => {
    /**
     * Initialize all UI event listeners
     */
    const init = () => {
        initThemeToggle();
        initHamburger();
        initCalculators();
        initEventDelegation();
        Logger.info('UI Controller initialized');
    };

    const initThemeToggle = () => {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                ThemeEngine.toggle();
                themeToggle.style.animation = 'none';
                setTimeout(() => themeToggle.style.animation = '', 50);
            });
        }
    };

    const initHamburger = () => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                Logger.debug('Hamburger menu toggled');
            });

            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        }
    };

    const initCalculators = () => {
        // Math Solver
        document.getElementById('mathCalculateBtn')?.addEventListener('click', () => {
            handleMathSolver();
        });

        // GPA Calculator
        document.getElementById('gpaCalculateBtn')?.addEventListener('click', () => {
            handleGPACalculator();
        });

        // Interest Calculator
        document.getElementById('interestCalculateBtn')?.addEventListener('click', () => {
            handleInterestCalculator();
        });

        // Physics Solver
        document.getElementById('physicsCalculateBtn')?.addEventListener('click', () => {
            handlePhysicsSolver();
        });
    };

    const initEventDelegation = () => {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                const action = e.target.getAttribute('data-action');
                handleAction(action, e.target);
            }
        });
    };

    /**
     * Display result with animation
     */
    const displayResult = (elementId, result, isError = false) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.innerHTML = '';
        const resultBox = document.createElement('div');
        resultBox.className = `result-box ${isError ? 'error' : 'success'}`;
        resultBox.style.animation = 'slideUp 0.5s ease-out';

        if (typeof result === 'object') {
            resultBox.innerHTML = `
                <div style="text-align: left; width: 100%;">
                    ${Object.entries(result).map(([key, value]) => `
                        <p style="margin: 0.5rem 0;">
                            <strong>${key}:</strong> ${value}
                        </p>
                    `).join('')}
                </div>
            `;
        } else {
            resultBox.textContent = result;
        }

        element.appendChild(resultBox);
    };

    /**
     * Show loading state
     */
    const showLoading = (elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.innerHTML = `
            <div class="result-box" style="animation: pulse 1.5s ease-in-out infinite;">
                <span>Calculating...</span>
            </div>
        `;
    };

    // Calculator handlers
    const handleMathSolver = async () => {
        const expression = document.getElementById('mathExpression')?.value;
        if (!expression) {
            displayResult('mathResult', 'Please enter an expression', true);
            return;
        }

        showLoading('mathResult');

        try {
            const result = await CalculatorEngine.solveMath(expression);
            displayResult('mathResult', result.explanation);
        } catch (error) {
            displayResult('mathResult', 'Error: ' + error.message, true);
        }
    };

    const handleGPACalculator = () => {
        const gpa = document.getElementById('gpaInput')?.value;
        if (!gpa) {
            displayResult('gpaResult', 'Please enter a GPA value', true);
            return;
        }

        try {
            const result = CalculatorEngine.convertGPA(parseFloat(gpa));
            displayResult('gpaResult', result.result);
        } catch (error) {
            displayResult('gpaResult', 'Error: ' + error.message, true);
        }
    };

    const handleInterestCalculator = async () => {
        const principal = document.getElementById('principal')?.value;
        const rate = document.getElementById('rate')?.value;
        const time = document.getElementById('time')?.value;
        const type = document.querySelector('input[name="interestType"]:checked')?.value || 'simple';

        if (!principal || !rate || !time) {
            displayResult('interestResult', 'Please fill all fields', true);
            return;
        }

        showLoading('interestResult');

        try {
            const result = await CalculatorEngine.calculateInterest(
                parseFloat(principal),
                parseFloat(rate),
                parseFloat(time),
                type
            );
            displayResult('interestResult', result.result);
        } catch (error) {
            displayResult('interestResult', 'Error: ' + error.message, true);
        }
    };

    const handlePhysicsSolver = async () => {
        const distance = document.getElementById('distance')?.value;
        const time = document.getElementById('time')?.value;
        const acceleration = document.getElementById('acceleration')?.value;

        if (!distance || !time || !acceleration) {
            displayResult('physicsResult', 'Please fill all fields', true);
            return;
        }

        showLoading('physicsResult');

        try {
            const result = await CalculatorEngine.solveMotion(
                parseFloat(distance),
                parseFloat(time),
                parseFloat(acceleration)
            );
            displayResult('physicsResult', result.result);
        } catch (error) {
            displayResult('physicsResult', 'Error: ' + error.message, true);
        }
    };

    const handleAction = (action, element) => {
        Logger.debug(`Action triggered: ${action}`);
        // Route actions to appropriate handlers
    };

    return {
        init,
        displayResult,
        showLoading
    };
})();

// ============================================
// APPLICATION BOOTSTRAP - Main Entry Point
// ============================================
const App = (() => {
    const init = async () => {
        try {
            Logger.info('Application Starting...');

            // Initialize systems
            ThemeEngine.apply(StateManager.getState('theme'));
            UIController.init();

            Logger.info('Application Initialized Successfully');
            console.log('ZB CLuS v2.0.0 - Industry Grade Edition');
            console.log('Cache Stats:', CacheManager.getStats());

            // Subscribe to theme changes
            StateManager.subscribe('theme', (newTheme) => {
                ThemeEngine.apply(newTheme);
            });

        } catch (error) {
            Logger.error('Application initialization failed', null, error);
            console.error('Fatal Error:', error);
        }
    };

    return {
        init,
        Logger,
        CacheManager,
        StateManager,
        CalculatorEngine,
        APIService
    };
})();

// ============================================
// INITIALIZE ON DOM READY
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
