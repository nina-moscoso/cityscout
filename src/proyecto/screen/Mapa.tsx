import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { turisticPlaces } from '../../data/turisticPlaces';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface MapState {
  isLoading: boolean;
  error: string | null;
  currentLocation: LocationCoords | null;
}

export const Mapa = () => {
  const [mapState, setMapState] = useState<MapState>({
    isLoading: true,
    error: null,
    currentLocation: null,
  });

  const initialRegion = {
    latitude: 2.4448,
    longitude: -76.6147,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const requestLocationPermissions = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message: 'Esta aplicación necesita acceso a tu ubicación.',
          buttonNeutral: 'Preguntar luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        setMapState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Se requiere permiso para acceder a la ubicación'
        }));
        return false;
      }
    } catch (error) {
      setMapState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al solicitar permisos de ubicación'
      }));
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setMapState(prev => ({
          ...prev,
          isLoading: false,
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        }));
      },
      (error) => {
        setMapState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Error al obtener la ubicación: ' + error.message
        }));
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  }, []);

  // Efecto para manejar la inicialización y limpieza
  useEffect(() => {
    let watchId: number;

    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermissions();
      if (hasPermission) {
        getCurrentLocation();
        
        // Suscribirse a actualizaciones de ubicación
        watchId = Geolocation.watchPosition(
          (position) => {
            setMapState(prev => ({
              ...prev,
              currentLocation: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }
            }));
          },
          (error) => {
            setMapState(prev => ({
              ...prev,
              error: 'Error al actualizar la ubicación: ' + error.message
            }));
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 5000,
            fastestInterval: 2000,
          }
        );
      }
    };

    initializeLocation();

    // Cleanup function
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [requestLocationPermissions, getCurrentLocation]);

  // Manejador de errores
  useEffect(() => {
    if (mapState.error) {
      Alert.alert('Error', mapState.error);
    }
  }, [mapState.error]);

  if (mapState.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapState.currentLocation ? {
          ...mapState.currentLocation,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        } : initialRegion}
        mapType="hybrid"
        showsUserLocation
        showsMyLocationButton
        showsCompass
        rotateEnabled
        zoomEnabled
        loadingEnabled
      >
        {turisticPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.coordinate.latitude,
              longitude: place.coordinate.longitude,
            }}
            title={place.title}
            description={place.history}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});