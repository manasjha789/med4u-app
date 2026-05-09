import 'reflect-metadata';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '..', '..', '..', '.env') });

import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { Doctor, ConsultationMode } from '../entities/doctor.entity';
import { Generic } from '../entities/generic.entity';
import { Medicine } from '../entities/medicine.entity';
import { Variant } from '../entities/variant.entity';
import { Price, PriceSource } from '../entities/price.entity';
import { LabTest } from '../entities/lab-test.entity';

// ─── HELPERS ────────────────────────────────────────────────────────────────

function extractStrength(name: string): string | undefined {
  const match = name.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|g|IU|ml|%))/i);
  return match ? match[1].trim() : undefined;
}

function inferForm(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('inhaler')) return 'inhaler';
  if (lower.includes('syrup')) return 'syrup';
  if (lower.includes('injection')) return 'injection';
  if (lower.includes('sachet')) return 'sachet';
  if (lower.includes('drops')) return 'drops';
  if (lower.includes('cream')) return 'cream';
  if (lower.includes('capsule')) return 'capsule';
  return 'tablet';
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const MEDICINES = [
  // Antibiotics
  { name: 'Amoxicillin', genericName: 'Amoxicillin', manufacturer: 'Cipla', category: 'Antibiotic', description: 'Used to treat bacterial infections including chest infections, dental abscesses, and urinary tract infections.', requiresPrescription: true },
  { name: 'Azithromycin', genericName: 'Azithromycin', manufacturer: 'Sun Pharma', category: 'Antibiotic', description: 'Treats bacterial infections like pneumonia, bronchitis, and sexually transmitted diseases.', requiresPrescription: true },
  { name: 'Ciprofloxacin', genericName: 'Ciprofloxacin', manufacturer: 'Dr. Reddys', category: 'Antibiotic', description: 'Broad-spectrum antibiotic used for urinary tract, respiratory, and skin infections.', requiresPrescription: true },
  { name: 'Doxycycline', genericName: 'Doxycycline Hyclate', manufacturer: 'Lupin', category: 'Antibiotic', description: 'Treats acne, respiratory infections, and Lyme disease.', requiresPrescription: true },
  { name: 'Metronidazole', genericName: 'Metronidazole', manufacturer: 'Abbott India', category: 'Antibiotic', description: 'Treats bacterial and parasitic infections including dental and stomach infections.', requiresPrescription: true },
  // Pain Relief
  { name: 'Paracetamol 500mg', genericName: 'Acetaminophen', manufacturer: 'GSK India', category: 'Pain Relief', description: 'Common pain reliever and fever reducer. Safe for most adults and children.', requiresPrescription: false },
  { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', manufacturer: 'Cipla', category: 'Pain Relief', description: 'Anti-inflammatory drug used for pain, fever, and inflammation.', requiresPrescription: false },
  { name: 'Diclofenac', genericName: 'Diclofenac Sodium', manufacturer: 'Novartis India', category: 'Pain Relief', description: 'NSAID used for arthritis, muscle pain, and post-operative pain.', requiresPrescription: true },
  { name: 'Tramadol', genericName: 'Tramadol Hydrochloride', manufacturer: 'Sun Pharma', category: 'Pain Relief', description: 'Opioid pain medication for moderate to severe pain.', requiresPrescription: true },
  { name: 'Aspirin 75mg', genericName: 'Acetylsalicylic Acid', manufacturer: 'Bayer India', category: 'Pain Relief', description: 'Used for pain relief and as a blood thinner to prevent heart attacks.', requiresPrescription: false },
  // Cardiovascular
  { name: 'Atorvastatin', genericName: 'Atorvastatin Calcium', manufacturer: 'Pfizer India', category: 'Cardiovascular', description: 'Lowers cholesterol and reduces risk of heart disease and stroke.', requiresPrescription: true },
  { name: 'Amlodipine', genericName: 'Amlodipine Besylate', manufacturer: 'Sun Pharma', category: 'Cardiovascular', description: 'Calcium channel blocker for high blood pressure and chest pain.', requiresPrescription: true },
  { name: 'Metoprolol', genericName: 'Metoprolol Succinate', manufacturer: 'AstraZeneca India', category: 'Cardiovascular', description: 'Beta-blocker for high blood pressure, heart failure, and angina.', requiresPrescription: true },
  { name: 'Ramipril', genericName: 'Ramipril', manufacturer: 'Sanofi India', category: 'Cardiovascular', description: 'ACE inhibitor for high blood pressure and heart failure.', requiresPrescription: true },
  { name: 'Clopidogrel', genericName: 'Clopidogrel Bisulfate', manufacturer: 'Dr. Reddys', category: 'Cardiovascular', description: 'Blood thinner to prevent blood clots in heart attack and stroke patients.', requiresPrescription: true },
  // Diabetes
  { name: 'Metformin 500mg', genericName: 'Metformin Hydrochloride', manufacturer: 'Cipla', category: 'Diabetes', description: 'First-line medication for type 2 diabetes. Helps control blood sugar levels.', requiresPrescription: true },
  { name: 'Glimepiride', genericName: 'Glimepiride', manufacturer: 'Sanofi India', category: 'Diabetes', description: 'Sulfonylurea drug that stimulates insulin release for type 2 diabetes.', requiresPrescription: true },
  { name: 'Insulin Glargine', genericName: 'Insulin Glargine', manufacturer: 'Novo Nordisk India', category: 'Diabetes', description: 'Long-acting insulin for type 1 and type 2 diabetes management.', requiresPrescription: true },
  { name: 'Sitagliptin', genericName: 'Sitagliptin Phosphate', manufacturer: 'MSD India', category: 'Diabetes', description: 'DPP-4 inhibitor that helps control blood sugar in type 2 diabetes.', requiresPrescription: true },
  { name: 'Empagliflozin', genericName: 'Empagliflozin', manufacturer: 'Boehringer Ingelheim', category: 'Diabetes', description: 'SGLT2 inhibitor for type 2 diabetes with cardiovascular benefits.', requiresPrescription: true },
  // Respiratory
  { name: 'Salbutamol Inhaler', genericName: 'Salbutamol Sulfate', manufacturer: 'GSK India', category: 'Respiratory', description: 'Bronchodilator for quick relief of asthma and COPD symptoms.', requiresPrescription: true },
  { name: 'Montelukast', genericName: 'Montelukast Sodium', manufacturer: 'Sun Pharma', category: 'Respiratory', description: 'Used for asthma prevention and allergic rhinitis.', requiresPrescription: true },
  { name: 'Budesonide Inhaler', genericName: 'Budesonide', manufacturer: 'AstraZeneca India', category: 'Respiratory', description: 'Inhaled corticosteroid for long-term asthma control.', requiresPrescription: true },
  { name: 'Cetirizine', genericName: 'Cetirizine Hydrochloride', manufacturer: 'UCB India', category: 'Respiratory', description: 'Antihistamine for allergies, hay fever, and urticaria.', requiresPrescription: false },
  { name: 'Levosalbutamol', genericName: 'Levosalbutamol', manufacturer: 'Cipla', category: 'Respiratory', description: 'Bronchodilator with fewer side effects than salbutamol for asthma.', requiresPrescription: true },
  // Gastrointestinal
  { name: 'Omeprazole 20mg', genericName: 'Omeprazole', manufacturer: 'Cipla', category: 'Gastrointestinal', description: 'Proton pump inhibitor for acid reflux, GERD, and stomach ulcers.', requiresPrescription: false },
  { name: 'Pantoprazole', genericName: 'Pantoprazole Sodium', manufacturer: 'Sun Pharma', category: 'Gastrointestinal', description: 'PPI for gastroesophageal reflux disease and Zollinger-Ellison syndrome.', requiresPrescription: true },
  { name: 'Ondansetron', genericName: 'Ondansetron Hydrochloride', manufacturer: 'Dr. Reddys', category: 'Gastrointestinal', description: 'Antiemetic used to prevent nausea and vomiting.', requiresPrescription: true },
  { name: 'Domperidone', genericName: 'Domperidone', manufacturer: 'Abbott India', category: 'Gastrointestinal', description: 'Used for nausea, vomiting, and gastroparesis.', requiresPrescription: false },
  { name: 'ORS Sachets', genericName: 'Oral Rehydration Salts', manufacturer: 'Cipla', category: 'Gastrointestinal', description: 'Used for rehydration during diarrhea and vomiting.', requiresPrescription: false },
  // Vitamins
  { name: 'Vitamin D3 60000 IU', genericName: 'Cholecalciferol', manufacturer: 'Sun Pharma', category: 'Vitamins', description: 'Weekly dose of Vitamin D for deficiency treatment and bone health.', requiresPrescription: false },
  { name: 'Vitamin B12', genericName: 'Cyanocobalamin', manufacturer: 'Lupin', category: 'Vitamins', description: 'Essential vitamin for nerve function, red blood cells, and DNA synthesis.', requiresPrescription: false },
  { name: 'Ferrous Sulfate', genericName: 'Ferrous Sulfate', manufacturer: 'Abbott India', category: 'Vitamins', description: 'Iron supplement for iron deficiency anemia.', requiresPrescription: false },
  { name: 'Calcium + Vitamin D', genericName: 'Calcium Carbonate + D3', manufacturer: 'Pfizer India', category: 'Vitamins', description: 'Combined supplement for bone strength and calcium deficiency.', requiresPrescription: false },
  { name: 'Folic Acid 5mg', genericName: 'Folic Acid', manufacturer: 'GSK India', category: 'Vitamins', description: 'Essential for pregnant women to prevent neural tube defects.', requiresPrescription: false },
];

// Final selling price (INR) per medicine name — MRP is +10%
const MEDICINE_PRICES: Record<string, number> = {
  'Amoxicillin': 75,
  'Azithromycin': 108,
  'Ciprofloxacin': 80,
  'Doxycycline': 85,
  'Metronidazole': 40,
  'Paracetamol 500mg': 30,
  'Ibuprofen 400mg': 40,
  'Diclofenac': 65,
  'Tramadol': 160,
  'Aspirin 75mg': 22,
  'Atorvastatin': 120,
  'Amlodipine': 58,
  'Metoprolol': 85,
  'Ramipril': 98,
  'Clopidogrel': 188,
  'Metformin 500mg': 49,
  'Glimepiride': 76,
  'Insulin Glargine': 1080,
  'Sitagliptin': 252,
  'Empagliflozin': 315,
  'Salbutamol Inhaler': 198,
  'Montelukast': 130,
  'Budesonide Inhaler': 342,
  'Cetirizine': 27,
  'Levosalbutamol': 175,
  'Omeprazole 20mg': 43,
  'Pantoprazole': 58,
  'Ondansetron': 85,
  'Domperidone': 49,
  'ORS Sachets': 22,
  'Vitamin D3 60000 IU': 76,
  'Vitamin B12': 85,
  'Ferrous Sulfate': 58,
  'Calcium + Vitamin D': 76,
  'Folic Acid 5mg': 25,
};

const LAB_TESTS = [
  // Blood Tests
  { name: 'Complete Blood Count (CBC)', category: 'Blood Test', description: 'Measures red blood cells, white blood cells, hemoglobin, and platelets.', price: 250, turnaroundDays: 1 },
  { name: 'HbA1c (Glycated Hemoglobin)', category: 'Blood Test', description: 'Measures average blood sugar over 3 months. Essential for diabetes diagnosis.', price: 400, turnaroundDays: 1 },
  { name: 'Lipid Profile', category: 'Blood Test', description: 'Measures total cholesterol, LDL, HDL, and triglycerides.', price: 500, turnaroundDays: 1 },
  { name: 'Liver Function Test (LFT)', category: 'Blood Test', description: 'Evaluates liver health by measuring enzymes, proteins, and bilirubin levels.', price: 600, turnaroundDays: 1 },
  { name: 'Kidney Function Test (KFT)', category: 'Blood Test', description: 'Measures creatinine, urea, and electrolytes to assess kidney function.', price: 550, turnaroundDays: 1 },
  { name: 'Thyroid Function Test (TFT)', category: 'Blood Test', description: 'Measures TSH, T3, T4 levels. Diagnoses hypothyroidism and hyperthyroidism.', price: 700, turnaroundDays: 1 },
  { name: 'Blood Glucose Fasting', category: 'Blood Test', description: 'Measures blood sugar after 8-hour fasting. Screens for diabetes.', price: 80, turnaroundDays: 1 },
  { name: 'Vitamin D (25-OH)', category: 'Blood Test', description: 'Measures Vitamin D levels. Deficiency linked to bone disease.', price: 1200, turnaroundDays: 2 },
  { name: 'Vitamin B12', category: 'Blood Test', description: 'Measures B12 levels. Deficiency causes anemia and nerve damage.', price: 900, turnaroundDays: 1 },
  { name: 'C-Reactive Protein (CRP)', category: 'Blood Test', description: 'Detects inflammation and infection in the body.', price: 500, turnaroundDays: 1 },
  { name: 'ESR (Erythrocyte Sedimentation Rate)', category: 'Blood Test', description: 'Measures inflammation rate. Elevated in infections and autoimmune diseases.', price: 150, turnaroundDays: 1 },
  { name: 'Uric Acid', category: 'Blood Test', description: 'Measures uric acid levels. High levels indicate gout risk.', price: 200, turnaroundDays: 1 },
  // Urine Tests
  { name: 'Urine Routine & Microscopy', category: 'Urine Test', description: 'Complete urine analysis for kidney health and UTI detection.', price: 120, turnaroundDays: 1 },
  { name: 'Urine Culture & Sensitivity', category: 'Urine Test', description: 'Identifies bacteria causing UTI and determines antibiotic treatment.', price: 600, turnaroundDays: 3 },
  { name: '24-Hour Urine Protein', category: 'Urine Test', description: 'Measures protein loss over 24 hours. Detects kidney damage.', price: 350, turnaroundDays: 1 },
  // Imaging
  { name: 'Chest X-Ray (PA View)', category: 'Imaging', description: 'Standard chest imaging for lungs, heart, and ribs.', price: 300, turnaroundDays: 1 },
  { name: 'ECG (Electrocardiogram)', category: 'Imaging', description: 'Records heart electrical activity. Detects arrhythmia and heart disease.', price: 200, turnaroundDays: 1 },
  { name: 'Ultrasound Abdomen', category: 'Imaging', description: 'Imaging of abdominal organs — liver, gallbladder, kidneys, pancreas.', price: 800, turnaroundDays: 1 },
  { name: '2D Echo (Echocardiogram)', category: 'Imaging', description: 'Ultrasound of the heart to assess structure and function.', price: 2000, turnaroundDays: 1 },
  { name: 'MRI Brain', category: 'Imaging', description: 'Detailed imaging of brain tissue. Detects tumors, stroke, and MS.', price: 8000, turnaroundDays: 1 },
  // Hormone Tests
  { name: 'FSH & LH', category: 'Hormone Test', description: 'Measures reproductive hormones for fertility evaluation.', price: 800, turnaroundDays: 1 },
  { name: 'Testosterone Total', category: 'Hormone Test', description: 'Measures testosterone levels for hormonal disorders evaluation.', price: 900, turnaroundDays: 1 },
  { name: 'Prolactin', category: 'Hormone Test', description: 'Measures prolactin hormone. Elevated levels affect fertility.', price: 700, turnaroundDays: 1 },
  { name: 'Cortisol (Morning)', category: 'Hormone Test', description: "Measures stress hormone cortisol. Diagnoses Cushing's disease.", price: 800, turnaroundDays: 1 },
  // Infection Tests
  { name: 'Dengue NS1 Antigen', category: 'Infection Test', description: 'Early detection of dengue fever. Most accurate in first 5 days.', price: 700, turnaroundDays: 1 },
  { name: 'Malaria Antigen Test', category: 'Infection Test', description: 'Rapid test for malaria detection.', price: 400, turnaroundDays: 1 },
  { name: 'Typhoid (Widal Test)', category: 'Infection Test', description: 'Detects antibodies against Salmonella typhi. Diagnoses typhoid.', price: 200, turnaroundDays: 1 },
  { name: 'HIV 1 & 2 Antibody', category: 'Infection Test', description: 'Screens for HIV infection with counseling support.', price: 500, turnaroundDays: 1 },
  { name: 'Hepatitis B Surface Antigen (HBsAg)', category: 'Infection Test', description: 'Detects Hepatitis B virus infection.', price: 300, turnaroundDays: 1 },
  { name: 'COVID-19 RT-PCR', category: 'Infection Test', description: 'Gold standard test for active COVID-19 infection detection.', price: 500, turnaroundDays: 1 },
  // Cancer Markers
  { name: 'PSA (Prostate Specific Antigen)', category: 'Cancer Marker', description: 'Screens for prostate cancer in men.', price: 900, turnaroundDays: 1 },
  { name: 'CA 125', category: 'Cancer Marker', description: 'Tumor marker for ovarian cancer monitoring.', price: 1200, turnaroundDays: 2 },
  { name: 'CEA (Carcinoembryonic Antigen)', category: 'Cancer Marker', description: 'Tumor marker for colon, lung, and breast cancer monitoring.', price: 1100, turnaroundDays: 2 },
  // Health Packages
  { name: 'Basic Health Checkup', category: 'Health Package', description: 'CBC + Blood Sugar + Lipid Profile + LFT + KFT + Urine Routine.', price: 1500, turnaroundDays: 1 },
  { name: 'Comprehensive Health Package', category: 'Health Package', description: 'Full body checkup including 60+ tests.', price: 3500, turnaroundDays: 1 },
  { name: "Women's Health Package", category: 'Health Package', description: 'Hormone panel, CBC, thyroid, vitamins, pap smear, bone density.', price: 2500, turnaroundDays: 2 },
  { name: 'Cardiac Risk Package', category: 'Health Package', description: 'Lipid profile, ECG, CRP, homocysteine, cardiac enzymes.', price: 2000, turnaroundDays: 1 },
  { name: 'Diabetes Management Package', category: 'Health Package', description: 'HbA1c, fasting glucose, insulin levels, kidney function.', price: 1800, turnaroundDays: 1 },
];

const DOCTORS = [
  { name: 'Dr. Devi Prasad Shetty', phone: '+919800000001', specialization: 'Cardiothoracic Surgery', experienceYears: 35, bio: 'Founder of Narayana Health, pioneer of affordable cardiac surgery in India. Performed over 15,000 heart surgeries.', consultationFee: 1500, languages: ['English', 'Hindi', 'Kannada'], rating: 4.9, city: 'Bengaluru', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'Kasturba Medical College, Mangalore', year: 1979 }, { degree: 'MS (General Surgery)', institution: 'Kasturba Medical College', year: 1982 }, { degree: 'MCh (Cardiothoracic Surgery)', institution: 'NIMHANS Bangalore', year: 1986 }] },
  { name: 'Dr. Naresh Trehan', phone: '+919800000002', specialization: 'Cardiovascular Surgery', experienceYears: 40, bio: 'Chairman of Medanta. Pioneer of minimally invasive cardiac surgery in India. Performed over 48,000 cardiac surgeries.', consultationFee: 2000, languages: ['English', 'Hindi'], rating: 4.9, city: 'Gurugram', consultationMode: ConsultationMode.OFFLINE, education: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 1969 }, { degree: 'MS', institution: 'AIIMS New Delhi', year: 1972 }, { degree: 'Cardiothoracic Fellowship', institution: 'NYU Medical Center, USA', year: 1979 }] },
  { name: 'Dr. Prathap C Reddy', phone: '+919800000003', specialization: 'Internal Medicine', experienceYears: 45, bio: 'Founder of Apollo Hospitals Group, the largest integrated healthcare chain in Asia.', consultationFee: 1800, languages: ['English', 'Hindi', 'Telugu'], rating: 4.8, city: 'Chennai', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'Stanley Medical College, Chennai', year: 1963 }, { degree: 'MD (Internal Medicine)', institution: 'University of Missouri, USA', year: 1968 }] },
  { name: 'Dr. Randeep Guleria', phone: '+919800000004', specialization: 'Pulmonology', experienceYears: 32, bio: 'Former Director of AIIMS New Delhi. Leading pulmonologist and COVID-19 management expert.', consultationFee: 1200, languages: ['English', 'Hindi'], rating: 4.8, city: 'New Delhi', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 1983 }, { degree: 'MD (Medicine)', institution: 'AIIMS New Delhi', year: 1986 }, { degree: 'DM (Pulmonology)', institution: 'AIIMS New Delhi', year: 1989 }] },
  { name: 'Dr. K.K. Aggarwal', phone: '+919800000005', specialization: 'Cardiology', experienceYears: 36, bio: 'Padma Shri awardee and former President of Indian Medical Association. Pioneer of echocardiography in India.', consultationFee: 1000, languages: ['English', 'Hindi'], rating: 4.7, city: 'New Delhi', consultationMode: ConsultationMode.ONLINE, education: [{ degree: 'MBBS', institution: 'Nagpur University', year: 1979 }, { degree: 'MD (Medicine)', institution: 'Delhi University', year: 1982 }, { degree: 'DM (Cardiology)', institution: 'AIIMS New Delhi', year: 1985 }] },
  { name: 'Dr. Shiv Kumar Sarin', phone: '+919800000006', specialization: 'Gastroenterology', experienceYears: 38, bio: 'Director of ILBS New Delhi. World-renowned hepatologist known for liver disease research.', consultationFee: 1500, languages: ['English', 'Hindi'], rating: 4.9, city: 'New Delhi', consultationMode: ConsultationMode.OFFLINE, education: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 1975 }, { degree: 'MD', institution: 'AIIMS New Delhi', year: 1978 }, { degree: 'DM (Gastroenterology)', institution: 'AIIMS New Delhi', year: 1981 }] },
  { name: 'Dr. Subhash Chandra', phone: '+919800000007', specialization: 'Neurology', experienceYears: 28, bio: 'Senior neurologist at BLK Super Speciality Hospital. Expert in epilepsy and stroke management.', consultationFee: 1200, languages: ['English', 'Hindi'], rating: 4.7, city: 'New Delhi', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'Maulana Azad Medical College', year: 1988 }, { degree: 'MD (Medicine)', institution: 'Delhi University', year: 1991 }, { degree: 'DM (Neurology)', institution: 'AIIMS New Delhi', year: 1994 }] },
  { name: 'Dr. Anupam Sibal', phone: '+919800000008', specialization: 'Pediatric Gastroenterology', experienceYears: 30, bio: 'Group Medical Director at Apollo Hospitals. First to perform pediatric liver transplant in India.', consultationFee: 1400, languages: ['English', 'Hindi'], rating: 4.8, city: 'New Delhi', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 1985 }, { degree: 'MD (Pediatrics)', institution: 'AIIMS New Delhi', year: 1989 }, { degree: 'Fellowship Pediatric Gastroenterology', institution: "King's College London, UK", year: 1993 }] },
  { name: 'Dr. Nandita Shah', phone: '+919800000009', specialization: 'Psychiatry', experienceYears: 25, bio: 'Leading psychiatrist at Hinduja Hospital Mumbai. Expert in mood disorders and addiction psychiatry.', consultationFee: 1000, languages: ['English', 'Hindi', 'Marathi'], rating: 4.7, city: 'Mumbai', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'Grant Medical College, Mumbai', year: 1991 }, { degree: 'MD (Psychiatry)', institution: 'KEM Hospital Mumbai', year: 1995 }, { degree: 'Fellowship', institution: 'Maudsley Hospital, London', year: 1998 }] },
  { name: 'Dr. Geeta Krishnan', phone: '+919800000010', specialization: 'Endocrinology', experienceYears: 22, bio: 'Senior endocrinologist at Kokilaben Hospital. Expert in diabetes and thyroid disorders.', consultationFee: 1100, languages: ['English', 'Hindi', 'Tamil'], rating: 4.6, city: 'Mumbai', consultationMode: ConsultationMode.ONLINE, education: [{ degree: 'MBBS', institution: 'Madras Medical College', year: 1995 }, { degree: 'MD (Medicine)', institution: 'Madras Medical College', year: 1998 }, { degree: 'DM (Endocrinology)', institution: 'PGIMER Chandigarh', year: 2001 }] },
  { name: 'Dr. Sameer Bhati', phone: '+919800000011', specialization: 'Orthopedics', experienceYears: 20, bio: 'Joint replacement specialist at Fortis Hospital. Performed over 3000 knee and hip replacements.', consultationFee: 1000, languages: ['English', 'Hindi'], rating: 4.6, city: 'Gurugram', consultationMode: ConsultationMode.OFFLINE, education: [{ degree: 'MBBS', institution: 'Lady Hardinge Medical College', year: 1997 }, { degree: 'MS (Orthopedics)', institution: 'AIIMS New Delhi', year: 2001 }, { degree: 'Fellowship Sports Medicine', institution: 'Hospital for Special Surgery, USA', year: 2004 }] },
  { name: 'Dr. Sunita Maheshwari', phone: '+919800000012', specialization: 'Pediatric Cardiology', experienceYears: 27, bio: 'Co-founder of Narayana Health. Pioneer of telemedicine for pediatric cardiac care.', consultationFee: 800, languages: ['English', 'Hindi', 'Kannada'], rating: 4.9, city: 'Bengaluru', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'Mysore Medical College', year: 1988 }, { degree: 'MD (Pediatrics)', institution: 'Bangalore Medical College', year: 1992 }, { degree: 'Fellowship Pediatric Cardiology', institution: 'Toronto Hospital for Sick Children', year: 1996 }] },
  { name: 'Dr. Harsh Mahajan', phone: '+919800000013', specialization: 'Radiology', experienceYears: 33, bio: "Founder of Mahajan Imaging. Pioneer of MRI and interventional radiology in India. Padma Shri awardee.", consultationFee: 900, languages: ['English', 'Hindi'], rating: 4.7, city: 'New Delhi', consultationMode: ConsultationMode.OFFLINE, education: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 1982 }, { degree: 'MD (Radiology)', institution: 'AIIMS New Delhi', year: 1986 }, { degree: 'Fellowship Interventional Radiology', institution: 'Johns Hopkins, USA', year: 1989 }] },
  { name: 'Dr. Pramod Garg', phone: '+919800000014', specialization: 'Gastroenterology', experienceYears: 30, bio: 'Director of Translational Health Science Institute. Expert in IBD and pancreatitis research.', consultationFee: 1300, languages: ['English', 'Hindi'], rating: 4.8, city: 'Faridabad', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 1984 }, { degree: 'MD', institution: 'AIIMS New Delhi', year: 1987 }, { degree: 'DM (Gastroenterology)', institution: 'AIIMS New Delhi', year: 1991 }] },
  { name: 'Dr. Rekha Bharti', phone: '+919800000015', specialization: 'Gynecology & Obstetrics', experienceYears: 24, bio: 'Senior gynecologist at Safdarjung Hospital. Expert in high-risk pregnancies and laparoscopic gynecology.', consultationFee: 800, languages: ['English', 'Hindi'], rating: 4.7, city: 'New Delhi', consultationMode: ConsultationMode.BOTH, education: [{ degree: 'MBBS', institution: 'Lady Hardinge Medical College', year: 1993 }, { degree: 'MS (Obs & Gynae)', institution: 'AIIMS New Delhi', year: 1997 }, { degree: 'Fellowship Reproductive Medicine', institution: 'University of Leeds, UK', year: 2000 }] },
];

// ─── SEED FUNCTION ───────────────────────────────────────────────────────────

async function seed() {
  const dataSource = AppDataSource;
  await dataSource.initialize();
  console.log('✅ Database connected');
  console.log(`DB: ${process.env.DB_NAME || 'med4u'} @ ${process.env.DB_HOST || 'localhost'}`);

  const forceSeed = process.env.FORCE_SEED === 'true';
  if (forceSeed) {
    console.log('⚠️  FORCE_SEED=true — clearing existing data...');
  }

  // ── Generics + Medicines + Variants + Prices ─────────────────────────────
  const genericRepo = dataSource.getRepository(Generic);
  const medicineRepo = dataSource.getRepository(Medicine);
  const variantRepo = dataSource.getRepository(Variant);
  const priceRepo = dataSource.getRepository(Price);
  if (forceSeed) {
    await priceRepo.createQueryBuilder().delete().execute();
    await variantRepo.createQueryBuilder().delete().execute();
    await medicineRepo.createQueryBuilder().delete().execute();
    await genericRepo.createQueryBuilder().delete().execute();
    console.log('🗑️  Cleared prices, variants, medicines, and generics');
  }
  const existingMeds = await medicineRepo.count();
  if (existingMeds === 0) {
    for (const med of MEDICINES) {
      let generic = await genericRepo.findOne({ where: { name: med.genericName } });
      if (!generic) {
        generic = await genericRepo.save(
          genericRepo.create({ name: med.genericName, category: med.category, description: med.description }),
        );
      }
      const medicine = await medicineRepo.save(
        medicineRepo.create({ name: med.name, manufacturer: med.manufacturer, genericId: generic.id, requiresPrescription: med.requiresPrescription }),
      );
      const variant = await variantRepo.save(
        variantRepo.create({ medicineId: medicine.id, strength: extractStrength(med.name), form: inferForm(med.name), packSize: '1 strip (10 units)' }),
      );
      const finalPrice = MEDICINE_PRICES[med.name] ?? 99;
      const mrp = Math.round(finalPrice * 1.1);
      await priceRepo.save(
        priceRepo.create({ variantId: variant.id, mrp, finalPrice, discountPercent: 10, source: PriceSource.MANUAL }),
      );
    }
    console.log(`✅ Seeded ${MEDICINES.length} medicines with variants and prices`);
  } else {
    console.log(`⏭️  Medicines already seeded (${existingMeds} found)`);
    // Backfill prices for any variant that has no price yet
    const unpricedVariants = await variantRepo
      .createQueryBuilder('v')
      .leftJoin('v.prices', 'p')
      .innerJoinAndSelect('v.medicine', 'm')
      .where('p.id IS NULL')
      .andWhere('v.deletedAt IS NULL')
      .getMany();
    if (unpricedVariants.length > 0) {
      for (const v of unpricedVariants) {
        const finalPrice = MEDICINE_PRICES[v.medicine.name] ?? 99;
        const mrp = Math.round(finalPrice * 1.1);
        await priceRepo.save(
          priceRepo.create({ variantId: v.id, mrp, finalPrice, discountPercent: 10, source: PriceSource.MANUAL }),
        );
      }
      console.log(`✅ Backfilled prices for ${unpricedVariants.length} variants`);
    } else {
      console.log('⏭️  Prices already present');
    }
  }

  // ── Lab Tests ─────────────────────────────────────────────────────────────
  const labRepo = dataSource.getRepository(LabTest);
  if (forceSeed) {
    await labRepo.createQueryBuilder().delete().execute();
    console.log('🗑️  Cleared lab tests');
  }
  const existingLabs = await labRepo.count();
  if (existingLabs === 0) {
    for (const test of LAB_TESTS) {
      await labRepo.save(labRepo.create(test));
    }
    console.log(`✅ Seeded ${LAB_TESTS.length} lab tests`);
  } else {
    console.log(`⏭️  Lab tests already seeded (${existingLabs} found)`);
  }

  // ── Doctors ───────────────────────────────────────────────────────────────
  const userRepo = dataSource.getRepository(User);
  const doctorRepo = dataSource.getRepository(Doctor);
  if (forceSeed) {
    await doctorRepo.createQueryBuilder().delete().execute();
    await userRepo.delete({ role: 'doctor' as any });
    console.log('🗑️  Cleared doctors');
  }
  const existingDoctors = await doctorRepo.count();
  if (existingDoctors === 0) {
    for (const doc of DOCTORS) {
      const user = await userRepo.save(
        userRepo.create({
          phone: doc.phone,
          name: doc.name,
          role: 'doctor' as any,
          isActive: true,
          isVerified: true,
        }),
      );
      await doctorRepo.save(
        doctorRepo.create({
          userId: user.id,
          specialization: doc.specialization,
          experienceYears: doc.experienceYears,
          bio: doc.bio,
          consultationFee: doc.consultationFee,
          languages: doc.languages,
          rating: doc.rating,
          reviewCount: Math.floor(Math.random() * 500) + 100,
          isVerified: true,
          education: doc.education,
          licenseNumber: `MCI${Math.floor(Math.random() * 900000) + 100000}`,
          city: doc.city,
          consultationMode: doc.consultationMode,
          isAvailableToday: true,
        }),
      );
    }
    console.log(`✅ Seeded ${DOCTORS.length} doctors`);
  } else {
    console.log(`⏭️  Doctors already seeded (${existingDoctors} found)`);
  }

  await dataSource.destroy();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  console.error(err);
  process.exit(1);
});