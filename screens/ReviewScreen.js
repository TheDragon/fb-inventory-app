import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function ReviewScreen({ route, navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const data = route.params;

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Camera permission is required.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
        console.log("Image selected:", result.assets[0].uri);
      } else {
        console.log("Image selection cancelled or failed.");
      }
    } catch (err) {
      console.error("Image picking error:", err);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handlePost = async () => {
    if (!image) {
      Alert.alert("Missing Image", "Please take or choose a photo first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("productId", data.productId);
      formData.append("name", data.name || "N/A");
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("description", data.description || "");
      formData.append("availability", data.availability);


      formData.append("photo", {
        uri: image.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post("http://10.9.91.147:3000/submit-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      if (response.data.success) {
        Alert.alert("✅ Success", "Posted to Facebook and updated Google Sheet.");
        navigation.navigate("Home");
      } else {
        Alert.alert("⚠️ Failed", "Something went wrong. Try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("POST ERROR:", error.response?.data || error.message);
      Alert.alert("❌ Upload failed", error.message || "Unknown error.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Product</Text>
      <Text>Product ID: {data.productId}</Text>
      {data.name && <Text>Name: {data.name}</Text>}
      <Text>Price: Nu {data.price}</Text>
      <Text>Quantity: {data.quantity}</Text>
      <Text>Availability: {data.availability}</Text>

      {data.description ? <Text>Description: {data.description}</Text> : null}

      <View style={styles.imageBox}>{image ? <Image source={{ uri: image.uri }} style={styles.image} /> : <Button title="Take/Choose Photo" onPress={pickImage} />}</View>

      {loading ? <ActivityIndicator size="large" color="blue" /> : <Button title="Post to Facebook & Google Sheet" onPress={handlePost} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  imageBox: { marginVertical: 20, alignItems: "center" },
  image: { width: 200, height: 200, borderRadius: 10 },
});
