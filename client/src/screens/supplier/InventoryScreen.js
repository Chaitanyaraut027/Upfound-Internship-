import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';

export default function InventoryScreen() {
  const inventory = useStore(s => s.inventory);
  const toggleStock = useStore(s => s.toggleStock);
  const updateStockCount = useStore(s => s.updateStockCount);
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockInput, setStockInput] = useState('');

  // Counts
  const totalCount = inventory.length;
  const inStockCount = inventory.filter(p => p.inStock && p.stockCount > 0).length;
  const lowStockCount = inventory.filter(p => p.inStock && p.stockCount > 0 && p.stockCount <= 15).length;
  const outOfStockCount = inventory.filter(p => !p.inStock || p.stockCount <= 0).length;

  const filteredList = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (filterTab === 'In Stock') return item.inStock && item.stockCount > 0;
      if (filterTab === 'Low Stock') return item.inStock && item.stockCount > 0 && item.stockCount <= 15;
      if (filterTab === 'Out of Stock') return !item.inStock || item.stockCount <= 0;

      return true;
    });
  }, [inventory, search, filterTab]);

  const openEditor = (product) => {
    setSelectedProduct(product);
    setStockInput(product.stockCount.toString());
    setModalVisible(true);
  };

  const handleAdjustDelta = (delta) => {
    const current = parseInt(stockInput) || 0;
    const nextVal = Math.max(0, current + delta);
    setStockInput(nextVal.toString());
  };

  const saveStock = () => {
    if (selectedProduct) {
      const count = parseInt(stockInput) || 0;
      updateStockCount(selectedProduct.id, count);
    }
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const isOutOfStock = !item.inStock || item.stockCount <= 0;
    const isLowStock = item.inStock && item.stockCount > 0 && item.stockCount <= 15;

    return (
      <View style={styles.inventoryCard}>
        <Image source={{ uri: item.image }} style={styles.thumbImage} resizeMode="cover" />

        <View style={styles.itemMeta}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemCategory}>{item.category} • ${item.price.toFixed(2)}</Text>

          {/* Status Badge */}
          <View style={styles.badgeRow}>
            {isOutOfStock ? (
              <View style={[styles.statusBadge, styles.badgeOut]}>
                <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
                <Text style={styles.badgeTextOut}>Out of Stock</Text>
              </View>
            ) : isLowStock ? (
              <View style={[styles.statusBadge, styles.badgeLow]}>
                <View style={[styles.dot, { backgroundColor: theme.colors.warning }]} />
                <Text style={styles.badgeTextLow}>Low Stock ({item.stockCount})</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.badgeIn]}>
                <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
                <Text style={styles.badgeTextIn}>In Stock ({item.stockCount})</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right Action: Stock Button & Switch */}
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editStockBtn}
            onPress={() => openEditor(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.editStockNumber}>{item.stockCount}</Text>
            <Ionicons name="pencil" size={12} color={theme.colors.supplierDark} />
          </TouchableOpacity>

          <Switch
            value={item.inStock && item.stockCount > 0}
            onValueChange={() => toggleStock(item.id)}
            trackColor={{ false: theme.colors.border, true: '#FDE68A' }}
            thumbColor={item.inStock && item.stockCount > 0 ? theme.colors.supplierDark : '#94a3b8'}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventory Manager</Text>
          <Text style={styles.headerSub}>
            {inStockCount} of {totalCount} items currently available
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Filter inventory by name or category..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {[
          { key: 'All', label: `All (${totalCount})` },
          { key: 'In Stock', label: `In Stock (${inStockCount})` },
          { key: 'Low Stock', label: `Low (${lowStockCount})` },
          { key: 'Out of Stock', label: `Out (${outOfStockCount})` },
        ].map(tab => {
          const isActive = filterTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setFilterTab(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Product Inventory List */}
      <FlatList
        data={filteredList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>No matching products</Text>
            <Text style={styles.emptySub}>Try searching with another keyword or change filter tab.</Text>
          </View>
        }
      />

      {/* Stock Edit Bottom Sheet Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalHeading}>Edit Stock Count</Text>
            {selectedProduct && (
              <View style={styles.modalProductMeta}>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalProductName} numberOfLines={2}>
                    {selectedProduct.name}
                  </Text>
                  <Text style={styles.modalProductCategory}>
                    {selectedProduct.category} • ${selectedProduct.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {/* Quick Stepper Buttons for fast demo adjustments */}
            <Text style={styles.stepperSectionLabel}>QUICK STEPPER</Text>
            <View style={styles.quickStepRow}>
              <TouchableOpacity style={styles.quickStepBtn} onPress={() => handleAdjustDelta(-5)}>
                <Text style={styles.quickStepText}>-5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickStepBtn} onPress={() => handleAdjustDelta(-1)}>
                <Text style={styles.quickStepText}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickStepBtn} onPress={() => handleAdjustDelta(1)}>
                <Text style={styles.quickStepText}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickStepBtn} onPress={() => handleAdjustDelta(5)}>
                <Text style={styles.quickStepText}>+5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickStepBtn, { backgroundColor: theme.colors.dangerLight }]}
                onPress={() => setStockInput('0')}
              >
                <Text style={[styles.quickStepText, { color: theme.colors.danger }]}>0</Text>
              </TouchableOpacity>
            </View>

            {/* Numeric Input */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>Stock Count:</Text>
              <TextInput
                style={styles.modalInput}
                value={stockInput}
                onChangeText={setStockInput}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={saveStock}
                activeOpacity={0.8}
              >
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12.5,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: theme.colors.textPrimary,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 6,
  },
  tabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.supplierDark,
    borderColor: theme.colors.supplierDark,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  inventoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  thumbImage: {
    width: 54,
    height: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSubtle,
    marginRight: 12,
  },
  itemMeta: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 5,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: theme.radius.sm,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeIn: {
    backgroundColor: theme.colors.successLight,
  },
  badgeTextIn: {
    fontSize: 10.5,
    fontWeight: '700',
    color: theme.colors.successDark,
  },
  badgeLow: {
    backgroundColor: theme.colors.warningLight,
  },
  badgeTextLow: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E',
  },
  badgeOut: {
    backgroundColor: theme.colors.dangerLight,
  },
  badgeTextOut: {
    fontSize: 10.5,
    fontWeight: '700',
    color: theme.colors.danger,
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  editStockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.supplierLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    gap: 4,
  },
  editStockNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.supplierDark,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: 24,
    ...theme.shadows.lg,
  },
  modalHandle: {
    width: 44,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  modalProductMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    padding: 12,
    borderRadius: theme.radius.md,
    marginBottom: 16,
  },
  modalThumb: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.sm,
    marginRight: 12,
  },
  modalProductName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalProductCategory: {
    fontSize: 11.5,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  stepperSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  quickStepRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickStepBtn: {
    flex: 1,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickStepText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputPrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginRight: 10,
  },
  modalInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  saveBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.supplierDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
