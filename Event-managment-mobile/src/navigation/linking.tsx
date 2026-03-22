import Config from 'react-native-config';
export const linking: any = {
  prefixes: [Config.DEEP_LINK + '://'],
  config: {
    screens: {
      //npx uri-scheme open myapp://login --ios
      signin: 'login',
      homenavs: {
        screens: {
          orders: 'orders/:id',
        },
      },
    },
  },
};
