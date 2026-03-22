/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, TouchableOpacity, View, Keyboard} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FieldValues, UseControllerReturn} from 'react-hook-form';
import FeedBackText from '../elements/feedback';
import {InputControl} from '../elements/controllers';
import {CheckBoxStyle} from '../../../style';
import Text from '../../utils/text';
import appColors from '../../../colors';

export const CheckBox = CheckBoxController((props: CheckboxInputProps) => {
  const [value, setValue] = useState(false);
  const disabled = props.disabled || props?.controller?.field?.disabled;
  useEffect(() => {
    setValue(props.default == 1 || props.default == true);
  }, [props.default]);

  function onCheck() {
    if (disabled) return;
    Keyboard.dismiss();
    setValue(old => {
      const val = !props.numberify ? !old : old ? 0 : 1;
      if (props.onChange) props.onChange(val);
      props.controller?.field?.onChange(val);
      return !old;
    });
  }
  const isError = props.controller?.fieldState?.invalid;
  const categoryStyle = (CheckBoxStyle as any)[props.category || 'primary'];
  const Icon = value
    ? props.activeIcon || categoryStyle?.activeIcon
    : props.inactiveIcon || categoryStyle?.inactiveIcon;
  const activeColor = props.checkColor || categoryStyle.activeColor;
  const disabledColor = props.disabledCheckColor || categoryStyle.disabledColor;
  const errorColor = props.errorColor || categoryStyle.errorColor;
  return (
    <View
      style={{
        ...categoryStyle?.style?.container,
        ...props.containerStyle,
        width: '100%',
      }}>
      <TouchableOpacity
        activeOpacity={props.fullyTouchable && !disabled ? 0 : 1}
        onPress={props.fullyTouchable ? onCheck : undefined}
        style={[styles.subContainer, props.subContainerStyle, value && props.activeStyle ? props.activeStyle : {}]}>
        {props.labelStart && (
          <Text
            numberOfLines={props.labelNumberOfLines}
            style={[
              categoryStyle?.style?.labelText,
              props.labelStyle,
              value && props.activeLabelStyle ? props.activeLabelStyle : {},
            ]}>
            {props.label}
          </Text>
        )}
        {!props.hideCheck && (
          <TouchableOpacity
            onBlur={props.controller?.field?.onBlur}
            onPress={onCheck}
            activeOpacity={!disabled ? 0 : 1}
            testID={props.testId || props.name}>
            <Icon
              fill={value ? (disabled ? disabledColor : activeColor) : appColors.screenBackground}
              stroke={disabled ? disabledColor : isError && errorColor ? errorColor : activeColor}
              width={categoryStyle.size}
              height={categoryStyle.size}
            />
          </TouchableOpacity>
        )}
        {!props.labelStart && (
          <Text
            numberOfLines={props.labelNumberOfLines}
            style={[
              categoryStyle?.style?.labelText,
              {flex: 1},
              props.labelStyle,
              value && props.activeLabelStyle ? props.activeLabelStyle : {},
            ]}>
            {props.label}
          </Text>
        )}
      </TouchableOpacity>
      {isError && !props.hideError && (
        <FeedBackText
          category="error"
          textStyle={{
            ...categoryStyle?.style?.errorText,
            ...props.errorTextStyle,
          }}>
          {props.controller?.fieldState?.error?.message}
        </FeedBackText>
      )}
    </View>
  );
});
function CheckBoxController(Input: any) {
  return function (props: CheckboxInputProps) {
    return InputControl(Input, props);
  };
}
export interface CheckboxInputProps {
  default?: boolean | 0 | 1;
  label?: string;
  labelStart?: boolean;
  fullyTouchable?: boolean;
  labelStyle?: any;
  errorTextStyle?: any;
  containerStyle?: any;
  subContainerStyle?: any;
  activeStyle?: any;
  activeLabelStyle?: any;
  disabledCheckColor?: string;
  checkColor?: string;
  errorColor?: string;
  testId?: string;
  activeIcon?: any;
  inactiveIcon?: any;
  hideCheck?: boolean;
  iconSize?: number;
  disabled?: boolean;
  numberify?: boolean;
  hideError?: boolean;
  category?: string;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  name?: string;
  required?: boolean | string;
  labelNumberOfLines?: number;
}

const styles = StyleSheet.create({
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
