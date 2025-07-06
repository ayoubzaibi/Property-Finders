import { useNavigation } from '@react-navigation/native';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../services/authContext';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#667eea', dark: '#764ba2' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#fff"
          name="house.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Property Explorer</ThemedText>
      </ThemedView>
      
      {user && (
        <ThemedText style={styles.welcomeText}>
          Welcome back, {user.displayName || user.email}!
        </ThemedText>
      )}

      <ThemedText>Discover amazing properties and find your perfect home.</ThemedText>
      
      <Collapsible title="Property Search">
        <ThemedText>
          Use the <ThemedText type="defaultSemiBold">Search</ThemedText> tab to find properties with advanced filters including location, price range, property type, and amenities.
        </ThemedText>
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => navigation.navigate('Search' as never)}
        >
          <Text style={styles.buttonText}>Go to Search</Text>
        </TouchableOpacity>
      </Collapsible>

      <Collapsible title="Favorites">
        <ThemedText>
          Save your favorite properties in the <ThemedText type="defaultSemiBold">Favorites</ThemedText> tab to easily access them later.
        </ThemedText>
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => navigation.navigate('Favorites' as never)}
        >
          <Text style={styles.buttonText}>View Favorites</Text>
        </TouchableOpacity>
      </Collapsible>

      <Collapsible title="Property Details">
        <ThemedText>
          Tap on any property to view detailed information including photos, amenities, and rent estimates.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Real-time Data">
        <ThemedText>
          Our app uses the RentCast API to provide real-time property data and accurate rent estimates for your area.
        </ThemedText>
        <ExternalLink href="https://www.rentcast.io/">
          <ThemedText type="link">Learn more about RentCast</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Firebase Authentication">
        <ThemedText>
          Secure authentication powered by Firebase. Your data is safely stored and synced across devices.
        </ThemedText>
        <ExternalLink href="https://firebase.google.com/docs/auth">
          <ThemedText type="link">Learn more about Firebase Auth</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Cross-Platform Support">
        <ThemedText>
          This app works seamlessly on Android, iOS, and web platforms. Built with React Native and Expo for maximum compatibility.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              You're currently using the iOS version with native performance optimizations.
            </ThemedText>
          ),
          android: (
            <ThemedText>
              You're currently using the Android version with native performance optimizations.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#fff',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#667eea',
    fontWeight: '600',
  },
  navigationButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
