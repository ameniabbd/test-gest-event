import React from 'react';

import Text from '../../utils/text';
import {StyleSheet, View} from 'react-native';
import {Size} from '../../../utils/size';

export default function TextCount(props: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle} category="legend">
        {(props.value?.length || 0) + '/' + props.maxLength}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flexDirection: 'row', marginBottom: Size(5), alignSelf: 'flex-end'},
  textStyle: {fontSize: Size(12)},
});
