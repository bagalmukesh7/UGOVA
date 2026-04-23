import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/mockDb.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Mock AI data fetching - simulates fetching from government portals
router.get('/fetch', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Simulate AI fetching process
    const sources = [
      'https://upsc.gov.in/examinations',
      'https://ssc.gov.in/recruitment',
      'https://pmkisan.gov.in',
      'https://pmjay.gov.in',
      'https://sbi.co.in/careers',
    ];

    const newOpportunities = generateMockAIFetched(sources);
    
    // Add to database
    newOpportunities.forEach(opp => {
      const exists = db.opportunities.find(o => o.title === opp.title);
      if (!exists) {
        db.opportunities.push(opp);
      }
    });

    res.json({
      message: 'AI fetch completed',
      sources: sources.length,
      fetched: newOpportunities.length,
      opportunities: newOpportunities,
    });
  } catch (error) {
    res.status(500).json({ message: 'AI fetch failed', error: error.message });
  }
});

function generateMockAIFetched(sources) {
  const mockData = [
    {
      id: uuidv4(),
      title: 'RBI Grade B Officer Recruitment 2025',
      type: 'job',
      organization: 'Reserve Bank of India',
      description: 'Recruitment for Grade B officers in General, DEPR, and DSIM streams.',
      eligibility: 'Graduate with 60% marks, Age 21-30',
      deadline: '2025-05-15',
      location: 'All India',
      category: 'General',
      url: 'https://rbi.org.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'PM SHRI Schools Scheme',
      type: 'scheme',
      organization: 'Ministry of Education',
      description: 'Scheme for upgradation of existing schools to exemplar schools.',
      eligibility: 'Schools with minimum enrollment criteria',
      deadline: '2025-08-31',
      location: 'All India',
      category: 'General',
      url: 'https://pmshri.doe.gov.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'CSIR NET 2025',
      type: 'exam',
      organization: 'Council of Scientific & Industrial Research',
      description: 'National Eligibility Test for lectureship and Junior Research Fellowship.',
      eligibility: 'MSc in relevant subject with 55% marks',
      deadline: '2025-04-20',
      location: 'All India',
      category: 'General',
      url: 'https://csirnet.nta.nic.in',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];

  return mockData;
}

// Get AI status
router.get('/status', authenticate, (req, res) => {
  try {
    res.json({
      status: 'active',
      lastFetch: new Date().toISOString(),
      totalSources: 5,
      opportunitiesInDb: db.opportunities.length,
      uptime: '99.9%',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get AI status', error: error.message });
  }
});

export default router;
