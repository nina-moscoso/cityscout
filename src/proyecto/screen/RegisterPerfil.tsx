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

export const RegisterPerfil = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bornDate, setBornDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const { first_name, last_name } = JSON.parse(storedUser);
          setFirstName(first_name || '');
          setLastName(last_name || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!username.trim() || !bornDate.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas guardar este perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: async () => {
            try {
              const profileData = {
                username: username.trim(),
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                born_date: bornDate.trim(),
              };

              // Guardar los datos en AsyncStorage (o enviarlos a un backend)
              await AsyncStorage.setItem('user_profile', JSON.stringify(profileData));

              Alert.alert('Éxito', 'Perfil guardado exitosamente.');
              navigation.navigate('TabNavigator'); // Navegar a TabNavigator
            } catch (error) {
              Alert.alert('Error', 'Hubo un problema al guardar el perfil. Inténtalo nuevamente.');
              console.error('Error saving profile:', error);
            }
          },
        },
      ]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setBornDate(formattedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registro de Perfil</Text>
      <Text style={styles.subtitle}>
        Completa la información de tu perfil personal para continuar
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Nombre"
        value={firstName}
        editable={false} // Campo no editable
      />

      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Apellido"
        value={lastName}
        editable={false} // Campo no editable
      />

      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerButtonText}>
          {'Seleccionar Fecha de Nacimiento'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Guardar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  header: {
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
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  datePickerButton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#116B91',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
