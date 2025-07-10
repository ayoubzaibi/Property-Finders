import { SplashScreen } from 'expo-router';
import { useSession } from './context';


const  SplashScreenController = () => {
  const { loading } = useSession();

  if (!loading) {
    SplashScreen.hideAsync();
  }

  return null;
}

export default SplashScreenController

