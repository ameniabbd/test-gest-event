/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Size} from '../../utils/size';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Text from './text';
import LeftArrow from '../../../resources/assets/arrow-left.svg';
import appColors from '../../colors';
import ProgressBar from 'react-native-progress-bar-horizontal';
import MenuIcon from '../../../resources/assets/menu.svg';

const Header = (props: any) => {
  const insets = useSafeAreaInsets();
  const headerHeigh = props?.options?.headerStyle?.height || Size(45);
  let height = insets.top == 0 ? headerHeigh + Size(10) : insets.top + headerHeigh;
  if (!isNaN(props?.options?.progress)) height += 8;
  function getProgress(progress: number, div: number) {
    div += 1;
    return progress >= div ? 1 : Math.abs(progress - div) < 1 ? Math.abs(progress - div) : 0;
  }
  return (
    <View
      style={{
        ...styles.containerStyle,
        backgroundColor: props?.options?.headerStyle?.backgroundColor || appColors.screenBackground,
        minHeight: height,
      }}>
      <View
        style={{
          ...styles.subContainerStyle,
          ...props?.options?.headerStyle,

          paddingTop: insets.top == 0 && Platform.OS == 'android' ? Size(10) : 0,
          marginTop: insets.top + (props?.options?.headerStyle?.paddingTop || 0) - Size(10),
        }}>
        {props.navigation.canGoBack() && props.options.headerBackVisible != false && (
          <TouchableOpacity
            onPress={props.options.onBack || props.navigation.goBack}
            style={{
              marginEnd: props.navigation.openDrawer && props?.option?.drawerIconVisible != false ? Size(10) : 0,
              ...props.options?.headerBackStyle,
            }}>
            {props.options?.headerBack ? props.options.headerBack() : <LeftArrow width={Size(26)} height={Size(26)} />}
          </TouchableOpacity>
        )}
        {props.navigation.openDrawer && props?.option?.drawerIconVisible != false && (
          <TouchableOpacity style={{...props.options?.headerBackStyle}} onPress={props.navigation.openDrawer}>
            <MenuIcon width={Size(18)} height={Size(18)} />
          </TouchableOpacity>
        )}
        {props.options.headerLeft && props.options.headerLeft()}
        <View
          style={{
            ...styles.textContainer,
            alignItems: props.options?.headerTitleAlign == 'left' ? 'flex-start' : 'center',
          }}>
          <Text
            style={{
              marginStart: props.options?.headerTitleAlign == 'left' ? Size(10) : 0,
              ...props?.options?.headerTitleStyle,
              color: appColors.text100,
            }}
            category="current">
            {props.options.title || props.route.name}
          </Text>
        </View>
        {props.options.headerRight && props.options.headerRight()}
      </View>
      {!isNaN(props?.options?.progress) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            ...props.options?.progressProps?.containerStyle,
          }}>
          {[...Array(props.options?.progressProps?.divisions || 1).keys()].map(elt => {
            return (
              <View key={elt} style={{flex: 1, ...props.options?.progressProps?.itemStyle}}>
                <ProgressBar
                  progress={getProgress(props?.options?.progress, elt)}
                  fillColor={props.options?.progressProps?.filledColor || appColors.successPrimary}
                  unfilledColor={props.options?.progressProps?.unfilledColor || appColors.error}
                  borderRadius={props.options?.progressProps?.borderRadius || 50}
                  height={props.options?.progressProps?.height || 8}
                  borderColor={props.options?.progressProps?.borderColor || appColors.screenBackground}
                  duration={700}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  containerStyle: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
  },
  subContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: appColors.screenBackground,
    alignItems: 'center',
    paddingHorizontal: Size(18),
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    zIndex: 0,
    justifyContent: Platform.OS == 'android' ? 'center' : 'flex-start',
  },
});
