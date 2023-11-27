import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationProvider from './src/navigations';
import { Provider as StoreProvider } from 'react-redux';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StoreProvider store={store}>
        <SafeAreaProvider>
          <NavigationProvider />
          <Toast />
        </SafeAreaProvider>
      </StoreProvider>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
