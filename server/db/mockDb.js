import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Mock in-memory database
const db = {
  users: [],
  opportunities: [],
  applications: [],
  activityLogs: [],
  otpStore: new Map(),
};

// Seed initial admin
const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  db.users.push({
    id: 'admin-001',
    email: 'admin@ugova.gov',
    password: hashedPassword,
    name: 'System Admin',
    role: 'admin',
    phone: '9876543210',
    isVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    profile: {
      education: 'Master of Technology',
      state: 'Delhi',
      city: 'New Delhi',
      age: 35,
      category: 'General',
    },
  });
};

// Seed mock opportunities
const seedOpportunities = () => {
  db.opportunities = [
    {
      id: uuidv4(),
      title: 'PM-KISAN Scheme - 17th Installment',
      type: 'scheme',
      organization: 'Ministry of Agriculture',
      description: 'Direct income support of Rs. 6,000 per year to farmer families across India.',
      eligibility: 'Small and marginal farmer families with cultivable land',
      deadline: '2025-03-31',
      location: 'All India',
      category: 'General',
      url: 'https://pmkisan.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'UPSC Civil Services Examination 2025',
      type: 'exam',
      organization: 'Union Public Service Commission',
      description: 'Preliminary examination for Indian Administrative Service, Indian Police Service, and other central services.',
      eligibility: 'Graduate degree from recognized university, Age 21-32',
      deadline: '2025-02-14',
      location: 'All India',
      category: 'General',
      url: 'https://upsc.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'SSC Combined Graduate Level Exam 2025',
      type: 'exam',
      organization: 'Staff Selection Commission',
      description: 'Combined Graduate Level examination for various Group B and C posts in government ministries.',
      eligibility: 'Bachelor degree from recognized university',
      deadline: '2025-04-15',
      location: 'All India',
      category: 'General',
      url: 'https://ssc.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Bank PO - State Bank of India Recruitment',
      type: 'job',
      organization: 'State Bank of India',
      description: 'Probationary Officers recruitment for 2500+ vacancies across India.',
      eligibility: 'Graduate degree with 60% marks, Age 21-30',
      deadline: '2025-03-20',
      location: 'All India',
      category: 'General',
      url: 'https://sbi.co.in/careers',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Ayushman Bharat - Health Coverage',
      type: 'scheme',
      organization: 'Ministry of Health & Family Welfare',
      description: 'Health insurance coverage of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.',
      eligibility: 'Families identified in Socio-Economic Caste Census 2011',
      deadline: '2025-12-31',
      location: 'All India',
      category: 'General',
      url: 'https://pmjay.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Railway Group D Recruitment 2025',
      type: 'job',
      organization: 'Ministry of Railways',
      description: 'Recruitment for Track Maintainer, Pointsman, Helper and other Group D posts. 50,000+ vacancies.',
      eligibility: '10th pass from recognized board, Age 18-33',
      deadline: '2025-02-28',
      location: 'All India',
      category: 'General',
      url: 'https://rrcb.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Pradhan Mantri Awas Yojana - Urban',
      type: 'scheme',
      organization: 'Ministry of Housing & Urban Affairs',
      description: 'Housing for All scheme providing affordable housing to urban poor with interest subsidy.',
      eligibility: 'Annual income up to Rs. 18 lakh, No pucca house',
      deadline: '2025-06-30',
      location: 'All India',
      category: 'General',
      url: 'https://pmay-urban.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'IBPS PO/MT Examination 2025',
      type: 'exam',
      organization: 'Institute of Banking Personnel Selection',
      description: 'Common recruitment process for Probationary Officers in participating banks.',
      eligibility: 'Graduate degree, Age 20-30',
      deadline: '2025-03-10',
      location: 'All India',
      category: 'General',
      url: 'https://ibps.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Defence Research & Development Organization - Scientist B',
      type: 'job',
      organization: 'DRDO',
      description: 'Recruitment of Scientist B in various disciplines including Electronics, Mechanical, Computer Science.',
      eligibility: 'BE/BTech or MSc with 60%, GATE qualified',
      deadline: '2025-04-05',
      location: 'All India',
      category: 'General',
      url: 'https://drdo.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Start-up India Seed Fund Scheme',
      type: 'scheme',
      organization: 'Department for Promotion of Industry and Internal Trade',
      description: 'Financial assistance to startups for proof of concept, prototype development, product trials.',
      eligibility: 'DPIIT recognized startups less than 2 years old',
      deadline: '2025-09-30',
      location: 'All India',
      category: 'General',
      url: 'https://startupindia.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Delhi Police Constable Recruitment',
      type: 'job',
      organization: 'Delhi Police',
      description: 'Recruitment of Constables (Executive) for Delhi Police. 7,500+ vacancies.',
      eligibility: '12th pass, Age 18-25',
      deadline: '2025-03-15',
      location: 'Delhi',
      category: 'General',
      url: 'https://delhipolice.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'JEE Advanced 2025',
      type: 'exam',
      organization: 'IIT Bombay',
      description: 'Joint Entrance Examination Advanced for admission to B.Tech programs in IITs.',
      eligibility: 'JEE Mains qualified, Age criteria as per category',
      deadline: '2025-05-04',
      location: 'All India',
      category: 'General',
      url: 'https://jeeadv.ac.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];
};

const seedData = async () => {
  try {
    await seedAdmin();
    seedOpportunities();
    console.log(`Seeded ${db.users.length} users and ${db.opportunities.length} opportunities`);
  } catch (err) {
    console.error('Seed error:', err.message);
    // Ensure at least some data exists
    if (db.opportunities.length === 0) seedOpportunities();
  }
};

export { db, seedData };
