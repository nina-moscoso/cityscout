import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const checkUserProfile = async () => {
    try {
      const userProfileString = await AsyncStorage.getItem('user_profile');
      if (!userProfileString) return false;
  
      const userProfile = JSON.parse(userProfileString);
      return userProfile &&
        userProfile.nombre &&
        userProfile.apellido; // Verifica campos mínimos
    } catch (error) {
      console.error('Error al verificar el perfil:', error);
      return false;
    }
  };
  

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      // 1. Login request
      const response = await axios.post(
        'https://bkd-general.getmab.com/login_tourism/',
        { email, password }
      );

      const { access_token } = response.data;
      
      
      // 2. Guardar token
      await AsyncStorage.setItem('access_token', access_token);

      // 3. Verificar perfil de usuario
      const hasProfile = await checkUserProfile();
      console.log(hasProfile);

      // 4. Navegar según el estado del perfil
      if (hasProfile !== null) {
        Alert.alert(
          'Éxito',
          'Inicio de sesión exitoso',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('TabNavigator')
            }
          ]
        );
      } else {
        Alert.alert(
          'Información',
          'Por favor, completa tu perfil antes de continuar',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Perfil')
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>
        Inicia sesión para explorar los mejores lugares turísticos
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#116B91',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#116B91',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A0C4D8',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#116B91',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});