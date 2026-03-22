import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getEventById, registerToEvent } from '../../services/eventServices';
import Text from '../../components/utils/text';
import { Size } from '../../utils/size';
import appColors from '../../colors';
import { showToast } from '../../components/utils/toast';
import { strings } from '../../contexts/app.context';

export default function EventDetailScreen() {
  const route = useRoute();
  const { id } = route.params as any

const navigation = useNavigation();


  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };



const handleRegister = async () => {
  try {
    setRegistering(true);
    await registerToEvent(id);
    showToast({
        category:"success",
      title: 'Succès 🎉',
      msgs: ['Inscription réussie'],
  
    });
    navigation.navigate('eventList');

  } catch (e: any) {
    console.log('ERROR REGISTER:', e?.response);
    showToast({
        category:"error",
      title: strings.signupechec,
      msgs: [e?.response?.data?.message || 'Erreur lors de l’inscription'],
      
    });

  } finally {
    setRegistering(false);
  }
};

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

        <Image
          source={
            event.image_url
              ? { uri: event.image_url }
              : require('../../../resources/assets/backimge.jpg')
          }
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          <Text style={styles.info}>📍 {event.location}</Text>

          <Text style={styles.info}>📅 {event.date}</Text>

          <Text style={styles.description}>
            {event.description}
          </Text>

          <Text style={styles.participants}>
            👥 {event.participants_count} / {event.max_participants}
          </Text>
        </View>

      </ScrollView>

      {/* BUTTON FIXED EN BAS */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={registering}
        >
          <Text style={styles.buttonText}>
            {registering ? 'Chargement...' : "S'inscrire"}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.screenBackground,
  },

  image: {
    width: '100%',
    height: 250,
  },

  content: {
    padding: Size(16),
  },

  title: {
    fontSize: Size(22),
    fontWeight: 'bold',
    marginBottom: Size(10),
  },

  info: {
    fontSize: Size(14),
    color: '#555',
    marginBottom: Size(5),
  },

  description: {
    fontSize: Size(14),
    marginTop: Size(10),
    color: '#333',
  },

  participants: {
    marginTop: Size(10),
    fontWeight: '600',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Size(16),
    backgroundColor: appColors.screenBackground,
  },

  button: {
    backgroundColor:appColors.primary60,
    padding: Size(14),
    marginBottom:Size(24),
    borderRadius:Size(12),
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});