import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Header } from "@/components/Header";
import { PressScale } from "@/components/PressScale";
import { SectionTitle } from "@/components/SectionTitle";
import { DoctorCard } from "@/components/DoctorCard";
import { useApp } from "@/context/AppContext";
import { colors } from "@/components/ui/premium";

const doctor =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=260&q=80";

const banners = [
  ["Consult top doctors in 15 mins", "Private video calls with verified specialists.", "videocam"],
  ["Flat 20% on medicines", "Genuine products, pharmacist verified.", "pricetag"],
  ["Free home sample pickup", "Book trusted lab tests from home.", "flask"],
] as const;

const quickActions = [
  ["Consult Now", "medical"],
  ["Order Medicine", "medkit"],
  ["Book Test", "flask"],
  ["Emergency", "alert-circle"],
] as const;

const categories = [
  ["General", "medical-outline"],
  ["Cardio", "heart-outline"],
  ["Dental", "happy-outline"],
  ["Skin", "sparkles-outline"],
  ["Neuro", "git-network-outline"],
  ["Child", "accessibility-outline"],
  ["Bones", "body-outline"],
  ["Lungs", "leaf-outline"],
] as const;

export default function HomeScreen() {
  const { displayName } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 650);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <Header
          title={`Hello, ${displayName}!`}
          subtitle="How are you feeling today?"
          onBellPress={() => router.push("/notifications")}
          onAvatarPress={() => router.push("/(tabs)/profileTab" as never)}
        />

        <PressScale style={styles.search} onPress={() => router.push("/search")}>
          <Ionicons name="search-outline" size={21} color="#94A3B8" />
          <TextInput
            editable={false}
            placeholder="Search doctors, medicines, clinics"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </PressScale>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionRow}>
          {quickActions.map(([label, icon]) => (
            <PressScale
              key={label}
              style={styles.quickPill}
              onPress={() => {
                if (label === "Order Medicine") router.push("/(tabs)/medicine");
                else if (label === "Book Test") router.push("/reports");
                else if (label === "Emergency") router.push("/videoCall");
                else router.push("/bookDoctor");
              }}
            >
              <Ionicons name={icon} size={18} color={colors.primary} />
              <Text style={styles.quickText}>{label}</Text>
            </PressScale>
          ))}
        </ScrollView>

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bannerRow}>
          {banners.map(([title, text, icon], index) => (
            <LinearGradient
              key={title}
              colors={index === 1 ? ["#0F172A", "#2563EB"] : ["#2563EB", "#60A5FA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroCopy}>
                <Text style={styles.heroTitle}>{title}</Text>
                <Text style={styles.heroText}>{text}</Text>
              </View>
              <View style={styles.heroIcon}>
                <Ionicons name={icon} size={34} color="#FFFFFF" />
              </View>
            </LinearGradient>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {[0, 1, 2].map((dot) => <View key={dot} style={[styles.dot, dot === 0 && styles.activeDot]} />)}
        </View>

        <SectionTitle title="Explore care" />
        <View style={styles.categoryGrid}>
          {categories.map(([label, icon]) => (
            <PressScale
              key={label}
              style={styles.category}
              onPress={() => router.push({ pathname: "/bookDoctor", params: { specialization: label } })}
            >
              <View style={styles.categoryCircle}>
                <Ionicons name={icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryText}>{label}</Text>
            </PressScale>
          ))}
        </View>

        <SectionTitle title="Upcoming appointment" action="View all" onPress={() => router.push("/bookDoctor")} />
        <LinearGradient colors={["rgba(37,99,235,0.96)", "#60A5FA"]} style={styles.appointment}>
          <View style={styles.appointmentTop}>
            <Image source={{ uri: doctor }} style={styles.appointmentImage} />
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentName}>Dr Abhi</Text>
              <Text style={styles.appointmentRole}>Orthopedic Specialist</Text>
              <Text style={styles.appointmentTime}>Today • 10:30 AM</Text>
            </View>
          </View>
          <View style={styles.appointmentActions}>
            <PressScale style={styles.joinButton} onPress={() => router.push("/videoCall")}>
              <Ionicons name="videocam" size={17} color={colors.primary} />
              <Text style={styles.joinText}>Join Call</Text>
            </PressScale>
            <PressScale style={styles.rescheduleButton} onPress={() => router.push("/doctorSlots")}>
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </PressScale>
          </View>
        </LinearGradient>

        <SectionTitle title="Recent doctors" action="See all" onPress={() => router.push("/bookDoctor")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DoctorCard name="Dr. Sarah Jenkins" specialty="Cardiologist" onPress={() => router.push("/doctorDetails" as never)} />
          <DoctorCard name="Dr. Neha Rao" specialty="Dermatologist" onPress={() => router.push("/doctorDetails" as never)} />
        </ScrollView>

        <SectionTitle title="Daily health nudges" />
        <View style={styles.tips}>
          {[
            ["Water reminder", "Drink 2 glasses before lunch", "water-outline"],
            ["Sleep reminder", "Wind down by 10:30 PM", "moon-outline"],
            ["Daily steps", "2,400 steps left today", "walk-outline"],
          ].map(([title, text, icon]) => (
            <View key={title} style={styles.tip}>
              <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={colors.primary} />
              <View style={styles.tipTextWrap}>
                <Text style={styles.tipTitle}>{title}</Text>
                <Text style={styles.tipText}>{text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 124 },
  search: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#D9E4F4",
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  searchInput: { flex: 1, marginLeft: 10, color: colors.dark, fontSize: 15, fontWeight: "700" },
  actionRow: { gap: 10, paddingTop: 16, paddingBottom: 4 },
  quickPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  quickText: { color: colors.dark, fontSize: 13, fontWeight: "900" },
  bannerRow: { gap: 14, paddingTop: 16 },
  heroCard: { width: 318, minHeight: 154, borderRadius: 30, padding: 22, flexDirection: "row", alignItems: "center" },
  heroCopy: { flex: 1, paddingRight: 12 },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: "900", lineHeight: 30 },
  heroText: { color: "#DBEAFE", fontSize: 14, fontWeight: "700", lineHeight: 20, marginTop: 8 },
  heroIcon: { width: 62, height: 62, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "rgba(255,255,255,0.18)" },
  dots: { flexDirection: "row", gap: 6, justifyContent: "center", marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#B8C7DD" },
  activeDot: { width: 18, backgroundColor: colors.primary },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: 16 },
  category: { width: "25%", alignItems: "center" },
  categoryCircle: { width: 62, height: 62, alignItems: "center", justifyContent: "center", borderRadius: 31, backgroundColor: colors.white },
  categoryText: { color: colors.dark, fontSize: 12, fontWeight: "900", marginTop: 8 },
  appointment: { borderRadius: 30, padding: 20, shadowColor: colors.primary, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.22, shadowRadius: 24, elevation: 8 },
  appointmentTop: { flexDirection: "row", alignItems: "center" },
  appointmentImage: { width: 74, height: 74, borderRadius: 24, borderWidth: 3, borderColor: "rgba(255,255,255,0.45)" },
  appointmentInfo: { flex: 1, marginLeft: 15 },
  appointmentName: { color: colors.white, fontSize: 21, fontWeight: "900" },
  appointmentRole: { color: "#DBEAFE", fontSize: 14, fontWeight: "700", marginTop: 4 },
  appointmentTime: { color: colors.white, fontSize: 14, fontWeight: "900", marginTop: 10 },
  appointmentActions: { flexDirection: "row", gap: 10, marginTop: 18 },
  joinButton: { flex: 1, height: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: 17, backgroundColor: colors.white },
  joinText: { color: colors.primary, fontSize: 14, fontWeight: "900" },
  rescheduleButton: { flex: 1, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: "rgba(255,255,255,0.18)", borderWidth: 1, borderColor: "rgba(255,255,255,0.34)" },
  rescheduleText: { color: colors.white, fontSize: 14, fontWeight: "900" },
  tips: { gap: 12 },
  tip: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 22, padding: 16 },
  tipTextWrap: { marginLeft: 13, flex: 1 },
  tipTitle: { color: colors.dark, fontSize: 15, fontWeight: "900" },
  tipText: { color: colors.grey, fontSize: 13, fontWeight: "700", marginTop: 4 },
});
