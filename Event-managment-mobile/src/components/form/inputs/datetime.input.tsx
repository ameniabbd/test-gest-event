/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, Keyboard} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Calendar from '../../../../resources/assets/calendar.svg';
import {FieldValues, UseControllerReturn} from 'react-hook-form';
import {InputFeedBack} from '../elements/feedback';
import RNDateTimePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import Label from '../elements/label';
import {InputControl} from '../elements/controllers';
import {InputStyle} from '../../../style';
import {Size} from '../../../utils/size';
import Text from '../../utils/text';
import {strings} from '../../../contexts/app.context';
import FloatingLabel from '../elements/floatingLabel';
import ClearBtn from '../elements/clearBtn';
import {getInputBoxStyle, getInputTextStyle, isFloatingLabel} from '../stylestatefn';
import {hideActionSheet, showActionSheet} from '../../utils/actionsheet';
import appColors from '../../../colors';
import Button from '../elements/button';

export const DateTimeInput = DateTimeInputController((props: DateTimeProps) => {
  const [value, setValue] = useState<Date | undefined>();
  const [show, setShow]: any = useState(undefined);
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  const floatingLabel = isFloatingLabel(props);
  const disabled = props.disabled || props?.controller?.field?.disabled;
  const boxStyle = getInputBoxStyle(show, props, disabled);
  const textStyle = getInputTextStyle(value, props, disabled);
  const fieldState = props.controller?.fieldState;
  const isError = fieldState?.invalid;
  const errorMsg = isError && fieldState?.error?.message;

  useEffect(() => {
    setValue(typeof props.default == 'string' ? new Date(props.default) : props.default);
  }, [props.default]);

  function showPicker() {
    if (props.showMode == 'actionsheet') {
      setShow(true);
      showActionSheet(() => <DatePickerSheet {...props} value={value} onConfirm={onChange} />, {
        gestureEnabled: false,
        onClose: () => setShow(false),
      });
    } else {
      Keyboard.dismiss();
      setShow(true);
    }
  }

  function onChange(evt: any) {
    if (props.showMode == 'actionsheet') {
      hideActionSheet();
    } else setShow(false);
    setValue(evt);
    if (props.onChange) props.onChange(evt);
    props.controller?.field?.onChange(evt);
  }

  function getFormatedValue() {
    if (value) {
      const format =
        props.format ||
        (props.mode == 'time' ? 'HH:mm' : props.mode == 'datetime' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY ');
      return dayjs(value).format(format);
    } else return !floatingLabel && props.placeHolder;
  }
  return (
    <View style={[categoryStyle?.container, props.containerStyle]}>
      {props.label && !floatingLabel && (
        <Label textStyle={[categoryStyle?.labelText, props.labelStyle]}>{props.label}</Label>
      )}
      <TouchableOpacity disabled={props.disabled} activeOpacity={0.8} onPress={showPicker} style={boxStyle}>
        <View style={{flex: 1}}>
          {floatingLabel && props.label && (
            <TouchableOpacity onPress={showPicker} style={{zIndex: 2}} activeOpacity={1}>
              <FloatingLabel
                label={props.label}
                placeHolder={props.placeHolder}
                inputBoxStyle={boxStyle}
                categoryStyle={categoryStyle}
                show={show}
                value={value}
                default={props.default}
              />
            </TouchableOpacity>
          )}
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{...textStyle, flex: 0, height: undefined}}>{getFormatedValue()}</Text>
          </View>
        </View>
        {props.allowClear && !disabled && value && <ClearBtn onClear={onChange.bind(onChange, undefined)} />}
        {!props.hideIcon ? (
          props.icon ? (
            props.icon()
          ) : (
            <Calendar fill={'red'} width={Size(24)} height={Size(24)} />
          )
        ) : null}
      </TouchableOpacity>
      {show && props.showMode != 'actionsheet' && (
        <DatePicker
          {...props}
          onCancel={() => {
            setShow(false);
          }}
          onConfirm={onChange}
          value={value}
        />
      )}
      {(errorMsg || props.feedback) && <InputFeedBack isError={errorMsg} feedback={errorMsg || props.feedback} />}
    </View>
  );
});

function DatePickerSheet(props: any) {
  const selectedDate: any = useRef(props.value || props.maximumDate || new Date());
  return (
    <View style={{padding: Size(16)}}>
      <Text category="H2" style={{marginVertical: Size(16), textAlign: 'center'}}>
        {props.modalTitle || strings.selectdate}
      </Text>
      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            shadowColor: appColors.disabled,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 16,
            borderRadius: 13,
            elevation: 5,
            borderColor: 'rgba(0, 53, 79, 0.1)',
          },
        ]}>
        <DatePicker
          {...props}
          onCancel={props.onCancel}
          onDateChange={(date: any) => {
            selectedDate.current = date;
          }}
          value={props.value}
        />
      </View>

      <View style={{paddingTop: Size(32)}}>
        <Button
          title={props.confirmText || strings.confirm}
          onPress={() => {
            props.onConfirm(selectedDate.current);
          }}
        />
        <Button
          style={{marginTop: Size(10)}}
          category="secondary"
          title={props.cancelText || strings.cancel}
          onPress={hideActionSheet}
        />
      </View>
    </View>
  );
}

function DatePicker(props: any) {
  return (
    <RNDateTimePicker
      testID={props.testId || props.name}
      mode={props.mode || 'date'}
      is24hourSource="locale"
      date={props.value || new Date()}
      modal={props.showMode != 'actionsheet'}
      theme="light"
      buttonColor={appColors.primary100}
      dividerColor={appColors.disabledBackground}
      open={true}
      onCancel={props.onCancel}
      onDateChange={props.onDateChange}
      onConfirm={props.onConfirm}
      maximumDate={props.maximumDate}
      minimumDate={props.minimumDate}
      minuteInterval={props.minuteInterval as any}
      confirmText={props.confirmText || strings.CtaEnregistrer}
      cancelText={props.cancelText || strings.cancel}
      title={props.modalTitle || strings.selectdate}
      locale={props.locale || 'fr'}
    />
  );
}

function DateTimeInputController(Input: any) {
  return function (props: DateTimeProps) {
    return InputControl(Input, props);
  };
}
interface DateTimeProps {
  default?: Date;
  label?: string;
  labelStyle?: any;
  containerStyle?: any;
  subContainerStyle?: any;
  format?: string;
  errorStyle?: any;
  floatingLabel?: boolean;
  successStyle?: any;
  disabledStyle?: any;
  focusStyle?: any;
  inputTextStyle?: any;
  inputTextDisabledStyle?: any;
  inputPlaceHolderStyle?: any;
  placeHolder?: string;
  allowClear?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  confirmText?: string;
  cancelText?: string;
  modalTitle?: string;
  locale?: string;
  testId?: string;
  hideIcon?: boolean;
  minuteInterval?: number;
  disabled?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  errorTextStyle?: any;
  validate?: Function;
  mode?: 'date' | 'time' | 'datetime';
  numberify?: boolean;
  icon?: any;
  feedback?: string;
  name?: string;
  required?: boolean | string;
  category?: string;
  showMode?: 'default' | 'actionsheet';
}
