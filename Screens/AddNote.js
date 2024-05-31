import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('notes.db');

const AddNote = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    if (route.params?.note) {
      const { id, title, description, favorite } = route.params.note;
      setNoteId(id);
      setTitle(title);
      setDescription(description);
      setIsFavorite(favorite);
    }
  }, [route.params?.note]);

  const handleFav = () => {
    setIsFavorite(!isFavorite);
  };

  const saveNote = () => {
    if (title.trim() === '' || description.trim() === '') {
      alert('Please fill in both title and description');
      return;
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    db.transaction(tx => {
      if (noteId) {
        tx.executeSql(
          'UPDATE notes SET title = ?, description = ?, favorite = ?, timestamp = ? WHERE id = ?',
          [title, description, isFavorite ? 1 : 0, currentTime, noteId],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              alert('Note updated successfully');
              route.params.fetchNotes(); // Update notes list
              navigation.goBack();
            }
          },
          (tx, error) => {
            console.log('Error updating data', error);
            alert('Error updating note');
          }
        );
      } else {
        tx.executeSql(
          'INSERT INTO notes (title, description, favorite, timestamp) VALUES (?, ?, ?, ?)',
          [title, description, isFavorite ? 1 : 0, currentTime],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              alert('Note added successfully');
              route.params.fetchNotes(); // Update notes list
              navigation.goBack();
            }
          },
          (tx, error) => {
            console.log('Error inserting data', error);
            alert('Error adding note');
          }
        );
      }
    });
  };

  const deleteNote = () => {
    if (!noteId) {
      alert('No note to delete');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM notes WHERE id = ?',
        [noteId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            alert('Note deleted successfully');
            route.params.fetchNotes(); // Update notes list
            navigation.goBack();
          }
        },
        (tx, error) => {
          console.log('Error deleting data', error);
          alert('Error deleting note');
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
        {noteId && (
            <TouchableOpacity onPress={deleteNote}>
              <Ionicons name="trash" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={saveNote}>
            <Ionicons name="checkmark" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={[styles.input, styles.titleInput]}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        multiline={true}
        maxHeight={150}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        maxHeight={150}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    height: 'auto',
  },
  descriptionInput: {
    height: 'auto',
  },
  icon: {
    marginRight: 20,
  },
});

export default AddNote;
