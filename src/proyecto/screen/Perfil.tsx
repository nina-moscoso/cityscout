import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export const Perfil = ({ navigation   }) => {
  const [profileData, setProfileData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    born_date: '',
  });
  
  const [tempProfileData, setTempProfileData] = useState(profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('user_profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfileData(parsedProfile);
        setTempProfileData(parsedProfile);
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(tempProfileData));
      setProfileData(tempProfileData);
      Alert.alert('¡Éxito!', 'Tu perfil ha sido actualizado.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil. Por favor, intenta nuevamente.');
    }
  };
  const logout = async () => {
    try {
      // Obtener todas las keys en AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      
      // Filtrar las keys que queremos eliminar (todas excepto user_profile)
      const keysToRemove = keys.filter(key => key !== 'user_profile' && key !== 'user' && key!=='events' && key!=='favorite');
      
      // Eliminar solo las keys seleccionadas 
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Error durante el logout:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Splash'); // O la navegación que uses
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData.first_name && profileData.last_name
                ? `${profileData.first_name[0]}${profileData.last_name[0]}`
                : '??'}
            </Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      {isEditing ? (
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre de usuario"
              value={tempProfileData.username}
              onChangeText={(text) => setTempProfileData((prev) => ({ ...prev, username: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre"
              value={tempProfileData.first_name}
              onChangeText={(text) => setTempProfileData((prev) => ({ ...prev, first_name: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Apellido</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu apellido"
              value={tempProfileData.last_name}
              onChangeText={(text) => setTempProfileData((prev) => ({ ...prev, last_name: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fecha de nacimiento</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {tempProfileData.born_date || 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={tempProfileData.born_date ? new Date(tempProfileData.born_date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setTempProfileData((prev) => ({
                    ...prev,
                    born_date: selectedDate.toISOString().split('T')[0],
                  }));
                }
              }}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setTempProfileData(profileData);
                setIsEditing(false);
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveProfile}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <View style={styles.infoCard}>
            <View style={styles.profileRow}>
              <Text style={styles.label}>Usuario</Text>
              <Text style={styles.value}>{profileData.username}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{profileData.first_name}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.label}>Apellido</Text>
              <Text style={styles.value}>{profileData.last_name}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.label}>Fecha de Nacimiento</Text>
              <Text style={styles.value}>{profileData.born_date}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText, styles.logoutButtonText]}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#116B91',
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  avatarContainer: {
    padding: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#116B91',
  },
  profileContainer: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  profileRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 10,
    padding: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#116B91',
    flex: 1,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#116B91',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#FF6B6B',
  },
});