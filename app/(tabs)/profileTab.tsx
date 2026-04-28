import { router } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, PrimaryButton, SectionHeader, ServiceCard } from "@/components/ui/premium";
import { useApp } from "@/context/AppContext";

const avatar =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=220&q=80";

const menu = [
  ["My Appointments", "Upcoming and past visits", "calendar-outline", "/bookDoctor"],
  ["Reports", "Lab reports and scans", "document-text-outline", "/reports"],
  ["Saved Doctors", "Your preferred specialists", "heart-outline", "/bookDoctor"],
  ["Addresses", "Home and work locations", "location-outline", "/profile"],
  ["Payment Methods", "Cards, UPI and wallets", "card-outline", "/search"],
  ["Help Center", "Support and FAQs", "help-circle-outline", "/notifications"],
  ["Settings", "Privacy and app preferences", "settings-outline", "/profile"],
] as const;

export default function ProfileTabScreen() {
  const { profile, displayName, resetProfile } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.phone}>{profile.phone || "Phone not added"}</Text>
            <Text style={styles.blood}>Blood Group {profile.bloodGroup || "not added"}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          {[
            ["Age", profile.age || "--"],
            ["Height", profile.height ? `${profile.height} cm` : "--"],
            ["Weight", profile.weight ? `${profile.weight} kg` : "--"],
          ].map(([label, value]) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Account" />
        <View style={styles.menu}>
          {menu.map(([title, subtitle, icon, route]) => (
            <ServiceCard key={title} title={title} subtitle={subtitle} icon={icon} onPress={() => router.push(route)} />
          ))}
        </View>

        <View style={styles.logoutWrap}>
          <PrimaryButton title="Edit Profile" tone="light" onPress={() => router.push("/profile")} />
          <PrimaryButton
            title="Logout"
            tone="danger"
            onPress={() => {
              resetProfile();
              router.replace("/login");
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 126 },
  profileCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 30, padding: 20 },
  avatar: { width: 86, height: 86, borderRadius: 28 },
  profileText: { flex: 1, marginLeft: 16 },
  name: { color: colors.dark, fontSize: 26, fontWeight: "900" },
  phone: { color: colors.grey, fontSize: 14, fontWeight: "700", marginTop: 5 },
  blood: { color: colors.primary, fontSize: 13, fontWeight: "900", marginTop: 8 },
  stats: { flexDirection: "row", gap: 12, marginTop: 16 },
  statCard: { flex: 1, alignItems: "center", backgroundColor: colors.white, borderRadius: 20, paddingVertical: 16 },
  statValue: { color: colors.dark, fontSize: 17, fontWeight: "900" },
  statLabel: { color: colors.grey, fontSize: 12, fontWeight: "800", marginTop: 5 },
  menu: { gap: 13 },
  logoutWrap: { gap: 12, marginTop: 20 },
});
