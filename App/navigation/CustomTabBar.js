import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        // Custom icons per route
        const icons = {
          Home: isFocused ? "home" : "home-outline",
          Profile: isFocused ? "person" : "person-outline",
          Stats: isFocused ? "pie-chart" : "pie-chart-outline",
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={icons[route.name]}
              size={26}
              color={isFocused ? "#000" : "#8e8e93"}
            />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position:"absolute",
    bottom:20,
    marginHorizontal:20,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  labelFocused: {
    color: "#000",
    fontWeight: "600",
  },
});
