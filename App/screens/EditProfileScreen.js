import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { launchImageLibrary } from "react-native-image-picker";
import Loader from "../components/Loader";
import RNFS from "react-native-fs";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

export default function EditProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL);
  const [loading, setLoading] = useState(false);

  // 🚀 Select Image → Copy to Permanent App Folder
  const selectImage = () => {
    launchImageLibrary({ mediaType: "photo" }, async (res) => {
      if (res.didCancel) return;
      if (res.errorMessage) return alert(res.errorMessage);

      const asset = res.assets[0];
      const pickedUri = asset.uri; // ALWAYS works

      // Get extension (jpg / png / webp)
      const ext = pickedUri.split(".").pop() || "jpg";

      // Create your own permanent path
      const newPath = `${RNFS.ExternalDirectoryPath}/profile.${ext}`;

      try {
        await RNFS.copyFile(pickedUri, newPath);
        const finalUri = "file://" + newPath;
        setPhoto(finalUri);
      } catch (err) {
        Alert.alert("Error", "Saving image failed: " + err.message);
      }
    });
  };

  // Save Profile
  const saveProfile = async () => {
    if (!name.trim()) {
      return Alert.alert("Validation", "Name cannot be empty!");
    }

    setLoading(true);
    try {
      // Update Firebase Auth
      await auth().currentUser.updateProfile({
        displayName: name,
        photoURL: photo,
      });

      // Save permanent path in DB
      await database()
        .ref(`users/${user.uid}/profileImagePath`)
        .set(photo);

      Alert.alert("Success", "Profile updated!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Image */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: photo }} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraBtn} onPress={selectImage}>
          <Ionicons name="camera" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#F1F5F9" }]}
          value={user?.email}
          editable={false}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  backBtn: {
    padding: 6,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 20,
  },

  inputGroup: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0F172A",
  },

  saveBtn: {
    backgroundColor: "#000",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
