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
import { LogBox } from 'react-native';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  LogBox.ignoreLogs([
    `ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.`,
    `VirtualizedLists should never be nested inside plain ScrollViews with the same orientation`,
    `source.uri should not be an empty string`,
    `You seem to update the renderersProps prop(s) of the "RenderHTML" component in short periods of time, causing costly tree rerenders (last update was 26.00ms ago).`,
    `Mapbox [info] Request failed due to a permanent error: Canceled  {"level": "warning", "message": "Request failed due to a permanent error: Canceled ", "tag": "Mbgl-HttpRequest"}`
  ]);

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
