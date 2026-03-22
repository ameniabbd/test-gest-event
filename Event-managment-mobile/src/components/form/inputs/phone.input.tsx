/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Size} from '../../../utils/size';
import {TextInput} from './text.input';
import {InputStyle} from '../../../style';
import {useAppContext} from '../../../contexts/app.context';
import {FieldValues, UseControllerReturn} from 'react-hook-form';
import parsePhoneNumber from 'libphonenumber-js';
import {InputFeedBack} from '../elements/feedback';
import {PhoneControl} from '../elements/controllers';
import {formatPhoneInput} from '../../../utils/functions';
import Countrypicker from '../countrypicker/countrypicker';
import {isFloatingLabel} from '../stylestatefn';

export const PhoneNumberInput = PhonenputController((props: PhoneInputType) => {
  const phoneInfo: any = useRef({});
  const {appInfos} = useAppContext();
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  const [value, setValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryId, setCountryId] = useState('');
  const fieldState = props.controller?.fieldState;
  const isError = fieldState?.invalid;
  const disabled = props.disabled || props?.controller?.field?.disabled;
  const errorMsg = isError && fieldState?.error?.message;
  useEffect(() => {
    const deflt = props.default ? (props.default.startsWith('+') ? props.default : '+' + props.default) : '';
    const phoneParse = parsePhoneNumber(deflt);
    const code = phoneParse?.countryCallingCode || props.defaultCode || '';
    const phone = phoneParse?.nationalNumber || props.default || '';
    const id = props.defaultId ? props.defaultId : phoneParse?.country == 'US' ? '231' : '';
    setCountryId(id);
    setCountryCode(code);
    setValue(formatPhoneInput(phone));
    phoneInfo.current = {
      country: phoneParse?.country,
      code: code,
      nationalNumber: phone,
      number: '+' + code + phone,
    };
  }, [props.default, props.defaultCode, props.defaultId]);
  const floatingLabel = isFloatingLabel(props);
  function onSelectCountry(val: any) {
    const phoneParse = parsePhoneNumber('+' + val.callingCode);
    phoneInfo.current = {
      country: phoneParse?.country,
      code: val.callingCode,
      nationalNumber: '',
      number: '+' + val.callingCode,
    };
    if (props.onChange) props.onChange(phoneInfo.current);
    setValue('');
    setCountryCode(val.callingCode);
    setCountryId(val.id);
  }
  function onChangePhone(val: string) {
    const v = val.replace(/\s/g, '');
    const code = countryCode;
    const phoneParse = parsePhoneNumber('+' + code + v);
    phoneInfo.current = {
      country: phoneParse?.country,
      code: code,
      nationalNumber: v,
      number: '+' + code + v,
    };
    if (props.onChange) props.onChange(phoneInfo.current);
    props.controller?.field?.onChange(phoneInfo.current);
    setValue(formatPhoneInput(v));
  }

  return (
    <View style={categoryStyle.container}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TextInput
          containerStyle={{
            flex: props.singleInput || props.national ? 1 : 0,
            marginBottom: 0,
          }}
          disabled={disabled}
          floatingLabel={props.floatingLabel}
          maxLength={props.maxLength}
          default={value}
          label={floatingLabel ? '' : props.indicatifLabel || props.label}
          onBlur={() => {
            props.controller?.field?.onBlur();
          }}
          onChange={onChangePhone}
          placeHolder={!props.singleInput && !props.national ? '' : props.placeHolder}
          isError={props.controller?.fieldState?.invalid && (props.singleInput || props.national)}
          subContainerStyle={{
            marginEnd: Size(10),
          }}
          keyboardType="number-pad"
          renderStart={() =>
            !props.national ? (
              <Countrypicker
                style={{minWidth: !props.singleInput ? Size(100) : undefined}}
                disabled={disabled || props.disabledSelect}
                locale={appInfos.language == 'fr' ? 'fra' : appInfos.language}
                countryCode={countryCode}
                hideDropDown={props.hideDropDown}
                hideFlag={props.hideFlag}
                id={countryId}
                onSelectCountry={onSelectCountry}
              />
            ) : null
          }
        />
        {!props.singleInput && !props.national && (
          <TextInput
            onBlur={() => props.controller?.field?.onBlur()}
            keyboardType="number-pad"
            label={props.indicatifLabel ? props.label : props.label ? ' ' : ''}
            placeHolder={props.placeHolder}
            floatingLabel={props.floatingLabel}
            onChange={onChangePhone}
            isError={props.controller?.fieldState?.invalid}
            maxLength={props.maxLength}
            containerStyle={{marginBottom: 0, flex: 1}}
            default={value}
            disabled={disabled}
          />
        )}
      </View>
      {(errorMsg || props.feedback) && <InputFeedBack isError={errorMsg} feedback={errorMsg || props.feedback} />}
    </View>
  );
});
function PhonenputController(Input: any) {
  return function (props: PhoneInputType) {
    return PhoneControl(Input, props);
  };
}
interface PhoneInputType {
  defaultCode?: string;
  defaultId?: string;
  category?: string;
  hideFlag?: boolean;
  hideDropDown?: boolean;
  disabledSelect?: boolean;
  disabled?: boolean;
  maxLength?: number;
  label?: string;
  indicatifLabel?: string;
  placeHolder?: string;
  name?: string;
  required?: boolean;
  errorMsg?: string;
  errorTextStyle?: any;
  floatingLabel?: any;
  labelStyle?: any;
  onChange?: Function;
  feedback?: string;
  national?: boolean;
  pickerTitle?: string;
  default?: string;
  pickerSearchPlaceHolder?: string;
  singleInput?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
}
