// ============================================================
//  SMEAR PATHOLOGY — ENGLISH CONTENT (i18n)
//  This file is the single source of truth for all English UI text.
//  Mirror structure must be maintained in content.mr.js.
//  When copy changes here, update content.mr.js to match.
// ============================================================
window.CONTENT_EN = {
  lang: 'en',
  dir: 'ltr',
  langToggle: 'मर',          // label shown to switch TO Marathi

  langPopup: {
    title: 'Choose Your Language',
    titleMr: 'भाषा निवडा',
    subtitle: 'Please select the language you are comfortable with.',
    mrBtn: 'मराठीत सुरू ठेवा',
    enBtn: 'Continue in English',
  },

  nav: {
    about: 'About',
    tests: 'Packages & Tests',
    founder: 'Our Director',
    howItWorks: 'How It Works',
    gallery: 'Gallery',
    reviews: 'Reviews',
    faq: 'FAQ',
    contact: 'Contact',
    email: 'Email Us',
  },

  header: {
    callBtn: 'Call Now',
    waBtn: 'WhatsApp',
    emailBtn: 'Email',
  },

  floatBtn: 'WhatsApp Us',

  hero: {
    eyebrow: 'Indapur \u2022 Pune \u2022 Maharashtra',
    headline: 'The Most Trusted\nLaboratory of Indapur',
    sub: 'Accurate diagnostics. Trusted results. Serving Indapur and surrounding areas with precision pathology and microbiological testing.',
    callBtn: 'Call Now',
    waBtn: 'WhatsApp Us',
    imgPlaceholder: 'Clinic photo coming soon',
  },

  about: {
    eyebrow: 'Who We Are',
    title: 'Trusted Diagnostics,\nRight Here in Indapur',
    lead: 'Smear Pathology is a dedicated diagnostic pathology and microbiology laboratory established to serve the community of Indapur and the surrounding talukas of Pune district. We bring the diagnostic accuracy and quality standards you would expect from a city-level laboratory \u2014 right to your doorstep.',
    para1: 'Our laboratory is led by Mr.\u00a0Pradip\u00a0S.\u00a0Jadhav, a qualified microbiologist holding a Bachelor of Science in Microbiology and a Post Graduate Diploma in Medical Laboratory Technology (PGDMLT). With formal academic training in pathological and microbiological sciences, Mr.\u00a0Jadhav brings both rigorous scientific methodology and genuine care for patient wellbeing to every test we process.',
    para2: 'We offer a broad range of diagnostic services spanning routine haematology, biochemistry, serology, and clinical microbiology \u2014 the tests that matter most for your family\u2019s health decisions. Every report is handled with care and delivered with accuracy, so your doctor has the clear, reliable data they need.',
    badge1Title: 'Qualified Microbiologist',
    badge1Desc: 'Led by Mr.\u00a0Pradip\u00a0S.\u00a0Jadhav, BSc Microbiology, PGDMLT \u2014 formal academic and technical training in laboratory sciences.',
    badge2Title: 'Accurate Reports',
    badge2Desc: 'Each sample is processed with standardised methodology to ensure the reliability your doctor depends on for clinical decisions.',
    badge3Title: 'Quick Turnaround',
    badge3Desc: 'Most routine tests are completed and reported the same day, so you and your physician can act promptly on the results.',
    badge4Title: 'Community Focused',
    badge4Desc: 'We exist to bring quality diagnostics closer to Indapur\u2019s families \u2014 affordable, accessible, and close to home.',
  },

  founder: {
    eyebrow: 'Our Director',
    name: 'Mr. Pradip S. Jadhav',
    quals: 'BSc Microbiology \u2022 PGDMLT',
    role: 'Founder & Principal Scientist',
    bio: 'Mr. Jadhav holds formal academic training in microbiology and medical laboratory technology, bringing both scientific rigour and a genuine commitment to patient care to every test processed at Smear Pathology. He established this laboratory with a straightforward goal: to make accurate, reliable diagnostics available close to home for the families of Indapur and the surrounding region, without the need to travel to Pune city. Precise results, prompt delivery, and respectful service are the standards he holds the laboratory to every day.',
    imgAlt: 'Mr. Pradip S. Jadhav — Founder & Principal Scientist, Smear Pathology Indapur',
    imgPlaceholderInitials: 'PJ',
  },

  tests: {
    eyebrow: 'Diagnostic Services',
    title: 'Packages & Tests',
    subtitle: 'Search tests or packages and compare the right option for you.',
    searchPlaceholder: 'Search tests or packages',
    packagesHeading: 'Health Packages',
    catalogueHeading: 'Popular Tests',
    allFilter: 'All',
    details: 'Details',
    parameterCount: 'tests',
    noPackages: 'No packages match your search.',
    noTests: 'No tests match your search.',
    packageWho: 'Who it suits',
    packageWhy: 'What it checks',
    packagePrep: 'Preparation',
    bookingMessage: 'Hi, I\'d like to book the {test} at Smear Pathology.',
    trust: {
      qualified: 'Qualified microbiologist',
      confidential: 'Confidential reports',
      pricing: 'Clear pricing — no hidden charges',
      prescription: 'No prescription needed for health checkup packages',
    },
    viewDetails: 'View details',
    startingFrom: 'Starting from',
    callToBook: 'Call to Book',
    waToBook: 'WhatsApp to Book',
    trustStrip: 'Qualified Microbiologist \u00b7 Accurate Reports \u00b7 Confidential Results',
    concernsHeading: 'Browse by Health Concern',
    packageFilters: ['All', 'Full Body', 'Diabetes', 'Thyroid', 'Heart', 'Women', 'Senior'],
    healthConcerns: ['Diabetes', 'Thyroid', 'Fever & Infection', 'Heart', 'Liver', 'Kidney', 'Vitamins', "Women's Health", 'Anemia', 'Urine & Stool'],
  },


  // PLACEHOLDER TEST DATA \u2014 replace with real client-provided list & pricing before launch.
  testData: [
    {
      id: 'cbc',
      name: 'Complete Blood Count (CBC)',
      price: 300,
      image: './public/assets/tests/cbc.png',
      shortDesc: 'Comprehensive evaluation of red cells, white cells, and platelets.',
      fullDesc: 'A Complete Blood Count (CBC) is one of the most commonly ordered blood tests. It evaluates all three major cell types in the blood \u2014 red blood cells (which carry oxygen), white blood cells (which fight infection), and platelets (which aid clotting). This test helps screen for a wide range of conditions including infections, anaemia, immune disorders, and bleeding problems. Fasting is not required.',
    },
    {
      id: 'urine-routine',
      name: 'Urine Routine Examination',
      price: 150,
      image: './public/assets/tests/urine.png',
      shortDesc: 'Basic urinalysis for infections, kidney function, and urinary health.',
      fullDesc: 'A Urine Routine Examination (URE) analyses physical, chemical, and microscopic properties of urine. It checks for signs of urinary tract infections, kidney disease, diabetes, and other metabolic conditions. Results include pH, protein, glucose, blood cells, and sediment. Results are typically ready within a few hours and no special preparation is needed other than collecting a midstream urine sample.',
    },
    {
      id: 'widal',
      name: 'Widal Test',
      price: 250,
      image: './public/assets/tests/widal.png',
      shortDesc: 'Blood test to detect typhoid fever by identifying Salmonella antibodies.',
      fullDesc: 'The Widal test is a serological assay used in the diagnosis of typhoid fever (enteric fever) caused by Salmonella typhi and Salmonella paratyphi. It detects specific agglutinating antibodies in a patient\u2019s blood that develop in response to these bacteria. The test is most informative when paired with clinical symptoms and interpreted by a qualified pathologist. A blood sample is required; no fasting is necessary.',
    },
    {
      id: 'sputum-afb',
      name: 'Sputum Test (AFB)',
      price: 200,
      image: './public/assets/tests/sputum.png',
      shortDesc: 'Microscopic sputum examination for tuberculosis and respiratory infections.',
      fullDesc: 'The Sputum AFB (Acid-Fast Bacilli) smear test is used to detect Mycobacterium tuberculosis, the bacterium responsible for tuberculosis (TB). A sputum sample \u2014 mucus coughed up from the lungs \u2014 is stained and examined under a microscope. This is a frontline screening tool for pulmonary TB, particularly important in regions like Maharashtra where TB surveillance remains a public health priority. Early morning samples typically yield the best results.',
    },
  ],

  howItWorks: {
    eyebrow: 'Simple Process',
    title: 'How It Works',
    subtitle: 'Getting tested at Smear Pathology is simple, quick, and hassle-free.',
    step1Num: '01',
    step1Title: 'Contact Us',
    // CONFIRM WITH CLIENT: is home sample collection offered? Currently shows walk-in only.
    step1Desc: 'Call or WhatsApp us to ask about any test, check pricing, or let us know you are coming.',
    step2Num: '02',
    step2Title: 'Visit the Lab',
    step2Desc: 'Come to our lab in Indapur at any time during working hours. Walk-ins are welcome.',
    step3Num: '03',
    step3Title: 'Sample Collected',
    step3Desc: 'Our trained team collects your sample quickly and carefully \u2014 usually in just a few minutes.',
    step4Num: '04',
    step4Title: 'Receive Your Report',
    step4Desc: 'Most reports are ready the same day and can be shared directly on WhatsApp.',
  },

  faq: {
    eyebrow: 'Common Questions',
    title: 'Frequently Asked Questions',
    subtitle: 'Answers to what first-time patients typically ask us.',
    items: [
      {
        q: 'When will my test report be ready?',
        // CONFIRM WITH CLIENT: exact turnaround for each test type
        a: 'Most routine tests \u2014 including CBC, urine examination, and Widal \u2014 are processed and reported the same day. We will let you know as soon as your report is ready.',
      },
      {
        q: 'Do I need to fast before the test?',
        // CONFIRM WITH CLIENT: list any tests that require fasting at this lab
        a: 'Fasting is not required for many common tests such as CBC, Widal, and urine examination. If your doctor has specifically advised fasting for your test, please follow their instruction and let us know when you arrive.',
      },
      {
        q: 'Is the blood collection process painful?',
        a: 'A routine blood draw takes only a few seconds and involves a very small needle prick. Most patients find it quick and manageable. Our team is trained to make the process as comfortable as possible.',
      },
      {
        q: 'Can I receive my report on WhatsApp?',
        // CONFIRM WITH CLIENT: confirm WhatsApp report delivery is offered
        a: 'Yes \u2014 once your report is ready, we can send it directly to your WhatsApp so you do not need to visit again just to collect it. Simply provide your WhatsApp number when you come in for testing.',
      },
      {
        q: 'Do I need an appointment, or can I walk in?',
        // CONFIRM WITH CLIENT: confirm walk-in policy
        a: 'Walk-ins are welcome during our working hours. You are also welcome to call or WhatsApp us in advance if you prefer, so we can be ready for your arrival.',
      },
      {
        q: 'Is my medical information kept confidential?',
        a: 'Absolutely. Your test reports and personal information are kept strictly confidential. We share your results only with you and never share your information with any third party without your explicit consent.',
      },
    ],
  },

  gallery: {
    eyebrow: 'Our Facility',
    title: 'Gallery',
    subtitle: 'A look inside Smear Pathology \u2014 our equipment, workspaces, and team.',
    placeholder: 'Gallery photos will appear here.\nDrop .jpg files into /public/assets/gallery/.',
  },

  reviews: {
    eyebrow: 'Patient Feedback',
    title: 'What Our Patients Say',
    subtitle: 'Real feedback from the people we serve every day.',
    seeAllBtn: 'See All Reviews on Google',
  },

  contact: {
    eyebrow: 'Get In Touch',
    title: 'Contact \u0026 Location',
    subtitle: 'Walk in, call us, WhatsApp or email \u2014 we\u2019re here to help.',
    addressLabel: 'Address',
    phoneLabel: 'Phone',
    waLabel: 'WhatsApp',
    waLinkText: 'Send a message',
    emailLabel: 'Email',
    emailLinkText: 'jssmearpathology0355@gmail.com',
    hoursLabel: 'Hours',
    hoursNote: '* Please confirm hours on phone or WhatsApp before visiting on public holidays.',
    instaLabel: 'Instagram',
    directionsLink: 'Get Directions \u2192',
    callBtn: 'Call Now',
    waBtn: 'WhatsApp Us',
    emailBtn: 'Email Us',
    directionsBtn: 'Get Directions',
    trustStrip: 'Qualified Microbiologist \u00b7 Accurate Reports \u00b7 Confidential Results',
    mapLabel: 'Find us on the map',
  },

  footer: {
    tagline: 'The Most Trusted Laboratory of Indapur',
    navTitle: 'Navigation',
    contactTitle: 'Contact',
    waLink: 'WhatsApp',
    emailLink: 'Email Us',
    directionsLink: 'Get Directions',
    copyright: 'All rights reserved.',
    seoLine: 'Diagnostic pathology \u0026 microbiology lab Indapur \u2014 blood tests, urine tests \u0026 more.',
  },

  viewMore: {
    viewMore: 'View More',
    viewLess: 'View Less',
    showing: 'Showing {shown} of {total}',
  },

  map: {
    lat: 18.1240501,
    lng: 75.0147934,
    shareUrl: 'https://maps.app.goo.gl/bYwAMgtcDcBKMQsz8',
    embedUrl: 'https://www.google.com/maps?q=18.1240501,75.0147934&z=17&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=18.1240501,75.0147934',
  },
};
