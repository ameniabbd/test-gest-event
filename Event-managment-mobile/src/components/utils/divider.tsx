import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Size} from '../../utils/size';
import appColors from '../../colors';
const screenWidth = Dimensions.get('window').width;

type DividerProps = {
  color?: string;
  thickness?: number;
  style?: object;
};

const Divider = ({color =appColors.primary10, thickness = 1, style}: DividerProps) => {
  return (
    <View
      style={[styles.divider, {borderBottomColor: color, borderBottomWidth: thickness, width: screenWidth}, style]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 0,
    alignSelf: 'center',
    marginVertical: Size(12),
  },
});

export default Divider;
