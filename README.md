# Property Finder App 🏠

A modern React Native mobile application for property hunting, built with Expo and Firebase. Users can browse properties, save favorites, and search with advanced filters.

## ✨ Features

### 🔐 Authentication
- Email/password registration and login
- Firebase Authentication integration
- Secure user session management

### 🏠 Property Discovery
- Browse properties in card/list view
- Advanced search with multiple filters
- Property type filtering (House, Apartment, Condo, etc.)
- Price range filtering
- Bedroom/bathroom filtering
- Amenities filtering (Pool, Gym, Garden, etc.)

### ❤️ Favorites Management
- Save favorite properties
- View saved properties
- Remove from favorites
- Sync across devices with Firestore

### 📱 User Experience
- Modern, intuitive UI design
- Pull-to-refresh functionality
- Loading states and error handling
- Responsive design for all screen sizes
- Offline support with AsyncStorage

### 🔧 Technical Features
- Redux Toolkit for state management
- TypeScript for type safety
- Firebase Firestore for data persistence
- RentCast API integration (configurable)
- AsyncStorage for local caching

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Property-Finders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update `app/config/firebase.ts` with your Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **RentCast API Setup (Optional)**
   - Get a free API key from [RapidAPI RentCast](https://rapidapi.com/rentcast/api/rentcast)
   - Update `services/rentcastApi.ts` with your API key:
   ```typescript
   const RENTCAST_API_KEY = 'your-rentcast-api-key';
   ```

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
Property-Finders/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   │   ├── Login.tsx      # Login screen
│   │   ├── Register.tsx   # Registration screen
│   │   └── Welcome.tsx    # Welcome screen
│   ├── (tabs)/            # Main app screens
│   │   ├── Home.tsx       # Property browse
│   │   ├── Search.tsx     # Advanced search
│   │   ├── Favorites.tsx  # Saved properties
│   │   ├── Profile.tsx    # User profile
│   │   └── Details.tsx    # Property details
│   └── config/
│       └── firebase.ts    # Firebase configuration
├── store/                 # Redux store
│   ├── index.ts          # Store configuration
│   ├── hooks.ts          # Typed Redux hooks
│   └── slices/           # Redux slices
│       ├── propertiesSlice.ts
│       ├── favoritesSlice.ts
│       └── userSlice.ts
├── services/             # API services
│   ├── propertyService.tsx
│   └── rentcastApi.ts
└── components/           # Reusable components
```

## 🔧 Configuration

### Firebase Security Rules
Set up Firestore security rules for the `favorites` and `users` collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own favorites
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Environment Variables
Create a `.env` file for sensitive configuration:
```env
FIREBASE_API_KEY=your-firebase-api-key
RENTCAST_API_KEY=your-rentcast-api-key
```

## 🎨 Customization

### Styling
The app uses a consistent color scheme defined in `constants/Colors.ts`. You can customize:
- Primary color: `#ff8c00` (Orange)
- Background colors
- Text colors
- Border colors

### Adding New Features
1. **New Property Fields**: Update the `Property` interface in `store/slices/propertiesSlice.ts`
2. **New Filters**: Add to the `SearchFilters` interface and update the search logic
3. **New Screens**: Create new files in the appropriate directory and update navigation

## 📱 Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

### Web
```bash
npx expo build:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Firebase](https://firebase.google.com/) for backend services
- [RentCast API](https://rapidapi.com/rentcast/api/rentcast) for property data
- [React Navigation](https://reactnavigation.org/) for navigation
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Property Hunting! 🏠✨**
