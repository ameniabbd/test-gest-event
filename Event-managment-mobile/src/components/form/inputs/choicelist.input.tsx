/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CheckBox, CheckboxInputProps} from './checkbox.input';
import {FieldValues, UseControllerReturn} from 'react-hook-form';
import FeedBackText from '../elements/feedback';
import Label from '../elements/label';
import {Size} from '../../../utils/size';
import {Switch, SwitchProps} from './switch.input';
import {ChoicesControl} from '../elements/controllers';
import {InputStyle} from '../../../style';

export const ChoiceList = ChoicesController((props: ChoiceListProps) => {
  const [values, setValues] = useState<any[]>([]);
  const [optionsByColumn, setOptionsByColumn] = useState<any[]>([]);
  const lastLine = !props.columns ? props.options.length - 1 : props.options.length / props.columns - 1;
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];

  useEffect(() => {
    const result: any[] = [];
    const options: any = [...props.options];
    const deft = props?.default ? (Array.isArray(props?.default) ? props?.default : [props.default]) : [];
    setValues(deft.filter(elt => options.find((elt1: any) => elt1.value == elt || elt1 == elt)));
    if (props.columns)
      for (let i = props.columns; i > 0; i--) {
        result.push(options.splice(0, Math.ceil(options.length / i)));
      }
    else {
      result.push(options);
    }
    setOptionsByColumn(result);
  }, [props.columns, props.options, props.default, props.mode]);

  function onChange(elt: any, checked: boolean) {
    const val = elt.value || elt;
    let old = [...values];
    if (props.mode == 'radio') old = checked ? [val] : [];
    else {
      if (old.indexOf(val) != -1) old = old.filter(v => v != val);
      else old.push(val);
    }
    setValues(old);
    const res = props.mode == 'radio' ? old[0] : old;
    props.controller?.field?.onChange(res);
    if (props?.onChange) props?.onChange(res, {item: elt, checked});
  }

  function onAll() {
    const res = values.length == props.options.length ? [] : [...props.options.map((elt: any) => elt.value || elt)];
    setValues(res);
    props.controller?.field?.onChange(res);
    if (props?.onChange) props?.onChange(res, {item: null, checked: res.length > 0});
  }

  function isDisabledItem(elt: any) {
    return (
      props.disabled ||
      elt.disabled ||
      (props?.maxItems && values?.length >= props?.maxItems && values?.indexOf(elt.value || elt) == -1)
    );
  }

  function isCheckedItem(elt: any) {
    return props.mode == 'radio' ? (elt.value || elt) == values[0] : values?.indexOf(elt.value || elt) != -1;
  }

  return (
    <View style={{...categoryStyle?.container, ...props.containerStyle}}>
      {props.label && <Label textStyle={{...categoryStyle?.labelText, ...props.labelStyle}}>{props.label}</Label>}
      {props.selectAll && props.mode != 'radio' && (
        <CheckBox {...props.checkAllProps} default={values.length == props.options.length} onChange={onAll} />
      )}
      <View style={{...styles.subContainer, ...props.subContainerStyle}}>
        {optionsByColumn.map((column, ind1) => (
          <View key={ind1} style={{...styles.columnStyle, ...props.columnStyle}}>
            {column.map((elt: any, ind2: number) => {
              return !props.iSwitch ? (
                <CheckBox
                  label={elt.label || elt}
                  disabled={isDisabledItem(elt)}
                  containerStyle={{
                    marginBottom: ind2 == lastLine ? 0 : Size(15),
                  }}
                  default={isCheckedItem(elt)}
                  onChange={onChange.bind(onChange, elt)}
                  key={ind1 + '' + ind2}
                  {...props.checkItemProps}
                />
              ) : (
                <Switch
                  label={elt.label || elt}
                  default={isCheckedItem(elt)}
                  key={ind1 + '' + ind2}
                  disabled={isDisabledItem(elt)}
                  containerStyle={{
                    marginBottom: ind2 == lastLine ? 0 : Size(15),
                  }}
                  onChange={onChange.bind(onChange, elt) as any}
                  {...props.switchItemProps}
                />
              );
            })}
          </View>
        ))}
      </View>
      {props.controller?.fieldState?.invalid && !props.hideError && (
        <FeedBackText category="error" textStyle={props.errorTextStyle}>
          {props.errorMsg}
        </FeedBackText>
      )}
    </View>
  );
});
function ChoicesController(Input: any) {
  return function (props: ChoiceListProps) {
    return ChoicesControl(Input, props);
  };
}
export interface ChoiceListProps {
  options: (string | number)[] | {value: string | number; label: string; disabled?: boolean}[];
  default?: (string | number)[] | string | number;
  columns?: number;
  label?: string;
  labelStyle?: any;
  columnStyle?: any;
  subContainerStyle?: any;
  category?: string;
  containerStyle?: any;
  mode?: 'select' | 'radio';
  iSwitch?: boolean;
  switch?: boolean;
  disabled?: boolean;
  name?: string;
  minItems?: number;
  required?: boolean;
  errorMsg?: string;
  maxItems?: number;
  errorTextStyle?: any;
  hideError?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  selectAll?: boolean;
  checkAllProps?: CheckboxInputProps;
  checkItemProps?: CheckboxInputProps;
  switchItemProps?: SwitchProps;
}
const styles = StyleSheet.create({
  subContainer: {flexDirection: 'row', width: '100%'},
  columnStyle: {flex: 1},
});
