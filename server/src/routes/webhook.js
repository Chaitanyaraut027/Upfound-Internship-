import { Router } from 'express';
import { fetchLeadFromMeta } from '../services/meta.js';
import { saveLead } from './leads.js';
import { emitNewLead } from '../services/socket.js';

const router = Router();

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const expectedToken = process.env.META_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === expectedToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

router.post('/webhook', async (req, res) => {
  res.status(200).send('EVENT_RECEIVED');

  try {
    const payload = req.body;

    if (payload.object === 'page' && Array.isArray(payload.entry)) {
      for (const entry of payload.entry) {
        if (Array.isArray(entry.changes)) {
          for (const change of entry.changes) {
            if (change.field === 'leadgen' && change.value?.leadgen_id) {
              await processIncomingLead(change.value.leadgen_id);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Webhook error:', error.message);
  }
});

async function processIncomingLead(leadgenId) {
  try {
    const lead = await fetchLeadFromMeta(leadgenId);
    const isSaved = saveLead(lead);

    if (isSaved) {
      emitNewLead(lead);
    }
  } catch (error) {
    console.error(`Error processing lead ID ${leadgenId}:`, error.message);
  }
}

export default router;
