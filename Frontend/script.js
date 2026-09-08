// Point this to your FastAPI local server
const API_BASE_URL = "https://sih26091-team-arthx.onrender.com";

// Language Voice / Speech Synthesis BCP-47 locale map
const langVoiceMap = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  pa: "pa-IN",
  ml: "ml-IN"
};

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
    reportTitle: "Your Business & Financial Report", downloadBtn: "Download / Print", errorServer: "Could not connect to the server.",
    simInitialCash: "Initial Cash (₹)",
    simMonthlyRev: "Base Monthly Revenue (₹)",
    simMonthlyExp: "Base Monthly Expenses (₹)",
    simEmi: "Monthly EMI (₹)",
    simulating: "Simulating 1,000 market conditions...",
    simResults: "Simulation Results",
    simSurvival: "Survival Probability",
    simRisk: "Risk Level",
    simTested: "Tested across",
    simCycles: "randomized seasonal demand cycles.",
    simFail: "Simulation engine failed to connect. Ensure backend is running.",
    navHome: "Home", navJournal: "Journal", navTools: "Tools", navChat: "Chat"
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
    reportTitle: "आपकी व्यावसायिक और वित्तीय रिपोर्ट", downloadBtn: "डाउनलोड / प्रिंट करें", errorServer: "सर्वर से कनेक्ट नहीं हो सका।",
    simInitialCash: "प्रारंभिक नकद (₹)",
    simMonthlyRev: "आधार मासिक राजस्व (₹)",
    simMonthlyExp: "आधार मासिक खर्च (₹)",
    simEmi: "मासिक ईएमआई (₹)",
    simulating: "1,000 बाजार स्थितियों का सिमुलेशन किया जा रहा है...",
    simResults: "सिमुलेशन परिणाम",
    simSurvival: "अस्तित्व की संभावना",
    simRisk: "जोखिम स्तर",
    simTested: "परीक्षण किया गया",
    simCycles: "यादृच्छिक मौसमी मांग चक्रों में।",
    simFail: "सिमुलेशन इंजन कनेक्ट होने में विफल रहा। सुनिश्चित करें कि बैकएंड चल रहा है।",
    navHome: "होम", navJournal: "जर्नल", navTools: "टूल्स", navChat: "चैट"
  },
  mr: { // Marathi
    tagline: "स्मार्ट व्यवसाय निधी, सोप्या शब्दात",
    heroTitle: "तुमच्या बजेटला व्यवसाय योजनेत बदला.",
    heroSub: "तुमचे स्थान आणि उपलब्ध भांडवल सांगा. आम्ही तुमचे बजेट, स्थानिक स्पर्धक आणि सरकारी योजना शोधून देऊ.",
    flowTitle: "अर्थसेतु कसे काम करते", flow1: "माहिती भरा", flow2: "AI बाजार विश्लेषण", flow3: "योजना व EMI मिळवा",
    chatTitle: "AI सहाय्यकाशी बोला", chatGreeting: "नमस्कार! तुमच्या व्यवसायाबद्दल आणि भांडवलाबद्दल सांगा.", sendBtn: "पाठवा",
    wizardTitle: "किंवा स्वतः माहिती भरा", q1: "1. क्षेत्र प्रकार", ruralBtn: "ग्रामीण", urbanBtn: "शहरी",
    q2: "2. व्यवसाय प्रकार", catDairy: "डेअरी", catTailor: "शिंपी काम", catGrocery: "किराणा दुकान",
    q3: "3. तुमची भांडवल रक्कम (₹)", calcBtn: "AI रिपोर्ट तयार करा",
    reportTitle: "व्यवसाय आणि आर्थिक अहवाल", downloadBtn: "डाउनलोड / प्रिंट करा", errorServer: "सर्व्हरशी संपर्क होऊ शकला नाही.",
    simInitialCash: "प्रारंभिक रक्कम (₹)", simMonthlyRev: "मासिक उत्पन्न (₹)", simMonthlyExp: "मासिक खर्च (₹)", simEmi: "मासिक हप्ता / EMI (₹)",
    simulating: "सि्युलेशन सुरू आहे...", simResults: "सि्युलेशन निकाल", simSurvival: "यशस्वी होण्याची शक्यता", simRisk: "जोखीम पातळी",
    simTested: "परीक्षण केले", simCycles: "हंगामी बाजाराच्या आधारे.", simFail: "सि्युलेशन जोडणी अयशस्वी.",
    navHome: "मुख्य", navJournal: "नोंदवही", navTools: "साधने", navChat: "चॅट"
  },
  gu: { // Gujarati
    tagline: "સ્માર્ટ બિઝનેસ ફંડિંગ, સરળ શબ્દોમાં",
    heroTitle: "તમારી બચતને વ્યવસાય યોજનામાં ફેરવો.",
    heroSub: "તમારું સ્થાન અને બજેટ જણાવો. અમે યોજનાઓ અને સ્પર્ધકોનું વિશ્લેષણ કરીશું.",
    flowTitle: "અર્થસેતુ કેવી રીતે કામ કરે છે", flow1: "વિગતો દાખલ કરો", flow2: "AI માર્કેટ એનાલિસિસ", flow3: "યોજના અને EMI મેળવો",
    chatTitle: "AI સહાયક સાથે વાત કરો", chatGreeting: "નમસ્તે! તમારા વ્યવસાય વિચારો જણાવો.", sendBtn: "મોકલો",
    wizardTitle: "અથવા જાતે વિગતો ભરો", q1: "1. વિસ્તારનો પ્રકાર", ruralBtn: "ગ્રામીણ", urbanBtn: "શહેરી",
    q2: "2. વ્યવસાય કેટેગરી", catDairy: "ડેરી ફાર્મિંગ", catTailor: "દરજી કામ", catGrocery: "કરિયાણાની દુકાન",
    q3: "3. તમારી મૂડી (₹)", calcBtn: "AI રિપોર્ટ જનરેટ કરો",
    reportTitle: "વ્યવસાય અને નાણાકીય અહેવાલ", downloadBtn: "ડાઉનલોડ / પ્રિન્ટ કરો", errorServer: "સર્વર કનેક્ટ થઈ શક્યું નથી.",
    simInitialCash: "પ્રારંભિક રોકડ (₹)", simMonthlyRev: "માસિક આવક (₹)", simMonthlyExp: "માસિક ખર્ચ (₹)", simEmi: "માસિક EMI (₹)",
    simulating: "સિબ્યુલેશન પ્રક્રિયા હેઠળ છે...", simResults: "સિબ્યુલેશન પરિણામો", simSurvival: "સફળતાની સંભાવના", simRisk: "જોખમ સ્તર",
    simTested: "ચકાસાયેલ", simCycles: "બજારના આધારે.", simFail: "એન્જિન કનેક્ટ થવામાં નિષ્ફળ.",
    navHome: "હોમ", navJournal: "જર્નલ", navTools: "સાધનો", navChat: "ચેટ"
  },
  bn: { // Bengali
    tagline: "সহজ ভাষায় ব্যবসায়িক অর্থায়ন",
    heroTitle: "আপনার সঞ্চয়কে ব্যবসায় রূপান্তর করুন।",
    heroSub: "আপনার অবস্থান এবং বাজেট জানান। আমরা সরকারি স্কিম ও বাজার বিশ্লেষণ করব।",
    flowTitle: "অর্থসেতু যেভাবে কাজ করে", flow1: "তথ্য প্রদান করুন", flow2: "AI বাজার বিশ্লেষণ", flow3: "স্কিম ও EMI পান",
    chatTitle: "AI সহকারীর সাথে কথা বলুন", chatGreeting: "হ্যালো! আপনার ব্যবসা সম্পর্কিত তথ্য দিন।", sendBtn: "পাঠান",
    wizardTitle: "অথবা ম্যানুয়ালি তথ্য লিখুন", q1: "১. এলাকার ধরন", ruralBtn: "গ্রাম", urbanBtn: "শহর",
    q2: "২. ব্যবসার ধরন", catDairy: "ডেরি ফার্ম", catTailor: "দর্জি", catGrocery: "মুদির দোকান",
    q3: "৩. মূলধন (₹)", calcBtn: "AI রিপোর্ট তৈরি করুন",
    reportTitle: "ব্যবসা ও আর্থিক রিপোর্ট", downloadBtn: "ডাউনলোড / প্রিন্ট", errorServer: "সার্ভারে সংযোগ করা যায়নি।",
    simInitialCash: "প্রাথমিক নগদ (₹)", simMonthlyRev: "মাসিক আয় (₹)", simMonthlyExp: "মাসিক খরচ (₹)", simEmi: "মাসিক কিস্তি (₹)",
    simulating: "সিমুলেশন চলছে...", simResults: "সিমুলেশন ফলাফল", simSurvival: "সফলতার সম্ভাবনা", simRisk: "ঝুঁকির মাত্রা",
    simTested: "পরীক্ষিত", simCycles: "ঋতুভিত্তিক বাজার চক্রের উপর।", simFail: "সিমুলেশন সংযোগে ব্যর্থ।",
    navHome: "হোম", navJournal: "জার্নাল", navTools: "টুলস", navChat: "চ্যাট"
  },
  ta: { // Tamil
    tagline: "எளிய முறையில் வணிக நிதி உதவி",
    heroTitle: "உங்கள் சேமிப்பை தொழிலாக மாற்றவும்.",
    heroSub: "உங்கள் இடம் மற்றும் நிதியை உள்ளிடவும். நாங்கள் கடன் திட்டங்களை கணக்கிடுகிறோம்.",
    flowTitle: "அர்த்தசேது எப்படி செயல்படுகிறது", flow1: "விவரங்களை உள்ளிடவும்", flow2: "AI ஆய்வு", flow3: "திட்டம் மற்றும் EMI பெறவும்",
    chatTitle: "AI உதவியாளரிடம் பேசுங்கள்", chatGreeting: "வணக்கம்! உங்கள் தொழில் யோசனையைக் கூறுங்கள்.", sendBtn: "அனுப்பு",
    wizardTitle: "அல்லது விவரங்களை சேர்க்கவும்", q1: "1. பகுதி வகை", ruralBtn: "கிராமம்", urbanBtn: "நகரம்",
    q2: "2. தொழில் வகை", catDairy: "பால் பண்ணை", catTailor: "தையல்", catGrocery: "மளிகை கடை",
    q3: "3. மூலதனம் (₹)", calcBtn: "அறிக்கையை உருவாக்கவும்",
    reportTitle: "நிதி அறிக்கை", downloadBtn: "பதிவிறக்கம் / அச்சு", errorServer: "சர்வரை இணைக்க முடியவில்லை.",
    simInitialCash: "ஆரம்ப ரொக்கம் (₹)", simMonthlyRev: "மாத வருமானம் (₹)", simMonthlyExp: "மாத செலவு (₹)", simEmi: "மாத தவணை (₹)",
    simulating: "செயல்முறை நடக்கிறது...", simResults: "முடிவுகள்", simSurvival: "வெற்றி வாய்ப்பு", simRisk: "ஆபத்து நிலை",
    simTested: "சோதிக்கப்பட்டது", simCycles: "சந்தை சுழற்சிகளில்.", simFail: "இணைப்பு தோல்வி.",
    navHome: "முகப்பு", navJournal: "குறிப்பேடு", navTools: "கருவிகள்", navChat: "சாட்"
  },
  te: { // Telugu
    tagline: "సులభమైన మాటల్లో బిజినెస్ ఫండింగ్",
    heroTitle: "మీ పొదుపును వ్యాపారంగా మార్చండి.",
    heroSub: "మీ ప్రాంతం మరియు బడ్జెట్ తెలియజేయండి. ప్రభుత్వ పథకాలతో మ్యాచ్ చేస్తాము.",
    flowTitle: "అర్థసేతు ఎలా పనిచేస్తుంది", flow1: "వివరాలు నమోదు చేయండి", flow2: "AI విశ్లేషణ", flow3: "పథకం & EMI పొందండి",
    chatTitle: "AI సహాయకుడితో మాట్లాడండి", chatGreeting: "నమస్తే! మీ వ్యాపార ఆలోచనను చెప్పండి.", sendBtn: "పంపు",
    wizardTitle: "లేదా నేరుగా నమోదు చేయండి", q1: "1. ప్రాంతం రకం", ruralBtn: "గ్రామీణ", urbanBtn: "పట్టణ",
    q2: "2. వ్యాపార వర్గం", catDairy: "డైరీ ఫార్మింగ్", catTailor: "టైలరింగ్", catGrocery: "కిరాణా కొట్టు",
    q3: "3. పెట్టుబడి (₹)", calcBtn: "AI రిపోర్ట్ పొందండి",
    reportTitle: "వ్యాపార & ఆర్థిక నివేదిక", downloadBtn: "డౌన్‌లోడ్ / ప్రింట్", errorServer: "సర్వర్ కనెక్ట్ కాలేదు.",
    simInitialCash: "ప్రారంభ నగదు (₹)", simMonthlyRev: "నెలకు ఆదాయం (₹)", simMonthlyExp: "నెలకు ఖర్చు (₹)", simEmi: "నెలకు EMI (₹)",
    simulating: "సిమ్యులేషన్ జరుగుతోంది...", simResults: "ఫలితాలు", simSurvival: "విజయవంతమయ్యే అవకాశం", simRisk: "రిస్క్ స్థాయి",
    simTested: "పరీక్షించబడింది", simCycles: "మార్కెట్ పరిస్థితులపై.", simFail: "కనెక్షన్ విఫలమైంది.",
    navHome: "హోమ్", navJournal: "జర్నల్", navTools: "టూల్స్", navChat: "చాట్"
  },
  kn: { // Kannada
    tagline: "ಸುಲಭ ಭಾಷೆಯಲ್ಲಿ ಉದ್ಯಮ ಧನಸಹಾಯ",
    heroTitle: "ನಿಮ್ಮ ಉಳಿತಾಯವನ್ನು ಉದ್ಯಮ ಯೋಜನೆಯಾಗಿ ಮಾರ್ಪಡಿಸಿ.",
    heroSub: "ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಲಭ್ಯವಿರುವ ಹಣವನ್ನು ತಿಳಿಸಿ. ಸೂಕ್ತ ಯೋಜನೆಗಳನ್ನು ತಿಳಿಸುತ್ತೇವೆ.",
    flowTitle: "ಅರ್ಥಸೇತು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ", flow1: "ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ", flow2: "AI ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ", flow3: "ಯೋಜನೆ ಮತ್ತು EMI ಪಡೆಯಿರಿ",
    chatTitle: "AI ಸಹಾಯಕರೊಂದಿಗೆ ಮಾತನಾಡಿ", chatGreeting: "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಉದ್ಯಮದ ಕಲ್ಪನೆಯನ್ನು ತಿಳಿಸಿ.", sendBtn: "ಕಳುಹಿಸಿ",
    wizardTitle: "ಅಥವಾ ವಿವರಗಳನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ", q1: "1. ಪ್ರದೇಶದ ಪ್ರಕಾರ", ruralBtn: "ಗ್ರಾಮೀಣ", urbanBtn: "ನಗರ",
    q2: "2. ಉದ್ಯಮ ವರ್ಗ", catDairy: "ಡೈರಿ ಫಾರ್ಮಿಂಗ್", catTailor: "ದರ್ಜಿ ಕೆಲಸ", catGrocery: "ಕಿರಾಣಿ ಅಂಗಡಿ",
    q3: "3. ನಿಮ್ಮ ಬಂಡವಾಳ (₹)", calcBtn: "ವರದಿ ಸಿದ್ಧಪಡಿಸಿ",
    reportTitle: "ಆರ್ಥಿಕ ವರದಿ", downloadBtn: "ಡೌನ್‌ಲೋಡ್ / ಪ್ರಿಂಟ್", errorServer: "ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ.",
    simInitialCash: "ಆರಂಭಿಕ ನಗದು (₹)", simMonthlyRev: "ಮಾಸಿಕ ಆದಾಯ (₹)", simMonthlyExp: "ಮಾಸಿಕ ವೆಚ್ಚ (₹)", simEmi: "ಮಾಸಿಕ EMI (₹)",
    simulating: "ಸಿಮ್ಯುಲೇಶನ್ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...", simResults: "ಫಲಿತಾಂಶಗಳು", simSurvival: "ಸಾಧ್ಯತೆಯ ಪ್ರಮಾಣ", simRisk: "ಅಪಾಯದ ಮಟ್ಟ",
    simTested: "ಪರೀಕ್ಷಿಸಲಾಗಿದೆ", simCycles: "ಮಾರುಕಟ್ಟೆ ಸ್ಥಿತಿಗಳಲ್ಲಿ.", simFail: "ಸಂಪರ್ಕ ಸಾಧಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    navHome: "ಹೋಮ್", navJournal: "ಜರ್ನಲ್", navTools: "ಸಾಧನಗಳು", navChat: "ಚಾಟ್"
  }
};

let currentLang = 'en';

document.addEventListener("DOMContentLoaded", () => {
  setupLanguage();
  setupUI();
  setupVoice();
  updateLanguage(currentLang);
});

function setupLanguage() {
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      currentLang = e.target.value;
      updateLanguage(currentLang);
    });
  }
}

function updateLanguage(lang) {
  const selectedDict = i18n[lang] || i18n['en'];
  const fallbackDict = i18n['en'];

  // Universal DOM translator with standard English fallback
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const translation = selectedDict[key] || fallbackDict[key];
    if (translation) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.innerHTML = translation;
      }
    }
  });

  // Dynamically sync placeholders for simulation inputs
  const simInputs = ["simInitialCash", "simMonthlyRev", "simMonthlyExp", "simEmi"];
  simInputs.forEach(id => {
    const inputEl = document.getElementById(id);
    if (inputEl) {
      inputEl.placeholder = selectedDict[id] || fallbackDict[id] || "";
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

  document.getElementById("calcBtn")?.addEventListener("click", submitWizardToFastAPI);
  document.getElementById("chatBtn")?.addEventListener("click", submitChatToFastAPI);
  document.getElementById("downloadBtn")?.addEventListener("click", () => window.print());
  
  const readBtn = document.getElementById("readAloudBtn");
  if(readBtn) readBtn.addEventListener("click", readReportAloud);
  
  const logBtn = document.getElementById("logJournalBtn");
  if(logBtn) logBtn.addEventListener("click", submitJournalEntry);
  
  const askBtn = document.getElementById("askJournalBtn");
  if(askBtn) askBtn.addEventListener("click", askJournal);

  const loadEntriesBtn = document.getElementById("loadEntriesBtn");
  if(loadEntriesBtn) loadEntriesBtn.addEventListener("click", fetchJournalEntries);

  const dateEl = document.getElementById("journalDate");
  if(dateEl) dateEl.valueAsDate = new Date();

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

  // --- AUTH MODAL LOGIC ---
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

  // --- SIMULATION ENGINE LOGIC ---
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
      const activeDict = i18n[currentLang] || i18n['en'];
      
      resultBox.style.display = "block";
      resultBox.innerHTML = `<em>${activeDict.simulating}</em>`;

      try {
        const response = await fetch(`${API_BASE_URL}/simulate/survival`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        let badgeColor = data.survival_probability_pct > 80 ? '#10B981' : (data.survival_probability_pct > 50 ? '#F59E0B' : '#EF4444');

        resultBox.innerHTML = `
          <h4 style="margin: 0 0 8px 0; color: #1E293B;">${activeDict.simResults}</h4>
          <p style="margin: 4px 0;">${activeDict.simSurvival}: <strong style="color: ${badgeColor}; font-size: 16px;">${data.survival_probability_pct}%</strong></p>
          <p style="margin: 4px 0;">${activeDict.simRisk}: <strong>${data.risk_level}</strong></p>
          <p style="font-size: 12px; color: var(--text-light); margin-top: 6px;">${activeDict.simTested} ${data.simulated_iterations} ${activeDict.simCycles}</p>
        `;
      } catch (e) {
        resultBox.innerHTML = `<span style="color:red">${activeDict.simFail}</span>`;
      }
    });
  }

  // --- SCENARIO COMPARISON LOGIC ---
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
    if(voiceBtn) voiceBtn.style.display = 'none';
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  
  voiceBtn.addEventListener("click", () => {
    recognition.lang = langVoiceMap[currentLang] || 'en-IN'; 
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
    const activeDict = i18n[currentLang] || i18n['en'];
    appendChatBubble(activeDict.errorServer, "ai");
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
  const marginMoney = data.loan?.margin_amount || 0;
  const loanAmount = data.loan?.loan_amount || 0;
  const emi = data.installment || 0;
  
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

  let competitorHTML = "";
  if (data.competitor_mapping && data.competitor_mapping.nearest && data.competitor_mapping.nearest.length > 0) {
    competitorHTML = `
    <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;">
    <h3 style="margin-top:0">Nearby Competitors (Live OSM Data)</h3>
    <ul class="competitor-list">
      ${data.competitor_mapping.nearest.slice(0, 5).map(comp => `
        <li class="competitor-card">
          <span class="competitor-name">${comp.name || 'Unnamed Business'}</span>
          <span class="competitor-dist">${comp.distance_km} km away</span>
        </li>
      `).join('')}
    </ul>
    `;
  } else if (data.competitor_mapping && data.competitor_mapping.nearest && data.competitor_mapping.nearest.length === 0) {
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
// --- BUSINESS JOURNAL LOGIC ---
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

// --- DYNAMIC READ ALOUD LOGIC ---
function readReportAloud() {
  const content = document.getElementById("resultContent")?.innerText;
  if (!content) return alert("No report to read yet!");

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = langVoiceMap[currentLang] || 'en-IN';
  utterance.rate = 0.9;
  
  window.speechSynthesis.speak(utterance);
}

// --- MAP RENDERER FOR COMPETITORS ---
let competitorMap = null;

function renderCompetitorMap(competitors) {
  const mapContainerId = "competitorMapDiv";
  let mapDiv = document.getElementById(mapContainerId);
  
  if (!mapDiv) return;

  if (competitorMap) competitorMap.remove();

  const defaultLat = 20.5937; 
  const defaultLon = 78.9629;

  competitorMap = L.map(mapContainerId).setView([defaultLat, defaultLon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(competitorMap);

  if (competitors && competitors.length > 0) {
    const bounds = [];
    competitors.forEach((comp, index) => {
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

// ==========================================
// --- BOTTOM NAV NAVIGATION ---
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item[data-view]");
  const views = document.querySelectorAll(".app-view");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      const target = item.getAttribute("data-view");
      views.forEach(v => v.classList.toggle("active-view", v.id === `view-${target}`));

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  const chatNavBtn = document.getElementById("navChatBtn");
  const chatToggleBtn = document.getElementById("chatToggleBtn");
  if (chatNavBtn && chatToggleBtn) {
    chatNavBtn.addEventListener("click", () => chatToggleBtn.click());
  }
});