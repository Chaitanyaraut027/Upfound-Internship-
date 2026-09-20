import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function LeadCard({ lead }) {
  const formattedDate = lead.created_time
    ? new Date(lead.created_time).toLocaleString()
    : 'Just now';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{lead.name || 'Unnamed Lead'}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>NEW</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{lead.email || 'N/A'}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{lead.phone || 'N/A'}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.timeLabel}>Received: {formattedDate}</Text>
        <Text style={styles.idLabel}>ID: {lead.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc'
  },
  tag: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff'
  },
  detailRow: {
    marginVertical: 4
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  value: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500',
    marginTop: 2
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155'
  },
  timeLabel: {
    fontSize: 11,
    color: '#94a3b8'
  },
  idLabel: {
    fontSize: 11,
    color: '#64748b'
  }
});
