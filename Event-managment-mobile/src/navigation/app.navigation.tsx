import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/signin.screen';
import { useAppContext } from '../contexts/app.context';
import BottomNavigation from './bottom.navigation';
import Header from '../components/utils/header';
import appColors from '../colors';
import SignupScreen from '../screens/signup.screen';
import HomeScreen from '../screens/home.screen';
import EventListScreen from '../screens/Events/EventListScreen';
import EventDetailScreen from '../screens/Events/EventDetailScreen';

const Stack = createNativeStackNavigator();
export default function AppNavigation() {
  const { appInfos } = useAppContext();
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          header: Header,
          statusBarBackgroundColor: appColors.screenBackground,
          navigationBarColor: appColors.screenBackground,
          statusBarStyle: 'dark',
          animation: 'slide_from_right',
        }}>
        {appInfos.token ? (
          <>
            <Stack.Screen options={{ headerShown: false }} name="eventList" component={EventListScreen} />
            <Stack.Screen options={{ headerShown: false }} name="EventDetail" component={EventDetailScreen} />


            <Stack.Screen options={{ headerShown: false }} name="homenavs" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="signin" component={SignInScreen} options={{ headerShown: false }} />

          </>
        )}
      </Stack.Navigator>
    </>
  );
}
