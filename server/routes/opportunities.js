import express from 'express';
import { db } from '../db/mockDb.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all opportunities with filters
router.get('/', (req, res) => {
  try {
    const { type, location, category, search, status } = req.query;
    let opportunities = [...db.opportunities];

    if (type && type !== 'all') {
      opportunities = opportunities.filter(o => o.type === type);
    }
    if (location && location !== 'all') {
      opportunities = opportunities.filter(o => 
        o.location === location || o.location === 'All India'
      );
    }
    if (category && category !== 'all') {
      opportunities = opportunities.filter(o => o.category === category);
    }
    if (status) {
      opportunities = opportunities.filter(o => o.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      opportunities = opportunities.filter(o => 
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    }

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch opportunities', error: error.message });
  }
});

// Get single opportunity
router.get('/:id', (req, res) => {
  try {
    const opportunity = db.opportunities.find(o => o.id === req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch opportunity', error: error.message });
  }
});

// Create opportunity (admin)
router.post('/', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const { title, type, organization, description, eligibility, deadline, location, category, url } = req.body;

    const opportunity = {
      id: crypto.randomUUID(),
      title,
      type,
      organization,
      description,
      eligibility,
      deadline,
      location,
      category,
      url,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    db.opportunities.push(opportunity);
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create opportunity', error: error.message });
  }
});

export default router;
