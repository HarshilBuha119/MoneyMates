import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ant from "react-native-vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useExpenses } from "../context/ExpenseContext";

export default function PersonExpensesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { personName } = route.params || {};

  // ⬅ Get full expense list from Firebase via provider
  const { expenses } = useExpenses();

  const [personExpenses, setPersonExpenses] = useState([]);
  const [totalGave, setTotalGave] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const loadExpenses = () => {
    if (!expenses || expenses.length === 0) return;

    const filtered = expenses.filter(
      (exp) => exp.personName.toLowerCase() === personName.toLowerCase()
    );

    let gave = 0;
    let received = 0;

    filtered.forEach((exp) => {
      if (exp.type === "gave") gave += exp.amount;
      else received += exp.amount;
    });

    setPersonExpenses(filtered);
    setTotalGave(gave);
    setTotalReceived(received);
    setNetBalance(gave - received);
  };

  // Load on screen focus and when expenses change
  useEffect(() => {
    loadExpenses();
  }, [expenses, personName]);

  const renderExpenseItem = ({ item }) => {
    const isGave = item.type === "gave";
    const expenseDate = new Date(item.date);

    return (
      <View style={styles.expenseCard}>
        <View
          style={[
            styles.typeIndicator,
            { backgroundColor: isGave ? "#FEE2E2" : "#DCFCE7" },
          ]}
        >
          <Ant
            name={isGave ? "arrowup" : "arrowdown"}
            size={16}
            color={isGave ? "#EF4444" : "#22C55E"}
          />
        </View>

        <View style={styles.expenseContent}>
          <View style={styles.expenseHeader}>
            <Text style={styles.expenseType}>
              {isGave ? "You gave" : "You received"}
            </Text>
            <Text
              style={[
                styles.expenseAmount,
                { color: isGave ? "#EF4444" : "#22C55E" },
              ]}
            >
              {isGave ? "-" : "+"}₹{item.amount.toFixed(2)}
            </Text>
          </View>

          <Text style={styles.expenseDate}>
            {expenseDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>

          {item.description ? (
            <Text style={styles.expenseDescription}>{item.description}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ant name="arrowleft" size={24} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{personName}</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddExpense", { personName })}
          style={styles.addBtn}
          activeOpacity={0.7}
        >
          <Ant name="plus" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Balance Summary */}
      <View style={styles.balanceSummary}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Net Balance</Text>
          <Text
            style={[
              styles.balanceAmount,
              {
                color:
                  netBalance > 0
                    ? "#22C55E"
                    : netBalance < 0
                    ? "#EF4444"
                    : "#64748B",
              },
            ]}
          >
            ₹{Math.abs(netBalance).toFixed(2)}
          </Text>
          <Text style={styles.balanceSubtext}>
            {netBalance > 0
              ? `${personName} owes you`
              : netBalance < 0
              ? `You owe ${personName}`
              : "Settled up"}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ant name="arrowup" size={18} color="#EF4444" />
            <Text style={styles.statAmount}>₹{totalGave.toFixed(2)}</Text>
            <Text style={styles.statLabel}>You gave</Text>
          </View>

          <View style={styles.statBox}>
            <Ant name="arrowdown" size={18} color="#22C55E" />
            <Text style={styles.statAmount}>₹{totalReceived.toFixed(2)}</Text>
            <Text style={styles.statLabel}>You received</Text>
          </View>
        </View>
      </View>

      {/* Expense List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>All Transactions</Text>
        <Text style={styles.listCount}>{personExpenses.length} total</Text>
      </View>

      <FlatList
        data={personExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ant name="inbox" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>
              Tap + to add your first expense
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", position: "relative" },
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  addBtn: {
    padding: 8,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
  },
  balanceSummary: { padding: 20 },
  balanceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  balanceLabel: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  balanceAmount: { fontSize: 36, fontWeight: "800", marginVertical: 4 },
  balanceSubtext: { fontSize: 14, color: "#64748B" },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statAmount: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  statLabel: { fontSize: 12, color: "#64748B" },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  listCount: { fontSize: 14, color: "#64748B" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  expenseCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseContent: { flex: 1 },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  expenseType: { fontSize: 16, fontWeight: "600", color: "#0F172A" },
  expenseAmount: { fontSize: 18, fontWeight: "700" },
  expenseDate: { fontSize: 13, color: "#64748B", marginBottom: 6 },
  expenseDescription: { fontSize: 14, color: "#64748B" },
  emptyContainer: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#64748B" },
  emptySubtext: { fontSize: 14, color: "#94A3B8" },
});
