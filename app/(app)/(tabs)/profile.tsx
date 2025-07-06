import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useSession } from "../../../lib/context";

export default function ProfileScreen() {
  const { session, signOut } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Profile</Text>
        <Text style={styles.subtitleText}>Welcome back!</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.subtitleText}>User Information</Text>
        <Text>Name: {session?.nombre}</Text>
        <Text>Email: {session?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitleText}>Protected Content</Text>
        <Text>
          This is a protected page that only authenticated users can access. You
          can navigate between the Home and Explore tabs, and manage your
          profile here.
        </Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  userInfo: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
