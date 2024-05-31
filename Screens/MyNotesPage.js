import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('notes.db');

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 32 - 8) / 2;

const MyNotesPage = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [notes, setNotes] = useState([]);
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          profile_picture TEXT
        );`
      );
    });
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM notes ORDER BY timestamp DESC;',
        [],
        (tx, results) => {
          setNotes(results.rows._array);
        }
      );
    });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearchText = note.title.toLowerCase().includes(searchText.toLowerCase()) || note.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesFavoriteFilter = !showFavorites || note.favorite === 1;
    return matchesSearchText && matchesFavoriteFilter;
  });

  const handleNotePress = (note) => {
    navigation.navigate('AddNote', { note, isFavorite: note.favorite, fetchNotes });
  };

  const handleAddNote = () => {
    navigation.navigate('AddNote', { fetchNotes });
  };

  const toggleFavorite = (note) => {
    const newFavoriteStatus = note.favorite === 1 ? 0 : 1;
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE notes SET favorite = ? WHERE id = ?',
        [newFavoriteStatus, note.id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            fetchNotes(); // Update notes list
          }
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>My Notes</Text>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={24} color="#9D9E9F" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      <View style={styles.filterContainer}>
  <TouchableOpacity onPress={() => setShowFavorites(false)}>
    <Text style={[styles.filterTitle, !showFavorites && styles.activeFilter]}>All Notes</Text>
    { !showFavorites && <View style={[styles.filterLine, styles.lineActive]} /> }
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setShowFavorites(true)}>
    <Text style={[styles.filterTitle, showFavorites && styles.activeFilter]}>Favorites</Text>
    { showFavorites && <View style={[styles.filterLine, styles.lineActive]} /> }
  </TouchableOpacity>
</View>
      <FlatList
        data={filteredNotes}
        numColumns={numColumns}
        renderItem={({ item }) => (
          
            
            <TouchableOpacity onPress={() => handleNotePress(item)} style={styles.noteContainer}>
              <View style={styles.noteItem}>
              <View>
              <Text style={styles.noteTimestamp}>{item.timestamp}</Text>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteDescription}>{item.description}</Text>
              </View>
            
            <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteIcon}>
              <MaterialIcons 
                name={item.favorite === 1 ? 'favorite' : 'favorite-border'}
                size={24}
                color={item.favorite === 1 ? '#6369D1' : 'black'}
              />
            </TouchableOpacity>
            </View>
            </TouchableOpacity>
       
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F0F1F3',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    flex: 1,
    backgroundColor: '#F0F1F3',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
 
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    position: 'relative',
    bottom:12
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 40,
    color: 'gray',
    marginHorizontal: 40,
  },
  activeFilter: {
    color: 'black',
  },
  filterLine: {
    position: 'absolute',
    bottom: -4, // Adjust as needed for the line thickness
    height: 3, // Adjust as needed for the line thickness
    width: '50%', // Initially, same as the container width
    left:40,
    borderRadius:8
  },
  lineActive: {
    backgroundColor: '#6369D1', // Line color for active state
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', // Adjust to your needs
    marginBottom: 10,
  },
  noteContent: {
    flex: 1,
    paddingRight: 40, // Space for the favorite icon

  },
  noteTimestamp: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  noteContainer: {
    width:'48%',
    backgroundColor:'#F0F1F3',
    borderRadius:12,
    padding:8,
    marginRight:10,
    marginBottom:10
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteDescription: {
    fontSize: 14,
    color: 'gray',
  },
  favoriteIcon: {
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: [{ translateY: -12 }], // Center vertically
  },
  flatListContent: {
    paddingBottom:20
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6369D1',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyNotesPage;
