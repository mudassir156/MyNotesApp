import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import LoginScreen from './LoginScreen';

const db = SQLite.openDatabase('auth.db');

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = () => {
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }
  
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log('User registered successfully');
            navigation.navigate('LoginScreen'); // Fixed: 'LoginScreen' should be a string
          } else {
            setErrorMessage('Failed to register user');
          }
        },
        (_, error) => { // Added error callback
          console.log('Error inserting user into database:', error);
          setErrorMessage('Failed to register user');
        }
      );
    });
  };
  
  return (
    <View style={styles.container}>
       <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-single-cartoon-spiral-notebook-isolated-white-background-vector-illustration_939711-1289.jpg' }} resizeMode='contain' style={{width:'50%',height:'20%',bottom:12,}} />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#F0F1F3',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
    backgroundColor:'#F0F1F3'
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6369D1',
    paddingVertical: 10,
    paddingHorizontal: 113,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
