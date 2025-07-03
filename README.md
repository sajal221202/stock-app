# Stock Broking App - React Native + Expo

A modern, feature-rich stock and ETF broking platform built with React Native and Expo. This app provides real-time stock data, interactive charts, and personalized watchlists with a beautiful, responsive UI supporting both light and dark themes.

## Features

### Core Functionality
- **📈 Stock Explorer**: Browse top gainers and losers with real-time data
- **📊 Interactive Charts**: View 30-day price charts with smooth animations
- **📌 Watchlists**: Create and manage multiple custom watchlists
- **🔍 Search & Filter**: Advanced search and sorting capabilities
- **🌙 Theme Support**: Seamless light and dark mode switching
- **📱 Responsive Design**: Optimized for all screen sizes

### Screens
1. **Explore Screen**: Top gainers/losers with grid layout
2. **Product Screen**: Detailed stock information with charts and company data
3. **Watchlist Screen**: Manage all your watchlists
4. **Watchlist Detail**: View stocks in specific watchlists
5. **View All Screen**: Paginated list with search and sort functionality

### Technical Features
- **Alpha Vantage API Integration**: Real-time stock data
- **Smart Caching**: 5-minute cache with automatic expiration
- **Offline Support**: Graceful fallback to mock data
- **Error Handling**: Comprehensive error states with retry functionality
- **Performance Optimized**: Lazy loading, FlatList optimization
- **AsyncStorage**: Persistent data storage for watchlists and preferences

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Alpha Vantage API Key (free from https://www.alphavantage.co/support/#api-key)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API Key**
   
   Open `src/constants/index.js` and replace the API key:
   ```javascript
   export const API_CONFIG = {
     BASE_URL: 'https://www.alphavantage.co/query',
     API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace this
     // ... rest of config
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on device/simulator**
   - **iOS**: Press `i` in terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in terminal

## API Configuration

### Alpha Vantage API
The app uses Alpha Vantage API for stock data with the following endpoints:
- `TOP_GAINERS_LOSERS`: Market movers data
- `OVERVIEW`: Company fundamental data
- `TIME_SERIES_DAILY`: Historical price data
- `SYMBOL_SEARCH`: Stock symbol search

### Mock Data Fallback
If API key is 'demo' or API requests fail, the app automatically falls back to realistic mock data to ensure functionality during development and testing.

## Project Structure

```
stock-app/
├── src/
│   ├── api/
│   │   └── stockApi.js          # API service layer
│   ├── components/
│   │   ├── StockCard.js         # Reusable stock card component
│   │   ├── LoadingSpinner.js    # Loading state component
│   │   ├── ErrorState.js        # Error handling component
│   │   └── EmptyState.js        # Empty state component
│   ├── constants/
│   │   └── index.js             # App constants and themes
│   ├── context/
│   │   ├── ThemeContext.js      # Theme management
│   │   └── WatchlistContext.js  # Watchlist state management
│   ├── navigation/
│   │   └── AppNavigator.js      # Navigation configuration
│   ├── screens/
│   │   ├── ExploreScreen.js     # Main stocks screen
│   │   ├── ProductScreen.js     # Stock detail screen
│   │   ├── WatchlistScreen.js   # Watchlists overview
│   │   ├── WatchlistDetailScreen.js # Individual watchlist
│   │   └── ViewAllScreen.js     # Paginated stock list
│   └── utils/
│       └── cache.js             # Caching and utility functions
├── App.js                       # App entry point
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Key Dependencies

```json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-navigation/stack": "^6.3.20",
  "@react-native-async-storage/async-storage": "1.21.0",
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "14.1.0",
  "@expo/vector-icons": "^14.0.0"
}
```

## Building for Production

### Build APK (Android)
```bash
expo build:android
```

### Build IPA (iOS)
```bash
expo build:ios
```

### Web Build
```bash
expo build:web
```

## Features Demo

### 🚀 Quick Start Demo
The app works immediately with mock data, so you can test all features without API setup:

1. **Browse Stocks**: View top gainers and losers on the home screen
2. **Stock Details**: Tap any stock to see detailed information and charts
3. **Add to Watchlist**: Use the bookmark button to add stocks to watchlists
4. **Create Watchlists**: Create custom watchlists from the watchlist tab
5. **Theme Toggle**: Switch between light and dark themes using the theme button

### 📱 UI/UX Highlights
- **Modern Design**: Clean, iOS-inspired interface
- **Smooth Animations**: Micro-interactions and smooth transitions
- **Responsive Layout**: Adapts to different screen orientations
- **Accessibility**: Proper contrast ratios and accessible components
- **Performance**: Optimized FlatLists with lazy loading

## Customization

### Themes
Edit `src/constants/index.js` to customize colors:
```javascript
export const lightTheme = {
  colors: {
    primary: '#007AFF',    // Your brand color
    secondary: '#5856D6',  // Secondary color
    // ... other colors
  }
};
```

### API Configuration
Modify `src/api/stockApi.js` to add new endpoints or change data sources.

### Add New Features
The modular architecture makes it easy to add new screens, components, or functionality.

## Performance Optimizations

- **FlatList Optimization**: `removeClippedSubviews`, `maxToRenderPerBatch`
- **Image Lazy Loading**: Deferred loading of chart components
- **Caching Strategy**: 5-minute cache with automatic invalidation
- **Memory Management**: Proper cleanup in useEffect hooks
- **Bundle Optimization**: Tree-shaking enabled for smaller bundle size

## Troubleshooting

### Common Issues

1. **API Rate Limiting**
   - Use your own Alpha Vantage API key
   - App falls back to mock data automatically

2. **Metro Bundle Issues**
   ```bash
   npx expo start --clear
   ```

3. **iOS Simulator Issues**
   ```bash
   npx expo install --fix
   ```

4. **Android Build Issues**
   - Ensure you have the latest Expo CLI
   - Check Android SDK setup

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Screenshots

*Add your app screenshots here*

## Support

For issues and feature requests, please create an issue on GitHub.

---

Built with ❤️ using React Native, Expo, and Alpha Vantage API 