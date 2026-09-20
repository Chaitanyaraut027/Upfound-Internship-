import { saveLead } from '../routes/leads.js';
import { emitNewLead } from './socket.js';

const POLL_INTERVAL_MS = 4000;
let seenLeadIds = new Set();
let pollerRunning = false;

async function fetchFormLeads() {
  const apiVersion = process.env.META_API_VERSION || 'v20.0';
  const token = process.env.META_ACCESS_TOKEN;
  const formId = process.env.META_FORM_ID;

  if (!token || !formId) return;

  const url = `https://graph.facebook.com/${apiVersion}/${formId}/leads?fields=id,created_time,field_data&limit=5&access_token=${token}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      console.error('[POLLER] API error:', json.error.message);
      return;
    }

    const leads = json.data || [];

    for (const rawLead of leads) {
      if (seenLeadIds.has(rawLead.id)) continue;

      seenLeadIds.add(rawLead.id);
      const lead = formatLead(rawLead);
      const saved = saveLead(lead);

      if (saved) {
        console.log(`[POLLER] 🎉 New lead from Meta! Name: ${lead.name} | Email: ${lead.email}`);
        emitNewLead(lead);
      }
    }
  } catch (err) {
    // network errors - ignore silently
  }
}

function formatLead(data) {
  const lead = {
    id: data.id,
    created_time: data.created_time || new Date().toISOString(),
    name: 'N/A',
    email: 'N/A',
    phone: 'N/A'
  };

  if (Array.isArray(data.field_data)) {
    for (const field of data.field_data) {
      const key = (field.name || '').toLowerCase();
      const val = Array.isArray(field.values) ? field.values[0] : field.values;
      if (key.includes('name')) lead.name = val;
      else if (key.includes('email')) lead.email = val;
      else if (key.includes('phone') || key.includes('mobile')) lead.phone = val;
    }
  }

  return lead;
}

export async function startPoller() {
  if (pollerRunning) return;
  pollerRunning = true;

  // Pre-load existing lead IDs so we don't re-emit old leads on restart
  const apiVersion = process.env.META_API_VERSION || 'v20.0';
  const token = process.env.META_ACCESS_TOKEN;
  const formId = process.env.META_FORM_ID;

  if (token && formId) {
    try {
      const res = await fetch(`https://graph.facebook.com/${apiVersion}/${formId}/leads?fields=id&limit=20&access_token=${token}`);
      const json = await res.json();
      if (json.data) {
        json.data.forEach(l => seenLeadIds.add(l.id));
        console.log(`[POLLER] Pre-loaded ${seenLeadIds.size} existing lead IDs — watching for NEW leads...`);
      }
    } catch (e) {}
  }

  console.log('[POLLER] ✅ Started. Polling Meta form every 4 seconds for new leads...');
  setInterval(fetchFormLeads, POLL_INTERVAL_MS);
}
