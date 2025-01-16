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
  Dimensions,
  Platform,
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

  // Funciones existentes se mantienen igual...
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

  const renderEventCard = (event: Event) => (
    <View key={event.id} style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="calendar-outline" size={40} color="#888" />
          </View>
        )}
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
        <View style={styles.eventFooter}>
          <View style={styles.dateTimeContainer}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.eventDateTime}>
              {event.date} - {event.time}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEvent(event.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6347" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eventos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingEvent(true)}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {events.length > 0 ? (
          events.map(renderEventCard)
        ) : (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={80} color="#DDD" />
            <Text style={styles.noEventsText}>No hay eventos programados</Text>
            <Text style={styles.noEventsSubtext}>
              Toca el botón + para agregar un nuevo evento
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isAddingEvent}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddingEvent(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Evento</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsAddingEvent(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Título del evento"
                placeholderTextColor="#999"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent((prev) => ({ ...prev, title: text }))}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent((prev) => ({ ...prev, description: text }))}
              />

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.datePickerButtonText}>
                  {newEvent.date || 'Seleccionar Fecha'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.datePickerButtonText}>
                  {newEvent.time || 'Seleccionar Hora'}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="URL de imagen (opcional)"
                placeholderTextColor="#999"
                value={newEvent.image}
                onChangeText={(text) => setNewEvent((prev) => ({ ...prev, image: text }))}
              />

              {(showDatePicker || showTimePicker) && (
                <DateTimePicker
                  mode={showDatePicker ? 'date' : 'time'}
                  value={new Date()}
                  onChange={(event, date) => {
                    if (showDatePicker) {
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
                    } else {
                      setShowTimePicker(false);
                      if (date) {
                        setNewEvent((prev) => ({
                          ...prev,
                          time: `${date.getHours().toString().padStart(2, '0')}:${date
                            .getMinutes()
                            .toString()
                            .padStart(2, '0')}`,
                        }));
                      }
                    }
                  }}
                />
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]} 
                  onPress={() => setIsAddingEvent(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleAddEvent}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    backgroundColor: '#116B91',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scrollContainer: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eventImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F8F9FA',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 16,
    lineHeight: 24,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDateTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  deleteButton: {
    padding: 8,
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noEventsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C757D',
    marginTop: 16,
  },
  noEventsSubtext: {
    fontSize: 16,
    color: '#ADB5BD',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#116B91',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Eventos;