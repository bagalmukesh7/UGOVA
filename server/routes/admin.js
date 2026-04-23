import express from 'express';
import { db } from '../db/mockDb.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalUsers: db.users.filter(u => u.role === 'user').length,
      totalApplications: db.applications.length,
      totalOpportunities: db.opportunities.length,
      totalSchemes: db.opportunities.filter(o => o.type === 'scheme').length,
      totalJobs: db.opportunities.filter(o => o.type === 'job').length,
      totalExams: db.opportunities.filter(o => o.type === 'exam').length,
      verifiedUsers: db.users.filter(u => u.isVerified).length,
      recentApplications: db.applications
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 10)
        .map(app => ({
          ...app,
          user: db.users.find(u => u.id === app.userId),
          opportunity: db.opportunities.find(o => o.id === app.opportunityId),
        })),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

// Get all users
router.get('/users', (req, res) => {
  try {
    const users = db.users
      .filter(u => u.role === 'user')
      .map(({ password, ...user }) => user);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get all applications
router.get('/applications', (req, res) => {
  try {
    const applications = db.applications.map(app => ({
      ...app,
      user: db.users.find(u => u.id === app.userId),
      opportunity: db.opportunities.find(o => o.id === app.opportunityId),
    }));
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Update application status
router.put('/applications/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const app = db.applications.find(a => a.id === req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    app.status = status;
    app.updatedAt = new Date().toISOString();

    res.json({ message: 'Status updated', application: app });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

// Get activity logs
router.get('/activity', (req, res) => {
  try {
    const logs = db.activityLogs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100)
      .map(log => ({
        ...log,
        user: db.users.find(u => u.id === log.userId),
      }));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch logs', error: error.message });
  }
});

export default router;
