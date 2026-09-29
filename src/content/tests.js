// PLACEHOLDER DATA — prices are illustrative. Replace with confirmed lab rates before launch.
// Medical wording must be confirmed by the lab owner.
// All Marathi text is AI-generated — needs native speaker review.

window.TEST_CATALOGUE = [
  // ── BLOOD ─────────────────────────────────────────────────
  { id: 'cbc',               name: 'CBC (Complete Blood Count)',       nameMr: 'सीबीसी (संपूर्ण रक्त गणना)',       price: 300, sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Blood', categoryMr: 'रक्त',    description: 'Screens for anaemia, infection, and blood disorders.' },
  { id: 'hemoglobin',        name: 'Haemoglobin (Hb)',                 nameMr: 'हीमोग्लोबिन',                      price: 80,  sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Blood', categoryMr: 'रक्त',    description: 'Checks for anaemia and iron status.' },
  { id: 'esr',               name: 'ESR (Erythrocyte Sedimentation Rate)', nameMr: 'ईएसआर',                        price: 100, sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Blood', categoryMr: 'रक्त',    description: 'Non-specific marker of inflammation or infection.' },
  { id: 'blood-group',       name: 'Blood Group & Rh Typing',          nameMr: 'रक्त गट आणि Rh',                   price: 100, sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'General', categoryMr: 'सामान्य', description: 'Determines ABO and Rh blood type for medical needs.' },

  // ── DIABETES ──────────────────────────────────────────────
  { id: 'fasting-blood-sugar', name: 'Fasting Blood Sugar (FBS)',      nameMr: 'उपवास रक्त शर्करा',                price: 60,  sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Diabetes', categoryMr: 'मधुमेह',  description: 'Baseline blood glucose — requires 10–12 hr fast.' },
  { id: 'pp-blood-sugar',     name: 'Post-Prandial Blood Sugar (PPBS)',  nameMr: 'जेवणानंतर रक्त शर्करा',           price: 60,  sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Diabetes', categoryMr: 'मधुमेह',  description: 'Blood glucose 2 hrs after a meal.' },
  { id: 'hba1c',              name: 'HbA1c (Glycated Haemoglobin)',      nameMr: 'HbA1c (ग्लायकेटेड हीमोग्लोबिन)', price: 500, sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Diabetes', categoryMr: 'मधुमेह',  description: '3-month average blood sugar — no fasting needed.' },

  // ── HEART ─────────────────────────────────────────────────
  { id: 'lipid-profile',     name: 'Lipid Profile',                    nameMr: 'लिपिड प्रोफाइल',                   price: 500, sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Heart', categoryMr: 'हृदय',      description: 'Cholesterol + Triglycerides + HDL/LDL — requires 10–12 hr fast.' },

  // ── LIVER ─────────────────────────────────────────────────
  { id: 'liver-function',    name: 'Liver Function Test (LFT)',         nameMr: 'यकृत कार्य चाचणी',                 price: 500, sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Liver', categoryMr: 'यकृत',      description: 'Assesses liver enzymes, proteins, and bilirubin.' },

  // ── KIDNEY ────────────────────────────────────────────────
  { id: 'kidney-function',   name: 'Kidney Function Test (KFT)',        nameMr: 'मूत्रपिंड कार्य चाचणी',            price: 450, sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Kidney', categoryMr: 'मूत्रपिंड',  description: 'Creatinine, urea, uric acid — kidney health markers.' },

  // ── THYROID ───────────────────────────────────────────────
  { id: 'tsh',               name: 'TSH',                              nameMr: 'TSH',                               price: 300, sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Thyroid', categoryMr: 'थायरॉइड', description: 'Key marker of thyroid function — no fasting needed.' },
  { id: 't3-t4-tsh',        name: 'T3 / T4 / TSH (Thyroid Profile)',   nameMr: 'T3 / T4 / TSH (थायरॉइड प्रोफाइल)', price: 399, sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Thyroid', categoryMr: 'थायरॉइड', description: 'Complete thyroid screen — no fasting needed.' },

  // ── VITAMINS ──────────────────────────────────────────────
  { id: 'vitamin-d',         name: 'Vitamin D (25-OH)',                 nameMr: 'व्हिटॅमिन डी',                     price: 1200,sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Vitamins', categoryMr: 'जीवनसत्त्वे', description: 'Vitamin D deficiency is very common — important for bone and immune health.' },
  { id: 'vitamin-b12',       name: 'Vitamin B12',                       nameMr: 'व्हिटॅमिन B12',                    price: 800, sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Vitamins', categoryMr: 'जीवनसत्त्वे', description: 'Important for nerve health and energy — vegetarians often deficient.' },

  // ── URINE ─────────────────────────────────────────────────
  { id: 'urine-routine',     name: 'Urine Routine Examination',         nameMr: 'मूत्र रूटीन तपासणी',               price: 100, sample: 'Urine', sampleMr: 'मूत्र', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Urine', categoryMr: 'मूत्र',    description: 'Routine urine analysis — checks for infection, sugar, protein.' },
  { id: 'urine-culture',     name: 'Urine Culture & Sensitivity',       nameMr: 'मूत्र कल्चर आणि सेन्सिटिव्हिटी',   price: 450, sample: 'Urine', sampleMr: 'मूत्र', reportTime: '24–48 hrs',reportTimeMr: '२४–४८ तास',    category: 'Urine', categoryMr: 'मूत्र',    description: 'Identifies bacteria in urine and guides antibiotic selection.' },

  // ── STOOL ─────────────────────────────────────────────────
  { id: 'stool-routine',     name: 'Stool Routine Examination',         nameMr: 'मल रूटीन तपासणी',                  price: 100, sample: 'Stool', sampleMr: 'मल',   reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Stool', categoryMr: 'मल',      description: 'Checks for infection, parasites, or digestive issues.' },

  // ── FEVER / INFECTION ─────────────────────────────────────
  { id: 'widal',             name: 'Widal Test',                        nameMr: 'विडाल टेस्ट',                      price: 250, sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Infection', categoryMr: 'संसर्ग', description: 'Screens for typhoid (Salmonella) infection.' },
  { id: 'malaria-test',      name: 'Malaria Test (MP)',                 nameMr: 'मलेरिया टेस्ट',                    price: 250, sample: 'Blood', sampleMr: 'रक्त', reportTime: 'Same day', reportTimeMr: 'त्याच दिवशी', category: 'Infection', categoryMr: 'संसर्ग', description: 'Detects malaria parasites in blood smear.' },
  { id: 'dengue-ns1',        name: 'Dengue NS1 Antigen',               nameMr: 'डेंग्यू NS1',                      price: 700, sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Infection', categoryMr: 'संसर्ग', description: 'Early dengue detection (most sensitive days 1–5).' },
  { id: 'crp',               name: 'CRP (C-Reactive Protein)',         nameMr: 'CRP',                               price: 450, sample: 'Blood', sampleMr: 'रक्त', reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Infection', categoryMr: 'संसर्ग', description: 'Marker of active inflammation or infection.' },

  // ── MICROBIOLOGY ──────────────────────────────────────────
  { id: 'sputum-afb',        name: 'Sputum AFB Smear',                 nameMr: 'सप्युम AFB स्मीयर',                price: 200, sample: 'Sputum', sampleMr: 'कफ',  reportTime: '24 hrs',   reportTimeMr: '२४ तास',       category: 'Microbiology', categoryMr: 'सूक्ष्मजीवशास्त्र', description: 'Screens for tuberculosis (TB) from sputum sample.' }
];
