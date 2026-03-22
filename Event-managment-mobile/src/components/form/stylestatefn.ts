import {InputStyle} from '../../style';

export function getInputBoxStyle(isFocused: any, props: any, disabled: any) {
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  let style: any = categoryStyle?.inputInitial;
  style = {
    ...style,
    flexDirection: props.multiline ? 'column' : 'row',
    alignItems: props.multiline ? 'flex-end' : 'center',
    ...props.subContainerStyle,
    maxHeight: undefined,
  };
  if (disabled) {
    style = {
      ...style,
      ...categoryStyle?.inputDisabled,
      ...props.disabledStyle,
    };
  } else if (isFocused) style = {...style, ...categoryStyle?.inputFocused, ...props.focusStyle};
  else if (props.controller?.fieldState?.invalid || props.isError || props.error)
    style = {...style, ...categoryStyle?.inputError, ...props.errorStyle};
  else if (props.controller?.fieldState?.isDirty) {
    style = {...style, ...categoryStyle?.inputSuccess, ...props.successStyle};
  }
  return style;
}

export function getInputTextStyle(value: any, props: any, disabled: any) {
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  let style = {
    height: '100%',
    width: '100%',
    ...categoryStyle?.inputText,
    ...props.inputTextStyle,
    maxHeight: props?.subContainerStyle?.maxHeight,
  };
  if (disabled)
    style = {
      ...style,
      ...categoryStyle?.inputDisabledText,
      ...props.inputTextDisabledStyle,
    };
  else if (!value || value?.length == 0)
    style = {
      ...style,
      ...categoryStyle?.inputPlaceHolderText,
      ...props.inputPlaceHolderStyle,
    };
  return style;
}

export function isFloatingLabel(props: any) {
  return props.floatingLabel == false
    ? props.floatingLabel
    : props.floatingLabel || (InputStyle as any)[props.category || 'primary']?.floatingLabel;
}
