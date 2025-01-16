import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Explorar } from '../../proyecto/screen/Explorar';
import { Eventos } from '../../proyecto/screen/Eventos';
import { Favorito } from '../../proyecto/screen/Favorito';
import { Perfil } from '../../proyecto/screen/Perfil';
import { Mapa } from '../../proyecto/screen/Mapa';
import { CustomTabBar } from './CustomTabBar';

const Tab = createBottomTabNavigator();

export function TabNavigation() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen name="Explora" component={Explorar} />
      <Tab.Screen name="Eventos" component={Eventos} />
      <Tab.Screen name="Mapa" component={Mapa} />
      <Tab.Screen name="Favoritos" component={Favorito} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}