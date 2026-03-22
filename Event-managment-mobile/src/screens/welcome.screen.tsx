import {StyleSheet} from 'react-native';
import React from 'react';
import ScreenContainer from '../components/utils/screenContainer';
import Text from '../components/utils/text';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container}>
        <Text>WelcomeScreen</Text>
      </SafeAreaView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
});
