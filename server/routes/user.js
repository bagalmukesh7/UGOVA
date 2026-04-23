import express from 'express';
import { db } from '../db/mockDb.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get dashboard data
router.get('/dashboard', (req, res) => {
  try {
    const applications = db.applications
      .filter(a => a.userId === req.user.id)
      .map(app => ({
        ...app,
        opportunity: db.opportunities.find(o => o.id === app.opportunityId),
      }));

    const stats = {
      totalApplications: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      applied: applications.filter(a => a.status === 'applied').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      recentApplications: applications
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 5),
      profileComplete: calculateProfileCompletion(req.user),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
});

function calculateProfileCompletion(user) {
  let score = 0;
  if (user.name) score += 20;
  if (user.email) score += 20;
  if (user.phone) score += 20;
  if (user.profile?.education) score += 20;
  if (user.profile?.state) score += 20;
  return score;
}

export default router;
