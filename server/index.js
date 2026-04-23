import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import opportunityRoutes from './routes/opportunities.js';
import applicationRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import aiRoutes from './routes/ai.js';
import { seedData } from './db/mockDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Seed mock database
try {
  await seedData();
  console.log('Database seeded successfully');
} catch (err) {
  console.error('Database seeding failed:', err.message);
}

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'UGOVA server is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

app.listen(PORT, () => {
  console.log(`UGOVA server running on port ${PORT}`);
});
