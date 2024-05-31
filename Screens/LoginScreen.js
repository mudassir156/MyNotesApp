import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('auth.db');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    createTable()
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);'
      );
    });
  };

  const handleLogin = () => {
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            console.log('Login successful');
            navigation.navigate('NotesPage');
          } else {
            setErrorMessage('Invalid username or password');
          }
        }
      );
    });
  };

  return (
    
    <View style={styles.container}>
    <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-single-cartoon-spiral-notebook-isolated-white-background-vector-illustration_939711-1289.jpg' }} resizeMode='contain' style={{width:'50%',height:'20%',bottom:12,}} />
      <Text style={styles.title}>My Notes</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.signupText}> <Text style={{color:'black'}}>Don't have an account? </Text>Sign up</Text>
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
    marginBottom: 30,
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
    paddingHorizontal: 120,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    color: '#6369D1',
    fontSize: 16,
  },
});

export default LoginScreen;
