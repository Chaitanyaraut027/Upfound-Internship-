# DualCommerce — Dual-Role Commerce App with Analytics & Real-Time Support Chat

A polished, high-performance React Native (Expo) mobile application supporting two switchable user roles — **Customer** and **Supplier** — with static/mock product data, supplier analytics dashboards, bidirectional real-time support chat, and an installable Android APK.

---

## Features

### Auth & Role Switcher
- Single-tap role selector between Customer and Supplier accounts
- Persistent session across reloads via Zustand + AsyncStorage
- Header actions for logout and instant role switching

### Customer Interface
- **Product Catalog**: 2-column grid feed from static JSON with client-side debounced search and horizontal category filter chips
- **Product Detail**: Full specifications, stock status, animated Add to Cart with quantity selector
- **Shopping Cart**: Quantity controls, interactive swipe-to-delete gestures (powered by `react-native-gesture-handler` + `react-native-reanimated`), order summary, and checkout flow

### Supplier Interface
- **Analytics Dashboard**: Revenue trend area chart (line), category breakdown donut chart, and KPI stat cards — all from static figures using `react-native-gifted-charts`
- **Inventory Manager**: Live in-stock toggles, stock count updates via bottom sheet modal, search and filter tabs

### Real-Time Support Chat
- Dedicated Customer ↔ Supplier messaging thread powered by Socket.IO
- Auto-scrolling speech bubbles with native keyboard pinning (`KeyboardAvoidingView`)
- Connection status indicator, role-aware message styling, quick suggestion pills

### System UI & Polish
- Safe area edge-to-edge support for notches and Android gesture bars (`SafeAreaProvider`)
- Graceful empty states for empty cart, zero search results, and empty chat
- Consistent design system with theme tokens, shadows, and typography

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native with Expo SDK 57 |
| Language | TypeScript / ES6+ JavaScript |
| State Management | Zustand v5 with persist middleware |
| Local Storage | AsyncStorage |
| Real-Time Backend | Node.js + Socket.IO |
| Gestures & Animations | `react-native-gesture-handler` + `react-native-reanimated` |
| Data Visualization | `react-native-gifted-charts` (LineChart, PieChart) |
| Navigation | React Navigation (Bottom Tabs + Native Stack) |
| Mobile Polish | `react-native-safe-area-context`, `KeyboardAvoidingView`, `FlatList` virtualization |

---

## Project Structure

```
├── client/                     # React Native Expo app
│   ├── App.js                  # Root component with providers
│   ├── app.json                # Expo configuration
│   ├── src/
│   │   ├── data/               # Static JSON data (products, analytics)
│   │   ├── navigation/         # App navigator, Customer & Supplier tab configs
│   │   ├── screens/
│   │   │   ├── AuthScreen.js          # Role selection screen
│   │   │   ├── ChatScreen.js          # Real-time support chat (shared)
│   │   │   ├── ProfileScreen.js       # Account, role switcher, demo controls
│   │   │   ├── customer/
│   │   │   │   ├── CatalogScreen.js   # Product catalog grid
│   │   │   │   ├── ProductDetailScreen.js
│   │   │   │   └── CartScreen.js      # Cart with swipe gestures
│   │   │   └── supplier/
│   │   │       ├── DashboardScreen.js # Analytics charts & KPIs
│   │   │       └── InventoryScreen.js # Stock management
│   │   ├── store/              # Zustand global state
│   │   └── theme/              # Design system tokens
│   └── android/                # Native Android build files
│
└── server/                     # Socket.IO chat relay server
    └── index.js                # WebSocket server (port 3001)
```

---

## Setup & Run

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android device/emulator or Expo Go app

### 1. Chat Server
```bash
cd server
npm install
node index.js
# Server runs on port 3001
```

### 2. Mobile App
```bash
cd client
npm install
npx expo start
```
Scan the QR code with Expo Go, or press `a` to open in an Android emulator.

> **Note:** Update the Socket.IO URL in `src/screens/ChatScreen.js` (`SOCKET_URL`) to your local machine's IP address for real-time chat to work across devices.

### 3. Build APK
```bash
cd client
npx expo run:android
# Or use EAS Build:
# npx eas build --platform android --profile preview
```

---

## Demo Walkthrough

The app includes a built-in **Profile / Role Hub** screen with:
- **Live App State** dashboard showing cart items, product count, and chat messages
- **Assignment checklist** verifying all implemented features
- **Demo Reset** button to restore default data

### Key Interactions to Demo
1. **Role Switching**: Tap role cards on auth screen, or use the segmented control in Profile
2. **Cart Gestures**: Swipe left on cart items to reveal delete action (60fps native gestures)
3. **Chart Rendering**: Switch between 6M/12M revenue views, interact with donut chart legend
4. **Real-Time Chat**: Open two sessions (Customer + Supplier) to see live message relay

---

## Architecture Highlights

- **Centralized State**: Single Zustand store manages role, cart, inventory, and messages with persistence
- **Shared Chat Screen**: Same `ChatScreen` component serves both roles, with context-aware styling
- **Live Inventory Sync**: Supplier stock changes instantly reflect in Customer catalog (shared store)
- **Design System**: Centralized `theme.js` with color palette, shadows, and radius tokens

---

## License

This project was built as a technical assignment for a React Native / Expo Mobile Developer evaluation.
