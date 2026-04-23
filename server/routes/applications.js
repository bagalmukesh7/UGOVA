import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/mockDb.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's applications
router.get('/', authenticate, (req, res) => {
  try {
    const applications = db.applications.filter(a => a.userId === req.user.id)
      .map(app => ({
        ...app,
        opportunity: db.opportunities.find(o => o.id === app.opportunityId),
      }));
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Apply for an opportunity
router.post('/', authenticate, (req, res) => {
  try {
    const { opportunityId } = req.body;
    
    const opportunity = db.opportunities.find(o => o.id === opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const existing = db.applications.find(
      a => a.userId === req.user.id && a.opportunityId === opportunityId
    );
    if (existing) {
      return res.status(400).json({ message: 'Already applied for this opportunity' });
    }

    const application = {
      id: uuidv4(),
      userId: req.user.id,
      opportunityId,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.applications.push(application);

    // Log activity
    db.activityLogs.push({
      id: uuidv4(),
      userId: req.user.id,
      action: 'APPLY',
      details: `Applied for ${opportunity.title}`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Application created',
      application: {
        ...application,
        opportunity,
      },
      redirectUrl: opportunity.url,
    });
  } catch (error) {
    res.status(500).json({ message: 'Application failed', error: error.message });
  }
});

export default router;
