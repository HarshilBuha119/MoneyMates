import { useNavigation } from "@react-navigation/native"
import React, { memo } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import Ant from "react-native-vector-icons/AntDesign"

export function ActivityList({ activities }) {
  const navigation = useNavigation()
  const renderItem = ({ item }) => {
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.iconBox}>
          {item.type === "expense" ? (
            <Ant name="creditcard" size={19} color="#0EA5E9" />
          ) : (
            <Ant name="checkcircle" size={19} color="#22C55E" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.sub}>
            {item.group} · {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[
          styles.amount,
          { color: item.amount >= 0 ? "#22C55E" : "#EF4444" }
        ]}>
          ₹{item.amount > 0 ? "+" : ""}{item.amount}
        </Text>
      </View>
    )
  }
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={styles.heading}>Recent Activity</Text>
        <TouchableOpacity onPress={() => navigation.navigate("RecentActivity", {
          activities: activities,   // <-- sending data
        })}>
          <Text style={styles.headingview}>View all</Text>
        </TouchableOpacity>
      </View>
      {activities.length === 0 ? (
        <Text style={styles.nothing}>No recent activity yet.</Text>
      ) : (
        <FlatList
          data={activities.slice(0, 5)}
          renderItem={renderItem}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginHorizontal: 17,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
    marginBottom: 10,
  },
  headingview: {
    marginHorizontal: 17,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
    marginBottom: 10,
  },
  nothing: {
    color: "#64748B",
    fontSize: 15,
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  desc: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  sub: {
    fontSize: 12,
    color: "#64748B",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
})
