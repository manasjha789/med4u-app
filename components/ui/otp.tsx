import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Otp() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="shield-checkmark" size={54} color="#2563EB" />
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>OTP verification screen loaded successfully.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4FF",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    color: "#64748B",
    textAlign: "center",
    fontSize: 15,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
