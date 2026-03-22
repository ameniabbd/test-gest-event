/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home.screen';
import {Platform} from 'react-native';
import {Size} from '../utils/size';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../components/utils/header';
import HomeActiveIcon from '../../resources/assets/home-active.svg';
import HomeInactiveIcon from '../../resources/assets/home-inactive.svg';
import appColors from '../colors';
const Tab = createBottomTabNavigator();
export default function BottomNavigation() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: appColors.primary150,
        tabBarInactiveTintColor: appColors.textDark,
        tabBarLabelStyle: {},
        tabBarShowLabel: true,
        headerShown: false,
        //tabBarBadge: '1000',
        tabBarStyle: {
          height: Size(Platform.OS == 'android' || insets.bottom == 0 ? 60 : 52) + insets.bottom,
        },
        tabBarLabelPosition: 'below-icon',
        header: props => <Header {...props} />,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'home',
          tabBarIcon(props) {
            return <TabIcon activeIcon={HomeActiveIcon} inactiveIcon={HomeInactiveIcon} {...props} />;
          },
        }}
      />
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'orders',
          tabBarIcon(props) {
            return <TabIcon activeIcon={HomeActiveIcon} inactiveIcon={HomeInactiveIcon} {...props} />;
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={HomeScreen}
        options={{
          tabBarLabel: 'profile',
          tabBarIcon(props) {
            return <TabIcon activeIcon={HomeActiveIcon} inactiveIcon={HomeInactiveIcon} {...props} />;
          },
        }}
      />
      <Tab.Screen
        name="settings"
        component={HomeScreen}
        options={{
          tabBarLabel: 'settings',
          tabBarIcon(props) {
            return <TabIcon activeIcon={HomeActiveIcon} inactiveIcon={HomeInactiveIcon} {...props} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
function TabIcon(props: any) {
  const Icon = props.focused ? props.activeIcon : props.inactiveIcon;
  return <Icon width={props.width || Size(28)} height={props.height || Size(28)} />;
}
BottomNavigation.route = 'bottom';
