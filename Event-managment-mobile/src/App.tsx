import React, {useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './navigation/app.navigation';
import AppContextProvider from './contexts/app.context';
import {WithSplashScreen} from './screens/splash.screen';
import {Text, ScrollView, FlatList, StyleSheet, TextInput} from 'react-native';
import Toast from './components/utils/toast';
import {ActionSheet} from './components/utils/actionsheet';
import {Modal} from './components/utils/modal';
import ErrorBoundries from './components/utils/errorBoundary';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HttpHandler from './components/utils/httpHandler';
import {linking} from './navigation/linking';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function App() {
  const [ready, setready] = useState(false);
  function onReady() {
    setready(true);
  }
  return (
    <GestureHandlerRootView style={styles.app}>
      <SafeAreaProvider>
        <WithSplashScreen isAppReady={ready}>
          <AppContextProvider>
            <ErrorBoundries>
              <HttpHandler>
                <Modal />
                <Toast />
                <ActionSheet />
                <NavigationContainer linking={linking} onReady={onReady}>
                  <AppNavigation />
                </NavigationContainer>
              </HttpHandler>
            </ErrorBoundries>
          </AppContextProvider>
        </WithSplashScreen>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  app: {flex: 1},
});
(Text as any).defaultProps = (Text as any).defaultProps || {};
(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(ScrollView as any).defaultProps = (ScrollView as any).defaultProps || {};
(FlatList as any).defaultProps = (FlatList as any).defaultProps || {};
(KeyboardAwareScrollView as any).defaultProps = (KeyboardAwareScrollView as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;
(FlatList as any).defaultProps.showsHorizontalScrollIndicator = false;
(FlatList as any).defaultProps.showsVerticalScrollIndicator = false;
(ScrollView as any).defaultProps.showsHorizontalScrollIndicator = false;
(ScrollView as any).defaultProps.showsVerticalScrollIndicator = false;
(KeyboardAwareScrollView as any).defaultProps.showsHorizontalScrollIndicator = false;
(KeyboardAwareScrollView as any).defaultProps.showsVerticalScrollIndicator = false;
(KeyboardAwareScrollView as any).defaultProps.keyboardShouldPersistTaps = 'handled';
(FlatList as any).defaultProps.keyboardShouldPersistTaps = 'handled';
(ScrollView as any).defaultProps.keyboardShouldPersistTaps = 'handled';
(TextInput as any).defaultProps.autoCapitalize = 'none';
(TextInput as any).defaultProps.underlineColorAndroid = 'transparent';
(TextInput as any).defaultProps.allowFontScaling = false;
(TextInput as any).defaultProps.autoCorrect = false;
