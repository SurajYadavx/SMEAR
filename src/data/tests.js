// ============================================================
//  SMEAR PATHOLOGY — TEST / SERVICE DATA
//  PLACEHOLDER TEST DATA — replace with real client-provided
//  test list & pricing before launch.
//  Each entry: { id, name, price, image, shortDesc, fullDesc }
// ============================================================
const TESTS = [
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    price: 300,
    image: '/assets/tests/cbc.jpg',
    shortDesc: 'Comprehensive evaluation of red cells, white cells, and platelets.',
    fullDesc:
      'A Complete Blood Count (CBC) is one of the most commonly ordered blood tests. It evaluates all three major cell types in the blood — red blood cells (which carry oxygen), white blood cells (which fight infection), and platelets (which aid clotting). This test helps screen for a wide range of conditions including infections, anaemia, immune disorders, and bleeding problems. Fasting is not required.',
  },
  {
    id: 'urine-routine',
    name: 'Urine Routine Examination',
    price: 150,
    image: '/assets/tests/urine.jpg',
    shortDesc: 'Basic urinalysis for infections, kidney function, and urinary health.',
    fullDesc:
      'A Urine Routine Examination (URE) analyses physical, chemical, and microscopic properties of urine. It checks for signs of urinary tract infections, kidney disease, diabetes, and other metabolic conditions. Results include pH, protein, glucose, blood cells, and sediment. Results are typically ready within a few hours and no special preparation is needed other than collecting a midstream urine sample.',
  },
  {
    id: 'widal',
    name: 'Widal Test',
    price: 250,
    image: '/assets/tests/widal.jpg',
    shortDesc: 'Blood test to detect typhoid fever by identifying Salmonella antibodies.',
    fullDesc:
      'The Widal test is a serological assay used in the diagnosis of typhoid fever (enteric fever) caused by Salmonella typhi and Salmonella paratyphi. It detects specific agglutinating antibodies in a patient\'s blood that develop in response to these bacteria. The test is most informative when paired with clinical symptoms and interpreted by a qualified pathologist. A blood sample is required; no fasting is necessary.',
  },
  {
    id: 'sputum-afb',
    name: 'Sputum Test (AFB)',
    price: 200,
    image: '/assets/tests/sputum.jpg',
    shortDesc: 'Microscopic sputum examination for tuberculosis and respiratory infections.',
    fullDesc:
      'The Sputum AFB (Acid-Fast Bacilli) smear test is used to detect Mycobacterium tuberculosis, the bacterium responsible for tuberculosis (TB). A sputum sample — mucus coughed up from the lungs — is stained and examined under a microscope. This is a frontline screening tool for pulmonary TB, particularly important in regions like Maharashtra where TB surveillance remains a public health priority. Early morning samples typically yield the best results.',
  },
];
