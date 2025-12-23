import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useExpenses } from "../context/ExpenseContext";

export default function RecentActivityScreen({ navigation }) {
    const { recentActivity } = useExpenses();
    const [isEditing, setIsEditing] = useState(false)
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const dateFromPicker = () => {
        setShowFromPicker(true)
        setIsEditing(true)
    }
    const dateToPicker = () => {
        setShowToPicker(true)
        setIsEditing(true)
    }
    const closeButton=()=>{
        setShowFromPicker(false)
        setShowToPicker(false)
    }
    // -------------------------------
    // 🔍 Filter Logic (search + date)
    // -------------------------------
    const filtered = useMemo(() => {
        return recentActivity.filter((item) => {
            const text = search.toLowerCase();

            const matchSearch =
                item.description.toLowerCase().includes(text) ||
                item.group.toLowerCase().includes(text) ||
                String(item.amount).includes(text);

            const created = new Date(item.createdAt);

            const afterFrom = fromDate ? created >= fromDate : true;
            const beforeTo = toDate ? created <= toDate : true;

            return matchSearch && afterFrom && beforeTo;
        });
    }, [search, fromDate, toDate, recentActivity]);

    // -------------------------------
    // 🔹 Render Activity Item
    // -------------------------------
    const renderItem = ({ item }) => {
        const isGiven = item.amount < 0;

        return (
            <View style={styles.item}>
                <View>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.date}>
                        {new Date(item.createdAt).toDateString()}
                    </Text>
                </View>

                <Text style={[styles.amount, { color: isGiven ? "#ef4444" : "#22c55e" }]}>
                    {isGiven ? `-₹${Math.abs(item.amount)}` : `+₹${item.amount}`}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recent Activity</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* Search */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#64748B" />
                <TextInput
                    placeholder="Search activity..."
                    placeholderTextColor={"black"}
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Date Filters */}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={dateFromPicker}
                >
                    <Ionicons name="calendar" size={20} color="#0F172A" />
                    <Text style={styles.dateBtnText}>
                        {fromDate ? fromDate.toDateString() : "From"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={dateToPicker}
                >
                    <Ionicons name="calendar" size={20} color="#0F172A" />
                    <Text style={styles.dateBtnText}>
                        {toDate ? toDate.toDateString() : "To"}
                    </Text>
                </TouchableOpacity>
                {isEditing ?
                    <TouchableOpacity onPress={closeButton}>
                        <Ionicons
                            name="close-circle"
                            size={30}
                            color={"#000"}
                        />
                    </TouchableOpacity> : null}
            </View>

            {/* Pickers */}
            {showFromPicker && (
                <DateTimePicker
                    value={fromDate || new Date()}
                    mode="date"
                    onChange={(e, date) => {
                        setShowFromPicker(false);
                        if (date) setFromDate(date);
                    }}
                />
            )}

            {showToPicker && (
                <DateTimePicker
                    value={toDate || new Date()}
                    mode="date"
                    onChange={(e, date) => {
                        setShowToPicker(false);
                        if (date) setToDate(date);
                    }}
                />
            )}

            {/* Activity List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.empty}>No activity found</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 15,
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#0F172A",
    },

    searchBox: {
        backgroundColor: "#F1F5F9",
        marginHorizontal: 16,
        paddingHorizontal: 15,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    searchInput: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
    },

    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginBottom: 14,
        alignItems:"center"
    },
    dateBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        maxWidth: "45%",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    dateBtnText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#0F172A",
    },

    item: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 2,
    },
    description: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172A",
    },
    date: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 3,
    },
    amount: {
        fontSize: 17,
        fontWeight: "700",
    },

    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#94A3B8",
    },
});
