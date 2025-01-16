import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Navegar automáticamente después de 2 segundos
    const timer = setTimeout(() => {
      navigation.navigate('Login' as never);
    }, 2000);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../../assets/logo.webp')} // Asegúrate de que esta ruta sea válida
        resizeMode="contain" // Ajusta el tamaño para que se vea mejor
      />
      <Text style={styles.text}>Bienvenido a la App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fondo blanco
    paddingHorizontal: 20, // Espaciado interno para evitar que el contenido toque los bordes
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#333', // Color del texto
    textAlign: 'center', // Centrar el texto
  },
  logo: {
    width: 250, // Ajusta el tamaño para que no sea demasiado grande
    height: 250,
    marginBottom: 20, // Espaciado entre el logo y el texto
  },
});
