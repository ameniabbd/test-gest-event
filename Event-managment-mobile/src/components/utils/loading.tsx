import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, Text, DeviceEventEmitter} from 'react-native';
import {Size} from '../../utils/size';
import appColors from '../../colors';

export default function Loading(props: {show?: boolean; title?: string}) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('loading', data => {
      setShow(data.show);
      setTitle(data.title);
    });
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    setShow(props.show || false);
    setTitle(props.title || '');
  }, [props.title, props.show]);

  return (
    show && (
      <View style={styles.container}>
        <View style={styles.container1}>
          <ActivityIndicator color={appColors.primary100} size="large" />
          {title && <Text style={styles.progressText}>{title}</Text>}
        </View>
      </View>
    )
  );
}

export function showLoading(title?: string) {
  DeviceEventEmitter.emit('loading', {title, show: true});
}
export function hideLoading() {
  DeviceEventEmitter.emit('loading', {show: false});
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
    position: 'absolute',
    top: '0%',
    width: '100%',
    height: '100%',
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  progressText: {
    fontSize: Size(17),
    fontWeight: '500',
    marginTop: 5,
    color: 'black',
  },
});
