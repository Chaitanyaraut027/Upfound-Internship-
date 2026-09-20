export async function fetchLeadFromMeta(leadgenId) {
  const apiVersion = process.env.META_API_VERSION || 'v20.0';
  const accessToken = process.env.META_ACCESS_TOKEN;
  const endpoint = `https://graph.facebook.com/${apiVersion}/${leadgenId}?access_token=${accessToken}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Meta API response error: ${response.status}`);
  }

  const rawLeadData = await response.json();
  return formatMetaLead(rawLeadData);
}

function formatMetaLead(data) {
  const lead = {
    id: data.id,
    created_time: data.created_time || new Date().toISOString(),
    name: 'N/A',
    email: 'N/A',
    phone: 'N/A'
  };

  if (Array.isArray(data.field_data)) {
    for (const field of data.field_data) {
      const fieldName = (field.name || '').toLowerCase();
      const fieldValue = Array.isArray(field.values) ? field.values[0] : field.values;

      if (fieldName.includes('name') || fieldName.includes('full_name')) {
        lead.name = fieldValue;
      } else if (fieldName.includes('email')) {
        lead.email = fieldValue;
      } else if (fieldName.includes('phone') || fieldName.includes('mobile')) {
        lead.phone = fieldValue;
      }
    }
  }

  return lead;
}
