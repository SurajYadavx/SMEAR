// PLACEHOLDER DATA — prices, parameter counts and inclusions are illustrative.
// Replace with the lab's real list before launch.
// Medical wording must be confirmed by the lab owner (Mr. Pradip S. Jadhav).
// Do NOT copy wording or prices from Metropolis, Redcliffe, or BookMyTest.
// All Marathi text is AI-generated and needs native review before going live.

window.PACKAGE_DATA = [

  // ── 1. BASIC HEALTH CHECKUP ───────────────────────────────
  {
    id:             'basic-health-checkup',
    slug:           'basic-health-checkup',
    name:           'Basic Health Checkup',
    nameMr:         'मूलभूत आरोग्य तपासणी',          // needs native review
    tagline:        'A practical start for routine screening',
    taglineMr:      'नित्य तपासणीसाठी योग्य सुरुवात', // needs native review
    category:       'Full Body',
    categoryMr:     'संपूर्ण शरीर',
    price:          599,
    mrp:            null,          // no invented discount — set real value when known
    paramCount:     45,
    fasting:        '10–12 hours',
    fastingMr:      '१०–१२ तास',
    reportTime:     'Same day / 24 hrs',
    reportTimeMr:   'त्याच दिवशी / २४ तास',
    sample:         'Blood + Urine',
    homeCollection: true,
    image:          null,          // filename in public/assets/packages/ — add when available

    // Grouped test list (what's actually run)
    profiles: [
      { title: 'Complete Blood Count', titleMr: 'संपूर्ण रक्त गणना', tests: ['Haemoglobin', 'WBC', 'Platelets', 'MCV', 'MCH', 'MCHC', 'RBC'] },
      { title: 'Blood Sugar',           titleMr: 'रक्त शर्करा',        tests: ['Fasting Blood Sugar'] },
      { title: 'Liver Function',        titleMr: 'यकृत कार्य',         tests: ['SGOT', 'SGPT', 'Total Bilirubin', 'Direct Bilirubin'] },
      { title: 'Kidney Function',       titleMr: 'मूत्रपिंड कार्य',    tests: ['Creatinine', 'Blood Urea Nitrogen'] },
      { title: 'Urine Routine',         titleMr: 'मूत्र रूटीन',        tests: ['Colour', 'Appearance', 'Protein', 'Sugar', 'Pus Cells', 'RBC'] }
    ],

    highlights: ['CBC with differential', 'Fasting blood sugar', 'Liver + kidney basics', 'Urine routine'],

    whoShouldTake:   'Adults who want a quick baseline overview before a seasonal checkup or after feeling off for a few days.',
    whoShouldTakeMr: 'प्रौढांसाठी जे हंगामी तपासणीपूर्वी किंवा काही दिवस अस्वस्थ वाटल्यावर प्राथमिक माहिती मिळवू इच्छितात.', // needs native review
    whyItMatters:    'Catches anaemia, infection signs, early blood sugar trends, and basic liver/kidney strain — all in one sample visit.',
    whyItMattersMr:  'अशक्तपणा, संसर्गाची चिन्हे, रक्त शर्करेतील बदल आणि यकृत/मूत्रपिंडावरील ताण एकाच भेटीत कळतात.', // needs native review

    bookingSteps: [
      'Call or WhatsApp us to confirm your slot',
      'Fast for 10–12 hours before sample collection (water allowed)',
      'Visit the lab or request home collection',
      'Sample collected in a few minutes',
      'Report shared same day via WhatsApp or on request'
    ],

    faq: [
      { q: 'Do I need a doctor\'s prescription?',      a: 'No prescription is required for this health checkup package.' },
      { q: 'Is fasting required?',                     a: 'Yes — please fast for 10–12 hours before the blood draw. Water is fine.' },
      { q: 'How long before I get my report?',         a: 'Most reports from this package are ready the same day or within 24 hours.' },
      { q: 'Can this be done at home?',                a: 'Home collection is available — contact us to book a visit.' },
      { q: 'Are children\'s doses and ranges different?', a: 'Yes — reference ranges differ by age. Our team will note the patient\'s age when reports are prepared.' }
    ]
  },

  // ── 2. FULL BODY CHECKUP ──────────────────────────────────
  {
    id:             'full-body-checkup',
    slug:           'full-body-checkup',
    name:           'Full Body Checkup',
    nameMr:         'संपूर्ण शरीर तपासणी',           // needs native review
    tagline:        'Balanced wellness screening for everyday health',
    taglineMr:      'दैनंदिन आरोग्यासाठी संतुलित तपासणी', // needs native review
    category:       'Full Body',
    categoryMr:     'संपूर्ण शरीर',
    price:          1499,
    mrp:            null,
    paramCount:     85,
    fasting:        '10–12 hours',
    fastingMr:      '१०–१२ तास',
    reportTime:     '24 hrs',
    reportTimeMr:   '२४ तास',
    sample:         'Blood + Urine',
    homeCollection: true,
    image:          null,

    profiles: [
      { title: 'Complete Blood Count', titleMr: 'संपूर्ण रक्त गणना', tests: ['Haemoglobin', 'WBC', 'Platelets', 'Hematocrit', 'MCV', 'MCH', 'MCHC', 'RBC'] },
      { title: 'Thyroid',              titleMr: 'थायरॉइड',           tests: ['T3', 'T4', 'TSH'] },
      { title: 'Diabetes',             titleMr: 'मधुमेह',            tests: ['HbA1c', 'Fasting Blood Sugar'] },
      { title: 'Liver Function',       titleMr: 'यकृत कार्य',        tests: ['SGOT', 'SGPT', 'ALP', 'Albumin', 'Total Protein', 'Total Bilirubin'] },
      { title: 'Kidney Function',      titleMr: 'मूत्रपिंड कार्य',   tests: ['Creatinine', 'Urea', 'Uric Acid', 'BUN'] },
      { title: 'Lipid Profile',        titleMr: 'लिपिड प्रोफाइल',   tests: ['Total Cholesterol', 'Triglycerides', 'HDL', 'LDL', 'VLDL'] },
      { title: 'Vitamins & Minerals',  titleMr: 'जीवनसत्त्वे',       tests: ['Vitamin D (25-OH)', 'Calcium'] },
      { title: 'Urine Routine',        titleMr: 'मूत्र रूटीन',       tests: ['Protein', 'Sugar', 'Pus Cells', 'Appearance', 'pH'] }
    ],

    highlights: ['Thyroid profile (T3/T4/TSH)', 'HbA1c (3-month sugar average)', 'Lipid profile', 'Vitamin D', 'Complete liver + kidney'],

    whoShouldTake:   'Adults 25 and above who want a broader picture of metabolism, thyroid, vitamins, and organ health — ideal as an annual checkup.',
    whoShouldTakeMr: '२५ वर्षांवरील प्रौढांसाठी जे चयापचय, थायरॉइड, जीवनसत्त्वे आणि अवयव आरोग्याची विस्तृत माहिती मिळवू इच्छितात.', // needs native review
    whyItMatters:    'Covers thyroid imbalance, long-term sugar control, cholesterol trends, vitamin D deficiency, and major organ function in a single visit.',
    whyItMattersMr:  'थायरॉइड असंतुलन, दीर्घकालीन रक्त शर्करा नियंत्रण, कोलेस्ट्रॉल, व्हिटॅमिन डी कमतरता आणि अवयव कार्य एकाच भेटीत तपासता येते.', // needs native review

    bookingSteps: [
      'Call or WhatsApp to book',
      'Fast for 10–12 hours (water allowed)',
      'Visit lab or request home collection',
      'Report ready in 24 hours'
    ],

    faq: [
      { q: 'Why is TSH included?',      a: 'Thyroid disorders are common and often go undetected — TSH is a key screening marker.' },
      { q: 'What does HbA1c show?',     a: 'HbA1c reflects your average blood sugar over the past 2–3 months, which is more useful than a single fasting reading.' },
      { q: 'Is fasting required?',      a: 'Yes — fast 10–12 hours before your appointment. Water is fine.' },
      { q: 'Can I add tests?',          a: 'Yes — call us and we can often add individual tests at a combined rate.' },
      { q: 'Is home collection available?', a: 'Yes — book via WhatsApp or call and we\'ll arrange a home visit.' }
    ]
  },

  // ── 3. DIABETES CARE PANEL ────────────────────────────────
  {
    id:             'diabetes-care-panel',
    slug:           'diabetes-care-panel',
    name:           'Diabetes Care Panel',
    nameMr:         'मधुमेह काळजी पॅनेल',            // needs native review
    tagline:        'Monitoring for diagnosed or at-risk individuals',
    taglineMr:      'मधुमेह असलेल्या किंवा जोखीम असलेल्यांसाठी नियमित तपासणी', // needs native review
    category:       'Diabetes',
    categoryMr:     'मधुमेह',
    price:          799,
    mrp:            null,
    paramCount:     12,
    fasting:        '10–12 hours',
    fastingMr:      '१०–१२ तास',
    reportTime:     'Same day',
    reportTimeMr:   'त्याच दिवशी',
    sample:         'Blood + Urine',
    homeCollection: true,
    image:          null,

    profiles: [
      { title: 'Glucose Control',  titleMr: 'ग्लुकोज नियंत्रण',   tests: ['Fasting Blood Sugar', 'Post Prandial Blood Sugar', 'HbA1c'] },
      { title: 'Kidney Markers',   titleMr: 'मूत्रपिंड सूचक',     tests: ['Creatinine', 'Urea', 'Microalbumin in Urine'] },
      { title: 'Lipid Screen',     titleMr: 'लिपिड तपासणी',       tests: ['Total Cholesterol', 'Triglycerides', 'HDL', 'LDL'] },
      { title: 'Urine',            titleMr: 'मूत्र',               tests: ['Routine Urine Examination'] }
    ],

    highlights: ['HbA1c', 'Fasting + PP sugar', 'Kidney function', 'Cholesterol screen'],

    whoShouldTake:   'People already diagnosed with diabetes (Type 1 or Type 2) who need regular monitoring, or those with a strong family history of diabetes.',
    whoShouldTakeMr: 'मधुमेह (टाइप १ किंवा टाइप २) असलेल्या किंवा कौटुंबिक इतिहास असलेल्या व्यक्तींसाठी.', // needs native review
    whyItMatters:    'Tracks long-term sugar control, kidney impact (a common complication), and cholesterol — three key pillars of diabetes management.',
    whyItMattersMr:  'दीर्घकालीन रक्त शर्करा, मूत्रपिंडावर परिणाम (सामान्य गुंतागुंत) आणि कोलेस्ट्रॉल — मधुमेह व्यवस्थापनाचे तीन महत्त्वाचे घटक.', // needs native review

    bookingSteps: [
      'Fast for 10–12 hours before the blood test',
      'Bring urine sample in a clean container if possible, or collect at the lab',
      'Results typically same day'
    ],

    faq: [
      { q: 'How often should a diabetic person do this panel?',  a: 'Generally every 3–6 months, depending on your doctor\'s advice and how well sugar is controlled.' },
      { q: 'What does microalbumin in urine show?',             a: 'It is an early marker of kidney involvement in diabetics — catching it early allows treatment before serious damage.' },
      { q: 'Can I do this if my sugar is well controlled?',     a: 'Yes — regular monitoring is important even when you feel fine.' }
    ]
  },

  // ── 4. THYROID PROFILE ────────────────────────────────────
  {
    id:             'thyroid-profile',
    slug:           'thyroid-profile',
    name:           'Thyroid Profile',
    nameMr:         'थायरॉइड प्रोफाइल',              // needs native review
    tagline:        'T3, T4 and TSH — the core thyroid screen',
    taglineMr:      'T3, T4 आणि TSH — मूलभूत थायरॉइड तपासणी', // needs native review
    category:       'Thyroid',
    categoryMr:     'थायरॉइड',
    price:          399,
    mrp:            null,
    paramCount:     3,
    fasting:        'Not required',
    fastingMr:      'आवश्यक नाही',
    reportTime:     'Same day',
    reportTimeMr:   'त्याच दिवशी',
    sample:         'Blood',
    homeCollection: true,
    image:          null,

    profiles: [
      { title: 'Thyroid Hormones', titleMr: 'थायरॉइड संप्रेरक', tests: ['T3 (Triiodothyronine)', 'T4 (Thyroxine)', 'TSH (Thyroid Stimulating Hormone)'] }
    ],

    highlights: ['T3', 'T4', 'TSH — all three in one visit', 'No fasting needed'],

    whoShouldTake:   'Anyone experiencing unexplained weight changes, fatigue, hair loss, mood shifts, or irregular periods — or anyone with a family history of thyroid disease.',
    whoShouldTakeMr: 'ज्यांना अचानक वजन बदल, थकवा, केस गळणे, मूड बदल किंवा अनियमित मासिक पाळी जाणवते त्यांच्यासाठी.', // needs native review
    whyItMatters:    'The thyroid gland controls metabolism, energy, and mood. Imbalances (hypo- or hyperthyroid) are common and highly treatable once identified.',
    whyItMattersMr:  'थायरॉइड ग्रंथी चयापचय, ऊर्जा आणि मूडवर नियंत्रण ठेवते. असंतुलन सामान्य आहे आणि उपचार करता येते.', // needs native review

    bookingSteps: [
      'No fasting required — you can eat and drink normally',
      'Walk in or book a home collection slot',
      'Report the same day'
    ],

    faq: [
      { q: 'Does time of day matter for thyroid test?',   a: 'TSH is usually highest in the morning. For consistent monitoring over time, try to test at a similar time of day.' },
      { q: 'No fasting — really?',                        a: 'Correct — thyroid hormones are not significantly affected by meals.' },
      { q: 'If TSH is abnormal, what next?',              a: 'Consult your doctor — they may request additional tests like Anti-TPO antibodies or an ultrasound, which we can also assist with.' }
    ]
  },

  // ── 5. WOMEN'S WELLNESS PANEL ─────────────────────────────
  {
    id:             'womens-wellness-panel',
    slug:           'womens-wellness-panel',
    name:           "Women's Wellness Panel",
    nameMr:         'महिला आरोग्य पॅनेल',             // needs native review
    tagline:        'Targeted screening for women of all ages',
    taglineMr:      'सर्व वयोगटातील महिलांसाठी लक्ष्यित तपासणी', // needs native review
    category:       "Women's Health",
    categoryMr:     'महिला आरोग्य',
    price:          1199,
    mrp:            null,
    paramCount:     22,
    fasting:        '10–12 hours',
    fastingMr:      '१०–१२ तास',
    reportTime:     '24 hrs',
    reportTimeMr:   '२४ तास',
    sample:         'Blood + Urine',
    homeCollection: true,
    image:          null,

    profiles: [
      { title: 'Blood & Iron',     titleMr: 'रक्त आणि लोह',        tests: ['Haemoglobin', 'CBC', 'Serum Iron', 'TIBC', 'Ferritin'] },
      { title: 'Thyroid',          titleMr: 'थायरॉइड',             tests: ['TSH'] },
      { title: 'Diabetes',         titleMr: 'मधुमेह',              tests: ['Fasting Blood Sugar', 'HbA1c'] },
      { title: 'Bone Health',      titleMr: 'हाडांचे आरोग्य',      tests: ['Vitamin D (25-OH)', 'Calcium', 'Phosphorus'] },
      { title: 'Liver & Kidney',   titleMr: 'यकृत आणि मूत्रपिंड', tests: ['SGOT', 'SGPT', 'Creatinine', 'Uric Acid'] },
      { title: 'Urine Routine',    titleMr: 'मूत्र रूटीन',         tests: ['Routine Urine Examination'] }
    ],

    highlights: ['Iron + Ferritin (anaemia screen)', 'TSH', 'Vitamin D + Calcium', 'HbA1c'],

    whoShouldTake:   'Women aged 20 and above — especially useful for those experiencing fatigue, irregular periods, hair loss, or approaching menopause.',
    whoShouldTakeMr: '२० वर्षांवरील महिला — विशेषतः ज्यांना थकवा, अनियमित मासिक पाळी, केस गळणे जाणवते.', // needs native review
    whyItMatters:    'Iron deficiency and Vitamin D deficiency are extremely common in women and often missed. This panel covers the most frequently seen gaps.',
    whyItMattersMr:  'लोहाची आणि व्हिटॅमिन डीची कमतरता महिलांमध्ये सामान्य आहे आणि अनेकदा दुर्लक्षित राहते.', // needs native review

    bookingSteps: [
      'Fast for 10–12 hours',
      'Book a lab visit or home collection',
      'Report shared in 24 hours'
    ],

    faq: [
      { q: 'Is this suitable for teenage girls?',  a: 'Yes — the panel is relevant from age 15–16 onwards. Discuss with us if there are specific concerns.' },
      { q: 'Can pregnant women take this?',        a: 'Please consult your doctor first — some reference ranges change during pregnancy.' },
      { q: 'Does this include hormonal tests?',    a: 'Not in the standard panel. Hormonal tests (FSH, LH, Prolactin, Estradiol) can be added — ask us.' }
    ]
  },

  // ── 6. SENIOR CARE PANEL ──────────────────────────────────
  {
    id:             'senior-care-panel',
    slug:           'senior-care-panel',
    name:           'Senior Care Panel',
    nameMr:         'ज्येष्ठ नागरिक काळजी पॅनेल',    // needs native review
    tagline:        'Comprehensive screening for adults 50 and above',
    taglineMr:      '५० वर्षांवरील प्रौढांसाठी सर्वसमावेशक तपासणी', // needs native review
    category:       'Senior Health',
    categoryMr:     'ज्येष्ठ आरोग्य',
    price:          1899,
    mrp:            null,
    paramCount:     65,
    fasting:        '10–12 hours',
    fastingMr:      '१०–१२ तास',
    reportTime:     '24 hrs',
    reportTimeMr:   '२४ तास',
    sample:         'Blood + Urine',
    homeCollection: true,
    image:          null,

    profiles: [
      { title: 'Complete Blood Count', titleMr: 'संपूर्ण रक्त गणना',  tests: ['Haemoglobin', 'WBC', 'Platelets', 'MCV', 'MCH', 'MCHC', 'RBC'] },
      { title: 'Diabetes',             titleMr: 'मधुमेह',             tests: ['Fasting Blood Sugar', 'HbA1c', 'Post Prandial Blood Sugar'] },
      { title: 'Thyroid',              titleMr: 'थायरॉइड',            tests: ['T3', 'T4', 'TSH'] },
      { title: 'Heart & Lipids',       titleMr: 'हृदय आणि लिपिड',    tests: ['Total Cholesterol', 'Triglycerides', 'HDL', 'LDL', 'VLDL'] },
      { title: 'Kidney Function',      titleMr: 'मूत्रपिंड कार्य',    tests: ['Creatinine', 'BUN', 'Uric Acid', 'eGFR'] },
      { title: 'Liver Function',       titleMr: 'यकृत कार्य',         tests: ['SGOT', 'SGPT', 'ALP', 'Total Bilirubin', 'Albumin', 'Total Protein'] },
      { title: 'Bone & Vitamins',      titleMr: 'हाडे आणि जीवनसत्त्वे', tests: ['Vitamin D (25-OH)', 'Calcium', 'Phosphorus', 'Vitamin B12'] },
      { title: 'Urine Routine',        titleMr: 'मूत्र रूटीन',        tests: ['Routine Urine Examination'] }
    ],

    highlights: ['eGFR (kidney health)', 'Vitamin B12', 'HbA1c', 'Full lipid profile', 'Bone markers'],

    whoShouldTake:   'Men and women aged 50 and above — especially those managing chronic conditions, or anyone wanting a thorough annual review.',
    whoShouldTakeMr: '५० वर्षांवरील पुरुष आणि महिला — विशेषतः जुनाट आजार असलेले किंवा वार्षिक तपासणी इच्छिणारे.', // needs native review
    whyItMatters:    'After 50, multiple systems need regular review. This panel looks at the areas most likely to change: kidney filtering, bone density markers, B12 status, and long-term sugar and heart-risk markers.',
    whyItMattersMr:  '५० नंतर अनेक अवयव प्रणाली नियमित तपासणीची गरज असते — मूत्रपिंड, हाडे, B12, रक्त शर्करा आणि हृदय जोखीम.', // needs native review

    bookingSteps: [
      'Fast for 10–12 hours before the blood draw',
      'Home collection is available — ideal for senior patients',
      'Report ready in 24 hours'
    ],

    faq: [
      { q: 'Can this be done at home for elderly patients?', a: 'Yes — home collection is available. We recommend booking a morning slot when possible.' },
      { q: 'What is eGFR?',                                  a: 'Estimated Glomerular Filtration Rate — a key measure of how well your kidneys are filtering blood.' },
      { q: 'Does this cover cardiac markers?',               a: 'It includes a full lipid profile which indicates heart disease risk. Specific cardiac markers (like Troponin or NT-proBNP) can be added on request.' }
    ]
  },

  // ── 7. HEART CARE PANEL ───────────────────────────────────
  {
    id:             'heart-care-panel',
    slug:           'heart-care-panel',
    name:           'Heart Care Panel',
    nameMr:         'हृदय काळजी पॅनेल',              // needs native review
    tagline:        'Lipid and cardiovascular risk screening',
    taglineMr:      'लिपिड आणि हृदय जोखीम तपासणी',   // needs native review
    category:       'Heart',
    categoryMr:     'हृदय',
    price:          699,
    mrp:            null,
    paramCount:     10,
    fasting:        '10–12 hours',
    fastingMr:      '१०–१२ तास',
    reportTime:     'Same day',
    reportTimeMr:   'त्याच दिवशी',
    sample:         'Blood',
    homeCollection: false,         // confirm with client
    image:          null,

    profiles: [
      { title: 'Lipid Profile',   titleMr: 'लिपिड प्रोफाइल',   tests: ['Total Cholesterol', 'Triglycerides', 'HDL Cholesterol', 'LDL Cholesterol', 'VLDL Cholesterol', 'Cholesterol/HDL Ratio'] },
      { title: 'Glucose',         titleMr: 'ग्लुकोज',           tests: ['Fasting Blood Sugar'] },
      { title: 'Liver (basic)',    titleMr: 'यकृत (मूलभूत)',     tests: ['SGOT', 'SGPT'] },
      { title: 'Kidney (basic)',   titleMr: 'मूत्रपिंड (मूलभूत)', tests: ['Creatinine'] }
    ],

    highlights: ['Complete lipid profile', 'HDL + LDL breakdown', 'Cholesterol/HDL risk ratio'],

    whoShouldTake:   'Adults 30 and above with risk factors: family history of heart disease, high BP, obesity, sedentary lifestyle, or smoking history.',
    whoShouldTakeMr: '३० वर्षांवरील प्रौढ ज्यांना कौटुंबिक हृदयरोग इतिहास, उच्च रक्तदाब, लठ्ठपणा किंवा धूम्रपानाचा इतिहास आहे.', // needs native review
    whyItMatters:    'High LDL and low HDL are key modifiable risk factors for heart disease. Early detection allows dietary and lifestyle changes before medication is needed.',
    whyItMattersMr:  'उच्च LDL आणि कमी HDL हे हृदयरोगाचे प्रमुख बदलण्यायोग्य जोखीम घटक आहेत. लवकर तपासणी करणे फायदेशीर ठरते.', // needs native review

    bookingSteps: [
      'Fast for 10–12 hours — this is particularly important for accurate lipid readings',
      'Walk in or book in advance',
      'Report ready same day'
    ],

    faq: [
      { q: 'Why must I fast for a lipid test?',      a: 'Triglycerides are strongly affected by recent meals — fasting gives the most accurate baseline reading.' },
      { q: 'What is a good cholesterol level?',      a: 'This varies by individual risk factors. Your doctor is the right person to interpret results in context of your health history.' },
      { q: 'Can I take my BP medication before the test?', a: 'Generally yes, but confirm with your doctor about any specific medications.' }
    ]
  },

  // ── 8. FEVER / INFECTION PANEL ────────────────────────────
  {
    id:             'fever-infection-panel',
    slug:           'fever-infection-panel',
    name:           'Fever & Infection Panel',
    nameMr:         'ताप आणि संसर्ग पॅनेल',          // needs native review
    tagline:        'Quick screen for common febrile illnesses',
    taglineMr:      'सामान्य ताप आजारांसाठी जलद तपासणी', // needs native review
    category:       'Fever / Infection',
    categoryMr:     'ताप / संसर्ग',
    price:          899,
    mrp:            null,
    paramCount:     8,
    fasting:        'Not required',
    fastingMr:      'आवश्यक नाही',
    reportTime:     'Same day',
    reportTimeMr:   'त्याच दिवशी',
    sample:         'Blood',
    homeCollection: false,         // confirm with client
    image:          null,

    profiles: [
      { title: 'Blood Count',     titleMr: 'रक्त गणना',  tests: ['CBC with Differential', 'ESR'] },
      { title: 'Infection Flags', titleMr: 'संसर्ग चिन्हे', tests: ['CRP (C-Reactive Protein)', 'Widal Test', 'Dengue NS1 Antigen', 'Malaria (MP) Test'] }
    ],

    highlights: ['CBC + ESR', 'CRP', 'Widal (typhoid)', 'Dengue NS1', 'Malaria test'],

    whoShouldTake:   'Anyone with fever lasting more than 2 days, especially if accompanied by body ache, weakness, or no obvious cause.',
    whoShouldTakeMr: 'दोन दिवसांपेक्षा जास्त काळ ताप असलेल्यांसाठी, विशेषतः अंगदुखी, अशक्तपणा किंवा उघड कारण नसल्यास.', // needs native review
    whyItMatters:    'Malaria, dengue, and typhoid are prevalent in this region. Early identification allows targeted treatment and prevents complications.',
    whyItMattersMr:  'मलेरिया, डेंग्यू आणि टायफॉइड या परिसरात सामान्य आहेत. लवकर ओळख उपचारात मदत करते.', // needs native review

    bookingSteps: [
      'No fasting required',
      'Walk in or call us — we try to prioritise fever cases quickly',
      'Most results same day'
    ],

    faq: [
      { q: 'Is this panel for a specific illness?',   a: 'No — it screens for the most common causes of fever in our area all at once, so you don\'t need to guess beforehand.' },
      { q: 'What if dengue NS1 is negative but I still have symptoms?', a: 'Dengue NS1 is most sensitive in the first 5 days of illness. Dengue IgM/IgG can be added if symptoms persist beyond that.' },
      { q: 'Do I need a prescription?',               a: 'No prescription is required to get tested.' }
    ]
  }

];
