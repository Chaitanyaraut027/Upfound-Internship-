import { Router } from 'express';
import { emitNewLead } from '../services/socket.js';

const router = Router();
const leadsDatabase = [];

export function getLeads() {
  return leadsDatabase;
}

export function saveLead(lead) {
  const alreadyExists = leadsDatabase.some((existingLead) => existingLead.id === lead.id);
  if (alreadyExists) {
    return false;
  }
  leadsDatabase.unshift(lead);
  return true;
}

router.get('/leads', (req, res) => {
  res.json({
    success: true,
    count: leadsDatabase.length,
    data: leadsDatabase
  });
});

router.get('/leads/:id', (req, res) => {
  const targetLead = leadsDatabase.find((lead) => lead.id === req.params.id);
  if (!targetLead) {
    return res.status(404).json({
      success: false,
      error: 'Lead not found'
    });
  }
  res.json({
    success: true,
    data: targetLead
  });
});

router.post('/leads', (req, res) => {
  const { id, name, email, phone, created_time } = req.body;

  if (!name && !email) {
    return res.status(400).json({
      success: false,
      error: 'Either name or email is required'
    });
  }

  const newLead = {
    id: id || `local_${Date.now()}`,
    name: name || 'Test User',
    email: email || 'test@example.com',
    phone: phone || '+1234567890',
    created_time: created_time || new Date().toISOString()
  };

  const isSaved = saveLead(newLead);
  if (!isSaved) {
    return res.status(409).json({
      success: false,
      error: 'Lead already exists'
    });
  }

  emitNewLead(newLead);
  res.status(201).json({
    success: true,
    data: newLead
  });
});

export default router;
