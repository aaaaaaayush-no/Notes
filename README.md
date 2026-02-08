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

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or later | [nodejs.org](https://nodejs.org/) |
| Android Studio | Ladybug (2024.2) or later | [developer.android.com/studio](https://developer.android.com/studio) |
| JDK | 17 (bundled with Android Studio) | Included with Android Studio |
| Git | Any recent version | [git-scm.com](https://git-scm.com/) |

### Step 1 — Install and Configure Android Studio

1. Download and install [Android Studio](https://developer.android.com/studio).
2. On the welcome screen, click **More Actions → SDK Manager** (or open **Settings → Languages & Frameworks → Android SDK** from an existing project).
3. Under the **SDK Platforms** tab, check **Android 15 (VanillaIceCream)** (API 35) and click **Apply**.
4. Switch to the **SDK Tools** tab and ensure the following are checked:
   - **Android SDK Build-Tools**
   - **Android SDK Command-line Tools**
   - **Android Emulator**
   - **Android SDK Platform-Tools**
5. Click **Apply / OK** to install the selected components.
6. Note the **Android SDK Location** shown at the top of the SDK Manager (e.g. `~/Android/Sdk` on Linux/macOS, `%LOCALAPPDATA%\Android\Sdk` on Windows) — you will need it in the next step.

### Step 2 — Set Environment Variables

Add the following to your shell profile (`~/.bashrc`, `~/.zshrc`, or equivalent):

```bash
export ANDROID_HOME=$HOME/Android/Sdk   # adjust if your SDK is elsewhere
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload your shell (`source ~/.bashrc`) or open a new terminal.

> **Windows:** Set `ANDROID_HOME` as a system environment variable and add `%ANDROID_HOME%\emulator` and `%ANDROID_HOME%\platform-tools` to your `Path`.

Verify the setup:

```bash
adb --version    # should print the ADB version
```

### Step 3 — Set Up an Android Emulator

1. In Android Studio, open **More Actions → Virtual Device Manager** (or **Tools → Device Manager** from a project).
2. Click **Create Virtual Device**.
3. Choose a device (e.g. **Pixel 7**) and click **Next**.
4. Select a system image — pick the latest available for **API 35** and click **Download** if needed, then **Next**.
5. Give the AVD a name and click **Finish**.
6. Start the emulator by clicking the ▶ button next to it.

> **Tip:** You can also use a physical Android device. Enable **Developer Options → USB Debugging** on the device, connect via USB, and run `adb devices` to confirm it is detected.

### Step 4 — Clone and Install Dependencies

```bash
git clone https://github.com/aaaaaaayush-no/Notes.git
cd Notes/ExpenseTracker
npm install
```

### Step 5 — Open the Project in Android Studio

This project includes a pre-generated native `android/` directory, so it can be opened directly.

1. Open Android Studio.
2. Select **File → Open** (or **Open** on the welcome screen).
3. Navigate to the `ExpenseTracker/android` folder inside the cloned repo and click **OK**.
4. Android Studio will start a **Gradle sync** — wait for it to finish (progress is shown in the bottom status bar). The first sync may take several minutes while dependencies are downloaded.
5. If prompted to update the Gradle plugin or wrapper, click **Don't remind me again** — the versions are managed by Expo and should not be changed.

### Step 6 — Run the App from Android Studio

You need **two things running**: the Metro bundler (serves the JavaScript bundle) and Android Studio (builds and installs the native shell).

1. **Start Metro** — Open a terminal and run:
   ```bash
   cd Notes/ExpenseTracker
   npm start
   ```
   Leave this terminal open. You should see the Metro dev menu.

2. **Select a device** — In the Android Studio toolbar, open the device dropdown and pick your emulator or connected device.

3. **Click Run ▶** — Android Studio will build the native project, install the APK, and launch the app. On first build this can take 5–10 minutes.

The app should open on your device/emulator and connect to the Metro bundler automatically.

### Alternative: Run from the Command Line (without Android Studio UI)

If you prefer not to use the Android Studio GUI to run the app:

```bash
cd Notes/ExpenseTracker
npm install
npx expo run:android
```

This will build the native project, start Metro, install the APK, and launch the app in one step.

### Firebase Setup (Optional — for multi-device sync)

Firebase enables real-time expense syncing across multiple devices. Without it, the app works in **local-only mode** with data persisted on-device via AsyncStorage.

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Realtime Database** and set rules to allow read/write.
3. Copy your Firebase config object.
4. In the app, open **Settings → Show Firebase Config** and paste the config JSON:

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

### Build a Standalone APK/AAB (Production)

Use [EAS Build](https://docs.expo.dev/build/introduction/) to create a production Android binary:

```bash
npm install -g eas-cli
eas login
eas build --platform android
```

This produces a signed `.aab` (Android App Bundle) for Google Play, or an `.apk` for direct installation.

### Regenerating the Native Project

If you modify `app.json` or add native dependencies, regenerate the Android project:

```bash
npx expo prebuild --platform android --clean
```

Then re-open the `android/` folder in Android Studio.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Gradle sync fails with "SDK not found"** | Make sure `ANDROID_HOME` is set correctly and the required SDK platforms/tools are installed via the SDK Manager. |
| **`adb: command not found`** | Add `$ANDROID_HOME/platform-tools` to your `PATH` (see Step 2). |
| **Metro bundler not reachable on emulator** | Run `adb reverse tcp:8081 tcp:8081` to forward the port, then reload the app. |
| **Build error: "Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'"** | Run `cd android && ./gradlew clean` then try building again. |
| **"Unable to load script" red screen** | Ensure Metro is running (`npm start`) before pressing Run in Android Studio. |
| **Emulator is slow** | Enable hardware acceleration — check **SDK Manager → SDK Tools → Intel HAXM** (Intel) or use the built-in HVF/KVM acceleration on Apple Silicon/Linux. |
| **Build succeeds but app crashes on launch** | Check `adb logcat` output for errors. Common cause: missing environment variables or mismatched SDK versions. |
| **"Deprecated Gradle features" warnings** | These warnings are cosmetic and can be ignored. Do not change the Gradle wrapper or plugin version — they are managed by Expo. |

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