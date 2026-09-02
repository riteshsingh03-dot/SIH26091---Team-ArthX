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
  
  // --- NEW: Read Aloud Event Listener ---
  const readBtn = document.getElementById("readAloudBtn");
  if(readBtn) readBtn.addEventListener("click", readReportAloud);
  
  // --- NEW: Journal Event Listeners ---
  const logBtn = document.getElementById("logJournalBtn");
  if(logBtn) logBtn.addEventListener("click", submitJournalEntry);
  
  const askBtn = document.getElementById("askJournalBtn");
  if(askBtn) askBtn.addEventListener("click", askJournal);

  // --- NEW: Journal Table Loader Listener ---
  const loadEntriesBtn = document.getElementById("loadEntriesBtn");
  if(loadEntriesBtn) loadEntriesBtn.addEventListener("click", fetchJournalEntries);

  // Set today's date automatically in the journal form
  const dateEl = document.getElementById("journalDate");
  if(dateEl) dateEl.valueAsDate = new Date();

  // --- NEW: Floating Chat Widget Toggle Logic ---
  const chatToggleBtn = document.getElementById("chatToggleBtn");
  const floatingChatWidget = document.getElementById("floatingChatWidget");
  const closeChatBtn = document.getElementById("closeChatBtn");

  if(chatToggleBtn && floatingChatWidget && closeChatBtn) {
    chatToggleBtn.addEventListener("click", () => {
      floatingChatWidget.classList.remove("hidden");
      chatToggleBtn.style.display = "none";
    });

    closeChatBtn.addEventListener("click", () => {
      floatingChatWidget.classList.add("hidden");
      chatToggleBtn.style.display = "flex";
    });
  }
 // --- AUTH MODAL & STATE LOGIC ---
  const authModal = document.getElementById("authModal");
  const openAuthBtn = document.getElementById("openAuthModalBtn");
  const closeAuthBtn = document.getElementById("closeAuthModalBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (openAuthBtn && authModal) {
    openAuthBtn.addEventListener("click", () => authModal.classList.remove("hidden"));
    closeAuthBtn.addEventListener("click", () => authModal.classList.add("hidden"));
    
    tabBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        tabBtns.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const targetTab = e.target.getAttribute("data-tab");
        if (targetTab === "login") {
          loginForm.classList.remove("hidden");
          signupForm.classList.add("hidden");
        } else {
          signupForm.classList.remove("hidden");
          loginForm.classList.add("hidden");
        }
      });
    });

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      authModal.classList.add("hidden");
      if(openAuthBtn) openAuthBtn.classList.add("hidden");
      if(logoutBtn) logoutBtn.classList.remove("hidden");
      alert("Logged in successfully!");
    });

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      authModal.classList.add("hidden");
      if(openAuthBtn) openAuthBtn.classList.add("hidden");
      if(logoutBtn) logoutBtn.classList.remove("hidden");
      alert("Account created successfully!");
    });

    if(logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logoutBtn.classList.add("hidden");
        if(openAuthBtn) openAuthBtn.classList.remove("hidden");
        alert("Logged out successfully!");
      });
    }
  }
  // --- SIMULATION MODAL & ENGINE LOGIC ---
  const openSimBtn = document.getElementById("openSimModalBtn");
  const simModal = document.getElementById("simModalOverlay");
  const closeSimBtn = document.getElementById("closeSimModalBtn");
  const runSimBtn = document.getElementById("runSimBtn");

  if (openSimBtn && simModal) {
    openSimBtn.addEventListener("click", () => simModal.classList.remove("hidden"));
    closeSimBtn.addEventListener("click", () => simModal.classList.add("hidden"));
  }

  if (runSimBtn) {
    runSimBtn.addEventListener("click", async () => {
      const payload = {
        initial_cash: parseFloat(document.getElementById("simInitialCash").value) || 0,
        base_monthly_revenue: parseFloat(document.getElementById("simMonthlyRev").value) || 0,
        base_monthly_expenses: parseFloat(document.getElementById("simMonthlyExp").value) || 0,
        emi: parseFloat(document.getElementById("simEmi").value) || 0,
        iterations: 1000
      };

      const resultBox = document.getElementById("simulationResult");
      resultBox.style.display = "block";
      resultBox.innerHTML = "<em>Simulating 1,000 market conditions...</em>";

      try {
        const response = await fetch(`${API_BASE_URL}/simulate/survival`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        let badgeColor = data.survival_probability_pct > 80 ? '#10B981' : (data.survival_probability_pct > 50 ? '#F59E0B' : '#EF4444');

        resultBox.innerHTML = `
          <h4 style="margin: 0 0 8px 0; color: #1E293B;">Simulation Results</h4>
          <p style="margin: 4px 0;">Survival Probability: <strong style="color: ${badgeColor}; font-size: 16px;">${data.survival_probability_pct}%</strong></p>
          <p style="margin: 4px 0;">Risk Level: <strong>${data.risk_level}</strong></p>
          <p style="font-size: 12px; color: var(--text-light); margin-top: 6px;">Tested across ${data.simulated_iterations} randomized seasonal demand cycles.</p>
        `;
      } catch (e) {
        resultBox.innerHTML = `<span style="color:red">Simulation engine failed to connect. Ensure backend is running.</span>`;
      }
    });
  }

  // --- SCENARIO COMPARISON & SENSITIVITY LOGIC ---
  const compareBtn = document.getElementById("compareScenariosBtn");
  if (compareBtn) {
    compareBtn.addEventListener("click", async () => {
      const resultBox = document.getElementById("scenarioResultBox");
      resultBox.style.display = "block";
      resultBox.innerHTML = "<em>Running scenario matrix...</em>";

      const payload = {
        base_inputs: {
          project_cost: 1000000,
          margin_pct: 0.10,
          annual_rate_pct: 8.0,
          tenure_months: 84,
          fixed_costs: 50000,
          price_per_unit: 100,
          variable_cost_per_unit: 60
        },
        scenarios: {
          scenario_a: { price_per_unit: 100 },
          scenario_b: { price_per_unit: 120 }
        }
      };

      try {
        const response = await fetch(`${API_BASE_URL}/scenarios/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        resultBox.innerHTML = `
          <h4 style="margin: 0 0 8px 0;">Comparison Results (Breakeven Analysis)</h4>
          <p style="margin: 4px 0;">Base Scenario (₹100/unit): <strong>${data.scenario_a?.breakeven_units || 'N/A'} units</strong></p>
          <p style="margin: 4px 0;">Optimized Scenario (₹120/unit): <strong style="color: #10B981;">${data.scenario_b?.breakeven_units || 'N/A'} units</strong> (Lower breakeven point due to higher margin per unit).</p>
        `;
      } catch (e) {
        resultBox.innerHTML = `<span style="color:red">Failed to fetch scenario comparison from backend.</span>`;
      }
    });
  }

  
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
  
  // Grabbing personal and granular location details if present
  const stateInput = document.getElementById("stateInput");
  const districtInput = document.getElementById("districtInput");
  const stateVal = stateInput ? stateInput.value.trim() : "";
  const districtVal = districtInput ? districtInput.value.trim() : "";

  if (!marginCapital) return alert("Please enter a valid margin capital amount.");

  const payload = {
    state: stateVal || "Maharashtra", 
    district: districtVal || null,
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
  
  // ORIGINAL SWOT RENDERER
  let swotHTML = "";
  if (data.swot) {
      let swotContent = typeof data.swot === 'string' ? data.swot.replace(/\n/g, '<br>') : `
        <p><strong>Strengths:</strong> ${data.swot.strengths || 'N/A'}</p>
        <p><strong>Weaknesses:</strong> ${data.swot.weaknesses || 'N/A'}</p>
        <p><strong>Opportunities:</strong> ${data.swot.opportunities || 'N/A'}</p>
        <p><strong>Threats:</strong> ${data.swot.threats || 'N/A'}</p>
      `;
      
      swotHTML = `
      <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;">
      <h3 style="margin-top:0">AI Market Analysis (SWOT)</h3>
      ${swotContent}
      `;
  }

  // --- NEW: COMPETITOR MAPPING RENDERER ---
  let competitorHTML = "";
  if (data.competitor_mapping && data.competitor_mapping.length > 0) {
      competitorHTML = `
      <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;">
      <h3 style="margin-top:0">Nearby Competitors (Live OSM Data)</h3>
      <ul class="competitor-list">
        ${data.competitor_mapping.slice(0, 5).map(comp => `
          <li class="competitor-card">
            <span class="competitor-name">${comp.name || 'Unnamed Business'}</span>
            <span class="competitor-dist">${comp.distance_km} km away</span>
          </li>
        `).join('')}
      </ul>
      `;
  } else if (data.competitor_mapping && data.competitor_mapping.length === 0) {
      competitorHTML = `<p><em>No immediate competitors found in the OpenStreetMap database for this radius.</em></p>`;
  }

  content.innerHTML = `
    <div class="step-card" style="border-left: 4px solid var(--primary)">
      <h3 style="margin-top:0">Selected Scheme: ${schemeName}</h3>
      <p><strong>Total Project Cost:</strong> ₹${projectCost.toLocaleString('en-IN')}</p>
      <p><strong>Your Contribution (Margin):</strong> ₹${marginMoney.toLocaleString('en-IN')}</p>
      <p><strong>Loan Amount (90%):</strong> ₹${loanAmount.toLocaleString('en-IN')}</p>
      <p><strong>Estimated Repayment:</strong> ₹${emi.toLocaleString('en-IN')} per installment</p>
      ${swotHTML}
      ${competitorHTML}
    </div>
  `;
}

// ==========================================
// --- NEW: BUSINESS JOURNAL LOGIC ---
// ==========================================

async function submitJournalEntry() {
  const date = document.getElementById("journalDate").value;
  const sales = parseFloat(document.getElementById("journalSales").value) || 0;
  const expenses = parseFloat(document.getElementById("journalExpenses").value) || 0;
  const units = parseFloat(document.getElementById("journalUnits").value) || 0;

  if (!date) return alert("Please select a date.");

  const payload = { entry_date: date, sales_revenue: sales, expenses: expenses, units_sold: units };

  try {
    const response = await fetch(`${API_BASE_URL}/journal/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const statusText = document.getElementById("journalLogStatus");
      if(statusText) {
        statusText.style.display = "block";
        setTimeout(() => statusText.style.display = "none", 3000);
      }
      document.getElementById("journalSales").value = "";
      document.getElementById("journalExpenses").value = "";
      document.getElementById("journalUnits").value = "";
      fetchJournalEntries();
     }
  } catch (e) {
    alert("Failed to save entry.");
  }
}

async function askJournal() {
  const queryEl = document.getElementById("journalQuery");
  const answerDiv = document.getElementById("journalAnswer");
  
  if (!queryEl || !answerDiv) return;
  const query = queryEl.value;
  
  if (!query) return;
  answerDiv.innerHTML = "<em>Analyzing your ledger...</em>";

  try {
    const response = await fetch(`${API_BASE_URL}/journal/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query })
    });
    
    const data = await response.json();
    
    if (data.error) {
       answerDiv.innerHTML = `<span style="color:red">${data.error}</span>`;
    } else if (data.intent === "summary") {
       answerDiv.innerHTML = `Total Sales: ₹${data.result.total_sales || 0} | Total Expenses: ₹${data.result.total_expenses || 0}`;
    } else if (data.intent === "max" || data.intent === "min") {
       const val = data.result[data.field];
       answerDiv.innerHTML = `The ${data.intent} ${data.field} was <strong>₹${val}</strong> on ${data.result.entry_date}.`;
    } else {
       answerDiv.innerHTML = `Query processed successfully.`;
    }
  } catch (e) {
    answerDiv.innerHTML = `<span style="color:red">Failed to reach the AI.</span>`;
  }
}

async function fetchJournalEntries() {
  const tbody = document.getElementById("journalTableBody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="4" style="padding: 12px; text-align: center;">Loading entries...</td></tr>`;

  try {
    const response = await fetch(`${API_BASE_URL}/journal/entries`);
    const entries = await response.json();

    if (!entries || entries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding: 12px; text-align: center; color: var(--text-light);">No journal entries found. Log one above!</td></tr>`;
      return;
    }

    tbody.innerHTML = entries.map(entry => `
      <tr style="border-bottom: 1px solid var(--line);">
        <td style="padding: 8px;">${entry.entry_date}</td>
        <td style="padding: 8px; color: #10B981;">₹${entry.sales_revenue || 0}</td>
        <td style="padding: 8px; color: #EF4444;">₹${entry.expenses || 0}</td>
        <td style="padding: 8px;">${entry.units_sold || '-'}</td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" style="padding: 12px; text-align: center; color: red;">Failed to load journal records.</td></tr>`;
  }
}

// --- NEW: READ ALOUD LOGIC ---
function readReportAloud() {
  const content = document.getElementById("resultContent").innerText;
  if (!content) return alert("No report to read yet!");

  // Stop any currently playing audio
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(content);
  // Matches the language to the current UI selection (English or Hindi)
  utterance.lang = currentLang === 'en' ? 'en-IN' : 'hi-IN';
  utterance.rate = 0.9; // Slightly slower for easier understanding
  
  window.speechSynthesis.speak(utterance);
}
// --- MAP RENDERER FOR COMPETITORS ---
let competitorMap = null;

function renderCompetitorMap(competitors) {
  const mapContainerId = "competitorMapDiv";
  let mapDiv = document.getElementById(mapContainerId);
  
  // Create container if it doesn't exist in the report DOM
  if (!mapDiv) {
    return; // Ensure the HTML element exists or is appended in renderReport
  }

  // Clean up previous map instance if re-rendering
  if (competitorMap) {
    competitorMap.remove();
  }

  // Default center (e.g., central coordinates or fallback)
  const defaultLat = 20.5937; 
  const defaultLon = 78.9629;

  competitorMap = L.map(mapContainerId).setView([defaultLat, defaultLon], 13);

  // Load OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(competitorMap);

  // Add markers if coordinates are provided by backend, or plot them relative to center
  if (competitors && competitors.length > 0) {
    const bounds = [];
    competitors.forEach((comp, index) => {
      // Fallback or explicit lat/lon from OSM payload
      const lat = comp.lat || (defaultLat + (index * 0.01));
      const lon = comp.lon || (defaultLon + (index * 0.01));
      
      const marker = L.marker([lat, lon]).addTo(competitorMap);
      marker.bindPopup(`<b>${comp.name || 'Competitor'}</b><br>${comp.distance_km} km away`);
      bounds.push([lat, lon]);
    });

    if (bounds.length > 0) {
      competitorMap.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}

let competitorHTML = "";
  if (data.competitor_mapping && data.competitor_mapping.length > 0) {
      competitorHTML = `
      <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;">
      <h3 style="margin-top:0">Nearby Competitors Map (Live OSM)</h3>
      <div id="competitorMapDiv" style="height: 300px; width: 100%; border-radius: 8px; margin-bottom: 15px; border: 1px solid var(--line);"></div>
      <ul class="competitor-list">
        ${data.competitor_mapping.slice(0, 5).map(comp => `
          <li class="competitor-card">
            <span class="competitor-name">${comp.name || 'Unnamed Business'}</span>
            <span class="competitor-dist">${comp.distance_km} km away</span>
          </li>
        `).join('')}
      </ul>
      `;
      // Trigger map rendering after DOM update
      setTimeout(() => renderCompetitorMap(data.competitor_mapping), 100);
  }