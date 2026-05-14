/* ============================
   ZB CLuS - JavaScript Functionality
   Google API Integration
   ============================ */

// ====== THEME TOGGLE FUNCTIONALITY ======
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const body = document.body;
    
    // Check for saved theme preference or default to 'dark-theme'
    const currentTheme = localStorage.getItem('theme') || 'dark-theme';
    
    // Apply saved theme on page load
    if (currentTheme === 'light-theme') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
    
    // Theme toggle button click handler
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        // Save preference to localStorage
        const theme = body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
        localStorage.setItem('theme', theme);
        
        // Add animation effect
        themeToggle.style.animation = 'none';
        setTimeout(() => {
            themeToggle.style.animation = '';
        }, 10);
    });
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initializeTheme);

// Google API Configuration
const GOOGLE_API_KEY = 'AIzaSyCXUXtGRFugttpjZQPcFYIwFDopJk9Psxg';
const GOOGLE_GENERATIVE_AI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// API Helper Functions
async function callGoogleGenerativeAI(prompt) {
    try {
        const response = await fetch(`${GOOGLE_GENERATIVE_AI_URL}?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Cache for API responses
const apiCache = new Map();

function getCachedResponse(key) {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
        return cached.data;
    }
    return null;
}

function setCachedResponse(key, data) {
    apiCache.set(key, { data, timestamp: Date.now() });
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
});

// Scroll to Section Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================
// MATHEMATICAL SOLVER (with AI Enhancement)
// ============================
async function solveMath() {
    const input = document.getElementById('mathInput').value.trim();
    const resultBox = document.getElementById('mathResult');

    if (!input) {
        resultBox.textContent = 'Please enter an expression';
        resultBox.className = 'result-box error';
        return;
    }

    try {
        // First try local calculation
        let expression = input
            .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
            .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)')
            .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)')
            .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)')
            .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
            .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
            .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
            .replace(/\^/g, '**');

        const result = Function('"use strict"; return (' + expression + ')')();

        if (isFinite(result)) {
            // Use AI to provide explanation
            const cacheKey = `math_${input}`;
            let explanation = getCachedResponse(cacheKey);
            
            if (!explanation) {
                const aiPrompt = `Briefly explain this mathematical calculation in one sentence: ${input} = ${result.toFixed(6)}. Keep it simple.`;
                explanation = await callGoogleGenerativeAI(aiPrompt);
                if (explanation) setCachedResponse(cacheKey, explanation);
            }

            resultBox.innerHTML = `
                <div style="width: 100%; text-align: left;">
                    <p><strong>Expression:</strong> ${input}</p>
                    <p><strong>Result:</strong> ${result.toFixed(6)}</p>
                    ${explanation ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>Explanation:</strong> ${explanation}</p>` : ''}
                </div>
            `;
            resultBox.className = 'result-box success';
        } else {
            resultBox.textContent = 'Invalid result or infinite value';
            resultBox.className = 'result-box error';
        }
    } catch (e) {
        resultBox.textContent = 'Invalid expression. Supported: +, -, *, /, ^, sqrt(), sin(), cos(), tan(), log(), ln(), abs()';
        resultBox.className = 'result-box error';
    }
}

// ============================
// PHYSICS SOLVER (with AI Enhancement)
// ============================
async function solveMotion() {
    const u = parseFloat(document.getElementById('u').value);
    const a = parseFloat(document.getElementById('a').value);
    const t = parseFloat(document.getElementById('t').value);
    const resultBox = document.getElementById('motionResult');

    if (isNaN(u) || isNaN(a) || isNaN(t)) {
        resultBox.textContent = 'Please enter all values';
        resultBox.className = 'result-box error';
        return;
    }

    // v = u + at
    const v = u + (a * t);
    const s = u * t + 0.5 * a * t * t; // displacement

    // Get AI explanation
    const cacheKey = `motion_${u}_${a}_${t}`;
    let explanation = getCachedResponse(cacheKey);
    
    if (!explanation) {
        const aiPrompt = `Explain this motion problem in one sentence: Initial velocity ${u} m/s, acceleration ${a} m/s², time ${t}s. Final velocity ${v.toFixed(2)} m/s, displacement ${s.toFixed(2)}m.`;
        explanation = await callGoogleGenerativeAI(aiPrompt);
        if (explanation) setCachedResponse(cacheKey, explanation);
    }

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Formula:</strong> v = u + at</p>
            <p><strong>Final Velocity (v):</strong> ${v.toFixed(2)} m/s</p>
            <p><strong>Displacement (s):</strong> ${s.toFixed(2)} m</p>
            ${explanation ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>Concept:</strong> ${explanation}</p>` : ''}
        </div>
    `;
    resultBox.className = 'result-box success';
}

async function solveForce() {
    const mass = parseFloat(document.getElementById('mass').value);
    const accel = parseFloat(document.getElementById('accel').value);
    const resultBox = document.getElementById('forceResult');

    if (isNaN(mass) || isNaN(accel)) {
        resultBox.textContent = 'Please enter both mass and acceleration';
        resultBox.className = 'result-box error';
        return;
    }

    // F = ma
    const force = mass * accel;

    const cacheKey = `force_${mass}_${accel}`;
    let explanation = getCachedResponse(cacheKey);
    
    if (!explanation) {
        const aiPrompt = `Explain Newton's second law (F=ma) in one sentence for mass ${mass}kg and acceleration ${accel}m/s².`;
        explanation = await callGoogleGenerativeAI(aiPrompt);
        if (explanation) setCachedResponse(cacheKey, explanation);
    }

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Formula:</strong> F = ma</p>
            <p><strong>Force:</strong> ${force.toFixed(2)} N (Newtons)</p>
            ${explanation ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>Note:</strong> ${explanation}</p>` : ''}
        </div>
    `;
    resultBox.className = 'result-box success';
}

async function solveEnergy() {
    const mass = parseFloat(document.getElementById('eMass').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    const resultBox = document.getElementById('energyResult');

    if (isNaN(mass) || isNaN(velocity)) {
        resultBox.textContent = 'Please enter both mass and velocity';
        resultBox.className = 'result-box error';
        return;
    }

    // KE = 0.5 * m * v^2
    const ke = 0.5 * mass * velocity * velocity;

    const cacheKey = `energy_${mass}_${velocity}`;
    let explanation = getCachedResponse(cacheKey);
    
    if (!explanation) {
        const aiPrompt = `Explain kinetic energy in one sentence for mass ${mass}kg and velocity ${velocity}m/s, resulting in ${ke.toFixed(2)}J.`;
        explanation = await callGoogleGenerativeAI(aiPrompt);
        if (explanation) setCachedResponse(cacheKey, explanation);
    }

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Formula:</strong> KE = ½mv²</p>
            <p><strong>Kinetic Energy:</strong> ${ke.toFixed(2)} J (Joules)</p>
            ${explanation ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>Understanding:</strong> ${explanation}</p>` : ''}
        </div>
    `;
    resultBox.className = 'result-box success';
}

// ============================
// GPA TO PERCENTAGE CALCULATOR (with AI Guidance)
// ============================
async function convertGPA() {
    const gpa = parseFloat(document.getElementById('gpaInput').value);
    const resultBox = document.getElementById('gpaResult');

    if (isNaN(gpa) || gpa < 0 || gpa > 4) {
        resultBox.textContent = 'Please enter a valid GPA between 0 and 4';
        resultBox.className = 'result-box error';
        return;
    }

    const percentage = (gpa / 4.0) * 100;

    let grade = '';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 80) grade = 'B+';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';

    // Get AI guidance
    const cacheKey = `gpa_${gpa}`;
    let guidance = getCachedResponse(cacheKey);
    
    if (!guidance) {
        const aiPrompt = `Give brief career guidance for a student with ${grade} grade (${percentage.toFixed(2)}%). Keep it to one sentence.`;
        guidance = await callGoogleGenerativeAI(aiPrompt);
        if (guidance) setCachedResponse(cacheKey, guidance);
    }

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>GPA:</strong> ${gpa.toFixed(2)}</p>
            <p><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
            <p><strong>Grade:</strong> ${grade}</p>
            ${guidance ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>Guidance:</strong> ${guidance}</p>` : ''}
            <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.8;"><em>Nepal Board System</em></p>
        </div>
    `;
    resultBox.className = 'result-box success';
}

// ============================
// TAB MANAGEMENT FUNCTIONS
// ============================
function openPhysicsTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].id === tabName || 
            (tabName === 'motion' && tabcontent[i].id === 'motion') ||
            (tabName === 'force' && tabcontent[i].id === 'force') ||
            (tabName === 'energy' && tabcontent[i].id === 'energy')) {
            // Keep open
        }
    }
    
    // Close all tabs except in physics section
    const allPhysicsTabs = document.querySelectorAll('#motion, #force, #energy');
    allPhysicsTabs.forEach(tab => tab.classList.remove('active'));
    
    const tabbuttons = evt.currentTarget.parentElement.querySelectorAll('.tab-btn');
    tabbuttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function openInterestTab(evt, tabName) {
    const tabcontent = document.querySelectorAll('#simple, #compound');
    tabcontent.forEach(tab => tab.classList.remove('active'));

    const tabbuttons = evt.currentTarget.parentElement.querySelectorAll('.tab-btn');
    tabbuttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function openMoreTab(evt, tabName) {
    const tabcontent = document.querySelectorAll('#discount, #percentage, #tax');
    tabcontent.forEach(tab => tab.classList.remove('active'));

    const tabbuttons = evt.currentTarget.parentElement.querySelectorAll('.tab-btn');
    tabbuttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// ============================
// INTEREST CALCULATOR FUNCTIONS
// ============================
async function updateCountryInfo(type) {
    const country = type === 'simple' 
        ? document.getElementById('countrySimple').value 
        : document.getElementById('countryCompound').value;

    const rates = {
        nepal: 8,
        india: 6,
        china: 3.5,
        usa: 5
    };

    const rateField = type === 'simple' 
        ? document.getElementById('rateSimple') 
        : document.getElementById('rateCompound');

    // Get AI info about country's economic system
    const cacheKey = `country_info_${country}`;
    let countryInfo = getCachedResponse(cacheKey);
    
    if (!countryInfo) {
        const aiPrompt = `Provide one sentence about ${country}'s typical bank interest rate system.`;
        countryInfo = await callGoogleGenerativeAI(aiPrompt);
        if (countryInfo) setCachedResponse(cacheKey, countryInfo);
    }

    rateField.placeholder = `Rate (% per annum) - ${country.toUpperCase()} typical: ${rates[country]}%`;
    if (countryInfo) {
        rateField.title = countryInfo;
    }
}

async function calculateSimpleInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rateSimple').value);
    const time = parseFloat(document.getElementById('timeSimple').value);
    const country = document.getElementById('countrySimple').value;
    const resultBox = document.getElementById('siResult');

    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        resultBox.textContent = 'Please enter all values';
        resultBox.className = 'result-box error';
        return;
    }

    // SI = (P * R * T) / 100
    const si = (principal * rate * time) / 100;
    const amount = principal + si;

    // Get AI comparison with other countries
    const cacheKey = `si_compare_${country}`;
    let comparison = getCachedResponse(cacheKey);
    
    if (!comparison) {
        const aiPrompt = `Compare simple interest benefits in ${country} vs other countries in one sentence.`;
        comparison = await callGoogleGenerativeAI(aiPrompt);
        if (comparison) setCachedResponse(cacheKey, comparison);
    }

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Country:</strong> ${country.toUpperCase()}</p>
            <p><strong>Formula:</strong> SI = (P × R × T) / 100</p>
            <p><strong>Principal:</strong> ${principal.toFixed(2)}</p>
            <p><strong>Rate:</strong> ${rate}% per annum</p>
            <p><strong>Time:</strong> ${time} years</p>
            <p><strong>Simple Interest:</strong> ${si.toFixed(2)}</p>
            <p style="font-weight: bold; margin-top: 0.5rem;"><strong>Total Amount:</strong> ${amount.toFixed(2)}</p>
            ${comparison ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>💡 Info:</strong> ${comparison}</p>` : ''}
        </div>
    `;
    resultBox.className = 'result-box success';
}

async function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principalCI').value);
    const rate = parseFloat(document.getElementById('rateCompound').value);
    const time = parseFloat(document.getElementById('timeCompound').value);
    const frequency = parseFloat(document.getElementById('frequency').value);
    const country = document.getElementById('countryCompound').value;
    const resultBox = document.getElementById('ciResult');

    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        resultBox.textContent = 'Please enter all values';
        resultBox.className = 'result-box error';
        return;
    }

    // A = P(1 + r/(100*n))^(n*t)
    // CI = A - P
    const r = rate / 100;
    const amount = principal * Math.pow(1 + r / frequency, frequency * time);
    const ci = amount - principal;

    // Get AI advice on compound interest
    const cacheKey = `ci_advice_${rate}`;
    let advice = getCachedResponse(cacheKey);
    
    if (!advice) {
        const aiPrompt = `Give one-line financial advice about compound interest at ${rate}% for long-term savings.`;
        advice = await callGoogleGenerativeAI(aiPrompt);
        if (advice) setCachedResponse(cacheKey, advice);
    }

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Country:</strong> ${country.toUpperCase()}</p>
            <p><strong>Formula:</strong> A = P(1 + r/(100n))^(nt)</p>
            <p><strong>Principal:</strong> ${principal.toFixed(2)}</p>
            <p><strong>Rate:</strong> ${rate}% per annum</p>
            <p><strong>Time:</strong> ${time} years</p>
            <p><strong>Compound Interest:</strong> ${ci.toFixed(2)}</p>
            <p style="font-weight: bold; margin-top: 0.5rem;"><strong>Total Amount:</strong> ${amount.toFixed(2)}</p>
            ${advice ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>💡 Advice:</strong> ${advice}</p>` : ''}
        </div>
    `;
    resultBox.className = 'result-box success';
}

// ============================
// EXAM RESULT PREDICTOR (with AI Analysis)
// ============================
async function predictExamResult() {
    const obtained = parseFloat(document.getElementById('obtainedMarks').value);
    const total = parseFloat(document.getElementById('totalMarks').value);
    const resultBox = document.getElementById('examResult');

    if (isNaN(obtained) || isNaN(total) || total <= 0) {
        resultBox.textContent = 'Please enter valid marks';
        resultBox.className = 'result-box error';
        return;
    }

    if (obtained > total) {
        resultBox.textContent = 'Obtained marks cannot exceed total marks';
        resultBox.className = 'result-box error';
        return;
    }

    const percentage = (obtained / total) * 100;

    let result = '';
    let status = '';
    if (percentage >= 90) {
        result = 'A+';
        status = 'Outstanding Performance';
    } else if (percentage >= 80) {
        result = 'A';
        status = 'Excellent Performance';
    } else if (percentage >= 70) {
        result = 'B';
        status = 'Good Performance';
    } else if (percentage >= 60) {
        result = 'C';
        status = 'Satisfactory Performance';
    } else if (percentage >= 45) {
        result = 'D';
        status = 'Pass (Need Improvement)';
    } else {
        result = 'F';
        status = 'Failed (Need to retake)';
    }

    // Get AI analysis
    const cacheKey = `exam_${obtained}_${total}`;
    let analysis = getCachedResponse(cacheKey);
    
    if (!analysis) {
        const aiPrompt = `Provide one sentence study tip for a student who scored ${percentage.toFixed(2)}% (${result} grade). Be encouraging.`;
        analysis = await callGoogleGenerativeAI(aiPrompt);
        if (analysis) setCachedResponse(cacheKey, analysis);
    }

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Obtained Marks:</strong> ${obtained} / ${total}</p>
            <p><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
            <p><strong>Grade:</strong> ${result}</p>
            <p><strong>Status:</strong> ${status}</p>
            ${analysis ? `<p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;"><strong>💡 Tip:</strong> ${analysis}</p>` : ''}
        </div>
    `;
    resultBox.className = 'result-box success';
}

// ============================
// ADDITIONAL CALCULATORS
// ============================
function openMoreTab(evt, tabName) {
    const tabcontent = document.querySelectorAll('#discount, #percentage, #tax');
    tabcontent.forEach(tab => tab.classList.remove('active'));

    const tabbuttons = document.querySelectorAll('.tabs .tab-btn');
    tabbuttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function calculateDiscount() {
    const original = parseFloat(document.getElementById('original').value);
    const discount = parseFloat(document.getElementById('discountPercent').value);
    const resultBox = document.getElementById('discountResult');

    if (isNaN(original) || isNaN(discount)) {
        resultBox.textContent = 'Please enter all values';
        resultBox.className = 'result-box error';
        return;
    }

    const discountAmount = (original * discount) / 100;
    const finalPrice = original - discountAmount;

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Original Price:</strong> ${original.toFixed(2)}</p>
            <p><strong>Discount:</strong> ${discount}%</p>
            <p><strong>Discount Amount:</strong> ${discountAmount.toFixed(2)}</p>
            <p style="font-weight: bold; margin-top: 0.5rem;"><strong>Final Price:</strong> ${finalPrice.toFixed(2)}</p>
        </div>
    `;
    resultBox.className = 'result-box success';
}

function calculatePercentage() {
    const part = parseFloat(document.getElementById('part').value);
    const whole = parseFloat(document.getElementById('whole').value);
    const resultBox = document.getElementById('percentResult');

    if (isNaN(part) || isNaN(whole) || whole === 0) {
        resultBox.textContent = 'Please enter valid values';
        resultBox.className = 'result-box error';
        return;
    }

    const percentage = (part / whole) * 100;

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Part:</strong> ${part}</p>
            <p><strong>Whole:</strong> ${whole}</p>
            <p style="font-weight: bold; margin-top: 0.5rem;"><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
        </div>
    `;
    resultBox.className = 'result-box success';
}

function calculateTax() {
    const amount = parseFloat(document.getElementById('taxAmount').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value);
    const resultBox = document.getElementById('taxResult');

    if (isNaN(amount) || isNaN(taxRate)) {
        resultBox.textContent = 'Please enter all values';
        resultBox.className = 'result-box error';
        return;
    }

    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;

    resultBox.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <p><strong>Amount:</strong> ${amount.toFixed(2)}</p>
            <p><strong>Tax Rate:</strong> ${taxRate}%</p>
            <p><strong>Tax Amount:</strong> ${taxAmount.toFixed(2)}</p>
            <p style="font-weight: bold; margin-top: 0.5rem;"><strong>Total (Amount + Tax):</strong> ${totalAmount.toFixed(2)}</p>
        </div>
    `;
    resultBox.className = 'result-box success';
}

// ============================
// WEATHER FEATURE
// ============================
function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const resultBox = document.getElementById('weatherResult');

    if (!city) {
        resultBox.textContent = 'Please enter a city name';
        resultBox.className = 'result-box error';
        return;
    }

    // Simulated weather data (static placeholder)
    const weatherData = {
        'kathmandu': {
            temp: 22,
            condition: 'Partly Cloudy',
            humidity: 65,
            wind: 8,
            pressure: 1013
        },
        'delhi': {
            temp: 35,
            condition: 'Hot & Humid',
            humidity: 70,
            wind: 5,
            pressure: 1005
        },
        'beijing': {
            temp: 18,
            condition: 'Clear Sky',
            humidity: 45,
            wind: 12,
            pressure: 1015
        },
        'new york': {
            temp: 15,
            condition: 'Cloudy',
            humidity: 60,
            wind: 10,
            pressure: 1012
        }
    };

    const data = weatherData[city.toLowerCase()];

    if (data) {
        resultBox.innerHTML = `
            <div style="width: 100%; text-align: left;">
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Temperature:</strong> ${data.temp}°C</p>
                <p><strong>Condition:</strong> ${data.condition}</p>
                <p><strong>Humidity:</strong> ${data.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind} km/h</p>
                <p><strong>Pressure:</strong> ${data.pressure} mb</p>
            </div>
        `;
        resultBox.className = 'result-box success';
    } else {
        resultBox.innerHTML = `
            <div style="width: 100%; text-align: left;">
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Temperature:</strong> 20°C</p>
                <p><strong>Condition:</strong> Partly Cloudy</p>
                <p><strong>Humidity:</strong> 65%</p>
                <p><strong>Wind Speed:</strong> 10 km/h</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;"><em>*Data is approximate</em></p>
            </div>
        `;
        resultBox.className = 'result-box success';
    }
}

// ============================
// AI WEBSITE BUILDER (Full Google API Integration)
// ============================
async function generateWebsite() {
    const prompt = document.getElementById('sitePrompt').value;
    const resultBox = document.getElementById('builderResult');

    if (!prompt) {
        resultBox.textContent = 'Please describe your website idea';
        resultBox.className = 'result-box error';
        return;
    }

    resultBox.innerHTML = '<p style="color: #666;"><i class="fas fa-spinner fa-spin"></i> Generating with AI...</p>';
    resultBox.className = 'result-box';

    // Check cache first
    const cacheKey = `website_${prompt}`;
    let aiResponse = getCachedResponse(cacheKey);

    if (!aiResponse) {
        const aiPrompt = `You are a professional web designer. Based on this idea: "${prompt}"
        
Provide a concise website structure with:
1. Suggested layout sections (max 5)
2. Color scheme recommendation (2-3 colors)
3. Key features (max 5)
4. Technology stack suggestion
5. One unique selling point

Keep response brief and actionable.`;

        aiResponse = await callGoogleGenerativeAI(aiPrompt);
        if (aiResponse) {
            setCachedResponse(cacheKey, aiResponse);
        }
    }

    if (aiResponse) {
        resultBox.innerHTML = `
            <div style="width: 100%; text-align: left;">
                <p><strong>Your Idea:</strong> ${prompt}</p>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
                    ${aiResponse.split('\n').map(line => {
                        if (line.trim()) {
                            return `<p style="margin-bottom: 0.5rem;">${line.trim()}</p>`;
                        }
                        return '';
                    }).join('')}
                </div>
            </div>
        `;
        resultBox.className = 'result-box success';
    } else {
        resultBox.innerHTML = `
            <div style="width: 100%; text-align: left;">
                <p><strong>Your Idea:</strong> ${prompt}</p>
                <p style="margin-top: 1rem;"><strong>Suggested Website Structure:</strong></p>
                <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    <li>✓ Responsive Design (Mobile-First)</li>
                    <li>✓ Modern Color Scheme</li>
                    <li>✓ SEO Optimization</li>
                    <li>✓ Contact Form Integration</li>
                    <li>✓ Social Media Links</li>
                    <li>✓ Analytics Dashboard</li>
                </ul>
            </div>
        `;
        resultBox.className = 'result-box success';
    }
}

// ============================
// FEEDBACK SUBMISSION (with AI Analysis)
// ============================
async function submitFeedback(event) {
    event.preventDefault();

    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMsg').value;

    if (!name || !email || !type || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Store feedback locally
    const feedback = {
        name: name,
        email: email,
        type: type,
        message: message,
        timestamp: new Date().toLocaleString(),
        sentiment: 'analyzing...'
    };

    // Get AI sentiment analysis
    const aiPrompt = `Analyze the sentiment of this feedback in one word (Positive/Negative/Neutral): "${message}"`;
    const sentiment = await callGoogleGenerativeAI(aiPrompt);
    feedback.sentiment = sentiment || 'Neutral';

    // Store in localStorage
    let feedbacks = JSON.parse(localStorage.getItem('zbClus_feedbacks')) || [];
    feedbacks.push(feedback);
    localStorage.setItem('zbClus_feedbacks', JSON.stringify(feedbacks));

    // Log to console for backend integration
    console.log('Feedback Submission:', feedback);

    alert(`✅ Thank you for your feedback, ${name}!\n\nType: ${type}\nEmail: ${email}\nSentiment: ${feedback.sentiment}\n\nYour message helps us improve!`);

    document.querySelector('.feedback-form').reset();
}

// ============================
// UTILITY FUNCTIONS & AI HELPERS
// ============================
async function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // AI-powered notification enhancement
    if (type === 'error') {
        const aiPrompt = `Generate a one-sentence solution for this error: "${message}". Be brief and helpful.`;
        const solution = await callGoogleGenerativeAI(aiPrompt);
        if (solution) console.log(`💡 Solution: ${solution}`);
    }
}

// AI-powered form validation
async function validateInput(input, type) {
    const cacheKey = `validation_${input}_${type}`;
    let feedback = getCachedResponse(cacheKey);
    
    if (!feedback) {
        const aiPrompt = `Check if this ${type} input is valid and provide one-word response (Valid/Invalid): "${input}"`;
        feedback = await callGoogleGenerativeAI(aiPrompt);
        if (feedback) setCachedResponse(cacheKey, feedback);
    }
    return feedback;
}

// AI-powered suggestions
async function getSuggestions(context) {
    const cacheKey = `suggestions_${context}`;
    let suggestions = getCachedResponse(cacheKey);
    
    if (!suggestions) {
        const aiPrompt = `Provide 3 helpful suggestions for: ${context}. Keep each suggestion to one sentence.`;
        suggestions = await callGoogleGenerativeAI(aiPrompt);
        if (suggestions) setCachedResponse(cacheKey, suggestions);
    }
    return suggestions;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === '/') {
        alert('ZB CLuS - Hotkeys:\nCtrl+/ : This help\nCtrl+M : Math Solver\nCtrl+P : Physics Solver\nCtrl+G : GPA Calculator');
    }
    if (event.ctrlKey && event.key === 'm') {
        document.getElementById('mathInput').focus();
    }
});

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('hover', function() {
            const tooltip = this.getAttribute('data-tooltip');
            console.log(tooltip);
        });
    });
}

// On page load
window.addEventListener('load', function() {
    console.log('ZB CLuS Loaded Successfully!');
    console.log('Version: 1.0');
    console.log('Created by: Jibendar Sah');
});

// Prevent right-click context menu (optional - comment out if not needed)
// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
//     alert('Right-click is disabled on this website!');
// });

// Performance monitoring
performance.mark('ZB_CLuS_start');
window.addEventListener('load', function() {
    performance.mark('ZB_CLuS_end');
    performance.measure('ZB_CLuS_time', 'ZB_CLuS_start', 'ZB_CLuS_end');
    const measure = performance.getEntriesByName('ZB_CLuS_time')[0];
    console.log('Page Load Time:', measure.duration.toFixed(2) + 'ms');
});

// Dark Mode Toggle (Optional Feature)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Smooth page transitions
window.addEventListener('beforeunload', function() {
    console.log('Thank you for using ZB CLuS!');
});
