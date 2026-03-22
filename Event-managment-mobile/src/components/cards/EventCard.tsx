import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '../utils/text';
import appColors from '../../colors';
import { formatDate } from '../utils/function';


export default function EventCard({ item, onPress }: any) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>

            {/* IMAGE */}
            <Image
                source={
                    item.image_url
                        ? { uri: item.image_url }
                        : require('../../../resources/assets/backimge.jpg')
                }
                style={styles.image}
                resizeMode='cover'
            />

            {/* CONTENT */}
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.subtitle}>
                    📍 {item.location || 'No location'}
                </Text>

                <Text style={styles.date} category='legend'>
                    📅 {formatDate(item.date)}
                </Text>

                {/* BOTTOM ROW */}
                <View style={styles.bottomRow}>
                    <Text style={styles.participants}>
                        👥 {item.participants_count || 0} / {item.max_participants || '∞'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: appColors.screenBackground,
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },

    image: {
        width: '100%',
        height: 180,
    },

    imagePlaceholder: {
        height: 180,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        padding: 14,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },

    date: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    participants: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
});