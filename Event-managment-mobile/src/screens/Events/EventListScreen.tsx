import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getEvents } from '../../services/eventServices';
import Text from '../../components/utils/text';
import EventCard from '../../components/cards/EventCard';
import { Size } from '../../utils/size';
import { strings } from '../../contexts/app.context';

export default function EventListScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🎉{strings.event}</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            onPress={() =>
              navigation.navigate('EventDetail', { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>Aucun événement disponible</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e7ec',
  },

  header: {
    paddingHorizontal: Size(16),
    paddingTop: Size(10),
    paddingBottom: Size(10),
  },

  title: {
    fontSize: Size(22),
    fontWeight: 'bold',
  },

  listContent: {
    paddingHorizontal: Size(16),
    paddingBottom: Size(20),
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
});