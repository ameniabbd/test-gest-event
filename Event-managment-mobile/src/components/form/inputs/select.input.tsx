/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-native/no-inline-styles */
import {View, Keyboard, TouchableOpacity, DeviceEventEmitter, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Size} from '../../../utils/size';
import {FieldValues, UseControllerReturn} from 'react-hook-form';
import Label from '../elements/label';
import {SelectControl} from '../elements/controllers';
import {TextInputProps} from './text.input';
import {InputFeedBack} from '../elements/feedback';
import {DropdownStyle, InputStyle} from '../../../style';
import Text from '../../utils/text';
import Dropdown from '../elements/dropdown';
import FloatingLabel from '../elements/floatingLabel';
import ArrowDown from '../../../../resources/assets/arrow-down.svg';
import ArrowUp from '../../../../resources/assets/arrow-up.svg';
import ClearBtn from '../elements/clearBtn';
import {getInputBoxStyle, getInputTextStyle, isFloatingLabel} from '../stylestatefn';
import TagsList from '../../utils/tagsList';
import appColors from '../../../colors';

export const SelectInput = SelectInputController((props: SelectInputProps) => {
  const [show, setShow]: any = useState(undefined);
  const [options, setOptions] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [zIndex, setZindex] = useState(2);
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  const dropDownCategoryStyle = (DropdownStyle as any)[props.dropDownCategory || props.category || 'primary'];
  const floatingLabel = isFloatingLabel(props);
  const disabled = props.disabled || props?.controller?.field?.disabled;
  const boxStyle = getInputBoxStyle(show, props, disabled);
  const textStyle = getInputTextStyle(values, props, disabled);
  const elementRef: any = useRef(null);
  const fieldState = props.controller?.fieldState;
  const isError = fieldState?.invalid;
  const errorMsg = isError && fieldState?.error?.message;

  useEffect(() => {
    let listener: any = null;
    if (listener) {
      listener.remove();
      listener = null;
    }
    listener = DeviceEventEmitter.addListener('hidedropdown', () => {
      setShow(false);
    });
    return () => {
      if (listener) {
        listener.remove();
        listener = null;
      }
    };
  }, []);

  useEffect(() => {
    setOptions(props.options);
    const opts: any = [...props.options];
    const deft = props?.default
      ? Array.isArray(props?.default) && props.multiple
        ? props?.default
        : !Array.isArray(props?.default) && !props.multiple
        ? [props.default]
        : []
      : [];

    setValues(deft.filter(elt => opts.find((elt1: any) => elt1.value == elt || elt1 == elt)));
  }, [props.options, props.default, props.multiple]);

  function onChange(elt: any, checked?: any) {
    let toupdate = [...values];
    const val = elt.value || elt;
    if (!props.multiple) toupdate = [val];
    else {
      if (toupdate.indexOf(val) != -1) toupdate = toupdate.filter(v => v != val);
      else toupdate.push(val);
    }
    setValues(toupdate);
    const res = !props.multiple ? toupdate[0] : toupdate;
    props.controller?.field?.onChange(res);
    if (props?.onChange) props?.onChange(res, {item: elt, checked});
    if (!props.multiple) {
      setShow(false);
      props.controller?.field?.onBlur();
    }
  }
  function getLabels() {
    return props.options
      .filter((elt: any) => values.indexOf(elt.value || elt) != -1)
      .map((elt: any) => elt.label || elt);
  }
  function onSearch(text: string) {
    if (!text) setOptions(props.options);
    else {
      const toupdate = [...props.options].filter((elt: any) => (elt.label || elt).startsWith(text));
      setOptions(toupdate);
    }
  }
  function onClearAll() {
    setValues([]);
    const res = !props.multiple ? '' : [];
    props.controller?.field?.onChange(res);
    if (props?.onChange) props?.onChange(res);
  }
  function hide() {
    hideDropdown();
    if (show) {
      setShow(false);
      props.controller?.field?.onBlur();
    }
  }

  function onPress() {
    if (disabled) return;
    if (!show) hideDropdown();
    setShow((old: any) => {
      if (old) props.controller?.field?.onBlur();
      return !old;
    });
    Keyboard.dismiss();
  }

  return (
    <>
      {props.label && !floatingLabel && (
        <Label textStyle={{...categoryStyle?.labelText, ...props.labelStyle}}>{props.label}</Label>
      )}
      <View style={{zIndex: zIndex}}>
        <View style={[categoryStyle?.container, props.containerStyle]}>
          <TouchableOpacity activeOpacity={1} disabled={disabled} ref={elementRef} onPress={onPress} style={boxStyle}>
            <View style={{flexWrap: 'wrap', flex: 1}}>
              <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
                {floatingLabel && (
                  <TouchableOpacity disabled={disabled} onPress={onPress} style={{zIndex: 2}} activeOpacity={1}>
                    <FloatingLabel
                      label={props.label}
                      placeHolder={props.placeHolder}
                      inputBoxStyle={boxStyle}
                      categoryStyle={categoryStyle}
                      show={show}
                      value={values}
                      default={props.default}
                    />
                  </TouchableOpacity>
                )}
                <View style={{flex: 1, justifyContent: 'center'}}>
                  {props.multiple && getLabels()?.length ? (
                    <MultipleSelectedItems items={getLabels()} numberOfLines={props.numberOfLines} />
                  ) : (
                    <Text style={textStyle}>
                      {!getLabels()?.length && !floatingLabel ? props.placeHolder : getLabels()[0]}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {values.length > 0 && props.allowClear && !disabled && <ClearBtn onClear={onClearAll} />}
            {show ? <ArrowUp height={Size(14)} width={Size(14)} /> : <ArrowDown height={Size(14)} width={Size(14)} />}
          </TouchableOpacity>
          {(errorMsg || props.feedback) && <InputFeedBack isError={errorMsg} feedback={errorMsg || props.feedback} />}
        </View>
        {show && (
          <Dropdown
            {...props}
            onSearch={onSearch}
            hide={hide}
            elementRef={elementRef}
            onReady={(params: any) => {
              setZindex(params.zIndex);
            }}
            onSelect={onChange}
            values={values}
            options={options}
            search={props.search}
            dropDownCategoryStyle={dropDownCategoryStyle}
            dropDownStyle={props.dropDownStyle}
          />
        )}
      </View>
    </>
  );
});

function MultipleSelectedItems(props: any) {
  return (
    <View style={{width: '100%', paddingVertical: Size(6)}}>
      <TagsList
        rowGap={6}
        columGap={6}
        numberOfLines={props.numberOfLines}
        items={props.items}
        renderHiddenItem={count => (
          <View style={styles.taghidden}>
            <Text color="white" category="current">
              {'+ ' + count}
            </Text>
          </View>
        )}
        renderItem={item => (
          <View style={styles.tag}>
            <Text color="white" category="current">
              {item}
            </Text>
            {props.allowItemClear && (
              <View style={{marginStart: Size(2)}}>
                <ClearBtn width={Size(18)} height={Size(18)} onClear={() => {}} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

function SelectInputController(Input: any) {
  return function (props: SelectInputProps) {
    return SelectControl(Input, props);
  };
}
export function hideDropdown() {
  DeviceEventEmitter.emit('hidedropdown', {show: false});
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: appColors.primary100,
    padding: Size(6),
    paddingVertical: Size(2),
    borderRadius: Size(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  taghidden: {
    backgroundColor: appColors.primary100,
    padding: Size(6),
    paddingVertical: Size(2),
    borderRadius: Size(4),
  },
});
export interface SelectInputProps {
  options: (string | number)[] | {value: string | number; label: string; disabled?: boolean}[];
  default?: (string | number)[] | string | number;
  label?: string;
  zIndex?: number;
  numberOfLines?: number;
  labelStyle?: any;
  containerStyle?: any;
  subContainerStyle?: any;
  disabled?: boolean;
  errorStyle?: any;
  successStyle?: any;
  disabledStyle?: any;
  category?: string;
  dropDownCategory?: string;
  focusStyle?: any;
  name?: string;
  minItems?: number;
  required?: boolean | string;
  errorMsg?: string;
  feedback?: string;
  inputTextStyle?: any;
  inputTextDisabledStyle?: any;
  inputPlaceHolderStyle?: any;
  multiple?: any;
  itemStyle?: any;
  floatingLabel?: boolean;
  selectedLabelsStyle?: any;
  disabledItemStyle?: any;
  activeItemStyle?: any;
  validate?: Function;
  dropDownStyle?: any;
  maxItems?: number;
  allowClear?: boolean;
  allowItemClear?: boolean;
  errorTextStyle?: any;
  hideError?: boolean;
  placeHolder?: string;
  search?: boolean;
  searchInputProps?: TextInputProps;
  multipleMaxLines?: number;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  iconColor?: string;
  iconSize?: number;
  showMode?: 'dropdown' | 'actionsheet';
}
