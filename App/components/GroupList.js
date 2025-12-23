import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import FA from "react-native-vector-icons/FontAwesome"

export function GroupList({ groups, onGroupPress }) {
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>People</Text>
        {groups.length > 0 && (
          <Text style={styles.count}>{groups.length} {groups.length === 1 ? 'person' : 'people'}</Text>
        )}
      </View>
      {groups.length === 0 ? (
        <Text style={styles.nothing}>No transactions yet. Add your first expense!</Text>
      ) : (
        groups.map((person, index) => {
          const isPositive = person.balance > 0
          const isNegative = person.balance < 0
          const balanceColor = isPositive ? "#22C55E" : isNegative ? "#EF4444" : "#64748B"

          return (
            <TouchableOpacity
              key={index}
              style={styles.groupCard}
              onPress={() => onGroupPress(person.name)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: isPositive ? "#DCFCE7" : isNegative ? "#FEE2E2" : "#F1F5F9" }
              ]}>
                <FA
                  name="user"
                  size={20}
                  color={isPositive ? "#22C55E" : isNegative ? "#EF4444" : "#64748B"}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text style={styles.groupName}>{person.name}</Text>
                <Text style={styles.groupSub}>
                  {isPositive
                    ? `Owes you ₹${Math.abs(person.balance).toFixed(2)}`
                    : isNegative
                      ? `You owe ₹${Math.abs(person.balance).toFixed(2)}`
                      : "Settled up"}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.groupAmount, { color: balanceColor }]}>
                  {isPositive ? "+" : isNegative ? "-" : ""}₹{Math.abs(person.balance).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 18,
    marginBottom: 10,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "#0F172A",
  },
  count: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
  nothing: {
    color: "#64748B",
    fontSize: 15,
    textAlign: "center",
    marginVertical: 25,
  },
  groupCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  groupSub: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  groupAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
})
