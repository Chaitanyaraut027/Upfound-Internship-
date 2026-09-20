import { Router } from 'express';
import { fetchLeadFromMeta } from '../services/meta.js';
import { saveLead } from './leads.js';
import { emitNewLead } from '../services/socket.js';

const router = Router();

router.get('/webhook', (req, res) => {
  console.log('--- WEBHOOK GET REQUEST RECEIVED ---');
  console.log('Query:', req.query);
  console.log('Headers:', req.headers);
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const expectedToken = process.env.META_VERIFY_TOKEN;

  console.log(`Expected Token: ${expectedToken} | Received Token: ${token}`);

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('Verification SUCCESS. Sending challenge:', challenge);
    return res.status(200).send(challenge);
  }
  
  console.log('Verification FAILED. Sending 403.');
  return res.sendStatus(403);
});

router.post('/webhook', async (req, res) => {
  console.log('--- POST WEBHOOK RECEIVED ---');
  console.log(JSON.stringify(req.body, null, 2));
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
