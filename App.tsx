// App.js
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from "./App/navigation/AppNavigator"
import ExpenseProvider from './App/context/ExpenseContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AuthProvider, { AuthContext } from './App/context/AuthContext';
import notifee from "@notifee/react-native";

GoogleSignin.configure({
  webClientId:
    '337803005366-hlkdut89nsphkpf4g073eejusr6j0jrg.apps.googleusercontent.com',
});
export default function App(){
useEffect(() => {
  async function setup() {
    // Request permission (Android 13+)
    await notifee.requestPermission();  // <-- REQUIRED

    await notifee.createChannel({
      id: "money-reminders",
      name: "Money Reminders",
      importance: 4,
    });
  }
  setup();
}, []);

return (
  <AuthProvider>
    <AuthContext.Consumer>
      {({ user }) => (
        <ExpenseProvider user={user}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
          </NavigationContainer>
        </ExpenseProvider>
      )}
    </AuthContext.Consumer>
  </AuthProvider>
);
}
