import React, { useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setLoading(true);
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
        const json = await response.json();

        if (json.status === 1) {
          const product = json.product;

          // Navigate to ManualEntryScreen with pre-filled data
          navigation.navigate("ManualEntry", {
            name: product.product_name || "",
            description: product.ingredients_text_en || product.ingredients_text || "",
            quantity: product.quantity || "1",
            price: product.nutriments?.price || "", // or set a default/fixed price
            availability: "Yes", // defaulting to available
          });
        } else {
          Alert.alert("Product not found", `No data found for code: ${data}`);
          setScanned(false);
        }
      } catch (error) {
        console.error("API error:", error);
        Alert.alert("Error", "Failed to fetch product info.");
        setScanned(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text>Fetching product info...</Text>
        </View>
      ) : (
        <CameraView
          style={{ flex: 1 }}
          facing={cameraType}
          onBarcodeScanned={handleBarcodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"],
          }}
        >
          <View style={styles.cameraContent}>
            <Text style={styles.text}>Scan a QR/Barcode</Text>
            <Button title="Flip Camera" onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))} />
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { fontSize: 16, marginBottom: 10 },
  cameraContent: { flex: 1, justifyContent: "flex-end", alignItems: "center", marginBottom: 30 },
  text: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
