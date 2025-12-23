import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Ant from "react-native-vector-icons/AntDesign"

export function BalanceCard({ balance }) {
  // Positive => user is owed, negative => user owes
  const color = balance.net > 0 ? "#22C55E" : balance.net < 0 ? "#EF4444" : "#64748B"
  
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Your Net Balance</Text>
      <Text style={[styles.amount, { color }]}>
        ₹{Math.abs(balance.net).toFixed(2)}
      </Text>
      <View style={styles.row}>
        <View style={styles.chipGreen}>
          <Ant name="arrowdown" size={14} color="#22C55E" />
          <Text style={styles.chipText}>Owed: ₹{balance.owed.toFixed(2)}</Text>
        </View>
        <View style={styles.chipRed}>
          <Ant name="arrowup" size={14} color="#EF4444" />
          <Text style={styles.chipText}>Owe: ₹{balance.owes.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F7FA",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 14,
    marginBottom: 26,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 1, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 6,
  },
  amount: {
    fontSize: 30,
    fontWeight: "800",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },
  chipGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    gap: 6,
  },
  chipRed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 8,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
  },
})
