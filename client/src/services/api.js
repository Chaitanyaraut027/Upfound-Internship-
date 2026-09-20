import { API_BASE_URL } from '../config';

export async function fetchLeads() {
  const response = await fetch(`${API_BASE_URL}/api/leads`, {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch leads: ${response.statusText}`);
  }
  const result = await response.json();
  return result.data || [];
}
