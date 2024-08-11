import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Dimensions, Alert } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const PRIMARY_COLOR = '#A7E6FF';
const SECONDARY_COLOR = '#FFFFFF';
const TEXT_COLOR = '#000000';
const LABEL_COLOR = '#758694';

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [totalCapacity, setTotalCapacity] = useState(2.5); 
  const [loggedAmount, setLoggedAmount] = useState(0);
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);

  useEffect(() => {
    loadLoggedAmount();
    loadIndividualNeed();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadIndividualNeed();
    }, [])
  );

  const loadLoggedAmount = async () => {
    try {
      const savedLoggedAmount = await AsyncStorage.getItem('@loggedAmount');
      if (savedLoggedAmount !== null) {
        setLoggedAmount(parseFloat(savedLoggedAmount));
      }
    } catch (error) {
      console.error('Error loading logged amount from AsyncStorage:', error);
    }
  };

  const loadIndividualNeed = async () => {
    try {
      const savedIndividualNeed = await AsyncStorage.getItem('@individualNeed');
      if (savedIndividualNeed !== null) {
        setTotalCapacity(parseFloat(savedIndividualNeed));
      }
    } catch (error) {
      console.error('Error loading individual need from AsyncStorage:', error);
    }
  };

  const saveEntries = async (newEntry) => {
    try {
      const storedEntries = await AsyncStorage.getItem('entries');
      let entries = storedEntries ? JSON.parse(storedEntries) : [];
      entries.push(newEntry);
      await AsyncStorage.setItem('entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  const saveLoggedAmount = async (newAmount) => {
    try {
      await AsyncStorage.setItem('@loggedAmount', newAmount.toString());
      setLoggedAmount(newAmount);
    } catch (error) {
      console.error('Error saving logged amount to AsyncStorage:', error);
    }
  };

  const saveIndividualNeed = async (newCapacity) => {
    try {
      await AsyncStorage.setItem('@individualNeed', newCapacity.toString());
      setTotalCapacity(newCapacity); 
    } catch (error) {
      console.error('Error saving individual need to AsyncStorage:', error);
    }
  };

  const handleNewEntry = () => {
    let newAmount = parseFloat(inputValue);
    if (isNaN(newAmount) || newAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number.');
      return;
    }

    if (isEditingCapacity) {
      saveIndividualNeed(newAmount);
      setIsEditingCapacity(false);
    } else {
      const updatedLogged = loggedAmount + newAmount;
      if (updatedLogged <= totalCapacity) {
        saveLoggedAmount(updatedLogged);
        if (updatedLogged >= totalCapacity) {
          Alert.alert('Herzlichen Glückwunsch!', 'Du hast deinen täglichen Bedarf gedeckt');
        }
        const newEntry = { inputValue, dateValue: new Date().toISOString().split('T')[0], timeValue: new Date().toLocaleTimeString() };
        saveEntries(newEntry);
      } else {
        Alert.alert('Error', 'Die eingetragene Menge überschreitet das Limit');
      }
    }

    setModalVisible(false);
    setInputValue('');
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.setItem('@loggedAmount', '0');
      setLoggedAmount(0);
  
      const newSection = { section: true, date: new Date().toISOString().split('T')[0] }; 
      const storedEntries = await AsyncStorage.getItem('entries');
      let entries = storedEntries ? JSON.parse(storedEntries) : [];
      entries.push(newSection);
      await AsyncStorage.setItem('entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error resetting logged amount to AsyncStorage:', error);
    }
  };
  

  const progressValue = loggedAmount / totalCapacity;
  const remainingAmount = totalCapacity - loggedAmount;

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/bottle.png')} style={styles.bottleImage} />
      <TouchableOpacity style={styles.newEntryButton} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={24} color="#fff" />
        <Text style={styles.newEntryText}>Neuer Eintrag</Text>
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{loggedAmount.toFixed(2)} Liter - {(progressValue * 100).toFixed(0)}%</Text>
          <ProgressBar progress={progressValue} color="#01E1FF" style={styles.progressBar} />
        </View>
        <Text style={styles.remainingText}>Verbleibend: {remainingAmount.toFixed(2)} Liter</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={() => {
          setIsEditingCapacity(true);
          setModalVisible(true);
        }}>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetText} onPress={handleReset}>Reset</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Neuen Eintrag hinzufügen</Text>

            <Text style={styles.label}>Getrunkene Menge in Liter</Text>
            <TextInput
              style={styles.input}
              placeholder='Liter'
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />

            <Text style={styles.label}>Datum</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={new Date().toISOString().split('T')[0]}
              editable={false} 
            />

            <Text style={styles.label}>Uhrzeit</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              value={new Date().toLocaleTimeString()}
              editable={false} 
            />

            <View style={styles.saveAndCancelView}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelText} onPress={() => {
                  setModalVisible(false);
                }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveText} onPress={handleNewEntry}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  bottleImage: {
    width: 150,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#01E1FF',
    borderWidth: 2,
    borderColor: '#01E1FF',
    marginBottom: 20,
  },
  newEntryText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#fff',
  },
  progressContainer: {
    width: screenWidth - 40,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#D3D3D3', 
  },
  editButton: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  saveButton: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25,
    backgroundColor: '#01E1FF',
    borderWidth: 2,
    borderColor: '#01E1FF',

  },

  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#01E1FF',
  },

  saveText: {
    fontSize: 18,
    width: 60,
    color: '#fff',
    paddingLeft: 10
  },

  cancelText: {
    fontSize: 18,
    color: '#01E1FF',
    width: 60
  },
  saveAndCancelView: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    gap: 40
  },
  label: {
    color: LABEL_COLOR,
    marginBottom: 10,
    alignItems: "flex-start"
  },
  resetText: {
    fontSize: 18,
    color: '#01E1FF',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#01E1FF',
    marginBottom: 20,
  }
});

