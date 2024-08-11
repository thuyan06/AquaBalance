
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function History() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('entries');
      const entries = storedEntries ? JSON.parse(storedEntries) : [];
      setEntries(entries);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const deleteEntry = async (index) => {
    try {
      const updatedEntries = [...entries];
      updatedEntries.splice(index, 1);
      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const confirmDelete = (index) => {
    Alert.alert(
      'Eintrag löschen',
      'Bist Du dir sicher, dass Du diesen Eintrag löschen möchtest?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteEntry(index), style: 'destructive' },
      ]
    );
  };

  const renderEntry = ({ item, index }) => {
    if (item.section) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionText}>Neuer Abschnitt: {item.date}</Text>
          <TouchableOpacity onPress={() => confirmDelete(index)}>
            <Icon name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.entryContainer}>
        <View style={styles.entryTextContainer}>
          <Text style={styles.entryText}>Amount: {item.inputValue} Liter</Text>
          <Text style={styles.entryText}>Date: {item.dateValue}</Text>
          <Text style={styles.entryText}>Time: {item.timeValue}</Text>
        </View>
        <TouchableOpacity onPress={() => confirmDelete(index)}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  sectionText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  entryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entryTextContainer: {
    flex: 1,
  },
  entryText: {
    fontSize: 18,
    color: 'black',
  },
});




