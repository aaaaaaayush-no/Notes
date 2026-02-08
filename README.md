# Expense Tracker

A minimal Android expense tracker app built with React Native (Expo) and Firebase for real-time multi-device synchronization. Split expenses easily with roommates or family.

## Features

### Core Functionality
- **Expense Entry Form** — Add expenses with description, amount, date, person who paid, and category
- **Expense List** — View all expenses in a clean, chronological list with edit/delete support
- **Monthly Totals** — Per-person spending breakdowns with visual progress bars
- **Settlement Calculator** — Automatically calculates who owes whom

### Multi-Device Sync
- **Firebase Realtime Database** — Real-time sync across all connected devices
- **Group Codes** — Create or join expense groups with a simple 6-character code
- **Offline Support** — Add expenses offline; they sync when connection returns
- **Local-Only Mode** — Works entirely without Firebase for single-device use

### UI/UX
- Clean, Material Design-inspired interface optimized for mobile
- Monthly view with month navigation
- Color-coded expense entries by person
- Category tags (Food, Rent, Utilities, Entertainment, Transport, Groceries, Health, Other)
- Person filter to view expenses by individual member
- Floating Action Button for quick expense entry

### Data Management
- Export monthly reports as shareable text/CSV
- Edit and delete expenses with confirmation dialogs
- Local caching with AsyncStorage
- Member management (add/remove group members)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android device or emulator with [Expo Go](https://expo.dev/client)

### Installation

```bash
cd ExpenseTracker
npm install
npx expo start
```

Scan the QR code with Expo Go on your Android device to run the app.

### Firebase Setup (Optional — for multi-device sync)

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** and set rules to allow read/write
3. Copy your Firebase config object
4. Paste the config JSON in the app's setup screen under "Show Firebase Config"

Example Firebase config:
```json
{
  "apiKey": "AIza...",
  "authDomain": "your-project.firebaseapp.com",
  "databaseURL": "https://your-project-default-rtdb.firebaseio.com",
  "projectId": "your-project",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc123"
}
```

Without Firebase, the app works in **local-only mode** with data persisted on device via AsyncStorage.

## Building for Android

This project is built with **React Native (Expo)**, not Android Studio. However, it fully supports Android and can be built into a standalone APK or AAB for distribution.

### Run on Android Device/Emulator (Development)

```bash
cd ExpenseTracker
npm install
npx expo start --android
```

Or scan the QR code with [Expo Go](https://expo.dev/client) on your Android device.

### Build a Standalone APK/AAB (Production)

Use [EAS Build](https://docs.expo.dev/build/introduction/) to create a production Android binary:

```bash
npm install -g eas-cli
eas login
eas build --platform android
```

This produces a signed `.aab` (Android App Bundle) for Google Play, or an `.apk` for direct installation.

### Open in Android Studio

If you need to work with native Android code or open the project in Android Studio, generate the native `android/` directory:

```bash
npx expo prebuild --platform android
```

Then open the generated `android/` folder in Android Studio. This gives you a standard Gradle-based Android project while keeping all the React Native/Expo functionality.

## Tech Stack

- **React Native** (Expo) — Cross-platform mobile framework
- **Firebase Realtime Database** — Backend and real-time sync
- **AsyncStorage** — Local data caching and offline support
- **React Navigation** — Bottom tab navigation
- **React Context API** — State management

## Project Structure

```
ExpenseTracker/
├── App.js                          # Root app with navigation setup
├── src/
│   ├── components/
│   │   ├── ExpenseForm.js          # Add/edit expense form with validation
│   │   ├── ExpenseItem.js          # Individual expense list item
│   │   ├── MonthSelector.js        # Month navigation control
│   │   ├── PersonFilter.js         # Filter by person
│   │   └── SummaryCard.js          # Monthly summary with settlements
│   ├── contexts/
│   │   ├── AppContext.js           # Global app state (user, group, members)
│   │   └── ExpenseContext.js       # Expense CRUD operations and sync
│   ├── screens/
│   │   ├── ExpensesScreen.js       # Main expense list view
│   │   ├── SetupScreen.js          # Onboarding (create/join group)
│   │   ├── SettingsScreen.js       # Profile, members, export
│   │   └── SummaryScreen.js        # Monthly totals and settlements
│   ├── services/
│   │   ├── firebase.js             # Firebase CRUD and subscriptions
│   │   └── localStorage.js         # AsyncStorage wrapper
│   └── utils/
│       └── helpers.js              # Formatting, categories, calculations
├── app.json                        # Expo configuration
└── package.json
```