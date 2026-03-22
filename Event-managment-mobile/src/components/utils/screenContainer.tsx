import React from 'react';
import Loading from './loading';
import {StyleSheet, View} from 'react-native';
import AppUpdate from './appUpdate';
import appColors from '../../colors';

export default function ScreenContainer(props: any) {
  return (
    <AppUpdate>
      <View style={styles.container}>
        <Loading />
        {props.children}
      </View>
    </AppUpdate>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: appColors.screenBackground},
});
