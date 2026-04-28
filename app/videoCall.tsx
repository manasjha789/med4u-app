import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/components/ui/premium";

const image = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80";

export default function VideoCallScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.video}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.livePill}><Text style={styles.liveText}>LIVE  18:42</Text></View>
          <View style={styles.patient}><Ionicons name="person" size={32} color={colors.primary} /></View>
          <View style={styles.doctorInfo}>
            <Text style={styles.name}>Dr. Abhi</Text>
            <Text style={styles.meta}>Orthopedic Consultation</Text>
          </View>
        </View>
        <View style={styles.controls}>
          {["mic-outline", "videocam-outline", "volume-high-outline"].map((icon) => (
            <TouchableOpacity key={icon} style={styles.control}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.dark} /></TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.end} onPress={() => router.replace("/(tabs)/homeScreen")}><Ionicons name="call" size={26} color={colors.white} /></TouchableOpacity>
        </View>
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Consultation Notes</Text>
          {["Symptoms: knee pain while walking", "Prescription: anti-inflammatory gel", "Recommended tests: X-Ray knee AP/Lateral"].map((item) => (
            <Text key={item} style={styles.note}>{item}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 42, paddingBottom: 34 },
  video: { height: 520, overflow: "hidden", borderRadius: 34, backgroundColor: colors.white },
  image: { width: "100%", height: "100%" },
  livePill: { position: "absolute", top: 18, left: 18, backgroundColor: colors.danger, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7 },
  liveText: { color: colors.white, fontSize: 12, fontWeight: "900" },
  patient: { position: "absolute", right: 18, top: 18, width: 96, height: 124, alignItems: "center", justifyContent: "center", borderRadius: 26, backgroundColor: colors.white },
  doctorInfo: { position: "absolute", left: 18, right: 18, bottom: 18, backgroundColor: "rgba(15,23,42,0.62)", borderRadius: 22, padding: 16 },
  name: { color: colors.white, fontSize: 23, fontWeight: "900" },
  meta: { color: "#DBEAFE", fontSize: 14, fontWeight: "700", marginTop: 4 },
  controls: { flexDirection: "row", justifyContent: "center", gap: 13, marginVertical: 20 },
  control: { width: 58, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: colors.white },
  end: { width: 62, height: 62, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: colors.danger, transform: [{ rotate: "135deg" }] },
  notes: { backgroundColor: colors.white, borderRadius: 26, padding: 18 },
  notesTitle: { color: colors.dark, fontSize: 20, fontWeight: "900", marginBottom: 12 },
  note: { color: colors.grey, fontSize: 14, fontWeight: "700", lineHeight: 22, marginBottom: 8 },
});
