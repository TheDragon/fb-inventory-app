// screens/HomeScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Inventory Poster</Text>
      <Button title="Scan QR Code" onPress={() => navigation.navigate("QRScanner")} />
      <View style={{ height: 20 }} />
      <Button title="Manual Entry" onPress={() => navigation.navigate("ManualEntry")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 30 },
});
