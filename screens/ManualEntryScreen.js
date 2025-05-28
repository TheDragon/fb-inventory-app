import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ManualEntryScreen({ navigation }) {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("Yes");

  useEffect(() => {
    const randomId = `PRD-${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    setProductId(randomId);
  }, []);

  const handleNext = () => {
    if (!productId || !name || !price || !quantity) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    navigation.navigate("Review", {
      entryType: "manual",
      productId,
      name,
      price,
      quantity,
      description,
      availability,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Product ID (auto-generated)*</Text>
      <TextInput style={[styles.input, styles.readOnly]} value={productId} editable={false} />

      <Text style={styles.label}>Product Name*</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Red Mug" />

      <Text style={styles.label}>Price (Nu)*</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="e.g. 120" />

      <Text style={styles.label}>Quantity*</Text>
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="e.g. 5" />

      <Text style={styles.label}>Availability*</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={availability} onValueChange={(itemValue) => setAvailability(itemValue)} style={styles.picker}>
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline placeholder="Short description..." />

      <View style={{ marginTop: 20 }}>
        <Button title="Next" onPress={handleNext} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: "bold", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  readOnly: {
    backgroundColor: "#f4f4f4",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
