import React, { createContext, useContext, useEffect, useState } from "react";
import database from "@react-native-firebase/database";

export const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export default function ExpenseProvider({ children, user }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------
  // 🔥 Load real-time data
  // -----------------------
  useEffect(() => {
    if (!user?.uid) {
      setExpenses([]);
      return;
    }

    const ref = database().ref(`users/${user.uid}/expenses`);

    const listener = ref.on("value", (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.keys(data).map((id) => ({ id, ...data[id] }));

      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setExpenses(arr);
      setLoading(false);
    });

    return () => ref.off("value", listener);
  }, [user?.uid]);


  // -----------------------
  // 🔥 Auto derived values
  // -----------------------
  const persons = React.useMemo(() => {
    const map = new Map();

    expenses.forEach((exp) => {
      const name = exp.personName;
      if (!map.has(name)) {
        map.set(name, {
          name,
          gave: 0,
          received: 0,
          lastTransaction: exp.createdAt,
        });
      }
      const person = map.get(name);

      if (exp.type === "gave") person.gave += exp.amount;
      else person.received += exp.amount;
    });

    return Array.from(map.values()).map((p) => ({
      ...p,
      balance: p.gave - p.received,
    }));
  }, [expenses]);

  const totalBalance = React.useMemo(() => {
    let owed = 0; // Others owe you
    let owes = 0; // You owe others

    persons.forEach((p) => {
      if (p.balance > 0) owed += p.balance;
      else owes += Math.abs(p.balance);
    });

    return {
      owed,
      owes,
      net: owed - owes,
    };
  }, [persons]);

  const recentActivity = React.useMemo(() => {
    return expenses.slice(0, 10).map((exp) => ({
      id: exp.id,
      description:
        exp.description ||
        (exp.type === "gave"
          ? `Gave to ${exp.personName}`
          : `Received from ${exp.personName}`),
      group: exp.personName,
      amount: exp.type === "gave" ? -exp.amount : exp.amount,
      createdAt: exp.createdAt,
    }));
  }, [expenses]);


  // -----------------------
  // 🔥 Write operations
  // -----------------------
  const addExpense = async (expense) => {
    const id = database().ref().push().key;

    const data = {
      id,
      ...expense,
      createdAt: new Date().toISOString(),
    };

    await database()
      .ref(`users/${user.uid}/expenses/${id}`)
      .set(data);

    return data;  // 🔥 RETURN THE DATA SO REMINDER CAN USE IT
  };


  const updateExpense = async (id, data) => {
    await database()
      .ref(`users/${user.uid}/expenses/${id}`)
      .update(data);
  };

  const deleteExpense = async (id) => {
    await database()
      .ref(`users/${user.uid}/expenses/${id}`)
      .remove();
  };


  return (
    <ExpenseContext.Provider
      value={{
        loading,
        expenses,
        persons,
        totalBalance,
        recentActivity,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
