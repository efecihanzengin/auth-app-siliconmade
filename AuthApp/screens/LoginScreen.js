
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifre girin.');
      return;
    }

    try {
      const response = await fetch('https://fakeapi.platzi.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const accessToken = data.access_token;
        await AsyncStorage.setItem('access_token', accessToken);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Profile' }],
        });
      } else {
        Alert.alert('Giriş Başarısız', data.message || 'Bilinmeyen bir hata oluştu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya bağlanırken bir hata oluştu.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Giriş Yap" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center', // İçeriği dikeyde ortalar
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
});

export default LoginScreen;