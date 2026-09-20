const express = require('express');
const router = express.Router();
const { emitNewLead } = require('../services/socket');

const leads = [];

function getLeads() {
  return leads;
}

function addLead(lead) {
  const existing = leads.find((l) => l.id === lead.id);
  if (existing) {
    return false;
  }
  leads.unshift(lead);
  return true;
}

router.get('/leads', (req, res) => {
  res.json({ success: true, count: leads.length, data: leads });
});

router.get('/leads/:id', (req, res) => {
  const lead = leads.find((l) => l.id === req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }
  res.json({ success: true, data: lead });
});

router.post('/leads', (req, res) => {
  const { id, name, email, phone, created_time } = req.body;
  if (!name && !email) {
    return res.status(400).json({ success: false, error: 'Name or Email is required' });
  }

  const newLead = {
    id: id || `local_${Date.now()}`,
    name: name || 'Test User',
    email: email || 'test@example.com',
    phone: phone || '+1234567890',
    created_time: created_time || new Date().toISOString()
  };

  const added = addLead(newLead);
  if (!added) {
    return res.status(409).json({ success: false, error: 'Duplicate lead ID' });
  }

  emitNewLead(newLead);
  res.status(201).json({ success: true, data: newLead });
});

module.exports = {
  router,
  getLeads,
  addLead
};
