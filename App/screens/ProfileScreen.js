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
import { AuthContext } from "../context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from "../components/Loader";
import { useNavigation } from "@react-navigation/native";
import RNFS from "react-native-fs";
import database from "@react-native-firebase/database";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const navigation = useNavigation()
  useEffect(() => {
    const loadImage = async () => {
      const snap = await database()
        .ref(`users/${user.uid}/profileImagePath`)
        .once("value");

      const storedPath = snap.val();

      if (storedPath) {
        const actualPath = storedPath.replace("file://", "");

        const exists = await RNFS.exists(actualPath);
        if (exists) {
          setPhoto(storedPath);
          return;
        }
      }

      // fallback → Google auth image
      setPhoto(user.photoURL);
    };

    loadImage();
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Background decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: photo }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{user?.displayName || "User"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Account Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="person-outline" size={22} color="#0F172A" />
            <Text style={styles.optionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            <Text style={styles.optionText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={22} color="#0F172A" />
            <Text style={styles.optionText}>About MoneyMates</Text>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={22} color="#0F172A" />
            <Text style={styles.optionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },

  // Background decorative shapes
  blobTopRight: {
    position: "absolute",
    top: 0,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: "#F0F4FF",
    opacity: 0.7,
    zIndex: -1,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: 40,
    left: -100,
    width: 230,
    height: 230,
    borderRadius: 120,
    backgroundColor: "#F5F7FA",
    opacity: 0.8,
    zIndex: -1,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
    marginBottom: 20,
  },

  // Profile Card
  profileCard: {
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 25,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  email: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },

  // Section
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
    marginLeft: 12,
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
