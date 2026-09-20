# Meta Lead Ads + React Native Real-Time PoC

A working Proof of Concept that demonstrates real-time lead sync from Meta Lead Ads to a React Native app using webhooks and Socket.IO.

## How It Works

```
Meta Lead Testing Tool
        ↓  (creates lead)
Meta Graph API (stores lead)
        ↓  (webhook notification OR polling)
Node.js Backend (Express + Socket.IO)
        ↓  (Socket.IO emit)
React Native App (live update, no refresh needed)
```

## Architecture

- **Backend**: Node.js + Express + Socket.IO on port 5000
- **Tunnel**: ngrok exposes localhost to Meta's webhook system
- **Frontend**: React Native (Expo) with Socket.IO client
- **Lead Detection**: Dual approach — webhook listener + polling fallback every 4 seconds

## Setup & Run

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 2. Expose with ngrok
```bash
./ngrok.exe http 5000
```
Copy the HTTPS URL → configure as Meta Webhook Callback URL.

### 3. Meta Configuration
- Create a Meta Developer App
- Add Webhooks product → subscribe to `Page → leadgen` field
- Subscribe your page: `POST /{page-id}/subscribed_apps?subscribed_fields=leadgen`
- Use the Lead Ads Testing Tool to create test leads

### 4. Mobile App
```bash
cd client
npm install
npx expo start --tunnel
```
Scan QR code in Expo Go.

## Environment Variables

See `server/.env.example` for required variables.

## Tech Stack

- React Native (Expo SDK 57)
- Node.js + Express
- Socket.IO
- Meta Graph API v20.0
- ngrok
