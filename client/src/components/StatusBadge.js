import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function StatusBadge({ isConnected }) {
  return (
    <View style={[styles.badge, isConnected ? styles.connected : styles.disconnected]}>
      <View style={[styles.dot, isConnected ? styles.dotConnected : styles.dotDisconnected]} />
      <Text style={styles.text}>
        {isConnected ? 'LIVE SYNC ACTIVE' : 'DISCONNECTED'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1
  },
  connected: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981'
  },
  disconnected: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  dotConnected: {
    backgroundColor: '#10b981'
  },
  dotDisconnected: {
    backgroundColor: '#ef4444'
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: 0.5
  }
});
