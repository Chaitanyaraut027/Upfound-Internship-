const express = require('express');
const router = express.Router();
const { fetchLeadFromMeta } = require('../services/meta');
const { addLead } = require('./leads');
const { emitNewLead } = require('../services/socket');

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.META_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

router.post('/webhook', async (req, res) => {
  res.status(200).send('EVENT_RECEIVED');

  try {
    const body = req.body;

    if (body.object === 'page' && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        if (Array.isArray(entry.changes)) {
          for (const change of entry.changes) {
            if (change.field === 'leadgen' && change.value) {
              const leadgenId = change.value.leadgen_id;
              if (leadgenId) {
                await processLead(leadgenId);
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err.message);
  }
});

async function processLead(leadgenId) {
  try {
    const lead = await fetchLeadFromMeta(leadgenId);
    const added = addLead(lead);
    if (added) {
      emitNewLead(lead);
    }
  } catch (err) {
    console.error(`Failed to process lead ${leadgenId}:`, err.message);
  }
}

module.exports = router;
