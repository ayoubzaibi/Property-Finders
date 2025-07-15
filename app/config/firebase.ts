
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgC_mYF8df7TFT54iOzVfr_WJysmC_xwU",
  authDomain: "property-finder-a312c.firebaseapp.com",
  projectId: "property-finder-a312c",
  storageBucket: "property-finder-a312c.firebasestorage.app",
  messagingSenderId: "918725126994",
  appId: "1:918725126994:web:0a4d6776ab2dd14a4ea88b",
  measurementId: "G-6WLQY4YCZG"
};

const firebaseApp = initializeApp(firebaseConfig);

let auth: Auth;
 
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
 
} catch {
  
  auth = getAuth(firebaseApp);
}

export { auth };
export const db = getFirestore(firebaseApp);
export default firebaseApp;