import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function IndexScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate('Home' as never);
  }, [navigation]);

  return null;
}
