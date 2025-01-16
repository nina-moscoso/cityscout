import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native'; // Detecta el tema
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { darkTheme, lightTheme } from '../themes/Colors';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme(); // Detecta si el sistema está en modo oscuro o claro
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  // Colores personalizados para cada tab según el tema
  const tabColors = {
    Explora: {
      icon: colorScheme === 'dark' ? '#A5D6DC' : '#F26F25', // Naranja Neón o Naranja Vivo
      background: colorScheme === 'dark' ? '#116B91' : '#2E3192', // Azul Neón o Azul Vivo
    },
    Eventos: {
      icon: colorScheme === 'dark' ? '#E32057' : '#CA1F5D', // Rosa Neón o Rosa Vibrante
      background: colorScheme === 'dark' ? '#EFDA61' : '#FBC447', // Dorado Neón o Amarillo
    },
    Mapa: {
      icon: colorScheme === 'dark' ? '#EFDA61' : '#2EA1B0', // Verde Neón o Azul Vibrante
      background: colorScheme === 'dark' ? '#116B91' : '#BAD654', // Azul Neón o Verde Lima
    },
    Favoritos: {
      icon: colorScheme === 'dark' ? '#F5F8F8' : '#F9715D', // Rojo Neón o Coral Vivo
      background: colorScheme === 'dark' ? '#F45551' : '#CA1F5D', // Rosa Neón o Rosa Vibrante
    },
    Perfil: {
      icon: colorScheme === 'dark' ? '#00FFFF' : '#BAD654', // Cian Neón o Verde Lima
      background: colorScheme === 'dark' ? '#9400D3' : '#2EA1B0', // Morado Neón o Azul Vibrante
    },
  };

  // Referencias para las animaciones
  const animations = useRef(state.routes.map(() => new Animated.Value(0))).current;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // Animación de escala y movimiento vertical
        const scale = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });

        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -15],
        });

        // Control de animación
        if (isFocused) {
          Animated.spring(animations[index], {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(animations[index], {
            toValue: 0,
            friction: 3,
            useNativeDriver: true,
          }).start();
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const renderIcon = (): React.ReactNode => {
          const colors = tabColors[route.name as keyof typeof tabColors];
          const iconColor = isFocused ? colors.icon : theme.colors.iconInactive; // Colores según el estado
          switch (route.name) {
            case 'Explora':
              return <Ionicons name={isFocused ? 'home' : 'home-outline'} size={30} color={iconColor} />;
            case 'Eventos':
              return <FontAwesome name="calendar" size={30} color={iconColor} />;
            case 'Mapa':
              return <FontAwesome name="map" size={30} color={iconColor} />;
            case 'Favoritos':
              return <Ionicons name={isFocused ? 'heart' : 'heart-outline'} size={30} color={iconColor} />;
            case 'Perfil':
              return <FontAwesome name="user-circle" size={30} color={iconColor} />;
            default:
              return <Ionicons name="help-circle-outline" size={30} color={iconColor} />;
          }
        };

        return (
          <TouchableOpacity key={index} onPress={onPress} style={styles.tabButton}>
            <View style={styles.wrapper}>
              <Animated.View
                style={[
                  styles.iconContainer,
                  isFocused && styles.focusedIconContainer,
                  {
                    transform: [{ scale }, { translateY }],
                    backgroundColor: isFocused
                      ? tabColors[route.name as keyof typeof tabColors].background
                      : 'transparent',
                  },
                ]}
              >
                {renderIcon()}
              </Animated.View>
              {isFocused && (
                <Text
                  style={[
                    styles.label,
                    styles.focusedLabel,
                    { color: tabColors[route.name as keyof typeof tabColors].icon },
                  ]}
                >
                  {label.toString()}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  focusedIconContainer: {
    elevation: 5,
    shadowColor: '#000',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  label: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  focusedLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
