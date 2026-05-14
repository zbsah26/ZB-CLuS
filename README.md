# ZB CLuS - Advanced Educational Calculator & Portal

## 🎓 Overview
**ZB CLuS** is a comprehensive, all-in-one educational calculator and information platform specifically designed for Nepal's education system. It combines mathematical calculations, physics solvers, financial tools, and AI-powered assistance.

---

## ✨ Features Implemented

### 1. **Mathematical Solver** 
- Supports basic operations: +, -, *, /, ^
- Advanced functions: sqrt(), sin(), cos(), tan(), log(), ln(), abs()
- AI-powered explanations for results
- Real-time calculation with result caching

### 2. **Physics Solver**
- Motion calculations (velocity, displacement)
- Force calculations (F = ma)
- Energy calculations (Kinetic energy)
- AI-enhanced explanations for physics concepts

### 3. **GPA to Percentage Converter**
- Nepal Board grading system (NEB/SEE/+2)
- Converts GPA (0-4.0) to percentage (0-100%)
- AI-powered career guidance based on grades
- Grade scale reference included

### 4. **Interest Calculator (Multi-Country)**
- **Simple Interest**: P×R×T/100 formula
- **Compound Interest**: P(1+r/100n)^(nt) formula
- **Supported Countries**: Nepal, India, China, USA
- **Frequency Options**: Annually, Semi-Annually, Quarterly, Monthly
- AI-powered financial advice for each calculation

### 5. **Exam Result Predictor**
- NEB/SEE/+2 result prediction
- Grade assignment based on percentage
- AI-powered study tips for improvement
- Performance analysis

### 6. **Additional Calculators**
- **Discount Calculator**: Calculate discounts and final prices
- **Percentage Calculator**: Find percentage of values
- **Tax Calculator**: Calculate tax on amounts

### 7. **News & Updates Section**
- Lokasewa examination updates
- SEE result announcements
- +2 preparation resources
- Educational news feeds

### 8. **Weather Information**
- Real-time weather data display
- City-based weather search
- Global warming information
- Climate change awareness

### 9. **AI Website Builder**
- Generate website structures with AI
- Color scheme recommendations
- Technology stack suggestions
- SEO optimization tips

### 10. **Feedback System**
- User feedback collection
- AI-powered sentiment analysis
- Multiple feedback categories
- Email integration ready

### 11. **Social Media Integration**
- Facebook: [ZB CLuS Facebook](https://www.facebook.com/share/171DKrVZKx/)
- Instagram: [@zb_lyrics_01](https://www.instagram.com/zb_lyrics_01)
- WhatsApp: [Direct Chat](https://wa.me/qr/57U6A6Z6LJLQN1)
- Email: zbsah26@gmail.com

### 12. **Additional Features**
- Gorkha Patra E-Paper integration
- Sponsored content/Ads section
- 3D/2D hybrid visual design
- Responsive mobile design
- Dark mode ready
- Caching system for API responses

---

## 🚀 Google API Integration

### Configuration
```javascript
const GOOGLE_API_KEY = 'AIzaSyCXUXtGRFugttpjZQPcFYIwFDopJk9Psxg';
const GOOGLE_GENERATIVE_AI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

### API Features Used
1. **Mathematical Solver**: AI explanations for calculations
2. **Physics Solver**: AI explanations for physics concepts
3. **GPA Calculator**: AI career guidance
4. **Interest Calculator**: AI financial comparisons and advice
5. **Exam Result Predictor**: AI study tips
6. **AI Website Builder**: Full AI-powered website generation
7. **Feedback System**: AI sentiment analysis
8. **General Utilities**: AI input validation and suggestions

### Caching System
- Responses cached for 1 hour
- Reduces API calls for repeated queries
- Improves performance and user experience
- localStorage integration for persistent data

---

## 📁 Project Structure

```
zb-clus/
├── index.html          # Main HTML structure
├── styles.css          # 3D/2D hybrid styling
├── script.js           # JavaScript functionality with AI integration
└── README.md           # This file
```

---

## 💻 Installation & Setup

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls
- No server required (runs entirely in browser)

### Quick Start
1. Download all three files: `index.html`, `styles.css`, `script.js`
2. Place them in the same directory
3. Open `index.html` in your web browser
4. Start using the calculators!

### Running Locally
```bash
# Option 1: Python HTTP Server
python -m http.server 8000

# Option 2: Node.js http-server
npx http-server

# Option 3: PHP Built-in Server
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

## 🔐 Security Notes

### ⚠️ Important
The Google API key is exposed in the frontend code. For **production use**, consider:

1. **Backend Implementation**: Use a backend server to handle API calls
2. **Environment Variables**: Store API key in server environment
3. **Proxy Server**: Route API calls through your backend
4. **API Key Rotation**: Rotate keys regularly
5. **Rate Limiting**: Implement server-side rate limiting

### Example Backend Integration (Node.js/Express)
```javascript
// Backend route
app.post('/api/calculate', async (req, res) => {
    const { prompt } = req.body;
    const result = await callGoogleGenerativeAI(prompt);
    res.json({ result });
});

// Frontend call
const response = await fetch('/api/calculate', {
    method: 'POST',
    body: JSON.stringify({ prompt: userInput })
});
```

---

## 🎨 Design Features

### 3D/2D Hybrid Design
- Floating 3D objects (cube, sphere, pyramid)
- Glass morphism effects
- Smooth animations and transitions
- Gradient backgrounds

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop optimization
- Hamburger menu for mobile navigation

### Color Scheme
- Primary: Purple (#6C5CE7)
- Secondary: Green (#00B894)
- Accent: Red (#FF6B6B)
- Warning: Yellow (#FDCB6E)

---

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

---

## 🔧 Key Functions

### Math Solver
```javascript
solveMath() // Calculate mathematical expressions with AI explanations
```

### Physics Solver
```javascript
solveMotion()    // Calculate motion (v = u + at)
solveForce()     // Calculate force (F = ma)
solveEnergy()    // Calculate kinetic energy (KE = ½mv²)
```

### Financial Calculators
```javascript
calculateSimpleInterest()    // SI = (P × R × T) / 100
calculateCompoundInterest()  // A = P(1 + r/100n)^(nt)
calculateDiscount()          // Calculate discount amounts
calculateTax()               // Calculate tax on amounts
```

### AI Features
```javascript
callGoogleGenerativeAI(prompt)  // Call Google Generative AI API
getCachedResponse(key)           // Get cached API response
setCachedResponse(key, data)     // Cache API response
```

---

## 📊 API Response Examples

### Math Solver
**Input**: `2+3*4`
**Response**: 
```
Result: 14
Explanation: This expression follows order of operations (PEMDAS), multiplying first then adding.
```

### Physics Solver
**Input**: u=10, a=2, t=5
**Response**:
```
Final Velocity: 20 m/s
Displacement: 100 m
Concept: An object starting at 10 m/s accelerating at 2 m/s² for 5 seconds reaches 20 m/s.
```

### GPA Converter
**Input**: 3.5 GPA
**Response**:
```
Percentage: 87.5%
Grade: A
Guidance: Focus on maintaining consistent performance in advanced subjects.
```

---

## 🎯 Usage Examples

### Calculate Mathematical Expression
1. Go to "Mathematical Numerical Solver"
2. Enter expression: `sqrt(16) + 5 * 2`
3. Click "Calculate"
4. View result with AI explanation

### Calculate Physics Problem
1. Go to "Physics Numerical Solver"
2. Select "Motion" tab
3. Enter: u=5, a=3, t=2
4. Click "Calculate"
5. Get velocity, displacement, and concept explanation

### Convert GPA to Percentage
1. Go to "GPA to Percentage Calculator"
2. Enter GPA: 3.8
3. Click "Convert"
4. View percentage and career guidance

### Calculate Compound Interest
1. Go to "Interest Calculator"
2. Select "Compound Interest"
3. Select country (Nepal)
4. Enter: Principal=10000, Rate=8%, Time=5, Frequency=Annually
5. Click "Calculate CI"
6. View results with financial advice

---

## 📞 Contact & Support

- **Email**: zbsah26@gmail.com
- **Facebook**: [ZB CLuS](https://www.facebook.com/share/171DKrVZKx/)
- **Instagram**: [@zb_lyrics_01](https://www.instagram.com/zb_lyrics_01)
- **WhatsApp**: [Chat Now](https://wa.me/qr/57U6A6Z6LJLQN1)

---

## 👨‍💻 Developer Information

**Created by**: Jibendar Sah
**Website**: ZB CLuS - Advanced Calculator & Educational Portal
**License**: © 2024 ZB CLuS. All Rights Reserved.

---

## 🗺️ Roadmap

### Planned Features
- [ ] Voice input for calculations
- [ ] Offline mode with service workers
- [ ] Multiple language support (Nepali, English, Hindi)
- [ ] Advanced graphing capabilities
- [ ] Integration with educational APIs
- [ ] User accounts and progress tracking
- [ ] Mobile app development
- [ ] Real-time collaboration features

---

## 🐛 Troubleshooting

### API Not Responding
- Check internet connection
- Verify API key is valid
- Check browser console for errors
- Try clearing browser cache

### Calculations Not Working
- Ensure all required fields are filled
- Check for valid input formats
- Try refreshing the page
- Test in different browser

### Mobile Issues
- Enable JavaScript
- Clear browser cache
- Try landscape orientation
- Update to latest browser version

---

## 📚 Learning Resources

### Supported Topics
- **Mathematics**: Algebra, Trigonometry, Logarithms
- **Physics**: Motion, Force, Energy, Work
- **Finance**: Simple Interest, Compound Interest
- **Education**: GPA Conversion, Grade Calculation
- **Exam Preparation**: NEB, SEE, +2 Exams

---

## 💡 Tips & Tricks

1. **Use Cache**: Repeated calculations use cached responses
2. **Keyboard Shortcuts**: Ctrl+/ for help (when implemented)
3. **Mobile First**: Best experience on mobile devices
4. **Feedback**: Send feedback to help us improve
5. **Share**: Share with friends for educational purposes

---

## 📋 Changelog

### Version 1.0 (Current)
- ✅ All calculator features implemented
- ✅ Google API integration complete
- ✅ AI explanations for all solvers
- ✅ Responsive design implemented
- ✅ Caching system working
- ✅ Feedback system integrated
- ✅ Social media integration complete

---

## 📄 License & Copyright

```
© 2024 ZB CLuS. All Rights Reserved.
Created by: Jibendar Sah
Website: ZB CLuS Advanced Calculator & Educational Portal
```

This project is for educational purposes. Use responsibly.

---

## 🙏 Acknowledgments

- Built with HTML5, CSS3, and Vanilla JavaScript
- Powered by Google Generative AI (Gemini)
- Designed for Nepal's Education System
- Inspired by educational needs of students

---

## 📞 Get Help

Having trouble? Contact us:
- 📧 Email: zbsah26@gmail.com
- 💬 WhatsApp: [Chat with us](https://wa.me/qr/57U6A6Z6LJLQN1)
- 👍 Facebook: [Message us](https://www.facebook.com/share/171DKrVZKx/)

---

**Happy Calculating! 🎓📐📊**
