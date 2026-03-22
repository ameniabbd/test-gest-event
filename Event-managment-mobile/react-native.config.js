module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
    android: {},
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
  assets: ['./resources/assets/fonts/'],
};
// npx react-native-asset
