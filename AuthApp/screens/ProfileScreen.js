// /screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('access_token');

    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

    try {
      const response = await fetch('https://fakeapi.platzi.com/api/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data);
      } else {
        Alert.alert('Hata', data.message || 'Profil bilgileri alınamadı.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya bağlanırken bir hata oluştu.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>Profil bilgileri yüklenemedi.</Text>
        <Button title="Tekrar Dene" onPress={fetchProfile} />
        <Button title="Çıkış Yap" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adı:</Text>
      <Text style={styles.value}>{userInfo.name}</Text>

      <Text style={styles.label}>E-posta:</Text>
      <Text style={styles.value}>{userInfo.email}</Text>

      {/* Diğer kullanıcı bilgilerini burada gösterebilirsiniz */}

      <Button title="Çıkış Yap" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    marginBottom: 10,
  },
});

export default ProfileScreen;