import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });
    NetInfo.fetch().then((state) => setIsOnline(!!state.isConnected));
    return () => unsubscribe();
  }, []);

  return isOnline;
}
