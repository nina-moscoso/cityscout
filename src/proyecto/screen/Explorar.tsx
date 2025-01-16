import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { turisticPlaces } from '../../data/turisticPlaces';
import { categorias } from '../../data/categorias';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Place {
  id: number;
  title: string;
  image: string;
  history: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  category?: string;
  subcategory?: string;
}

export const Explorar = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [favoritesMapping, setFavoritesMapping] = useState<{ [key: number]: boolean }>({});
  const [ratingsMapping, setRatingsMapping] = useState<{ [key: number]: number }>({});
  const [userLocation, setUserLocation] = useState({
    latitude: 2.4448,
    longitude: -76.6147,
  });

  // Storage key helper
  const getStorageKey = (placeId: number, type: 'favorite' | 'rating') =>
    `place_${placeId}_${type}`;

  // Load favorites and ratings from storage
  useEffect(() => {
    const loadMappings = async () => {
      try {
        const favoriteKeys = turisticPlaces.map(place => getStorageKey(place.id, 'favorite'));
        const ratingKeys = turisticPlaces.map(place => getStorageKey(place.id, 'rating'));

        const [favorites, ratings] = await Promise.all([
          AsyncStorage.multiGet(favoriteKeys),
          AsyncStorage.multiGet(ratingKeys)
        ]);

        const favoritesMap = Object.fromEntries(
          favorites.map(([key, value]) => [parseInt(key.split('_')[1], 10), value === 'true'])
        );

        const ratingsMap = Object.fromEntries(
          ratings.map(([key, value]) => [parseInt(key.split('_')[1], 10), value ? parseInt(value, 10) : 0])
        );

        setFavoritesMapping(favoritesMap);
        setRatingsMapping(ratingsMap);
      } catch (error) {
        console.error('Error loading mappings:', error);
      }
    };

    loadMappings();
  }, []);

  // Filter places based on category, subcategory and search
  const filteredPlaces = turisticPlaces.filter(place => {
    const matchesCategory = !selectedCategory ||
      place.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSubcategory = !selectedSubcategory ||
      place.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase();
    const matchesSearch = place.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Handle category selection
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(prevCategory => prevCategory === categoryId ? null : categoryId);
    setSelectedSubcategory(null);
    setSelectedPlace(null);
  };

  // Handle subcategory selection
  const handleSubcategoryPress = (subcategory: string) => {
    setSelectedSubcategory(prevSubcategory => prevSubcategory === subcategory ? null : subcategory);
    setSelectedPlace(null);
  };

  // Handle marker press
  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
  };

  // Rating stars component
  const RatingStars = ({ placeId }: { placeId: number }) => {
    const rating = ratingsMapping[placeId] || 0;

    const handleRating = async (newRating: number) => {
      try {
        const newRatings = { ...ratingsMapping, [placeId]: newRating };
        setRatingsMapping(newRatings);

        const ratingKeys = turisticPlaces.map(place => getStorageKey(place.id, 'rating'));
        await AsyncStorage.multiSet(
          ratingKeys.map(key => [key, (newRatings[parseInt(key.split('_')[1], 10)] || 0).toString()])
        );

      } catch (error) {
        console.error('Error setting rating:', error);
      }
    };

    const handleFavorite = async (placeId: number) => {
      try {
        const newFavorites = { ...favoritesMapping, [placeId]: !favoritesMapping[placeId] };
        setFavoritesMapping(newFavorites);

        const favoriteKey = getStorageKey(placeId, 'favorite');
        await AsyncStorage.setItem(favoriteKey, newFavorites[placeId].toString());
      } catch (error) {
        console.error('Error setting favorite:', error);
      }
    };

    return (
      <View style={styles.starsContainer}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={28}
                color="#FFD700"
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
          <Text style={styles.ratingText}>{rating} / 5</Text>
        </View>
        <TouchableOpacity onPress={() => handleFavorite(placeId)} style={styles.favoriteButton}>
          <Ionicons
            name={favoritesMapping[placeId] ? 'heart' : 'heart-outline'}
            size={28}
            color={favoritesMapping[placeId] ? '#FF6347' : '#B0B0B0'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar lugares..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categorias.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <category.icon.library
              name={category.icon.name}
              size={category.icon.size}
              color={selectedCategory === category.id ? '#000' : '#fff'}
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Subcategories */}
      {selectedCategory && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subcategoriesContainer}
        >
          {categorias
            .find(category => category.id === selectedCategory)
            ?.subcategories.map((subcategory, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.subcategoryButton,
                  selectedSubcategory === (typeof subcategory === 'string' ? subcategory : subcategory.name) &&
                  styles.selectedSubcategoryButton,
                ]}
                onPress={() => handleSubcategoryPress(
                  typeof subcategory === 'string' ? subcategory : subcategory.name
                )}
              >
                <Text style={[
                  styles.subcategoryText,
                  selectedSubcategory === (typeof subcategory === 'string' ? subcategory : subcategory.name) &&
                  styles.selectedSubcategoryText
                ]}>
                  {typeof subcategory === 'string' ? subcategory : subcategory.name}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          mapType="satellite"
        >
          {filteredPlaces.map(place => (
            <Marker
              key={place.id}
              coordinate={place.coordinate}
              title={place.title}
              description={place.history}
              pinColor="#FF0000"
              onPress={() => handleMarkerPress(place)}
            />
          ))}
        </MapView>


      </View>
      <View>
        {/* Selected Place Card */}
        {selectedPlace && (
          <View style={styles.detailCard}>
            <Image
              source={{ uri: selectedPlace.image }}
              style={styles.placeImage}
              resizeMode="cover"
            />
            <View style={styles.detailContent}>
              <Text style={styles.placeTitle}>{selectedPlace.title}</Text>
              <Text numberOfLines={10} style={styles.placeDescription}>
                {selectedPlace.history}
              </Text>
              <RatingStars placeId={selectedPlace.id} />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    padding: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#116B91',
    borderRadius: 15,
    width: 100,
    height: 100,
    marginRight: 12,
    padding: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#BAD654',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  selectedCategoryText: {
    color: '#000',
  },
  subcategoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  subcategoryButton: {
    backgroundColor: '#E5F1FF',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedSubcategoryButton: {
    backgroundColor: '#BAD654',
  },
  subcategoryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  selectedSubcategoryText: {
    color: '#000',
    fontWeight: '700',
  },
  mapContainer: {
    height: 400,
    margin: 8,
    borderRadius: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  detailCard: {
    marginHorizontal: 16,
    marginBottom: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  placeImage: {
    width: '100%',
    height: 120,
  },
  detailContent: {
    padding: 12,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 2,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  favoriteButton: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },  
});