import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import axiosInstance from '../config/axios';
import { showToast } from '../components/utils/toast';
import { strings } from '../contexts/app.context';
import { FormProvider, useForm } from 'react-hook-form';
import appColors from '../colors';
import FormContainer from '../components/form/formContainer';
import { heightPixel, Size } from '../utils/size';
import Text from '../components/utils/text';
import Divider from '../components/utils/divider';
import { TextInput } from '../components/form';
import Button from '../components/form/elements/button';
import { emailReg, passwordReg } from '../utils/regex';
import { useAppContext } from '../contexts/app.context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

export default function SignupScreen({ navigation }: any) {
  const methods = useForm({ mode: 'onSubmit' });
  const watch = methods.watch();
  const { setAppInfos } = useAppContext();
  const btnDisabled =
    !watch.email ||
    !watch.password ||
    !watch.first_name ||
    !watch.last_name;

  async function submit(form: any) {
    try {
      const { data } = await axiosInstance.post('auth/register', {
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      });

      console.log('REGISTER SUCCESS:', data);
      await AsyncStorage.setItem('token', data.token);
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.token}`;

      setAppInfos({
        user: data.user,
        token: data.token,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'home' }],
      });

    } catch (e: any) {
      console.log('REGISTER ERROR:', e?.response?.data);

      if (e?.response?.status === 400) {
        showToast({
          title: strings.signupechec,
          msgs: [e?.response?.data?.message || 'Erreur'],
        });
      } else {
        showToast({
          title: 'Erreur',
          msgs: ['Erreur serveur'],
        });
      }
    }
  }

  function onSignin() {
    navigation.navigate('signin');
  }

  return (
    <FormContainer keyboardVerticalOffset={heightPixel(96)} style={styles.container}>
      <FormProvider {...methods}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <Text category='H2' style={styles.title}>Créer un compte</Text>
          <TextInput
            name="first_name"
            required={strings.prenom_required}
            placeHolder={strings.prenomPlacholder}
            label={strings.prenomLabel}
            containerStyle={styles.input}
          />

          <TextInput
            name="last_name"
            required={strings.nom_required}
             placeHolder={strings.nomPlacholder}
              label={strings.nomLabel}
            containerStyle={styles.input}
          />

          <TextInput
            name="email"
            required={strings.emailinvalid}
            placeHolder={strings.emailPlaceholder}
            validate={(val: any) =>
              !emailReg.test(val) ? strings.emailinvalid : true
            }
            label={strings.addressEmail}
            containerStyle={styles.input}
          />

          <TextInput
            name="password"
            required={strings.password_required}
            validate={(val: any) =>
              !passwordReg.test(val) ? 'Mot de passe invalide' : true
            }
            placeHolder={strings.paaswordPlacholder}
            secureTextEntry
            label={strings.passwordlabel}
            containerStyle={styles.input}
          />
        </ScrollView>

        <View style={styles.bottom}>
          <Button
            title={strings.register}
            onPress={methods.handleSubmit(submit)}
            disabled={btnDisabled}
          />

          <View style={styles.footer}>
            <Text category="legend" style={styles.haveAccountbtn}>
              {strings.haveAccount}
            </Text>
            <TouchableOpacity
              onPress={onSignin}
            >
              <Text category='exergue' style={styles.loginbtn}>{strings.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </FormProvider>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Size(100),
    paddingHorizontal: Size(16),
    paddingBottom: Size(10),
  },
  scroll: { flexGrow: 1 },
  title: {

    textAlign: 'center',
    marginBottom: Size(25),
  },
  cgu: {
    flex: 1,
    marginTop: Size(20),
    justifyContent: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Size(18),
  },
  input: { marginBottom: Size(6) },
  ouView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Size(20),
    marginBottom: Size(16),
  },
  divider: { width: '45%' },
  politique: {
    marginTop: Size(16),
    color: appColors.primary100,
  },
  orText: { color: appColors.primary150 },
  bottom: { marginTop: Size(16) },
  haveAccountbtn: {
    color: appColors.primary60
  },
  loginbtn: {
    textDecorationLine: 'underline',
    color: appColors.primary100
  }
});