import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SplashScreen } from './src/proyecto/home/SplashScreen';
import { TabNavigation } from './src/components/buttonNavigation/TabNavigation';
import { Login } from './src/proyecto/screen/Login';
import { Register } from './src/proyecto/screen/Register';
import { RegisterPerfil } from './src/proyecto/screen/RegisterPerfil';

const Stack = createNativeStackNavigator();

export const App = () => {
 
  return (
    <>
    <NavigationContainer>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name='Login'  component={Login} />
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='Perfil'  component={RegisterPerfil} />
      <Stack.Screen name='TabNavigator' component={TabNavigation} />
    </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

export default App;
