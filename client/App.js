import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Header } from './src/components/Header';
import { LeadCard } from './src/components/LeadCard';
import { fetchLeads } from './src/services/api';
import { connectSocket, disconnectSocket } from './src/services/socket';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const loadLeads = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchLeads();
      setLeads(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend REST API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();

    connectSocket(
      () => setIsConnected(true),
      () => setIsConnected(false),
      (newLead) => {
        setLeads((prevLeads) => {
          const exists = prevLeads.some((l) => l.id === newLead.id);
          if (exists) return prevLeads;
          return [newLead, ...prevLeads];
        });
      }
    );

    return () => {
      disconnectSocket();
    };
  }, [loadLeads]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadLeads();
  }, [loadLeads]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Header isConnected={isConnected} leadCount={leads.length} />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Fetching leads via REST API...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.subErrorText}>Pull down to retry REST API fetch</Text>
        </View>
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <LeadCard lead={item} />}
          contentContainerStyle={leads.length === 0 ? styles.emptyContainer : styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
              colors={['#3b82f6']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Text style={styles.emptyTitle}>No Leads Received Yet</Text>
              <Text style={styles.emptySub}>
                Submit a test lead via Meta Lead Testing Tool to see real-time Socket.IO synchronization.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 14
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  subErrorText: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center'
  },
  listPadding: {
    paddingVertical: 12
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  emptyView: {
    alignItems: 'center',
    padding: 32
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  emptySub: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20
  }
});
