import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../utils/FirebaseConfig';

interface UserSettings {
  name: string;
  email: string;
  password: string;
}

const SettingsScreen = () => {
  const [settings, setSettings] = useState<UserSettings>({
    name: 'John Doe',
    email: 'john@example.com',
    password: ''
  });

  const handleSaveChanges = () => {
    console.log('Saved settings:', settings);
    alert('Changes saved!');
  };

  const handleChange = (value: string, field: keyof UserSettings) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>Manage your account settings.</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={settings.name}
        onChangeText={(text) => handleChange(text, 'name')}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={settings.email}
        onChangeText={(text) => handleChange(text, 'email')}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={settings.password}
        onChangeText={(text) => handleChange(text, 'password')}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => { FIREBASE_AUTH.signOut() }}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000', // Dark background
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:5
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default SettingsScreen;
