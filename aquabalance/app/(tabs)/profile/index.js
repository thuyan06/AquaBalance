import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

const PRIMARY_COLOR = '#A7E6FF';
const SECONDARY_COLOR = '#FFFFFF';
const TEXT_COLOR = '#000000';
const LABEL_COLOR = '#758694';

export default function Profile() {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('0');
  const [climate, setClimate] = useState('0');
  const [gender, setGender] = useState('male');
  const [waterIntake, setWaterIntake] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState({ weight: '', activityLevel: '', climate: '', gender: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedWeight = await AsyncStorage.getItem('weight');
      const storedActivityLevel = await AsyncStorage.getItem('activityLevel');
      const storedClimate = await AsyncStorage.getItem('climate');
      const storedGender = await AsyncStorage.getItem('gender');
      const storedWaterIntake = await AsyncStorage.getItem('waterIntake');
      const storedShowResults = await AsyncStorage.getItem('showResults');

      if (storedWeight) setWeight(storedWeight);
      if (storedActivityLevel) setActivityLevel(storedActivityLevel);
      if (storedClimate) setClimate(storedClimate);
      if (storedGender) setGender(storedGender);
      if (storedWaterIntake) setWaterIntake(JSON.parse(storedWaterIntake));
      if (storedShowResults) setShowResults(JSON.parse(storedShowResults));
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    saveData('weight', value);
    setErrors((prevErrors) => ({ ...prevErrors, weight: '' }));
  };

  const handleActivityLevelChange = (value) => {
    setActivityLevel(value);
    saveData('activityLevel', value);
    setErrors((prevErrors) => ({ ...prevErrors, activityLevel: '' }));
  };

  const handleClimateChange = (value) => {
    setClimate(value);
    saveData('climate', value);
    setErrors((prevErrors) => ({ ...prevErrors, climate: '' }));
  };

  const handleGenderChange = (value) => {
    setGender(value);
    saveData('gender', value);
    setErrors((prevErrors) => ({ ...prevErrors, gender: '' }));
  };

  const saveIndividualNeed = async (individualNeed) => {
    try {
      await AsyncStorage.setItem('@individualNeed', individualNeed.toString());
    } catch (error) {
      console.error('Failed to save individual need to AsyncStorage:', error);
    }
  };

  const calculateWaterIntake = () => {
    const weightInKg = parseFloat(weight);
    let hasError = false;
    let newErrors = { weight: '', activityLevel: '', climate: '', gender: '' };

    if (!weight || isNaN(weightInKg) || weightInKg < 40 || weightInKg > 400) {
      newErrors.weight = 'Bitte geben Sie ein gültiges Gewicht zwischen 40 und 400 kg ein.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const baseNeed = Math.min(weightInKg * 20 / 1000, 3);
    const activityNeed = Math.min(parseFloat(activityLevel), 1.0);
    const climateNeed = Math.min(parseFloat(climate), 0.2);
    const genderAdjustment = gender === 'male' ? 0.4 : 0;
    const individualNeed = baseNeed + activityNeed + climateNeed + genderAdjustment;

    const newWaterIntake = { individual: individualNeed.toFixed(2) };
    setWaterIntake(newWaterIntake);
    saveData('waterIntake', JSON.stringify(newWaterIntake));
    setShowResults(true);
    saveData('showResults', JSON.stringify(true));
    saveIndividualNeed(individualNeed);

    Keyboard.dismiss();
  };

  const handleEdit = () => {
    setShowResults(false);
    saveData('showResults', JSON.stringify(false));
  };

  const handleNewEntry = () => {
    // Implement your logic for new entry here
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.innerContainer}>
            {showResults ? (
              <View style={styles.resultsContainer}>
                <Text style={styles.header}>Wasserbedarf Ergebnisse</Text>
                <View style={styles.results}>
                  <Text style={styles.resultText}>Individualisierter Wasserbedarf: {waterIntake.individual} Liter pro Tag</Text>
                </View>
                <CustomButton style={styles.editButton} title="Bearbeiten" onPress={handleEdit} />
                <TouchableOpacity style={styles.linkButton}>
                  <Link href="/home">
                  <Text style={styles.linkText}>Fortschritt eintragen</Text>
                </Link>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.header}>Wasserbedarf berechnen</Text>
                <Text style={styles.label}>Gewicht (kg):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={handleWeightChange}
                  placeholder="Gewicht in kg"
                  placeholderTextColor="#758694"
                />
                {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}

                <Text style={styles.label}>Aktivitätsniveau (Stunden der Aktivität pro Tag):</Text>
                <Picker
                  selectedValue={activityLevel}
                  style={styles.picker}
                  onValueChange={handleActivityLevelChange}
                >
                  <Picker.Item label="Kaum etwas" value="0" />
                  <Picker.Item label="0.5 Stunde" value="0.2" />
                  <Picker.Item label="1 Stunde" value="0.4" />
                  <Picker.Item label="2 Stunden" value="0.5" />
                  <Picker.Item label="3+ Stunden" value="1" />
                </Picker>
                {errors.activityLevel ? <Text style={styles.errorText}>{errors.activityLevel}</Text> : null}

                <Text style={styles.label}>Klima:</Text>
                <Picker
                  selectedValue={climate}
                  style={styles.picker}
                  onValueChange={handleClimateChange}
                >
                  <Picker.Item label="Kühl" value="0" />
                  <Picker.Item label="Warm" value="0.2" />
                  <Picker.Item label="Heiß" value="0.2" />
                </Picker>
                {errors.climate ? <Text style={styles.errorText}>{errors.climate}</Text> : null}

                <Text style={styles.label}>Geschlecht:</Text>
                <Picker
                  selectedValue={gender}
                  style={styles.picker}
                  onValueChange={handleGenderChange}
                >
                  <Picker.Item label="Männlich" value="male" />
                  <Picker.Item label="Weiblich" value="female" />
                </Picker>
                {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

                <CustomButton title="Berechnen" onPress={calculateWaterIntake} />
              </View>
            )}
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  avoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: TEXT_COLOR,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: LABEL_COLOR,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#CED0CE',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: TEXT_COLOR,
  },
  picker: {
    height: 40,
    width: '100%',
    borderColor: '#CED0CE',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    color: TEXT_COLOR,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#01E1FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 5,
  },
  resultsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  results: {
    backgroundColor: '#E0F8FF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: TEXT_COLOR,
  },
  editButton: {
    marginBottom: 10,
  },
  linkText: {
    fontSize: 18,
    color: '#01E1FF',
    width: 60
  },
  linkButton:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#01E1FF',
  }
});