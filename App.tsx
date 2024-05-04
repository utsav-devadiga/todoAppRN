import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './utils/FirebaseConfig';
import SignUpScreen from './screens/SignUpScreen';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function InsideLayout() {

  return (
    <Drawer.Navigator initialRouteName="Home"
      screenOptions={{
        headerShown: true, // Control header visibility here for all drawer screens
        drawerActiveTintColor: '#1f2937', // Active item color
        drawerInactiveTintColor: '#1f2937', // Inactive item color
        drawerStyle: {
          backgroundColor: '#f6f6f6', // Background of the drawer
        },
        headerTintColor: '#1f2937', // Color of the header text and icons
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingScreen} />


    </Drawer.Navigator>
  )
}

function AuthLayout() {

  return (
    <Stack.Navigator initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Signin" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

    </Stack.Navigator>
  )
}

export default function App() {
  const [user, setuser] = useState<User | null>(null)

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user?.uid);
      setuser(user);
    });
  }, [])



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='My Todo' component={InsideLayout}
            options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name='Auth' component={AuthLayout}
            options={{ headerShown: false }} />

        )}


      </Stack.Navigator>
    </NavigationContainer>
  );
}
