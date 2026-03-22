/* eslint-disable react-native/no-inline-styles */
import {View, TextInput as RNTextInput, KeyboardTypeOptions, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import appColors from '../../../colors';
import {FieldValues, UseControllerReturn} from 'react-hook-form';
import {InputFeedBack} from '../elements/feedback';
import Label from '../elements/label';
import {InputControl} from '../elements/controllers';
import {DropdownStyle, InputStyle} from '../../../style';
import PasswordTester from '../elements/passwordTester';
import Dropdown from '../elements/dropdown';
import FloatingLabel from '../elements/floatingLabel';
import ClearBtn from '../elements/clearBtn';
import {getInputBoxStyle, getInputTextStyle, isFloatingLabel} from '../stylestatefn';
import {PasswordBtn} from '../elements/passwordBtn';
import TextCount from '../elements/texCount';
export const TextInput = TextInputController((props: TextInputProps) => {
  const [value, setValue] = useState<string>('');
  const [show, setShow] = useState(false);
  const [zIndex, setZindex] = useState(2);
  const inputRef: any = useRef(null);
  const [isFocused, setIsFocused]: any = useState(undefined);
  const elementRef: any = useRef(null);
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  const dropDownCategoryStyle = (DropdownStyle as any)[props.dropDownCategory || 'primary'];
  const floatingLabel = isFloatingLabel(props);
  const disabled = props.disabled || props?.controller?.field?.disabled;
  const boxStyle = getInputBoxStyle(isFocused, props, disabled);
  const textStyle = getInputTextStyle(value, props, disabled);
  const fieldState = props.controller?.fieldState;
  const isError = fieldState?.invalid;
  const errorMsg = (isError && fieldState?.error?.message) || props.error;
  useEffect(() => {
    setValue(props.default || '');
  }, [props.default]);

  function onFocus() {
    setIsFocused(true);
    if (props.onFocus) props.onFocus();
  }

  function onBlur() {
    setIsFocused(false);
    if (props.onBlur) props.onBlur();
    props.controller?.field?.onBlur();
  }

  function onChange(evt: string) {
    setValue(evt);
    if (props.onChange) props.onChange(evt);
    props.controller?.field?.onChange(evt);
  }
  return (
    <View
      style={{
        ...categoryStyle?.container,
        ...props.containerStyle,
        zIndex: zIndex,
      }}>
      {props.label && !floatingLabel && (
        <Label textStyle={[categoryStyle?.labelText, props.labelStyle]}>{props.label}</Label>
      )}
      <View ref={elementRef} style={boxStyle}>
        {props.renderStart && (
          <TouchableOpacity onPress={() => inputRef.current?.focus()} activeOpacity={1}>
            {props.renderStart()}
          </TouchableOpacity>
        )}
        <View style={{flex: 1, flexDirection: 'column', width: '100%'}}>
          {floatingLabel && props.label && (
            <FloatingLabel
              label={props.label}
              placeHolder={props.placeHolder}
              inputBoxStyle={boxStyle}
              categoryStyle={categoryStyle}
              show={isFocused}
              value={value}
              default={props.default}
            />
          )}
          <RNTextInput
            autoCorrect={props.autoCorrect}
            selectionColor={props.cursorColor || appColors.primary50}
            textAlign={props.textAlign}
            textAlignVertical={props.textAlignVertical}
            keyboardType={props.keyboardType}
            returnKeyType={props.returnKeyType}
            multiline={props.multiline}
            autoFocus={props.autoFocus}
            maxLength={props.maxLength}
            editable={!disabled}
            numberOfLines={props.numberOfLines || (!props.multiline ? 1 : undefined)}
            ref={inputRef}
            onBlur={onBlur}
            onFocus={onFocus}
            onChangeText={onChange}
            style={textStyle}
            value={props.format ? props.format(value) : value}
            placeholderTextColor={
              disabled
                ? categoryStyle?.inputDisabledText?.color
                : props.placeHolderColor || categoryStyle?.inputPlaceHolderText?.color
            }
            placeholder={floatingLabel ? '' : props.placeHolder}
            secureTextEntry={props.secureTextEntry && !show}
            onSubmitEditing={() => {
              if (props?.onSubmitEditing) props?.onSubmitEditing(value);
            }}
          />
        </View>
        {props.multiline && !props.hideTextIndicator && props.maxLength && (
          <TextCount maxLength={props.maxLength} value={value} />
        )}
        {props.allowClear && !props.multiline && !disabled && value && (
          <ClearBtn onClear={onChange.bind(onChange, '')} />
        )}
        {props.secureTextEntry && !props.noShowPasswordIcon && (
          <PasswordBtn show={show} onPress={() => setShow(old => !old)} />
        )}
        {props.renderEnd ? (
          <TouchableOpacity onPress={() => inputRef.current?.focus()} activeOpacity={1}>
            {props.renderEnd()}
          </TouchableOpacity>
        ) : null}
      </View>
      {props.withTester && value && <PasswordTester value={value} />}
      {(errorMsg || props.feedback) && <InputFeedBack isError={errorMsg} feedback={errorMsg || props.feedback} />}
      {isFocused && props?.dataList?.length > 0 && (
        <Dropdown
          {...props}
          onSelect={(item: any) => {
            setValue(item.label || item);
            if (props.onSelectItem) props.onSelectItem(item);
          }}
          hide={() => {
            inputRef.current.blur();
          }}
          onReady={(params: any) => {
            setZindex(params.zIndex);
          }}
          elementRef={elementRef}
          options={props.dataList}
          dropDownCategoryStyle={dropDownCategoryStyle}
          dropDownStyle={props.dropDownStyle}
        />
      )}
    </View>
  );
});

function TextInputController(Input: any) {
  return function (props: TextInputProps) {
    return InputControl(Input, props);
  };
}

export interface TextInputProps {
  default?: string;
  label?: string;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  placeHolder?: string;
  maxLength?: number;
  testId?: string;
  secureTextEntry?: boolean;
  textAlign?: 'left' | 'right' | 'center' | undefined;
  disabled?: boolean;
  dropDownStyle?: any;
  autoCorrect?: boolean;
  dataList?: any;
  dropDownCategory?: string;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  onFocus?: Function;
  onSubmitEditing?: any;
  zIndex?: number;
  placeHolderStyle?: any;
  floatingLabel?: boolean;
  onBlur?: Function;
  onIconPress?: Function;
  isError?: boolean;
  multiline?: boolean;
  errorTextStyle?: any;
  textAlignVertical?: any;
  returnKeyType?: any;
  labelStyle?: any;
  containerStyle?: any;
  category?: string;
  subContainerStyle?: any;
  allowClear?: boolean;
  inputTextStyle?: any;
  inputTextDisabledStyle?: any;
  errorStyle?: any;
  cursorColor?: any;
  autoFocus?: boolean;
  successStyle?: any;
  disabledStyle?: any;
  focusStyle?: any;
  placeHolderColor?: any;
  validate?: Function;
  format?: Function;
  feedback?: string;
  noShowPasswordIcon?: boolean;
  withTester?: boolean;
  hideTextIndicator?: boolean;
  name?: string;
  error?: string;
  renderStart?: () => React.JSX.Element | null;
  renderEnd?: () => React.JSX.Element | null;
  required?: boolean | string;
  onSelectItem?: Function;
}
