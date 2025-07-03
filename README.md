# 🚀 Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

For iOS development:
- macOS computer
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835) (for iOS development)
- iOS Simulator

For Android development:
- [Android Studio](https://developer.android.com/studio) and Android SDK
- Android Emulator or physical device

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/stock-app.git
   cd stock-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   - Sign up for a free API key at [Alpha Vantage](https://www.alphavantage.co/)
   - Create a `.env` file in the root directory
   - Add your API key:
     ```
     ALPHA_VANTAGE_API_KEY=your_api_key_here
     ```

4. **Start the Development Server**
   ```bash
   npm start
   # or
   npx expo start
   ```

## Running the App

After starting the development server, you have several options to run the app:

### 📱 On Your Physical Device
1. Install the Expo Go app from:
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
2. Scan the QR code shown in your terminal with:
   - Camera app (iOS)
   - Expo Go app (Android)

### 💻 On Simulators/Emulators
- Press `i` in the terminal to open in iOS Simulator
- Press `a` to open in Android Emulator

### 🌐 On Web Browser
- Press `w` to open in web browser


## Additional Notes

- The app uses Expo SDK 53
- Minimum required iOS version: 13.0
- Minimum required Android version: 6.0

## 🛠️ **Tech Stack**

- **Frontend**: React Native, Expo SDK 53
- **Navigation**: React Navigation 6 (Stack + Tabs)
- **State Management**: React Context + Hooks
- **Charts**: React Native Chart Kit
- **Storage**: AsyncStorage for offline persistence
- **API**: Alpha Vantage for real-time financial data
- **UI/UX**: Custom theme system with iOS-inspired design


Happy coding! 🎉
