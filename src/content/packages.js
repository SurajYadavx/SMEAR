// PLACEHOLDER DATA — prices, parameter counts and inclusions are illustrative. Replace with the lab's real list before launch. Medical wording must be confirmed by the lab.
window.PACKAGE_DATA = {
  en: [
    {
      id: 'basic-health-checkup',
      name: 'Basic Health Checkup',
      tagline: 'A practical start for routine screening',
      params: 45,
      price: 599,
      reports: '24 hrs',
      fasting: '10–12 hrs',
      sample: 'Blood',
      concern: 'Full Body',
      highlights: ['CBC with differential', 'Fasting sugar', 'Lipid basics'],
      groups: [
        { title: 'Complete Blood Count', items: ['Hb', 'WBC', 'Platelets', 'MCV', 'MCH'] },
        { title: 'Blood Sugar', items: ['Fasting Blood Sugar', 'Random Blood Sugar'] },
        { title: 'Liver Function', items: ['SGOT', 'SGPT', 'Total Bilirubin'] },
        { title: 'Kidney Function', items: ['Creatinine', 'BUN'] },
        { title: 'Urine Routine', items: ['Protein', 'Sugar', 'Pus cells'] }
      ],
      who: 'Good for routine screening before a seasonal checkup or when you want a quick baseline overview.',
      why: 'Helps spot anemia, infection signs, sugar trends, kidney strain, and basic liver health in one sample visit.',
      prep: 'Fast for 10–12 hours. Water is allowed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'Fasting' 
    },
    {
      id: 'full-body-checkup',
      name: 'Full Body Checkup',
      tagline: 'Balanced wellness screening for everyday health',
      params: 85,
      price: 1499,
      reports: '24 hrs',
      fasting: '10–12 hrs',
      sample: 'Blood',
      concern: 'Full Body',
      highlights: ['Thyroid profile', 'HbA1c', 'Calcium & vitamin D'],
      groups: [
        { title: 'Complete Blood Count', items: ['Hb', 'WBC', 'Platelets', 'Hematocrit'] },
        { title: 'Thyroid', items: ['T3', 'T4', 'TSH'] },
        { title: 'Diabetes', items: ['HbA1c', 'Fasting Sugar'] },
        { title: 'Liver Function', items: ['SGOT', 'SGPT', 'ALP', 'Albumin'] },
        { title: 'Kidney Function', items: ['Creatinine', 'Urea', 'Uric Acid'] },
        { title: 'Vitamins', items: ['Vitamin D', 'Calcium'] }
      ],
      who: 'Suitable for adults who want a broader picture of pulse, energy, metabolism, and organ health.',
      why: 'This helps review thyroid status, blood sugar control, vitamin levels, and major organ function in one package.',
      prep: 'Fast for 10–12 hours. Water is allowed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'Fasting'
    },
    {
      id: 'advanced-full-body-vitamin',
      name: 'Advanced Full Body + Vitamins',
      tagline: 'Broader screening with vitamin and inflammation checks',
      params: 110,
      price: 2299,
      reports: '24 hrs',
      fasting: '10–12 hrs',
      sample: 'Blood',
      concern: 'Full Body',
      highlights: ['CRP', 'Vit B12', 'Iron studies'],
      groups: [
        { title: 'Complete Blood Count', items: ['Hb', 'WBC', 'Platelets', 'RBC count'] },
        { title: 'Lipid', items: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides'] },
        { title: 'Thyroid', items: ['TSH', 'T3', 'T4'] },
        { title: 'Vitamin & Iron', items: ['Vitamin B12', 'Iron', 'Ferritin', 'TIBC'] },
        { title: 'Inflammation', items: ['CRP', 'Electrolytes'] }
      ],
      who: 'Helpful if you have fatigue, body aches, or want a deeper health review with vitamin markers.',
      why: 'It gives a stronger snapshot of immunity, inflammation, iron status, thyroid balance, and metabolic health.',
      prep: 'Fast for 10–12 hours. Water is allowed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'Fasting'
    },
    {
      id: 'diabetes-care',
      name: 'Diabetes Care',
      tagline: 'Simple monitoring for sugar and kidney health',
      params: 12,
      price: 699,
      reports: '24 hrs',
      fasting: '8–10 hrs',
      sample: 'Blood',
      concern: 'Diabetes',
      highlights: ['HbA1c', 'Fasting sugar', 'Kidney basics'],
      groups: [
        { title: 'Diabetes', items: ['Fasting Blood Sugar', 'PP Blood Sugar', 'HbA1c'] },
        { title: 'Kidney Basics', items: ['Creatinine', 'Urea'] },
        { title: 'Urine', items: ['Urine Sugar', 'Albumin'] }
      ],
      who: 'Useful for those monitoring sugar regularly or noticing increased thirst, weakness, or urination.',
      why: 'Keeps an eye on blood sugar control and kidney stress, which often go together in diabetics.',
      prep: 'Fast for 8–10 hours. Water is allowed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'Fasting'
    },
    {
      id: 'thyroid-profile',
      name: 'Thyroid Profile',
      tagline: 'Checks common thyroid concerns simply and clearly',
      params: 3,
      price: 499,
      reports: '24 hrs',
      fasting: 'No fasting',
      sample: 'Blood',
      concern: 'Thyroid',
      highlights: ['TSH', 'T3', 'T4'],
      groups: [
        { title: 'Thyroid', items: ['T3', 'T4', 'TSH'] }
      ],
      who: 'Helpful if you feel tired, gain or lose weight suddenly, or have irregular periods.',
      why: 'This profile helps assess whether thyroid activity is too low or too high.',
      prep: 'No fasting is needed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'No fasting'
    },
    {
      id: 'heart-health',
      name: 'Heart Health',
      tagline: 'Review of cholesterol, sugar, and heart risk markers',
      params: 20,
      price: 999,
      reports: '24 hrs',
      fasting: '10–12 hrs',
      sample: 'Blood',
      concern: 'Heart',
      highlights: ['Lipid profile', 'CRP', 'Blood sugar'],
      groups: [
        { title: 'Lipid Profile', items: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides'] },
        { title: 'Cardiac Risk', items: ['CRP', 'Fasting Sugar'] },
        { title: 'Kidney Basics', items: ['Creatinine', 'Urea'] }
      ],
      who: 'Suitable for adults with family history, high stress, or a history of high cholesterol.',
      why: 'It helps review the major markers that affect heart and circulation health.',
      prep: 'Fast for 10–12 hours. Water is allowed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'Fasting'
    },
    {
      id: 'womens-wellness',
      name: 'Women\'s Wellness',
      tagline: 'Focused review for common female health markers',
      params: 60,
      price: 1299,
      reports: '24 hrs',
      fasting: '10–12 hrs',
      sample: 'Blood',
      concern: 'Women',
      highlights: ['CBC', 'Iron', 'Vitamin D'],
      groups: [
        { title: 'Blood & Iron', items: ['CBC', 'Iron Studies', 'Ferritin'] },
        { title: 'Thyroid', items: ['TSH', 'T3', 'T4'] },
        { title: 'Vitamin & Bone', items: ['Vitamin D', 'Calcium', 'B12'] },
        { title: 'Urine Routine', items: ['Protein', 'Sugar', 'Pus cells'] }
      ],
      who: 'Helpful for fatigue, irregular periods, low immunity, or general health screening.',
      why: 'This review checks iron, vitamins, thyroid balance, and general blood health.',
      prep: 'Fast for 10–12 hours. Water is allowed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'Fasting'
    },
    {
      id: 'senior-citizen-checkup',
      name: 'Senior Citizen Checkup',
      tagline: 'A fuller review for age-related screening needs',
      params: 90,
      price: 1799,
      reports: '24 hrs',
      fasting: '10–12 hrs',
      sample: 'Blood',
      concern: 'Senior',
      highlights: ['Kidney', 'Liver', 'Electrolytes'],
      groups: [
        { title: 'Complete Blood Count', items: ['Hb', 'WBC', 'Platelets'] },
        { title: 'Kidney Function', items: ['Creatinine', 'Urea', 'Electrolytes'] },
        { title: 'Liver Function', items: ['SGOT', 'SGPT', 'ALP'] },
        { title: 'Urine Routine', items: ['Protein', 'Sugar', 'Cells'] }
      ],
      who: 'Well suited for older adults wanting a regular health review and better early screening.',
      why: 'Helps assess organ function, sugar control, blood health, and general wellness trends.',
      prep: 'Fast for 10–12 hours. Water is allowed. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'Fasting'
    },
    {
      id: 'fever-monsoon-panel',
      name: 'Fever / Monsoon Panel',
      tagline: 'Common infection screen for fever and seasonal illness',
      params: 10,
      price: 899,
      reports: 'Same/next day',
      fasting: 'No fasting',
      sample: 'Blood',
      concern: 'Fever/Infection',
      highlights: ['CBC', 'Malaria', 'Dengue'],
      groups: [
        { title: 'Blood Screening', items: ['CBC', 'Malaria Test', 'Dengue NS1'] },
        { title: 'Infection Markers', items: ['CRP', 'Widal / Typhi'] },
        { title: 'Urine Routine', items: ['Protein', 'Pus cells', 'Sugar'] }
      ],
      who: 'Useful during fever, weakness, or monsoon illness when infection testing is needed quickly.',
      why: 'Helps review common bacterial or viral infection markers before starting treatment or follow-up.',
      prep: 'No fasting is required. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'No fasting'
    },
    {
      id: 'urine-infection-screen',
      name: 'Urine & Infection Screen',
      tagline: 'Focused check for urinary and stool infection concerns',
      params: 15,
      price: 499,
      reports: '24–48 hrs',
      fasting: 'No fasting',
      sample: 'Urine',
      concern: 'Urine & Stool Infection',
      highlights: ['Urine culture', 'Stool routine', 'Infection check'],
      groups: [
        { title: 'Urine', items: ['Urine Routine', 'Urine Culture & Sensitivity'] },
        { title: 'Stool', items: ['Stool Routine'] },
        { title: 'Infection Signs', items: ['Pus cells', 'Bacteria', 'Leukocytes'] }
      ],
      who: 'Useful when there is burning while passing urine, abdominal discomfort, or recurring infections.',
      why: 'Helps identify common urinary or stool infection patterns and guides the right follow-up.',
      prep: 'No fasting is required. Inform us about any medicines you take.',
      delivery: 'Reports are shared by WhatsApp or collected on request.',
      sticker: 'No fasting'
    }
  ],
  mr: [
    {
      id: 'basic-health-checkup',
      name: 'मूलभूत आरोग्य तपासणी',
      tagline: 'नियमित तपासणीसाठी सोपी सुरुवात',
      params: 45,
      price: 599,
      reports: '२४ तास',
      fasting: '१०–१२ तास',
      sample: 'रक्त',
      concern: 'पूर्ण शरीर',
      highlights: ['सीबीसी', 'उपवासातील साखर', 'लिपिड बेसिक'],
      groups: [
        { title: 'सीबीसी', items: ['Hb', 'WBC', 'Platelets', 'MCV', 'MCH'] },
        { title: 'रक्तातील साखर', items: ['उपवास साखर', 'रँडम साखर'] },
        { title: 'यकृत', items: ['SGOT', 'SGPT', 'Total Bilirubin'] },
        { title: 'किडनी', items: ['Creatinine', 'BUN'] },
        { title: 'मूत्र तपासणी', items: ['Protein', 'Sugar', 'Pus cells'] }
      ],
      who: 'सामान्य आरोग्य तपासणी किंवा बेसलाइन माहिती पाहण्यासाठी योग्य.',
      why: 'रक्तालगत, साखर, किडनी आणि यकृत यांची मूलभूत माहिती मिळते.',
      prep: '१०–१२ तास उपवास. पाणी चालते. कोणतेही औषध घेत असल्यास सांगावे.',
      delivery: 'अहवाल WhatsApp वर पाठवला जातो किंवा घेतला जाऊ शकतो.',
      sticker: 'उपवास' 
    },
    {
      id: 'full-body-checkup',
      name: 'फुल बॉडी चेकअप',
      tagline: 'दैनंदिन आरोग्यासाठी संतुलित तपासणी',
      params: 85,
      price: 1499,
      reports: '२४ तास',
      fasting: '१०–१२ तास',
      sample: 'रक्त',
      concern: 'पूर्ण शरीर',
      highlights: ['थायरॉईड', 'HbA1c', 'कॅल्शियम', 'व्हिटामिन डी'],
      groups: [
        { title: 'सीबीसी', items: ['Hb', 'WBC', 'Platelets', 'Hematocrit'] },
        { title: 'थायरॉईड', items: ['T3', 'T4', 'TSH'] },
        { title: 'डायबेटीज', items: ['HbA1c', 'Fasting Sugar'] },
        { title: 'यकृत', items: ['SGOT', 'SGPT', 'ALP', 'Albumin'] },
        { title: 'किडनी', items: ['Creatinine', 'Urea', 'Uric Acid'] },
        { title: 'व्हिटामिन', items: ['Vitamin D', 'Calcium'] }
      ],
      who: 'उर्जेमुळे, थकवा, चयापचय आणि आरोग्य तपासणी करायची असल्यास योग्य.',
      why: 'थायरॉईड, साखर, व्हिटामिन आणि प्रमुख अवयवांची माहिती मिळते.',
      prep: '१०–१२ तास उपवास. पाणी चालते. कोणतेही औषध घेत असल्यास सांगावे.',
      delivery: 'अहवाल WhatsApp वर पाठवला जातो किंवा घेतला जाऊ शकतो.',
      sticker: 'उपवास'
    }
  ]
};

var packageTranslationsMr = {
  'advanced-full-body-vitamin': {
    name: 'सविस्तर आरोग्य व जीवनसत्त्व तपासणी', tagline: 'जीवनसत्त्वे आणि दाह तपासण्यांसह विस्तृत तपासणी', concern: 'पूर्ण शरीर',
    highlights: ['CRP', 'व्हिटॅमिन B12', 'लोह तपासणी'], who: 'थकवा, अंगदुखी किंवा जीवनसत्त्वांच्या तपासणीसह सविस्तर आरोग्य आढावा हवा असल्यास उपयुक्त.',
    why: 'रोगप्रतिकारक शक्ती, दाह, लोह, थायरॉईड आणि चयापचय आरोग्याची माहिती देते.', prep: '१०–१२ तास उपवास. पाणी चालते. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवास'
  },
  'diabetes-care': {
    name: 'मधुमेह तपासणी', tagline: 'साखर आणि किडनी आरोग्याची नियमित तपासणी', concern: 'डायबेटीज',
    highlights: ['HbA1c', 'उपवासातील साखर', 'किडनी तपासणी'], who: 'रक्तातील साखरेचे नियमित निरीक्षण करणाऱ्यांसाठी उपयुक्त.',
    why: 'रक्तातील साखरेचे नियंत्रण आणि किडनीवरील ताण तपासण्यास मदत होते.', prep: '८–१० तास उपवास. पाणी चालते. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवास'
  },
  'thyroid-profile': {
    name: 'थायरॉईड तपासणी', tagline: 'थायरॉईडच्या सामान्य समस्यांची तपासणी', concern: 'थायरॉईड',
    highlights: ['TSH', 'T3', 'T4'], who: 'थकवा, अचानक वजनबदल किंवा अनियमित मासिक पाळी असल्यास उपयुक्त.',
    why: 'थायरॉईडचे कार्य कमी किंवा जास्त आहे का याचे मूल्यांकन करते.', prep: 'उपवासाची गरज नाही. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवासाची गरज नाही'
  },
  'heart-health': {
    name: 'हृदय आरोग्य तपासणी', tagline: 'कोलेस्ट्रॉल, साखर आणि हृदयाशी संबंधित घटकांचा आढावा', concern: 'हृदय',
    highlights: ['लिपिड प्रोफाइल', 'CRP', 'रक्तातील साखर'], who: 'कुटुंबात हृदयरोगाचा इतिहास किंवा कोलेस्ट्रॉल वाढलेले असल्यास उपयुक्त.',
    why: 'हृदय व रक्ताभिसरणाशी संबंधित प्रमुख घटकांचा आढावा घेते.', prep: '१०–१२ तास उपवास. पाणी चालते. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवास'
  },
  'womens-wellness': {
    name: 'महिलांचे आरोग्य तपासणी पॅकेज', tagline: 'महिलांच्या आरोग्याशी संबंधित सामान्य घटकांची तपासणी', concern: 'महिला',
    highlights: ['CBC', 'लोह', 'व्हिटॅमिन D'], who: 'थकवा, अनियमित मासिक पाळी किंवा सर्वसाधारण आरोग्य तपासणीसाठी उपयुक्त.',
    why: 'लोह, जीवनसत्त्वे, थायरॉईड आणि रक्ताच्या आरोग्याची तपासणी करते.', prep: '१०–१२ तास उपवास. पाणी चालते. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवास'
  },
  'senior-citizen-checkup': {
    name: 'ज्येष्ठ नागरिक आरोग्य तपासणी', tagline: 'वयानुसार आरोग्य तपासणीसाठी सविस्तर आढावा', concern: 'ज्येष्ठ नागरिक',
    highlights: ['किडनी', 'यकृत', 'इलेक्ट्रोलाइट्स'], who: 'नियमित आरोग्य आढावा घेऊ इच्छिणाऱ्या ज्येष्ठांसाठी उपयुक्त.',
    why: 'अवयवांचे कार्य, साखरेचे नियंत्रण आणि रक्ताच्या आरोग्याचा आढावा घेते.', prep: '१०–१२ तास उपवास. पाणी चालते. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवास'
  },
  'fever-monsoon-panel': {
    name: 'ताप व पावसाळी आजार तपासणी', tagline: 'ताप आणि हंगामी आजारांसाठी सामान्य संसर्ग तपासणी', concern: 'ज्वर/संक्रमण',
    highlights: ['CBC', 'मलेरिया', 'डेंग्यू'], who: 'ताप, अशक्तपणा किंवा पावसाळ्यातील आजारांमध्ये उपयुक्त.',
    why: 'सामान्य जिवाणू किंवा विषाणू संसर्गाच्या घटकांचा आढावा घेते.', prep: 'उपवासाची गरज नाही. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवासाची गरज नाही'
  },
  'urine-infection-screen': {
    name: 'मूत्र व संसर्ग तपासणी', tagline: 'मूत्रमार्ग आणि मलाशी संबंधित संसर्गाची तपासणी', concern: 'मूत्र व मल संसर्ग',
    highlights: ['मूत्र कल्चर', 'मल तपासणी', 'संसर्ग तपासणी'], who: 'लघवी करताना जळजळ, पोटात त्रास किंवा वारंवार संसर्ग होत असल्यास उपयुक्त.',
    why: 'मूत्र किंवा मलाशी संबंधित सामान्य संसर्गाची चिन्हे तपासते.', prep: 'उपवासाची गरज नाही. औषधे घेत असल्यास प्रयोगशाळेला सांगा.', sticker: 'उपवासाची गरज नाही'
  }
};

window.PACKAGE_DATA.en.forEach(function (item) {
  var translation = packageTranslationsMr[item.id];
  if (!translation) return;
  var localized = Object.assign({}, item, translation, {
    sample: item.sample === 'Urine' ? 'मूत्र' : 'रक्त',
    reports: item.reports === '24 hrs' ? '२४ तास' : item.reports
  });
  var existingIndex = window.PACKAGE_DATA.mr.findIndex(function (entry) {
    return entry.id === item.id;
  });
  if (existingIndex === -1) window.PACKAGE_DATA.mr.push(localized);
});

window.TEST_CATALOGUE = {
  en: [
    { id: 'cbc', name: 'CBC', price: 300, sample: 'Blood', reports: 'Same day', category: 'Blood', concern: 'General', description: 'Checks red cells, white cells, and platelets.' },
    { id: 'hemoglobin', name: 'Hemoglobin', price: 80, sample: 'Blood', reports: 'Same day', category: 'Blood', concern: 'Anemia', description: 'Measures the oxygen-carrying hemoglobin level.' },
    { id: 'esr', name: 'ESR', price: 100, sample: 'Blood', reports: 'Same day', category: 'Blood', concern: 'Fever/Infection', description: 'Looks for inflammation and infection activity.' },
    { id: 'fasting-blood-sugar', name: 'Fasting Blood Sugar', price: 60, sample: 'Blood', reports: 'Same day', category: 'Diabetes', concern: 'Diabetes', description: 'Checks sugar after fasting.' },
    { id: 'pp-blood-sugar', name: 'PP Blood Sugar', price: 60, sample: 'Blood', reports: 'Same day', category: 'Diabetes', concern: 'Diabetes', description: 'Checks sugar after a meal.' },
    { id: 'hba1c', name: 'HbA1c', price: 500, sample: 'Blood', reports: '24 hrs', category: 'Diabetes', concern: 'Diabetes', description: 'Helps check average sugar control over weeks.' },
    { id: 'lipid-profile', name: 'Lipid Profile', price: 500, sample: 'Blood', reports: '24 hrs', category: 'Heart', concern: 'Heart', description: 'Reviews cholesterol and triglycerides.' },
    { id: 'liver-function', name: 'Liver Function', price: 500, sample: 'Blood', reports: '24 hrs', category: 'Liver', concern: 'Liver', description: 'Looks at liver enzymes and bile markers.' },
    { id: 'kidney-function', name: 'Kidney Function', price: 450, sample: 'Blood', reports: '24 hrs', category: 'Kidney', concern: 'Kidney', description: 'Checks kidney filtration and waste markers.' },
    { id: 'thyroid-profile', name: 'Thyroid Profile (T3/T4/TSH)', price: 500, sample: 'Blood', reports: '24 hrs', category: 'Thyroid', concern: 'Thyroid', description: 'Reviews thyroid activity and balance.' },
    { id: 'tsh', name: 'TSH', price: 300, sample: 'Blood', reports: '24 hrs', category: 'Thyroid', concern: 'Thyroid', description: 'Useful for screening thyroid hormone control.' },
    { id: 'vitamin-d', name: 'Vitamin D', price: 1200, sample: 'Blood', reports: '24 hrs', category: 'Vitamin', concern: 'Vitamins', description: 'Checks vitamin D levels and deficiency risk.' },
    { id: 'vitamin-b12', name: 'Vitamin B12', price: 800, sample: 'Blood', reports: '24 hrs', category: 'Vitamin', concern: 'Vitamins', description: 'Evaluates B12 status and energy-related symptoms.' },
    { id: 'urine-routine', name: 'Urine Routine', price: 100, sample: 'Urine', reports: 'Same day', category: 'Urine', concern: 'Urine & Stool Infection', description: 'Simple urine review for infection and kidney markers.' },
    { id: 'urine-culture-sensitivity', name: 'Urine Culture & Sensitivity', price: 450, sample: 'Urine', reports: '24–48 hrs', category: 'Urine', concern: 'Urine & Stool Infection', description: 'Checks for bacteria and guides treatment.' },
    { id: 'stool-routine', name: 'Stool Routine', price: 100, sample: 'Stool', reports: '24 hrs', category: 'Stool', concern: 'Urine & Stool Infection', description: 'Looks for infection or digestive irregularities.' },
    { id: 'widal', name: 'Widal', price: 250, sample: 'Blood', reports: 'Same day', category: 'Infection', concern: 'Fever/Infection', description: 'Helps assess possible typhoid infection.' },
    { id: 'malaria-test', name: 'Malaria Test', price: 250, sample: 'Blood', reports: 'Same day', category: 'Infection', concern: 'Fever/Infection', description: 'Checks for malaria markers.' },
    { id: 'dengue-ns1', name: 'Dengue NS1', price: 700, sample: 'Blood', reports: '24 hrs', category: 'Infection', concern: 'Fever/Infection', description: 'Screens for early dengue infection.' },
    { id: 'crp', name: 'CRP', price: 450, sample: 'Blood', reports: '24 hrs', category: 'Inflammation', concern: 'Fever/Infection', description: 'Reviews inflammation and infection response.' },
    { id: 'sputum-afb', name: 'Sputum AFB Smear', price: 200, sample: 'Sputum', reports: '24 hrs', category: 'Microbiology', concern: 'Fever/Infection', description: 'Supports review for respiratory infection concerns.' },
    { id: 'blood-group', name: 'Blood Group', price: 100, sample: 'Blood', reports: 'Same day', category: 'General', concern: 'General', description: 'Checks blood group for medical or transfusion needs.' }
  ],
  mr: [
    { id: 'cbc', name: 'सीबीसी', price: 300, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'रक्त', concern: 'सामान्य', description: 'लाल पेशी, पांढऱ्या पेशी आणि प्लेटलेट तपासते.' },
    { id: 'hemoglobin', name: 'हीमोग्लोबिन', price: 80, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'रक्त', concern: 'अनिमिया', description: 'ऑक्सिजन वाहून नेणाऱ्या हेमोग्लोबिनची किंमत तपासते.' },
    { id: 'esr', name: 'ईएसआर', price: 100, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'रक्त', concern: 'ज्वर/संक्रमण', description: 'दाह आणि संसर्ग कशा पद्धतीने चालू आहे ते पाहते.' },
    { id: 'fasting-blood-sugar', name: 'उपवास साखर', price: 60, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'डायबेटीज', concern: 'डायबेटीज', description: 'उपवासानंतर साखरेचे मूल्य तपासते.' },
    { id: 'pp-blood-sugar', name: 'PP साखर', price: 60, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'डायबेटीज', concern: 'डायबेटीज', description: 'जेवणानंतर साखरेचे मूल्य तपासते.' },
    { id: 'hba1c', name: 'HbA1c', price: 500, sample: 'रक्त', reports: '२४ तास', category: 'डायबेटीज', concern: 'डायबेटीज', description: 'मागील काही आठवड्यांची सरासरी साखर स्थिती तपासते.' },
    { id: 'lipid-profile', name: 'लिपिड प्रोफाइल', price: 500, sample: 'रक्त', reports: '२४ तास', category: 'हृदय', concern: 'हृदय', description: 'कोलेस्ट्रॉल आणि ट्रायग्लिसराइडचे मूल्य तपासते.' },
    { id: 'liver-function', name: 'यकृत कार्य', price: 500, sample: 'रक्त', reports: '२४ तास', category: 'यकृत', concern: 'यकृत', description: 'यकृताची कार्यक्षमता आणि पित्त मार्कर तपासते.' },
    { id: 'kidney-function', name: 'किडनी कार्य', price: 450, sample: 'रक्त', reports: '२४ तास', category: 'किडनी', concern: 'किडनी', description: 'किडनी फिल्टरिंग आणि कचरा मार्कर तपासते.' },
    { id: 'thyroid-profile', name: 'थायरॉईड प्रोफाइल (T3/T4/TSH)', price: 500, sample: 'रक्त', reports: '२४ तास', category: 'थायरॉईड', concern: 'थायरॉईड', description: 'थायरॉईडची कार्यक्षमता तपासते.' },
    { id: 'tsh', name: 'TSH', price: 300, sample: 'रक्त', reports: '२४ तास', category: 'थायरॉईड', concern: 'थायरॉईड', description: 'थायरॉईड नियंत्रण तपासण्यासाठी उपयुक्त.' },
    { id: 'vitamin-d', name: 'व्हिटामिन डी', price: 1200, sample: 'रक्त', reports: '२४ तास', category: 'व्हिटामिन', concern: 'व्हिटामिन', description: 'व्हिटामिन डी पातळी तपासते.' },
    { id: 'vitamin-b12', name: 'व्हिटामिन B12', price: 800, sample: 'रक्त', reports: '२४ तास', category: 'व्हिटामिन', concern: 'व्हिटामिन', description: 'B12 स्थिती आणि थकवा यांचे मूल्यांकन करते.' },
    { id: 'urine-routine', name: 'मूत्र रूटीन', price: 100, sample: 'मूत्र', reports: 'त्याच दिवशी', category: 'मूत्र', concern: 'मूत्र व मल संसर्ग', description: 'सामान्य मूत्र तपासणीसाठी.' },
    { id: 'urine-culture-sensitivity', name: 'मूत्र कल्चर आणि सेन्सिटिव्हिटी', price: 450, sample: 'मूत्र', reports: '२४–४८ तास', category: 'मूत्र', concern: 'मूत्र व मल संसर्ग', description: 'बॅक्टेरिया तपासते आणि उपचार मार्गदर्शक ठरते.' },
    { id: 'stool-routine', name: 'मल रूटीन', price: 100, sample: 'मल', reports: '२४ तास', category: 'मल', concern: 'मूत्र व मल संसर्ग', description: 'संसर्ग किंवा पचन समस्या तपासते.' },
    { id: 'widal', name: 'विडाल', price: 250, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'संसर्ग', concern: 'ज्वर/संक्रमण', description: 'टायफॉइड संसर्गाचा अंदाज घेते.' },
    { id: 'malaria-test', name: 'मलेरिया टेस्ट', price: 250, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'संसर्ग', concern: 'ज्वर/संक्रमण', description: 'मलेरिया तपासते.' },
    { id: 'dengue-ns1', name: 'डेंग्यू NS1', price: 700, sample: 'रक्त', reports: '२४ तास', category: 'संसर्ग', concern: 'ज्वर/संक्रमण', description: 'लवकर डेंग्यू संक्रमण तपासते.' },
    { id: 'crp', name: 'CRP', price: 450, sample: 'रक्त', reports: '२४ तास', category: 'दाह', concern: 'ज्वर/संक्रमण', description: 'दाह आणि संसर्ग प्रतिसाद तपासते.' },
    { id: 'sputum-afb', name: 'सप्युम AFB स्मीयर', price: 200, sample: 'सप्युम', reports: '२४ तास', category: 'माइक्रोबायोलॉजी', concern: 'ज्वर/संक्रमण', description: 'श्वसन संक्रमणावर तपासणीसाठी उपयुक्त.' },
    { id: 'blood-group', name: 'रक्त गट', price: 100, sample: 'रक्त', reports: 'त्याच दिवशी', category: 'सामान्य', concern: 'सामान्य', description: 'वैद्यकीय गरजांसाठी रक्त गट तपासते.' }
  ]
};
