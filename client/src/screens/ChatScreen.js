import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { io } from 'socket.io-client';
import { theme } from '../theme/theme';

const SOCKET_URL = 'ws://192.168.227.117:3001';

const CUSTOMER_SUGGESTIONS = [
  'Is this product currently in stock?',
  'What is the estimated delivery time?',
  'Do you provide bulk purchase discounts?',
  'Can I change my delivery address?',
];

const SUPPLIER_SUGGESTIONS = [
  'Yes! We have inventory ready to dispatch today.',
  'Standard delivery takes 2 to 3 business days.',
  'Bulk order discounts start at 10+ units.',
  'Your order has been verified and processed.',
];

export default function ChatScreen() {
  const role = useStore(s => s.role);
  const messages = useStore(s => s.messages);
  const addMessage = useStore(s => s.addMessage);
  const clearMessages = useStore(s => s.clearMessages);
  const setRole = useStore(s => s.setRole);

  const [text, setText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef(null);
  const socketRef = useRef(null);
  const insets = useSafeAreaInsets();

  const isCustomer = role === 'customer';

  useEffect(() => {
    try {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        timeout: 6000,
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', () => {
        setIsConnected(false);
      });

      socketRef.current.on('chat_message', (msg) => {
        if (msg.sender !== role) {
          addMessage(msg);
        }
      });
    } catch (e) {
      setIsConnected(false);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [role, addMessage]);

  const sendMessage = useCallback((overrideText) => {
    const content = (overrideText || text).trim();
    if (!content) return;

    const msg = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      text: content,
      sender: role,
      timestamp: new Date().toISOString(),
    };

    addMessage(msg);

    if (socketRef.current?.connected) {
      socketRef.current.emit('chat_message', msg);
    }

    if (!overrideText) {
      setText('');
    }
  }, [text, role, addMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleClearHistory = () => {
    Alert.alert('Clear Chat History', 'Erase messages in this conversation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearMessages },
    ]);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMe = (sender) => sender === role;

  const suggestions = isCustomer ? CUSTOMER_SUGGESTIONS : SUPPLIER_SUGGESTIONS;

  const renderMessage = ({ item }) => {
    const mine = isMe(item.sender);
    return (
      <View style={[styles.messageRow, mine ? styles.myRow : styles.theirRow]}>
        {!mine && (
          <View style={[styles.avatarBox, { backgroundColor: item.sender === 'supplier' ? theme.colors.supplierLight : theme.colors.primaryLight }]}>
            <Ionicons
              name={item.sender === 'supplier' ? 'business' : 'cart'}
              size={14}
              color={item.sender === 'supplier' ? theme.colors.supplierDark : theme.colors.primary}
            />
          </View>
        )}

        <View style={[styles.bubble, mine ? (isCustomer ? styles.myCustomerBubble : styles.mySupplierBubble) : styles.theirBubble]}>
          <Text style={[styles.senderLabel, mine ? styles.mySenderLabel : styles.theirSenderLabel]}>
            {item.sender === 'customer' ? 'Customer' : 'Supplier Support'}
          </Text>

          <Text style={[styles.messageText, mine ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>

          <View style={styles.bubbleFooter}>
            <Text style={[styles.timeText, mine ? styles.myTime : styles.theirTime]}>
              {formatTime(item.timestamp)}
            </Text>
            {mine && (
              <Ionicons
                name="checkmark-done"
                size={14}
                color={isCustomer ? '#C7D2FE' : '#FEF3C7'}
                style={{ marginLeft: 3 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Real-time Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerAvatar, { backgroundColor: isCustomer ? theme.colors.supplierLight : theme.colors.primaryLight }]}>
            <Ionicons
              name={isCustomer ? 'business' : 'person'}
              size={20}
              color={isCustomer ? theme.colors.supplierDark : theme.colors.primary}
            />
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>
              {isCustomer ? 'Apex Supplier Support' : 'Customer Inquiry Desk'}
            </Text>
            <View style={styles.connectionStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: isConnected ? theme.colors.success : theme.colors.warning }]} />
              <Text style={styles.statusText}>
                {isConnected ? 'Live Socket.io Connected' : 'Connecting to server...'}
              </Text>
            </View>
          </View>
        </View>

        {/* Clear & Role Switch Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => setRole(isCustomer ? 'supplier' : 'customer')}
            activeOpacity={0.7}
          >
            <Ionicons name="repeat" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={handleClearHistory}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Identity Banner */}
      <View style={[styles.roleBanner, isCustomer ? styles.roleBannerCustomer : styles.roleBannerSupplier]}>
        <Ionicons
          name={isCustomer ? 'person-circle-outline' : 'business-outline'}
          size={16}
          color={isCustomer ? theme.colors.primary : theme.colors.supplierDark}
        />
        <Text style={[styles.roleBannerText, { color: isCustomer ? theme.colors.primaryDark : theme.colors.supplierDark }]}>
          Sending messages as: <Text style={{ fontWeight: '800' }}>{isCustomer ? 'Customer' : 'Supplier'}</Text>
        </Text>
      </View>

      {/* Message List or Empty State */}
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="chatbubbles-outline" size={50} color={theme.colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Direct Support Channel</Text>
          <Text style={styles.emptySub}>
            Real-time WebSocket communication between customer and supplier. Send a message or tap a quick prompt below to start.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Quick Suggestion Pills */}
      <View style={styles.suggestionSection}>
        <FlatList
          horizontal
          data={suggestions}
          keyExtractor={(item, i) => i.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionPill}
              onPress={() => sendMessage(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="flash-outline" size={12} color={theme.colors.primary} />
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input Bar */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={`Type a message as ${isCustomer ? 'Customer' : 'Supplier'}...`}
          placeholderTextColor={theme.colors.textMuted}
          multiline
          maxLength={400}
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            isCustomer ? styles.sendBtnCustomer : styles.sendBtnSupplier,
            !text.trim() && styles.sendBtnDisabled,
          ]}
          onPress={() => sendMessage()}
          disabled={!text.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={17} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  connectionStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 6,
    borderBottomWidth: 1,
  },
  roleBannerCustomer: {
    backgroundColor: theme.colors.primaryLight,
    borderBottomColor: '#E0E7FF',
  },
  roleBannerSupplier: {
    backgroundColor: theme.colors.supplierLight,
    borderBottomColor: '#FEF3C7',
  },
  roleBannerText: {
    fontSize: 11.5,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    gap: 6,
  },
  myRow: {
    justifyContent: 'flex-end',
  },
  theirRow: {
    justifyContent: 'flex-start',
  },
  avatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    ...theme.shadows.sm,
  },
  myCustomerBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  mySupplierBubble: {
    backgroundColor: theme.colors.supplierDark,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  senderLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  mySenderLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  theirSenderLabel: {
    color: theme.colors.textMuted,
  },
  messageText: {
    fontSize: 14.5,
    lineHeight: 20,
  },
  myText: {
    color: '#ffffff',
  },
  theirText: {
    color: theme.colors.textPrimary,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 3,
  },
  timeText: {
    fontSize: 9.5,
  },
  myTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  theirTime: {
    color: theme.colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  suggestionSection: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingVertical: 6,
  },
  suggestionList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  suggestionText: {
    fontSize: 11.5,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    color: theme.colors.textPrimary,
    maxHeight: 90,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnCustomer: {
    backgroundColor: theme.colors.primary,
  },
  sendBtnSupplier: {
    backgroundColor: theme.colors.supplierDark,
  },
  sendBtnDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
});
