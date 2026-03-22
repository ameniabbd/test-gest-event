/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {BackHandler, Platform, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import WebView from 'react-native-webview';
import {hideLoading, showLoading} from './loading';

const WebPage = (props: {
  url: string;
  onNavigationChange?: any;
  onMessage?: any;
  onFinishBack?: Function;
  showHeader?: boolean;
  headerTitle?: string;
  injectedJavaScript?: '';
}) => {
  const webViewcanGoBack = useRef(false);
  const INJECTED_JAVASCRIPT = `(function() {
        const meta = document.createElement('meta'); 
        meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); 
        meta.setAttribute('name', 'viewport'); 
        document.getElementsByTagName('head')[0].appendChild(meta);
      })();${props.injectedJavaScript || ''}`;
  const webViewRef: any = useRef({});
  const handleBackButtonPress = () => {
    try {
      if (webViewcanGoBack.current) webViewRef.current?.goBack();
      else {
        if (props.onFinishBack) props.onFinishBack();
      }
    } catch (err: any) {
      /* empty */
    }
    return true;
  };

  useEffect(() => {
    let backHandler = null;
    showLoading();
    if (Platform.OS === 'android')
      backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    return () => {
      if (Platform.OS === 'android' && backHandler) backHandler.remove();
    };
  }, []);
  return (
    props?.url && (
      <View style={[StyleSheet.absoluteFill, {zIndex: 100}]}>
        <WebView
          source={{uri: props?.url}}
          style={[styles.webview]}
          originWhitelist={['*']}
          allowFileAccess={true}
          ref={webViewRef}
          scalesPageToFit={false}
          onLoadStart={() => showLoading()}
          onLoadEnd={() => hideLoading()}
          javaScriptEnabled={true}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          onMessage={props?.onMessage}
          onLoadProgress={({nativeEvent}) => {
            webViewcanGoBack.current = nativeEvent.canGoBack;
          }}
          domStorageEnabled={true}
          onNavigationStateChange={props.onNavigationChange}
        />
      </View>
    )
  );
};

export default WebPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  webview: {flex: 1},
});
