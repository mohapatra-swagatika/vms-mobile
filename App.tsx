import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AuthProvider, useAuth} from './src/auth/AuthContext';
import {HomeScreen} from './src/screens/HomeScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {colors} from './src/theme';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const {state} = useAuth();

  return (
    <View style={styles.container}>
      {state.isAuthenticated ? <HomeScreen /> : <LoginScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
