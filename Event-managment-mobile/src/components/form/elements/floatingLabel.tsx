import {Animated, Easing} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Size} from '../../../utils/size';
import appColors from '../../../colors';

const FloatingLabel = (props: any) => {
  const inputHeight = props?.categoryStyle?.inputInitial?.height || props?.categoryStyle?.inputInitial?.minHeight;
  const params = {
    positionTop: {default: inputHeight / 5, active: Size(-16)},
    color: {default: appColors.primary50, active: appColors.primary150},
    fontSize: {default: Size(16), active: Size(14)},
  };
  const animatedValue = useRef(new Animated.Value(0));
  const animationSpeed = 500;
  function getFloatingLabelStyle() {
    const empty = !props.value || (Array.isArray(props.value) && props.value.length == 0);
    const floatinglabelstyle =
      props.show || !empty
        ? {...props?.categoryStyle?.labelText, ...props.labelStyle}
        : {
            ...props?.categoryStyle?.inputPlaceHolderText,
            ...props.placeHolderStyle,
          };

    return {
      position: 'absolute',
      //  backgroundColor: appColors.screenBackground,
      maxWidth: Size(315),
      ...floatinglabelstyle,
      marginTop: 0,
      top: animatedValue?.current?.interpolate({
        inputRange: [0, 1],
        outputRange: [params.positionTop.default, params.positionTop.active],
        extrapolate: 'clamp',
      }),
      fontSize: animatedValue?.current?.interpolate({
        inputRange: [0, 1],
        outputRange: [params.fontSize.default, params.fontSize.active],
        extrapolate: 'clamp',
      }),
      color: animatedValue?.current?.interpolate({
        inputRange: [0, 1],
        outputRange: [params.color.default, params.color.active],
      }),
    };
  }
  function animateText(duration: number, val: number) {
    Animated.timing(animatedValue?.current, {
      toValue: val,
      duration: duration,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }

  useEffect(() => {
    const empty = !props.value || (Array.isArray(props.value) && props.value.length == 0);
    if (props.default && props.show == undefined) {
      animateText(0, 1);
    } else if (props.show == true) {
      animateText(animationSpeed, 1);
    } else if (props.show == false && empty) {
      animateText(animationSpeed, 0);
    }
  }, [props.default, props.show, props.value]);
  return (
    <Animated.Text numberOfLines={1} style={[getFloatingLabelStyle()]}>
      {!props.show && !props.value ? props.placeHolder || props.label : props.label}
    </Animated.Text>
  );
};

export default FloatingLabel;
