// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = React.useState("Login");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setInitialRoute("Profile");
        }
      } catch (error) {
        console.error("Token kontrolü sırasında hata:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return null; // Veya bir yükleme göstergesi ekleyebilirsiniz
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Giriş Yap" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
