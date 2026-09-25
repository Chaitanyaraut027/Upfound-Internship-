import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { useStore } from '../../store/useStore';
import { REVENUE_DATA, CATEGORY_DATA, STATS } from '../../data/analytics';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 72;

function StatCard({ icon, label, value, trend, color, isNegative }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTop}>
        <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: isNegative ? theme.colors.dangerLight : theme.colors.successLight }]}>
            <Ionicons
              name={isNegative ? 'arrow-down' : 'arrow-up'}
              size={11}
              color={isNegative ? theme.colors.danger : theme.colors.success}
            />
            <Text style={[styles.trendText, { color: isNegative ? theme.colors.danger : theme.colors.success }]}>
              {trend}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const inventory = useStore(s => s.inventory);
  const setRole = useStore(s => s.setRole);
  const insets = useSafeAreaInsets();
  const [timeFilter, setTimeFilter] = useState('12M');

  // Compute live inventory metrics
  const totalProducts = inventory.length;
  const inStockCount = inventory.filter(p => p.inStock && p.stockCount > 0).length;
  const lowStockCount = inventory.filter(p => p.inStock && p.stockCount > 0 && p.stockCount <= 15).length;
  const outOfStockCount = inventory.filter(p => !p.inStock || p.stockCount <= 0).length;

  const lineData = (timeFilter === '6M' ? REVENUE_DATA.slice(6) : REVENUE_DATA).map(d => ({
    value: d.revenue / 1000,
    label: d.month,
    dataPointText: `${(d.revenue / 1000).toFixed(0)}k`,
  }));

  const pieData = CATEGORY_DATA.map(d => ({
    value: d.value,
    color: d.color,
    text: `${d.value}%`,
    focused: d.name === 'Electronics',
  }));

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header with Role Badge & Switcher */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Supplier Hub</Text>
          <View style={styles.roleRow}>
            <View style={styles.roleBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.roleText}>Supplier Mode</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setRole('customer')}
          style={styles.switchRoleBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal" size={14} color={theme.colors.primary} />
          <Text style={styles.switchRoleText}>Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Primary KPI Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="cash-outline"
          label="Total Revenue"
          value={STATS.totalRevenue}
          trend="+14.2%"
          color={theme.colors.primary}
        />
        <StatCard
          icon="receipt-outline"
          label="Orders Fulfilled"
          value={STATS.totalOrders.toLocaleString()}
          trend="+8.5%"
          color={theme.colors.success}
        />
        <StatCard
          icon="cube-outline"
          label="Live Catalog Items"
          value={`${totalProducts} SKUs`}
          trend={`${inStockCount} active`}
          color={theme.colors.supplierDark}
        />
        <StatCard
          icon="alert-circle-outline"
          label="Low Stock Alerts"
          value={`${lowStockCount} Items`}
          trend={lowStockCount > 0 ? 'Restock' : 'Optimal'}
          color={theme.colors.danger}
          isNegative={lowStockCount > 0}
        />
      </View>

      {/* Section 1: Revenue Overview (Line/Area Chart) */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.sectionHeaderTitle}>Revenue Overview</Text>
            <Text style={styles.sectionHeaderSub}>Monthly gross turnover in thousands ($K)</Text>
          </View>

          {/* Time Filter Pills */}
          <View style={styles.filterPills}>
            <TouchableOpacity
              style={[styles.pillBtn, timeFilter === '6M' && styles.pillBtnActive]}
              onPress={() => setTimeFilter('6M')}
            >
              <Text style={[styles.pillText, timeFilter === '6M' && styles.pillTextActive]}>6M</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pillBtn, timeFilter === '12M' && styles.pillBtnActive]}
              onPress={() => setTimeFilter('12M')}
            >
              <Text style={[styles.pillText, timeFilter === '12M' && styles.pillTextActive]}>12M</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartWrap}>
          <LineChart
            data={lineData}
            width={CHART_WIDTH}
            height={190}
            color={theme.colors.primary}
            thickness={3}
            hideDataPoints={false}
            dataPointsColor={theme.colors.primary}
            dataPointsRadius={4}
            startFillColor={theme.colors.primary}
            endFillColor={theme.colors.primary + '10'}
            areaChart
            curved
            yAxisColor={theme.colors.border}
            xAxisColor={theme.colors.border}
            yAxisTextStyle={{ color: theme.colors.textMuted, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.colors.textMuted, fontSize: 9 }}
            noOfSections={4}
            spacing={timeFilter === '6M' ? 44 : 24}
          />
        </View>
      </View>

      {/* Section 2: Category Breakdown (Donut Chart) */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.sectionHeaderTitle}>Category Breakdown</Text>
            <Text style={styles.sectionHeaderSub}>Sales distribution across product verticals</Text>
          </View>
        </View>

        <View style={styles.pieRow}>
          <View style={styles.pieWrap}>
            <PieChart
              data={pieData}
              donut
              radius={80}
              innerRadius={52}
              innerCircleColor="#ffffff"
              centerLabelComponent={() => (
                <View style={styles.pieCenter}>
                  <Text style={styles.pieCenterValue}>100%</Text>
                  <Text style={styles.pieCenterLabel}>Turnover</Text>
                </View>
              )}
            />
          </View>

          {/* Legend Items */}
          <View style={styles.legendContainer}>
            {CATEGORY_DATA.map(cat => (
              <View key={cat.name} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                <View style={styles.legendMeta}>
                  <Text style={styles.legendText} numberOfLines={1}>{cat.name}</Text>
                  <View style={styles.legendBarBg}>
                    <View style={[styles.legendBarFill, { width: `${cat.value * 2}%`, backgroundColor: cat.color }]} />
                  </View>
                </View>
                <Text style={styles.legendValue}>{cat.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Section 3: Inventory Summary Status */}
      <View style={[styles.chartCard, { marginBottom: 20 }]}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.sectionHeaderTitle}>Inventory Summary</Text>
            <Text style={styles.sectionHeaderSub}>Live catalog health and stock posture</Text>
          </View>
          <TouchableOpacity
            style={styles.manageInventoryBtn}
            onPress={() => navigation.navigate('Inventory')}
            activeOpacity={0.7}
          >
            <Text style={styles.manageInventoryText}>Manage</Text>
            <Ionicons name="arrow-forward" size={13} color={theme.colors.supplierDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.inventoryBreakdown}>
          <View style={styles.statusCol}>
            <View style={[styles.statusIconBox, { backgroundColor: theme.colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
            </View>
            <Text style={styles.statusCount}>{inStockCount}</Text>
            <Text style={styles.statusLabel}>In Stock</Text>
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusCol}>
            <View style={[styles.statusIconBox, { backgroundColor: theme.colors.warningLight }]}>
              <Ionicons name="warning" size={18} color={theme.colors.warning} />
            </View>
            <Text style={styles.statusCount}>{lowStockCount}</Text>
            <Text style={styles.statusLabel}>Low Stock</Text>
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusCol}>
            <View style={[styles.statusIconBox, { backgroundColor: theme.colors.dangerLight }]}>
              <Ionicons name="close-circle" size={18} color={theme.colors.danger} />
            </View>
            <Text style={styles.statusCount}>{outOfStockCount}</Text>
            <Text style={styles.statusLabel}>Out of Stock</Text>
          </View>
        </View>
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
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.supplierLight,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: theme.radius.full,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.supplierDark,
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: theme.colors.supplierDark,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    gap: 5,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    ...theme.shadows.sm,
  },
  switchRoleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 36 - 10) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statValue: {
    fontSize: 19,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11.5,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionHeaderSub: {
    fontSize: 11.5,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.sm,
    padding: 2,
  },
  pillBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.xs,
  },
  pillBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  pillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  pillTextActive: {
    color: '#ffffff',
  },
  chartWrap: {
    alignItems: 'center',
    marginLeft: -16,
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
  },
  pieCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  pieCenterLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 8,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendMeta: {
    flex: 1,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  legendBarBg: {
    height: 4,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: 2,
    marginTop: 3,
    overflow: 'hidden',
  },
  legendBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  manageInventoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.supplierLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    gap: 4,
  },
  manageInventoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.supplierDark,
  },
  inventoryBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    marginTop: 4,
  },
  statusCol: {
    alignItems: 'center',
  },
  statusIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statusCount: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  statusLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  statusDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.border,
  },
});
