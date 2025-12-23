import { useCallback } from "react";
import database from "@react-native-firebase/database";
import notifee, { TriggerType } from "@notifee/react-native";

export default function useMoneyReminder(userId) {

  // Create a reminder
  const scheduleReminder = useCallback(async (transaction) => {
    const id = transaction.id;
    const { name, amount, dateGiven, dueAfterDays, type } = transaction;

    const triggerDate = new Date(dateGiven);
    triggerDate.setDate(triggerDate.getDate() + dueAfterDays);

    // allow ANY date picked by user, even past → adjust automatically
    const now = new Date();
    if (triggerDate <= now) {
      triggerDate.setSeconds(now.getSeconds() + 10); 
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
    };

    const body =
      type === "you-gave"
        ? `${name} has not paid you back ₹${amount} yet.`
        : `You still owe ₹${amount} to ${name}.`;

    const notificationId = await notifee.createTriggerNotification(
      {
        title: "Money Reminder",
        body,
        android: {
          channelId: "money-reminders",
          pressAction: { id: "default" },
        },
      },
      trigger
    );

    // 🔥 FIXED PATH (inside users/)
    await database()
      .ref(`users/${userId}/reminders/${id}`)
      .set({
        ...transaction,
        notificationId,
      });

    return notificationId;
  }, [userId]);


  // Cancel reminder
  const cancelReminder = useCallback(async (transactionId) => {
    const ref = database().ref(`users/${userId}/reminders/${transactionId}`);

    const snapshot = await ref.once("value");

    if (snapshot.exists()) {
      const { notificationId } = snapshot.val();
      if (notificationId) {
        await notifee.cancelNotification(notificationId);
      }
      await ref.remove();
    }
  }, [userId]);


  // Update reminder
  const updateReminder = useCallback(async (transaction) => {
    await cancelReminder(transaction.id);
    await scheduleReminder(transaction);
  }, [cancelReminder, scheduleReminder]);


  return {
    scheduleReminder,
    cancelReminder,
    updateReminder,
  };
}
