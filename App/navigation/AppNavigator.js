import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import AddExpenseModal from "../screens/AddExpense";
import PersonExpensesScreen from "../screens/PersonExpensesScreen";
import EditProfileScreen from "../screens/EditProfileScreen"
import RecentActivityScreen from '../screens/RecentActivityScreen'
import TabNavigator from "./TabNavigator";


import { AuthContext } from "../context/AuthContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />

          {/* These stay as normal Stack screens */}
          <Stack.Screen name="AddExpense" component={AddExpenseModal} />
          <Stack.Screen name="PersonExpenses" component={PersonExpensesScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
          <Stack.Screen name="RecentActivity" component={RecentActivityScreen}/>

         </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
