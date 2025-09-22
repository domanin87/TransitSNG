import './i18n'; import React from 'react'; import { NavigationContainer } from '@react-navigation/native'; import { createNativeStackNavigator } from '@react-navigation/native-stack'; import HomeScreen from './screens/HomeScreen'; import LoginScreen from './screens/LoginScreen'; import PlaceCargoScreen from './screens/PlaceCargoScreen'; import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();
export default function App(){ return (<NavigationContainer><Stack.Navigator initialRouteName='Home'><Stack.Screen name='Login' component={LoginScreen} /><Stack.Screen name='Home' component={HomeScreen} /><Stack.Screen name='Place' component={PlaceCargoScreen} /><Stack.Screen name='Chat' component={ChatScreen} /></Stack.Navigator></NavigationContainer>); }
