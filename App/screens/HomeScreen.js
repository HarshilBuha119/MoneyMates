import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Images } from "../../assets/images";
import Ant from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

import { ActivityList } from "../components/ActivityList";
import { BalanceCard } from "../components/BalanceCard";
import { GroupList } from "../components/GroupList";
import Loader from "../components/Loader";
import { useExpenses } from "../context/ExpenseContext";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { totalBalance, persons, recentActivity, loading } = useExpenses();
  const [groups, setGroups] = useState([]);
  const [recent, setRecent] = useState([]);
  const [balance, setBalance] = useState({ owed: 0, owes: 0, net: 0 });

  useEffect(() => {
    setGroups(persons);
    setBalance(totalBalance);
    setRecent(recentActivity);
  }, [persons, totalBalance, recentActivity]);

  if (loading) return <Loader visible={true} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: "20%" }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={()=>navigation.navigate("Profile")}>
            <Image source={{ uri: user?.photoURL }} style={styles.logoMini} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MoneyMates</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("AddExpense")}
            activeOpacity={0.7}
          >
            <Ant name="pluscircleo" size={26} color="#000" />
          </TouchableOpacity>
        </View>
        <BalanceCard balance={balance} />
        <GroupList
          groups={groups}
          onGroupPress={(personName) =>
            navigation.navigate("PersonExpenses", { personName })
          }
        />
        <ActivityList activities={recent} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
    paddingHorizontal:10
  },
  blobTopRight: {
    position: "absolute",
    top: 0,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: "#F0F4FF",
    opacity: 0.7,
    zIndex: -1,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: 60,
    left: -80,
    width: 210,
    height: 210,
    borderRadius: 115,
    backgroundColor: "#F5F7FA",
    opacity: 0.8,
    zIndex: -1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0F172A",
  },
  logoMini: {
    width: 36,
    height: 36,
    borderRadius: 25
  },
  addBtn: {
    backgroundColor: "#F0F4FF",
    padding: 9,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
