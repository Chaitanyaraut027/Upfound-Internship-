async function fetchLeadFromMeta(leadgenId) {
  const version = process.env.META_API_VERSION || 'v20.0';
  const token = process.env.META_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/${version}/${leadgenId}?access_token=${token}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Meta API error ${response.status}`);
  }

  const data = await response.json();
  return parseMetaLead(data);
}

function parseMetaLead(data) {
  const lead = {
    id: data.id,
    created_time: data.created_time || new Date().toISOString(),
    name: 'N/A',
    email: 'N/A',
    phone: 'N/A',
    raw_field_data: data.field_data || []
  };

  if (Array.isArray(data.field_data)) {
    for (const field of data.field_data) {
      const key = (field.name || '').toLowerCase();
      const val = Array.isArray(field.values) ? field.values[0] : field.values;

      if (key.includes('name') || key.includes('full_name')) {
        lead.name = val;
      } else if (key.includes('email')) {
        lead.email = val;
      } else if (key.includes('phone') || key.includes('mobile')) {
        lead.phone = val;
      }
    }
  }

  return lead;
}

module.exports = {
  fetchLeadFromMeta
};
