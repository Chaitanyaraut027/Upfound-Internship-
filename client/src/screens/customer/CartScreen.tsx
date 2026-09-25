import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  HandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';
import { CartItem } from '../../types';

interface SwipeableCartItemProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
}

function SwipeableCartItem({ item, onRemove, onUpdateQty }: SwipeableCartItemProps) {
  const translateX = useSharedValue(0);

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    'worklet';
    const translationX = event.nativeEvent.translationX;
    if (translationX < 0) {
      translateX.value = Math.max(translationX, -130);
    }
  };

  const onHandlerStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (event.nativeEvent.state === State.END) {
      const translationX = event.nativeEvent.translationX;
      if (translationX < -85) {
        translateX.value = withTiming(-450, { duration: 180 }, () => {
          runOnJS(onRemove)(item.product.id);
        });
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    }
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.swipeContainer}>
      {/* Background Delete Action */}
      <View style={styles.deleteBackground}>
        <View style={styles.deleteContent}>
          <Ionicons name="trash-outline" size={22} color="#ffffff" />
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      </View>

      {/* Foreground Swipeable Card using Gesture Handler + Reanimated */}
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={[styles.cartItem, animatedCardStyle]}>
          <Image source={{ uri: item.product.image }} style={styles.itemImage} resizeMode="cover" />

          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.itemCategory}>{item.product.category}</Text>
            <Text style={styles.itemPrice}>
              ${(item.product.price * item.quantity).toFixed(2)}
              <Text style={styles.itemUnitPrice}> (${item.product.price.toFixed(2)} ea)</Text>
            </Text>
          </View>

          {/* Quantity Controls & Delete Icon */}
          <View style={styles.rightActions}>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQty(item.product.id, item.quantity - 1)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                  size={14}
                  color={item.quantity === 1 ? theme.colors.danger : theme.colors.primary}
                />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQty(item.product.id, item.quantity + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Quick Direct Delete Button */}
            <TouchableOpacity
              style={styles.directDeleteBtn}
              onPress={() => onRemove(item.product.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle-outline" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

export default function CartScreen({ navigation }: { navigation: any }) {
  const cart = useStore(s => s.cart);
  const removeFromCart = useStore(s => s.removeFromCart);
  const updateCartQuantity = useStore(s => s.updateCartQuantity);
  const clearCart = useStore(s => s.clearCart);
  const insets = useSafeAreaInsets();

  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? 0.0 : 0.0;
  const total = subtotal + tax + shipping;

  const handleRemove = useCallback((productId: string) => {
    removeFromCart(productId);
  }, [removeFromCart]);

  const handleUpdateQty = useCallback((productId: string, qty: number) => {
    updateCartQuantity(productId, qty);
  }, [updateCartQuantity]);

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your shopping cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearCart },
    ]);
  };

  const handleCheckout = () => {
    const randomOrder = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomOrder);
    setCheckoutModalVisible(true);
    clearCart();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSub}>
            {cart.length === 0
              ? 'No items in cart'
              : `${cart.reduce((a, b) => a + b.quantity, 0)} items selected`}
          </Text>
        </View>

        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={15} color={theme.colors.danger} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="cart-outline" size={54} color={theme.colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySub}>
            Explore our curated catalog and add high-quality products to get started.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.8}
          >
            <Ionicons name="storefront-outline" size={18} color="#ffffff" />
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Swipe Hint Banner */}
          <View style={styles.hintBanner}>
            <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.hintText}>
              Swipe left on any item to delete, or use the controls to change quantity.
            </Text>
          </View>

          {/* Cart Items List */}
          <FlatList
            data={cart}
            keyExtractor={item => item.product.id}
            renderItem={({ item }) => (
              <SwipeableCartItem
                item={item}
                onRemove={handleRemove}
                onUpdateQty={handleUpdateQty}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Order Summary & Checkout Card */}
          <View style={[styles.summary, { paddingBottom: insets.bottom + 14 }]}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Tax (8%)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>FREE</Text>
            </View>

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalSub}>Includes all taxes & duties</Text>
              </View>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Checkout Success Modal */}
      <Modal visible={checkoutModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.successIconBox}>
              <Ionicons name="checkmark-circle" size={56} color={theme.colors.success} />
            </View>
            <Text style={styles.modalTitle}>Order Confirmed!</Text>
            <Text style={styles.modalOrderNumber}>Order #{orderId}</Text>
            <Text style={styles.modalDesc}>
              Your purchase order has been generated and dispatched to the supplier. You can track this in real-time chat.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalChatBtn}
                onPress={() => {
                  setCheckoutModalVisible(false);
                  navigation.navigate('Chat');
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubbles-outline" size={18} color={theme.colors.primary} />
                <Text style={styles.modalChatBtnText}>Chat Supplier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => {
                  setCheckoutModalVisible(false);
                  navigation.navigate('Shop');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalDoneBtnText}>Continue Shopping</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.dangerLight,
    gap: 4,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.danger,
  },
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    gap: 8,
  },
  hintText: {
    fontSize: 11.5,
    color: theme.colors.primaryDark,
    fontWeight: '500',
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  swipeContainer: {
    marginBottom: 10,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  deleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  itemImage: {
    width: 68,
    height: 68,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
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
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  itemUnitPrice: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
  rightActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  directDeleteBtn: {
    padding: 2,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13.5,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    gap: 8,
    ...theme.shadows.sm,
  },
  browseBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  summary: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
    marginTop: 6,
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  totalSub: {
    fontSize: 10.5,
    color: theme.colors.textMuted,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.sm,
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  successIconBox: {
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -0.4,
  },
  modalOrderNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 4,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 13.5,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalChatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    gap: 6,
  },
  modalChatBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  modalDoneBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  modalDoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
