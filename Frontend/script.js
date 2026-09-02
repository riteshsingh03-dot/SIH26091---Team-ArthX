// ==========================================
// CONFIGURATION & DICTIONARY
// ==========================================
const API_BASE_URL = "http://localhost:5000/api";

const i18n = {
  en: {
    tagline: "Smart business funding, in plain words",
    heroTitle: "Turn your savings into a funded business plan.",
    heroSub: "Tell us your location and available cash. We calculate your total budget, map local competitors, and match you with government schemes.",
    flowTitle: "How ArthSetu Works", flow1: "Input Details & Margin Capital", flow2: "AI Analyzes Market & Calculates Loan", flow3: "Get Scheme Match & EMI Plan",
    chatTitle: "Talk to our AI Assistant", chatGreeting: "Hello! Tell me about your business idea and how much money you have to start.", sendBtn: "Send",
    wizardTitle: "Or enter details manually", q1: "1. Area Type", ruralBtn: "Village / Rural", urbanBtn: "Town / City",
    q2: "2. Business Category", catDairy: "Dairy Farming", catTailor: "Tailoring", catGrocery: "Grocery Store",
    q3: "3. Your Margin Capital (₹)", calcBtn: "Generate AI Report",
    reportTitle: "Your Business & Financial Report", downloadBtn: "📄 Download / Print", errorServer: "Could not connect to the server."
  },
  hi: {
    tagline: "स्मार्ट व्यापार फंडिंग, सरल शब्दों में",
    heroTitle: "अपनी बचत को एक वित्तपोषित व्यवसाय योजना में बदलें।",
    heroSub: "हमें अपना स्थान और उपलब्ध नकद बताएं। हम आपके कुल बजट की गणना करते हैं और आपको सरकारी योजनाओं से मिलाते हैं।",
    flowTitle: "अर्थसेतु कैसे काम करता है", flow1: "विवरण और मार्जिन पूंजी दर्ज करें", flow2: "AI बाजार का विश्लेषण करता है", flow3: "योजना और EMI प्राप्त करें",
    chatTitle: "हमारे AI सहायक से बात करें", chatGreeting: "नमस्ते! मुझे अपने व्यावसायिक विचार और आपके बजट के बारे में बताएं।", sendBtn: "भेजें",
    wizardTitle: "या मैन्युअल रूप से विवरण दर्ज करें", q1: "1. क्षेत्र का प्रकार", ruralBtn: "गांव / ग्रामीण", urbanBtn: "शहर / नगर",
    q2: "2. व्यवसाय श्रेणी", catDairy: "डेयरी फार्मिंग", catTailor: "सिलाई", catGrocery: "किराने की दुकान",
    q3: "3. आपकी मार्जिन पूंजी (₹)", calcBtn: "AI रिपोर्ट जनरेट करें",
    reportTitle: "आपकी व्यावसायिक और वित्तीय रिपोर्ट", downloadBtn: "📄 डाउनलोड / प्रिंट करें", errorServer: "सर्वर से कनेक्ट नहीं हो सका।"
  },
  // ADD BENGALI (bn), MARATHI (mr), TELUGU (te), TAMIL (ta) mappings here following the exact same keys
};

let currentLang = 'en';
const profile = { rural: true, category: 'dairy', marginCapital: null };

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  setupLanguage();
  setupUI();
  setupVoice();
});

function setupLanguage() {
  const langSelect = document.getElementById("langSelect");
  langSelect.addEventListener("change", (e) => {
    currentLang = e.target.value;
    updateLanguage(currentLang);
  });
}

function updateLanguage(lang) {
  if (!i18n[lang]) return; // Fallback if lang dict is missing
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key]) {
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = i18n[lang][key];
      else el.innerHTML = i18n[lang][key];
    }
  });
}

// ==========================================
// UI LOGIC & EVENTS
// ==========================================
function setupUI() {
  // Toggle Rural/Urban
  document.querySelectorAll(".toggle-row .pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      profile.rural = btn.dataset.area === "rural";
    });
  });

  // Buttons
  document.getElementById("calcBtn").addEventListener("click", handleWizardSubmit);
  document.getElementById("chatBtn").addEventListener("click", handleChatSubmit);
  document.getElementById("downloadBtn").addEventListener("click", () => window.print());
}

// ==========================================
// VOICE INPUT (Web Speech API)
// ==========================================
function setupVoice() {
  const voiceBtn = document.getElementById("voiceBtn");
  const chatInput = document.getElementById("chatInput");
  
  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.style.display = 'none';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  
  voiceBtn.addEventListener("click", () => {
    recognition.lang = currentLang === 'en' ? 'en-IN' : `${currentLang}-IN`; 
    recognition.start();
    voiceBtn.classList.add("listening");
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    voiceBtn.classList.remove("listening");
  };

  recognition.onerror = () => voiceBtn.classList.remove("listening");
  recognition.onend = () => voiceBtn.classList.remove("listening");
}

// ==========================================
// BACKEND API CONNECTIONS
// ==========================================
function appendChatBubble(text, sender) {
  const history = document.getElementById("chatHistory");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  history.appendChild(bubble);
  history.scrollTop = history.scrollHeight;
}

async function handleChatSubmit() {
  const inputEl = document.getElementById("chatInput");
  const message = inputEl.value.trim();
  if (!message) return;

  inputEl.value = "";
  appendChatBubble(message, "user");

  try {
    // 1. Send text to LLM endpoint for NLP extraction
    const nlpRes = await fetch(`${API_BASE_URL}/nlp-extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message, language: currentLang })
    });
    
    // Simulate NLP mapping
    // const extracted = await nlpRes.json();
    appendChatBubble("I've calculated your financial roadmap. Check the report below!", "ai");
    
    // Auto-trigger the report generation
    profile.marginCapital = 50000; // Mock extracted data
    fetchReport(profile);
    
  } catch (err) {
    appendChatBubble(i18n[currentLang].errorServer, "ai");
  }
}

function handleWizardSubmit() {
  profile.category = document.getElementById("categorySelect").value;
  profile.marginCapital = parseInt(document.getElementById("marginInput").value);
  
  if (!profile.marginCapital) {
    alert("Please enter a valid margin capital amount.");
    return;
  }
  fetchReport(profile);
}

async function fetchReport(dataPayload) {
  const resultSec = document.getElementById("resultSection");
  const loader = document.getElementById("loadingIndicator");
  const content = document.getElementById("resultContent");

  resultSec.hidden = false;
  loader.hidden = false;
  content.innerHTML = "";
  resultSec.scrollIntoView({ behavior: "smooth" });

  try {
    // 2. Send structured data to your calculation engine
    const reportRes = await fetch(`${API_BASE_URL}/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataPayload)
    });
    
    // const reportData = await reportRes.json();
    
    // MOCK DELAY & RESPONSE:
    setTimeout(() => {
      loader.hidden = true;
      content.innerHTML = `
        <div class="step-card" style="border-left: 4px solid var(--primary)">
          <h3 style="margin-top:0">Module 1: Financial Structure (Mudra Scheme)</h3>
          <p><strong>Available Margin:</strong> ₹${dataPayload.marginCapital}</p>
          <p><strong>Total Project Cost:</strong> ₹${dataPayload.marginCapital * 10}</p>
          <p><strong>Eligible Loan (90%):</strong> ₹${(dataPayload.marginCapital * 10) * 0.9}</p>
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 15px 0;">
          <h3 style="margin-top:0">Module 2: Hyper-Local Market Analysis</h3>
          <p><strong>Competitors nearby:</strong> Low saturation in Gram Panchayat.</p>
          <p><strong>Threats:</strong> Supply chain dependency on neighboring block.</p>
        </div>
      `;
    }, 1500);

  } catch (err) {
    loader.hidden = true;
    content.innerHTML = `<p style="color:red">${i18n[currentLang].errorServer}</p>`;
  }
}