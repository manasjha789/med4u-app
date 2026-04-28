import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, PrimaryButton } from "@/components/ui/premium";

const steps = ["Order accepted", "Packed", "Out for delivery", "Delivered"];

export default function OrderTrackingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.dark} /></TouchableOpacity>
        <Text style={styles.title}>Order Tracking</Text>
        <Text style={styles.subtitle}>Your medicines are moving fast.</Text>
        <View style={styles.timeline}>
          {steps.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={[styles.dot, index < 3 && styles.activeDot]}><Ionicons name="checkmark" size={16} color={colors.white} /></View>
              <View style={styles.stepText}><Text style={styles.stepTitle}>{step}</Text><Text style={styles.stepMeta}>{index < 3 ? "Completed" : "Expected soon"}</Text></View>
            </View>
          ))}
        </View>
        <PrimaryButton title="Back to Home" onPress={() => router.replace("/(tabs)/homeScreen")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 42 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white, marginBottom: 18 },
  title: { color: colors.dark, fontSize: 30, fontWeight: "900" },
  subtitle: { color: colors.grey, fontSize: 15, fontWeight: "700", marginTop: 6, marginBottom: 22 },
  timeline: { backgroundColor: colors.white, borderRadius: 28, padding: 20, marginBottom: 22 },
  step: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  dot: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: "#CBD5E1" },
  activeDot: { backgroundColor: colors.success },
  stepText: { marginLeft: 14 },
  stepTitle: { color: colors.dark, fontSize: 17, fontWeight: "900" },
  stepMeta: { color: colors.grey, fontSize: 13, fontWeight: "700", marginTop: 4 },
});
