import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Skeleton from 'react-native-reanimated-skeleton';
import FastImage from '@d11/react-native-fast-image';

const ImageLoading = (props: {
  source: string;
  defaultImage?: any;
  resizeMode?: any;
  style?: any;
  disableLoading?: boolean;
  onError?: Function;
}) => {
  const [isError, setisError] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    setisLoading(true);
  }, [props.source]);
  return (
    <View>
      <Skeleton containerStyle={styles.skeleteonContainer} isLoading={isLoading}>
        <View style={props.style} />
      </Skeleton>
      <FastImage
        defaultSource={props.defaultImage}
        resizeMode={props.resizeMode}
        style={props.style}
        onError={() => {
          if (props.onError) props?.onError();
          setisError(true);
        }}
        onLoadEnd={() => {
          setisLoading(false);
        }}
        source={isError ? props.defaultImage : {uri: props.source}}
      />
    </View>
  );
};

export default ImageLoading;

const styles = StyleSheet.create({
  skeleteonContainer: {
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
  },
});
