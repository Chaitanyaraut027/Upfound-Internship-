import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../data/products';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 12;
const CARD_WIDTH = (width - (GRID_PADDING * 2) - GRID_GAP) / 2;

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const CATEGORY_ICONS = {
  All: 'sparkles-outline',
  Electronics: 'hardware-chip-outline',
  Clothing: 'shirt-outline',
  'Home & Kitchen': 'home-outline',
  Sports: 'fitness-outline',
};

function ProductCard({ item, onPress, onAddToCart }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleQuickAdd = (e) => {
    e.stopPropagation?.();
    if (!item.inStock || item.stockCount <= 0) return;
    
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 90, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    onAddToCart(item);
  };

  const isLowStock = item.inStock && item.stockCount > 0 && item.stockCount <= 15;
  const isOutOfStock = !item.inStock || item.stockCount <= 0;

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.88}
      onPress={() => onPress(item)}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {/* Badges Overlay */}
        <View style={styles.topBadges}>
          {isOutOfStock ? (
            <View style={[styles.stockPill, styles.stockPillOut]}>
              <Text style={styles.stockPillTextOut}>Out of Stock</Text>
            </View>
          ) : isLowStock ? (
            <View style={[styles.stockPill, styles.stockPillLow]}>
              <Text style={styles.stockPillTextLow}>Low: {item.stockCount} left</Text>
            </View>
          ) : (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{item.category}</Text>
            </View>
          )}
        </View>

        {/* Rating Floating Tag */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={styles.ratingValue}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.stockStatusText}>
              {isOutOfStock ? 'Unavailable' : `${item.stockCount} in stock`}
            </Text>
          </View>

          {/* Quick Add Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.quickAddBtn,
                isOutOfStock && styles.quickAddBtnDisabled,
              ]}
              onPress={handleQuickAdd}
              disabled={isOutOfStock}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isOutOfStock ? 'close' : 'add'}
                size={18}
                color={isOutOfStock ? theme.colors.textMuted : '#ffffff'}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CatalogScreen({ navigation }) {
  const inventory = useStore(s => s.inventory);
  const addToCart = useStore(s => s.addToCart);
  const setRole = useStore(s => s.setRole);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [quickToast, setQuickToast] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;

  const debouncedSearch = useDebounce(search, 250);
  const insets = useSafeAreaInsets();

  // Filter against live inventory store
  const filtered = useMemo(() => {
    return inventory.filter(p => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [inventory, debouncedSearch, activeCategory]);

  const showToast = (productName) => {
    setQuickToast(`Added ${productName} to cart`);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1);
    showToast(product.name.split(' ')[0]);
  }, [addToCart]);

  const handleProductPress = useCallback((product) => {
    navigation.navigate('ProductDetail', { product });
  }, [navigation]);

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('All');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header with Role Badge & Switcher */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>DualCommerce</Text>
          <View style={styles.roleRow}>
            <View style={styles.rolePill}>
              <View style={styles.activeDot} />
              <Text style={styles.rolePillText}>Customer Mode</Text>
            </View>
          </View>
        </View>

        {/* Quick Role Switch Shortcut */}
        <TouchableOpacity
          onPress={() => setRole('supplier')}
          style={styles.switchRoleBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal" size={14} color={theme.colors.supplierDark} />
          <Text style={styles.switchRoleText}>Supplier</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={19} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product name or category..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Category Chips */}
      <View style={styles.chipSection}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => {
            const isSelected = activeCategory === item;
            const iconName = CATEGORY_ICONS[item] || 'pricetag-outline';
            return (
              <TouchableOpacity
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setActiveCategory(item)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={iconName}
                  size={14}
                  color={isSelected ? '#ffffff' : theme.colors.textSecondary}
                  style={styles.chipIcon}
                />
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Product Catalog Grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={handleProductPress}
            onAddToCart={handleAddToCart}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="search-outline" size={44} color={theme.colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find any products matching "{debouncedSearch || activeCategory}".
            </Text>
            <TouchableOpacity style={styles.clearFilterBtn} onPress={clearFilters} activeOpacity={0.8}>
              <Ionicons name="refresh-outline" size={16} color="#ffffff" />
              <Text style={styles.clearFilterText}>Reset Search & Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Quick Add Toast Notification */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toastContainer,
          {
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
        <Text style={styles.toastText}>{quickToast}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: GRID_PADDING,
    paddingTop: 8,
    paddingBottom: 8,
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
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: theme.radius.full,
    gap: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  rolePillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.supplierLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    gap: 5,
    borderWidth: 1,
    borderColor: '#FDE68A',
    ...theme.shadows.sm,
  },
  switchRoleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: theme.colors.supplierDark,
  },
  searchContainer: {
    paddingHorizontal: GRID_PADDING,
    marginBottom: 8,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  chipSection: {
    marginBottom: 6,
  },
  chipList: {
    paddingHorizontal: GRID_PADDING,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  gridContainer: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 6,
    paddingBottom: 110,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.95,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  topBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  categoryPillText: {
    fontSize: 9.5,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stockPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  stockPillOut: {
    backgroundColor: theme.colors.danger,
  },
  stockPillTextOut: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '800',
  },
  stockPillLow: {
    backgroundColor: theme.colors.warning,
  },
  stockPillTextLow: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '800',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: theme.radius.full,
    ...theme.shadows.sm,
  },
  ratingValue: {
    fontSize: 10.5,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  productInfo: {
    padding: 11,
  },
  productName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -0.3,
  },
  stockStatusText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
  quickAddBtn: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  quickAddBtnDisabled: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    gap: 6,
    ...theme.shadows.sm,
  },
  clearFilterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    gap: 8,
    ...theme.shadows.lg,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
