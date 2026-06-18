/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AuthProvider, useAuthLoading, useIsAuthenticated} from './src/auth/AuthContext';
import {locale} from './src/constants';
import {HomeScreen} from './src/screens/HomeScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {colors, spacing} from './src/theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const isLoading = useAuthLoading();
  const isAuthenticated = useIsAuthenticated();

  if (isLoading) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.bootText}>{locale.login.boot.restoringSession}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAuthenticated ? <HomeScreen /> : <LoginScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  bootText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});

export default App;
