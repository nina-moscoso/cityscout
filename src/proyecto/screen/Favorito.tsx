import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { turisticPlaces } from '../../data/turisticPlaces';

interface FavoritePlace {
  id: number;
  title: string;
  rating: number;
  image: string;
}

export const Favorito = () => {
  const [favoritePlaces, setFavoritePlaces] = useState<FavoritePlace[]>([]);

  const getStorageKey = (placeId: number, type: 'favorite' | 'rating') =>
    `place_${placeId}_${type}`;

  const loadFavoritePlaces = async () => {
    try {
      const favorites: FavoritePlace[] = [];
      for (const place of turisticPlaces) {
        const isFavoriteKey = getStorageKey(place.id, 'favorite');
        const ratingKey = getStorageKey(place.id, 'rating');

        const isFavorite = await AsyncStorage.getItem(isFavoriteKey);
        const rating = await AsyncStorage.getItem(ratingKey);

        if (isFavorite === 'true') {
          favorites.push({
            id: place.id,
            title: place.title,
            rating: rating ? parseInt(rating, 10) : 0,
            image: place.image, // Incluye la imagen del lugar
          });
        }
      }
      setFavoritePlaces(favorites);
    } catch (error) {
      console.error('Error loading favorite places:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoritePlaces();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tus Lugares Favoritos</Text>
      {favoritePlaces.length > 0 ? (
        favoritePlaces.map((place) => (
          <View key={place.id} style={styles.favoriteCard}>
            <Image
              source={{ uri: place.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.placeTitle}>{place.title}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.placeRating}>{place.rating} / 5</Text>
              </View>
              <View style={styles.favoriteRow}>
                <Ionicons name="heart" size={20} color="#FF4D4D" />
                <Text style={styles.favoriteText}>Favorito</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noFavorites}>
          No tienes lugares favoritos aún.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeRating: {
    fontSize: 16,
    marginLeft: 6,
    color: '#666',
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  favoriteText: {
    fontSize: 14,
    color: '#FF4D4D',
    marginLeft: 4,
  },
  noFavorites: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
