import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormContainer from '../components/form/formContainer';
import Text from '../components/utils/text';
import { TextInput } from '../components/form';
import Button from '../components/form/elements/button';
import axiosInstance from '../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext, strings } from '../contexts/app.context';
import { showToast } from '../components/utils/toast';
import { heightPixel, Size } from '../utils/size';
import appColors from '../colors';
import { emailReg, passwordReg } from '../utils/regex';
import Back from "../../resources/assets/arrow-left.svg"

export default function SignInScreen({ navigation }: any) {
  const methods = useForm({ mode: 'onSubmit' });
  const watch = methods.watch();
  const { setAppInfos } = useAppContext();

  const btnDisabled = !watch.email || !watch.password;

  async function submit(form: any) {
    try {
      const { data } = await axiosInstance.post('auth/login', {
        email: form.email,
        password: form.password,
      });

      await AsyncStorage.setItem('token', data.token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setAppInfos({ user: data.user, token: data.token });
      navigation.reset({ index: 0, routes: [{ name: 'home' }] });
    } catch (e: any) {
      showToast({
        title: 'Erreur',
        msgs: [e?.response?.data?.message || 'Identifiants invalides'],
      });
    }
  }

  function onSignup() {
    navigation.navigate('signup');
  }

  return (
    <FormContainer keyboardVerticalOffset={heightPixel(96)} style={styles.container}>
      <FormProvider {...methods}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Back /></TouchableOpacity>
          <Text category='H2' style={styles.title}>{strings.signinTitle}</Text>

          <TextInput
            name="email"
            placeHolder={strings.emailPlaceholder}
            label={strings.addressEmail}
            required={strings.emailinvalid}
            validate={(val: any) => !emailReg.test(val) ? strings.emailinvalid : true}
            containerStyle={styles.input}
          />

          <TextInput
            name="password"
            placeHolder={strings.paaswordPlacholder}
            label={strings.passwordlabel}
            secureTextEntry
            required={strings.password_required}
            validate={(val: any) => !passwordReg.test(val) ? 'Mot de passe invalide' : true}
            containerStyle={styles.input}
          />

        </ScrollView>

        <View style={styles.bottom}>
          <Button title={strings.ctaSuivant} onPress={methods.handleSubmit(submit)} disabled={btnDisabled} />

          <View style={styles.footer}>
            <Text category="legend" style={styles.haveAccountbtn}>{strings.pasCompte}</Text>
            <TouchableOpacity onPress={onSignup}><Text category='exergue' style={styles.loginbtn}>{strings.inscrit}</Text></TouchableOpacity>
          </View>
        </View>
      </FormProvider>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Size(50), paddingHorizontal: Size(16), paddingBottom: Size(10) },
  scroll: { flexGrow: 1 },
  title: { textAlign: 'center', marginBottom: Size(25) },
  input: { marginBottom: Size(12) },
  bottom: { marginTop: Size(20) },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Size(18) },
  haveAccountbtn: { color: appColors.primary60 },
  loginbtn: { textDecorationLine: 'underline', color: appColors.primary100 },
  back: { marginVertical: Size(24) },
});