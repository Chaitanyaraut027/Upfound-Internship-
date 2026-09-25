import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product: initialProduct } = route.params;
  const inventory = useStore(s => s.inventory);
  const addToCart = useStore(s => s.addToCart);
  const insets = useSafeAreaInsets();

  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Retrieve latest product state from live inventory
  const product = useMemo(() => {
    return inventory.find(p => p.id === initialProduct.id) || initialProduct;
  }, [inventory, initialProduct]);

  const isOutOfStock = !product.inStock || product.stockCount <= 0;
  const isLowStock = product.inStock && product.stockCount > 0 && product.stockCount <= 15;

  const handleIncrement = () => {
    if (quantity < product.stockCount) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product, quantity);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    setToastMessage(`Added ${quantity} item${quantity > 1 ? 's' : ''} to Cart!`);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleChatAboutProduct = () => {
    navigation.navigate('CustomerMain', { screen: 'Chat' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Floating Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topTitle} numberOfLines={1}>
          {product.name}
        </Text>

        <TouchableOpacity
          onPress={() => setIsFavorited(f => !f)}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorited ? theme.colors.danger : theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Product Image */}
        <View style={styles.heroImageWrap}>
          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlayBadge}>
            <Text style={styles.heroCategoryText}>{product.category}</Text>
          </View>
        </View>

        {/* Product Details Content */}
        <View style={styles.detailsContent}>
          {/* Header Row: Title & Rating */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.ratingRow}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Ionicons
                      key={star}
                      name={star <= Math.round(product.rating) ? 'star' : 'star-outline'}
                      size={14}
                      color="#F59E0B"
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>{product.rating} (120+ reviews)</Text>
              </View>
            </View>

            {/* Price Display */}
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>${product.price.toFixed(2)}</Text>
            </View>
          </View>

          {/* Stock Availability Banner */}
          <View style={styles.stockBanner}>
            <View style={styles.stockLeft}>
              <View
                style={[
                  styles.stockIndicator,
                  {
                    backgroundColor: isOutOfStock
                      ? theme.colors.danger
                      : isLowStock
                      ? theme.colors.warning
                      : theme.colors.success,
                  },
                ]}
              />
              <Text style={styles.stockStatusTitle}>
                {isOutOfStock
                  ? 'Currently Out of Stock'
                  : isLowStock
                  ? `Only ${product.stockCount} items left in stock!`
                  : `In Stock (${product.stockCount} available)`}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.askSupplierBtn}
              onPress={handleChatAboutProduct}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubbles-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.askSupplierText}>Ask Supplier</Text>
            </TouchableOpacity>
          </View>

          {/* Product Description */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Technical Specifications */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Specifications & Details</Text>
            <View style={styles.specsCard}>
              {product.specifications?.map((spec, index) => (
                <View
                  key={index}
                  style={[
                    styles.specRow,
                    index !== product.specifications.length - 1 && styles.specBorder,
                  ]}
                >
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Delivery & Warranty Perks */}
          <View style={styles.perksRow}>
            <View style={styles.perkItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.perkText}>Verified Supplier</Text>
            </View>
            <View style={styles.perkItem}>
              <Ionicons name="car-outline" size={18} color={theme.colors.success} />
              <Text style={styles.perkText}>Fast Shipping</Text>
            </View>
            <View style={styles.perkItem}>
              <Ionicons name="return-down-back-outline" size={18} color={theme.colors.secondary} />
              <Text style={styles.perkText}>30-Day Returns</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar with Quantity Selector & Add to Cart */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {/* Quantity Stepper */}
        <View style={styles.quantityContainer}>
          <Text style={styles.qtyLabel}>Quantity</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepperBtn, (quantity <= 1 || isOutOfStock) && styles.stepperBtnDisabled]}
              onPress={handleDecrement}
              disabled={quantity <= 1 || isOutOfStock}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={16} color={quantity <= 1 ? theme.colors.textMuted : theme.colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.qtyDisplay}>{quantity}</Text>

            <TouchableOpacity
              style={[
                styles.stepperBtn,
                (quantity >= product.stockCount || isOutOfStock) && styles.stepperBtnDisabled,
              ]}
              onPress={handleIncrement}
              disabled={quantity >= product.stockCount || isOutOfStock}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={16}
                color={quantity >= product.stockCount ? theme.colors.textMuted : theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart CTA */}
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.addToCartBtn, isOutOfStock && styles.addToCartBtnDisabled]}
            onPress={handleAddToCart}
            disabled={isOutOfStock}
            activeOpacity={0.85}
          >
            <Ionicons name="cart" size={20} color="#ffffff" />
            <Text style={styles.addToCartText}>
              {isOutOfStock ? 'Sold Out' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Added to Cart Feedback Toast */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroImageWrap: {
    position: 'relative',
    width: width,
    height: width * 0.78,
    backgroundColor: '#ffffff',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  heroCategoryText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailsContent: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    marginTop: -16,
    ...theme.shadows.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 28,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 12.5,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  priceBox: {
    alignItems: 'flex-end',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  stockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockStatusTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  askSupplierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  askSupplierText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  specsCard: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  specBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  specLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  perksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 6,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  perkText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 12,
    ...theme.shadows.md,
  },
  quantityContainer: {
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  qtyDisplay: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    gap: 8,
    ...theme.shadows.sm,
  },
  addToCartBtnDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  toast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    gap: 8,
    ...theme.shadows.lg,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
