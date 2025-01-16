import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
}

export const Eventos = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: Date.now(),
    title: '',
    description: '',
    date: '',
    time: '',
    image: '',
  });
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const saveEvents = async (updatedEvents: Event[]) => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas guardar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: () => {
            const updatedEvents = [...events, { ...newEvent, id: Date.now() }];
            saveEvents(updatedEvents);
            setNewEvent({ id: Date.now(), title: '', description: '', date: '', time: '', image: '' });
            setIsAddingEvent(false);
          },
        },
      ]
    );
  };

  const handleDeleteEvent = (eventId: number) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedEvents = events.filter((event) => event.id !== eventId);
            saveEvents(updatedEvents);
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddingEvent(true)}
      >
        <Text style={styles.addButtonText}>Agregar Evento</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              {event.image ? (
                <Image source={{ uri: event.image }} style={styles.eventImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Sin Imagen</Text>
                </View>
              )}
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <Text style={styles.eventDateTime}>
                  {event.date} - {event.time}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteEvent(event.id)}
              >
                <Ionicons name="trash" size={24} color="#FF6347" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>No hay eventos disponibles.</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal para agregar evento */}
      <Modal
        visible={isAddingEvent}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddingEvent(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.formHeader}>Nuevo Evento</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent((prev) => ({ ...prev, title: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={newEvent.description}
              onChangeText={(text) => setNewEvent((prev) => ({ ...prev, description: text }))}
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {newEvent.date || 'Seleccionar Fecha'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    const today = new Date();
                    if (date < today) {
                      Alert.alert('Error', 'No puedes seleccionar una fecha anterior a hoy.');
                    } else {
                      setNewEvent((prev) => ({
                        ...prev,
                        date: date.toISOString().split('T')[0],
                      }));
                    }
                  }
                }}
              />
            )}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {newEvent.time || 'Seleccionar Hora'}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                mode="time"
                value={new Date()}
                onChange={(event, date) => {
                  setShowTimePicker(false);
                  if (date) {
                    setNewEvent((prev) => ({
                      ...prev,
                      time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()
                        .toString()
                        .padStart(2, '0')}`,
                    }));
                  }
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="URL de Imagen (opcional)"
              value={newEvent.image}
              onChangeText={(text) => setNewEvent((prev) => ({ ...prev, image: text }))}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddingEvent(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddEvent}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#116B91',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventCard: {
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
  eventImage: {
    width: 100,
    height: 100,
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDateTime: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#116B91',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#888',
  },
});
