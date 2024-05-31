import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNote from './Screens/AddNote';
import MyNotesPage from './Screens/MyNotesPage';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={gestureHandlerRootHOC(LoginScreen)} options={{headerShown:false}} />
      <Stack.Screen name="SignupScreen" component={gestureHandlerRootHOC(SignupScreen)} options={{headerShown:false}} />

        <Stack.Screen name="NotesPage" component={gestureHandlerRootHOC(MyNotesPage)}  options={{headerShown:false}} />
        <Stack.Screen name="AddNote" component={gestureHandlerRootHOC(AddNote)} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;




