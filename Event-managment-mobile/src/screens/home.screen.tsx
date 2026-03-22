import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ScreenContainer from '../components/utils/screenContainer';
import Text from '../components/utils/text';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container}>
        <Text>HomeScreen</Text>
      </SafeAreaView>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: {},
});
