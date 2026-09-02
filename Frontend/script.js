// Point this to your FastAPI local server
const API_BASE_URL = "http://127.0.0.1:8000";

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
  }
};

let currentLang = 'en';

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
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang] && i18n[lang][key]) {
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = i18n[lang][key];
      else el.innerHTML = i18n[lang][key];
    }
  });
}

function setupUI() {
  document.querySelectorAll(".toggle-row .pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
    });
  });

  document.getElementById("calcBtn").addEventListener("click", submitWizardToFastAPI);
  document.getElementById("chatBtn").addEventListener("click", submitChatToFastAPI);
  document.getElementById("downloadBtn").addEventListener("click", () => window.print());
}

function setupVoice() {
  const voiceBtn = document.getElementById("voiceBtn");
  const chatInput = document.getElementById("chatInput");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.style.display = 'none';
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  voiceBtn.addEventListener("click", () => {
    recognition.lang = currentLang === 'en' ? 'en-IN' : 'hi-IN'; 
    recognition.start();
    voiceBtn.classList.add("listening");
  });
  recognition.onresult = (event) => {
    chatInput.value = event.results[0][0].transcript;
    voiceBtn.classList.remove("listening");
  };
  recognition.onerror = () => voiceBtn.classList.remove("listening");
  recognition.onend = () => voiceBtn.classList.remove("listening");
}

function appendChatBubble(text, sender) {
  const history = document.getElementById("chatHistory");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  history.appendChild(bubble);
  history.scrollTop = history.scrollHeight;
}

// --- WIZARD SUBMISSION ---
async function submitWizardToFastAPI() {
  const marginCapital = parseFloat(document.getElementById("marginInput").value);
  const category = document.getElementById("categorySelect").value;
  if (!marginCapital) return alert("Please enter a valid margin capital amount.");

  const payload = {
    state: "Maharashtra", 
    business_category: category,
    margin_pct: 0.10,
    margin_capital: marginCapital,
    experience_level: "beginner"
  };

  await fetchAndRenderResult("/feasibility", payload);
}

// --- CHAT SUBMISSION ---
async function submitChatToFastAPI() {
  const inputEl = document.getElementById("chatInput");
  const message = inputEl.value.trim();
  if (!message) return;

  inputEl.value = "";
  appendChatBubble(message, "user");

  const payload = {
    message: message,
    experience_level: "beginner"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    
    appendChatBubble(data.explanation || "I have analyzed your request. See the report below!", "ai");
    renderReport(data);

  } catch (err) {
    appendChatBubble(i18n[currentLang].errorServer, "ai");
  }
}

async function fetchAndRenderResult(endpoint, payload) {
  const resultSec = document.getElementById("resultSection");
  const loader = document.getElementById("loadingIndicator");
  
  resultSec.hidden = false;
  loader.hidden = false;
  document.getElementById("resultContent").innerHTML = "";
  resultSec.scrollIntoView({ behavior: "smooth" });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Server error");
    }

    const data = await response.json();
    loader.hidden = true;
    renderReport(data);

  } catch (err) {
    loader.hidden = true;
    document.getElementById("resultContent").innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

function renderReport(data) {
  const content = document.getElementById("resultContent");
  
  const schemeName = data.scheme?.name || "Standard Loan";
  const projectCost = data.loan?.project_cost || 0;
  const marginMoney = data.loan?.margin_money || 0;
  const loanAmount = data.loan?.loan_amount || 0;
  const emi = data.installment || 0;
  
  let swotHTML = "";
  if (data.swot) {
      swotHTML = `
      <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;">
      <h3 style="margin-top:0">AI Market Analysis (SWOT)</h3>
      <p><strong>Strengths:</strong> ${data.swot.strengths || 'N/A'}</p>
      <p><strong>Weaknesses:</strong> ${data.swot.weaknesses || 'N/A'}</p>
      <p><strong>Opportunities:</strong> ${data.swot.opportunities || 'N/A'}</p>
      <p><strong>Threats:</strong> ${data.swot.threats || 'N/A'}</p>
      `;
  }

  content.innerHTML = `
    <div class="step-card" style="border-left: 4px solid var(--primary)">
      <h3 style="margin-top:0">Selected Scheme: ${schemeName}</h3>
      <p><strong>Total Project Cost:</strong> ₹${projectCost.toLocaleString('en-IN')}</p>
      <p><strong>Your Contribution (Margin):</strong> ₹${marginMoney.toLocaleString('en-IN')}</p>
      <p><strong>Loan Amount (90%):</strong> ₹${loanAmount.toLocaleString('en-IN')}</p>
      <p><strong>Estimated Repayment:</strong> ₹${emi.toLocaleString('en-IN')} per installment</p>
      ${swotHTML}
    </div>
  `;
}