import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, PageHeader } from "@/components/ui/premium";

const reports = ["CBC Test", "Blood Sugar", "X-Ray", "MRI"];

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.dark} /></TouchableOpacity>
        <PageHeader title="Reports" subtitle="Download reports and review your test history." />
        {reports.map((report, index) => (
          <TouchableOpacity key={report} style={styles.card} activeOpacity={0.86}>
            <View style={styles.pdf}><Text style={styles.pdfText}>PDF</Text></View>
            <View style={styles.info}>
              <Text style={styles.title}>{report}</Text>
              <Text style={styles.meta}>{index + 2} Sep 2026  -  Ready</Text>
            </View>
            <Ionicons name="download-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        ))}
        <View style={styles.history}>
          <Text style={styles.historyTitle}>Test History</Text>
          <Text style={styles.historyText}>12 reports stored securely. Share with doctors during consultation.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 34 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white, marginBottom: 18 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 24, padding: 16, marginBottom: 14 },
  pdf: { width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.background },
  pdfText: { color: colors.primary, fontSize: 13, fontWeight: "900" },
  info: { flex: 1, marginLeft: 14 },
  title: { color: colors.dark, fontSize: 17, fontWeight: "900" },
  meta: { color: colors.grey, fontSize: 13, fontWeight: "700", marginTop: 4 },
  history: { backgroundColor: colors.white, borderRadius: 24, padding: 18, marginTop: 8 },
  historyTitle: { color: colors.dark, fontSize: 20, fontWeight: "900" },
  historyText: { color: colors.grey, fontSize: 14, fontWeight: "700", lineHeight: 21, marginTop: 6 },
});
