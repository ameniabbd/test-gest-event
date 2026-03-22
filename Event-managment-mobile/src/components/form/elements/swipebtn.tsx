/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import {Size, widthPixel} from '../../../utils/size';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SwipeButton = (props: SwipeBtnProps) => {
  const BUTTON_WIDTH = props.width || widthPixel(390);
  const BUTTON_HEIGHT = props.height || Size(50);
  const BUTTON_PADDING = props.padding || Size(3.5);
  const swipableColor = props.swipableStyle?.backgroundColor || '#06d6a0';
  const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;
  const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
  const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;
  const X = useSharedValue(0);
  const [toggled, setToggled] = useState(false);
  const handleComplete = (isToggled: any) => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
      if (props.onToggle) props.onToggle(isToggled);
    }
  };
  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.completed = toggled;
    },
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }
      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 1.18 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      return {
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        borderRadius: BUTTON_HEIGHT,
        padding: BUTTON_PADDING,
      };
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
        width: H_WAVE_RANGE + X.value,
        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        start: BUTTON_PADDING,
        height: SWIPEABLE_DIMENSIONS,
        width: SWIPEABLE_DIMENSIONS,
        borderRadius: SWIPEABLE_DIMENSIONS,
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          [swipableColor, props.swipableEndColor || swipableColor],
        ),
        transform: [{translateX: X.value}],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(X.value, InterpolateXInput, [0.7, 0], Extrapolate.CLAMP),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP,
            ),
          },
        ],
      };
    }),
  };

  return (
    <Animated.View
      style={[
        styles.swipeCont,
        AnimatedStyles.swipeCont,
        props.containerStyle,
        {pointerEvents: props.disabled ? 'none' : 'auto'},
      ]}>
      <AnimatedLinearGradient
        style={[AnimatedStyles.colorWave, styles.colorWave]}
        colors={props.gradsColors || ['#06d6a0', '#1b9aaa']}
        start={{x: 0.0, y: 0.5}}
        end={{x: 1, y: 0.5}}
      />
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable, props.swipableStyle]}>
          {props.swipableIcon ? props.swipableIcon() : null}
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText, props.titleStyle]}>
        {props.title}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeCont: {
    backgroundColor: '#B4DBEA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorWave: {
    position: 'absolute',
    start: 0,
  },
  swipeable: {
    position: 'absolute',
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: Size(16),
    fontWeight: 'bold',
    zIndex: 2,
  },
});

export default SwipeButton;

interface SwipeBtnProps {
  onToggle?: Function;
  title?: string;
  containerStyle?: any;
  swipableStyle?: any;
  titleStyle?: any;
  swipableIcon?: () => React.JSX.Element | null;
  swipableEndColor?: string;
  gradsColors?: string[];
  width?: number;
  height?: number;
  padding?: number;
  disabled?: boolean;
}
