import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function QRScannerScreen({ navigation }) {
  const handleNavigationChange = (navState) => {
    const { url } = navState;
    if (url.includes("?result=")) {
      const scannedData = decodeURIComponent(url.split("?result=")[1]);
      navigation.navigate("Review", {
        productId: scannedData,
        entryType: "qr",
      });
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://qrcodescan.in" }} // You can also try https://webqr.com
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
