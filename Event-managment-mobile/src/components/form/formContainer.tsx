import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import ScreenContainer from '../utils/screenContainer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {keyboardOffset} from '../../utils/size';
const FormContainer = (props: any) => {
  const [flexToggle, setFlexToggle] = useState(false);
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setFlexToggle(false);
    });
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setFlexToggle(true);
    });
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);
  return (
    <ScreenContainer>
      <SafeAreaView edges={props.edges || ['bottom']} style={props.style}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={props.keyboardVerticalOffset || keyboardOffset(110)}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.keyboard, flexToggle && styles.grow]}>
          {props.children}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenContainer>
  );
};

export default FormContainer;

const styles = StyleSheet.create({
  scroll: {flexGrow: 1},
  keyboard: {flex: 1},
  grow: {flexGrow: 1},
});
