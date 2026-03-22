import {View, StyleSheet} from 'react-native';
import React from 'react';
import Text from '../../utils/text';
import ErrorIcon from '../../../../resources/assets/error.svg';
import {Size} from '../../../utils/size';
import {InputStyle} from '../../../style';
export default function FeedBackText(props: {
  children?: string;
  textStyle?: any;
  containerStyle?: any;
  category?: 'error' | 'success' | 'info';
}) {
  return (
    props.children && (
      <View style={[styles.container, props.containerStyle]}>
        <View style={styles.icon}>{props.category == 'error' && <ErrorIcon width={Size(18)} height={Size(18)} />}</View>
        <Text style={[styles.text, props.textStyle]}>{props.children}</Text>
      </View>
    )
  );
}

export function InputFeedBack(props: any) {
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  return props.isError ? (
    <FeedBackText category="error" textStyle={[categoryStyle?.errorText, props.errorTextStyle]}>
      {props.feedback}
    </FeedBackText>
  ) : props.feedback ? (
    <FeedBackText textStyle={[categoryStyle?.feedBackText, props.errorTextStyle]}>{props.feedback}</FeedBackText>
  ) : null;
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center'},
  text: {flex: 1},
  icon: {marginTop: Size(4)},
});
