import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge } from './StatusBadge';

export function Header({ isConnected, leadCount }) {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.title}>Meta Lead Sync</Text>
        <Text style={styles.subtitle}>{leadCount} {leadCount === 1 ? 'Lead' : 'Leads'} Captured</Text>
      </View>
      <StatusBadge isConnected={isConnected} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2
  }
});
