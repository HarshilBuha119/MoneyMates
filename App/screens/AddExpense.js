import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Ant from "react-native-vector-icons/AntDesign"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useExpenses } from "../context/ExpenseContext"
import useMoneyReminder from "../hooks/useMoneyReminder";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

export default function AddExpenseScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const personName = route.params?.personName || "" // Get person name if editing existing
  const userId = auth().currentUser.uid;
  const { scheduleReminder } = useMoneyReminder(userId);
  const { addExpense } = useExpenses()

  const [name, setName] = useState(personName)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [expenseType, setExpenseType] = useState("gave") // "gave" or "received"
  const handleSubmit = async () => {
    if (!name.trim() || !amount) {
      alert("Please fill in name and amount")
      return
    }

    const expenseData = {
      personName: name.trim(),
      description: description.trim(),
      amount: parseFloat(amount),
      date: date.toISOString(),
      type: expenseType,
    }

    // Save to Firebase
    const newExpense = await addExpense(expenseData);

    // Schedule Notification
    scheduleReminder({
      id: newExpense.id,
      name: newExpense.personName,
      amount: newExpense.amount,
      dateGiven: newExpense.date,   // previous date field
      dueAfterDays: 10,             // 10-day reminder
      type: newExpense.type === "gave" ? "you-gave" : "you-received",
    });

    // Navigation
    if (personName) {
      navigation.goBack()
    } else {
      navigation.navigate("Tabs")
    }
  }


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
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Person Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Person Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Musk"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94A3B8"
            editable={!personName} // Disable if editing existing person
          />
        </View>

        {/* Expense Type - I gave him / He gave me */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Transaction Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.typeOptions}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                expenseType === "gave" && styles.typeOptionActive,
              ]}
              onPress={() => setExpenseType("gave")}
              activeOpacity={0.7}
            >
              <View style={styles.typeIconContainer}>
                <Ant
                  name="arrowup"
                  size={20}
                  color={expenseType === "gave" ? "#EF4444" : "#64748B"}
                />
              </View>
              <Text
                style={[
                  styles.typeOptionText,
                  expenseType === "gave" && styles.typeOptionTextActive,
                ]}
              >
                I gave him
              </Text>
              <Text style={styles.typeSubtext}>You lent money</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                expenseType === "received" && styles.typeOptionActive,
              ]}
              onPress={() => setExpenseType("received")}
              activeOpacity={0.7}
            >
              <View style={styles.typeIconContainer}>
                <Ant
                  name="arrowdown"
                  size={20}
                  color={expenseType === "received" ? "#22C55E" : "#64748B"}
                />
              </View>
              <Text
                style={[
                  styles.typeOptionText,
                  expenseType === "received" && styles.typeOptionTextActive,
                ]}
              >
                He gave me
              </Text>
              <Text style={styles.typeSubtext}>You received money</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Amount <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Ant name="calendar" size={18} color="#64748B" />
            <Text style={styles.dateText}>
              {date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false)
                if (selectedDate) setDate(selectedDate)
              }}
            />
          )}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes or details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#94A3B8"
          />
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitBtnText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: "600",
    color: "#0F172A",
  },
  typeOptions: {
    flexDirection: "row",
    gap: 12,
  },
  typeOption: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  typeOptionActive: {
    borderColor: "#000",
    backgroundColor: "#bfc4c1ff",
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  typeOptionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },
  typeOptionTextActive: {
    color: "#0F172A",
  },
  typeSubtext: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  submitBtn: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
})
