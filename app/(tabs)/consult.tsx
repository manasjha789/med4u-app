import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, PageHeader, ServiceCard } from "@/components/ui/premium";

const services = [
  ["Book Consultation", "Find the right specialist", "calendar-outline", "/bookDoctor"],
  ["AI Symptom Checker", "Understand symptoms quickly", "sparkles-outline", "/search"],
  ["Video Visit", "Start an online consult", "videocam-outline", "/videoCall"],
  ["Mental Wellness", "Therapy and stress support", "heart-circle-outline", "/bookDoctor"],
  ["Women Care", "Gynecology and wellness", "female-outline", "/bookDoctor"],
  ["Child Care", "Pediatrics for families", "accessibility-outline", "/bookDoctor"],
  ["Emergency Help", "Urgent medical support", "alert-circle-outline", "/videoCall"],
  ["Second Opinion", "Review your diagnosis", "document-text-outline", "/reports"],
] as const;

export default function ConsultScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title="Consult" subtitle="Care options built around your schedule." />
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroTitle}>Talk to a doctor today</Text>
            <Text style={styles.heroText}>Verified specialists available in 15 minutes.</Text>
          </View>
          <Ionicons name="pulse" size={42} color={colors.white} />
        </View>

        <View style={styles.grid}>
          {services.map(([title, subtitle, icon, route]) => (
            <ServiceCard
              key={title}
              title={title}
              subtitle={subtitle}
              icon={icon}
              onPress={() => router.push(route)}
              style={styles.service}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 126 },
  hero: {
    minHeight: 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  heroTitle: { color: colors.white, fontSize: 23, fontWeight: "900" },
  heroText: { color: "#DBEAFE", fontSize: 14, fontWeight: "700", marginTop: 6, maxWidth: 230 },
  grid: { gap: 14 },
  service: { minHeight: 92 },
});
