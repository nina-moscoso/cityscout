import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export const Perfil = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    born_date: '',
  });
  const [tempProfileData, setTempProfileData] = useState(profileData); // Estado temporal para edición
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('user_profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfileData(parsedProfile);
        setTempProfileData(parsedProfile); // Sincroniza el estado temporal
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(tempProfileData));
      setProfileData(tempProfileData); // Actualiza el perfil con los nuevos datos
      Alert.alert('Éxito', 'Perfil actualizado exitosamente.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Inténtalo nuevamente.');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Mi Perfil</Text>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={tempProfileData.username}
            onChangeText={(text) => setTempProfileData((prev) => ({ ...prev, username: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={tempProfileData.first_name}
            onChangeText={(text) => setTempProfileData((prev) => ({ ...prev, first_name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={tempProfileData.last_name}
            onChangeText={(text) => setTempProfileData((prev) => ({ ...prev, last_name: text }))}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {tempProfileData.born_date || 'Seleccionar Fecha de Nacimiento'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={
                tempProfileData.born_date
                  ? new Date(tempProfileData.born_date)
                  : new Date()
              }
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
              style={styles.cancelButton}
              onPress={() => {
                setTempProfileData(profileData); // Restaura los datos originales
                setIsEditing(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Usuario:</Text>
            <Text style={styles.value}>{profileData.username}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{profileData.first_name}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Apellido:</Text>
            <Text style={styles.value}>{profileData.last_name}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Fecha de Nacimiento:</Text>
            <Text style={styles.value}>{profileData.born_date}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#116B91',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#666',
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
  datePickerButton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 16,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#116B91',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#116B91',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
