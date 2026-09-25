import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { theme } from '../theme/theme';

export default function AuthScreen() {
  const setRole = useStore(s => s.setRole);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Hero Branding */}
      <View style={styles.heroSection}>
        <View style={styles.badgeWrap}>
          <View style={styles.demoBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.demoBadgeText}>DUAL-ROLE COMMERCE SYSTEM</Text>
          </View>
        </View>

        <Text style={styles.brandTitle}>DualCommerce</Text>
        <Text style={styles.brandSubtitle}>
          Select a role to experience the mobile shopping and merchant management platform.
        </Text>
      </View>

      {/* Role Selection Cards */}
      <View style={styles.cardsContainer}>
        {/* Customer Card */}
        <TouchableOpacity
          style={[styles.roleCard, styles.customerCard]}
          onPress={() => setRole('customer')}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="cart" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.tagWrap}>
              <View style={[styles.roleTag, { backgroundColor: theme.colors.primaryLight }]}>
                <Text style={[styles.roleTagText, { color: theme.colors.primary }]}>B2C SHOPPER</Text>
              </View>
            </View>
          </View>

          <Text style={styles.cardTitle}>Customer Portal</Text>
          <Text style={styles.cardDesc}>
            Browse product catalog, filter categories, manage shopping cart with swipe gestures, and chat with suppliers in real-time.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>2-Column Grid & Debounced Search</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Swipe-to-Delete Cart & Quantity Controls</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Direct Real-Time Support Chat</Text>
            </View>
          </View>

          <View style={[styles.cardButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.cardButtonText}>Continue as Customer</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Supplier Card */}
        <TouchableOpacity
          style={[styles.roleCard, styles.supplierCard]}
          onPress={() => setRole('supplier')}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.supplierLight }]}>
              <Ionicons name="analytics" size={32} color={theme.colors.supplierDark} />
            </View>
            <View style={styles.tagWrap}>
              <View style={[styles.roleTag, { backgroundColor: theme.colors.supplierLight }]}>
                <Text style={[styles.roleTagText, { color: theme.colors.supplierDark }]}>B2B MERCHANT</Text>
              </View>
            </View>
          </View>

          <Text style={styles.cardTitle}>Supplier Portal</Text>
          <Text style={styles.cardDesc}>
            Access high-level revenue and category analytics, update live inventory stock counts, and answer customer inquiries.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Revenue Trend & Donut Category Charts</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Real-Time Stock Availability Toggle</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Live Customer Support Inbox</Text>
            </View>
          </View>

          <View style={[styles.cardButton, { backgroundColor: theme.colors.supplierDark }]}>
            <Text style={styles.cardButtonText}>Continue as Supplier</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footerNote}>
        <Ionicons name="repeat-outline" size={16} color={theme.colors.textMuted} />
        <Text style={styles.footerNoteText}>
          You can seamlessly switch roles anytime via the navigation bar.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  heroSection: {
    marginBottom: 24,
  },
  badgeWrap: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: theme.colors.primary,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 18,
  },
  roleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 22,
    borderWidth: 1.5,
    ...theme.shadows.md,
  },
  customerCard: {
    borderColor: '#E0E7FF',
  },
  supplierCard: {
    borderColor: '#FEF3C7',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagWrap: {},
  roleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  featureList: {
    gap: 8,
    marginBottom: 20,
    backgroundColor: theme.colors.surfaceSubtle,
    padding: 12,
    borderRadius: theme.radius.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12.5,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: theme.radius.md,
    gap: 8,
  },
  cardButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 10,
  },
  footerNoteText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
