import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { UserAvatar } from "@/components/UserAvatar";
import { useApp } from "@/context/AppContext";
import { colors } from "@/components/ui/premium";

const doctorImage =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=260&q=80";

type IonIconName = keyof typeof Ionicons.glyphMap;
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const quickActions: {
  title: string;
  icon: IonIconName | MaterialIconName;
  iconSet: "ion" | "material";
  color: string;
  route: string;
}[] = [
  { title: "Consult", icon: "stethoscope", iconSet: "material", color: colors.primary, route: "/bookDoctor" },
  { title: "Order", icon: "medical-bag", iconSet: "material", color: colors.primary, route: "/(tabs)/medicine" },
  { title: "Lab", icon: "flask-outline", iconSet: "ion", color: colors.primary, route: "/reports" },
  { title: "Health", icon: "document-text-outline", iconSet: "ion", color: colors.primary, route: "/reports" },
];

const specialists: {
  name: string;
  count: string;
  icon: IonIconName | MaterialIconName;
  iconSet: "ion" | "material";
  color: string;
}[] = [
  { name: "Cardio", count: "45+ Doctors", icon: "heart", iconSet: "ion", color: colors.primary },
  { name: "Neuro", count: "40+ Doctors", icon: "brain", iconSet: "material", color: colors.primary },
  { name: "Dentist", count: "30+ Doctors", icon: "tooth-outline", iconSet: "material", color: colors.primary },
  { name: "Skin", count: "25+ Doctors", icon: "person-outline", iconSet: "ion", color: colors.primary },
];

function SectionHeader({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <PressScale onPress={onPress}>
        <Text style={styles.viewAll}>View all</Text>
      </PressScale>
    </View>
  );
}

function Header({ name, avatarUri }: { name: string; avatarUri?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.greeting} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86}>
          Hello, {name}
        </Text>
        <Text style={styles.morning}>Good Morning</Text>
      </View>

      <View style={styles.headerActions}>
        <PressScale style={styles.headerButton} onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={24} color={colors.dark} />
          <View style={styles.notificationDot} />
        </PressScale>
        <PressScale onPress={() => router.push("/(tabs)/profileTab" as never)}>
          <UserAvatar imageUri={avatarUri} size={56} />
        </PressScale>
      </View>
    </View>
  );
}

function SearchBar() {
  return (
    <PressScale style={styles.searchBar} onPress={() => router.push("/search")}>
      <Ionicons name="search-outline" size={25} color="#7B8797" />
      <TextInput
        editable={false}
        placeholder="Search doctors, meds"
        placeholderTextColor="#7B8797"
        numberOfLines={1}
        style={styles.searchInput}
      />
      <View style={styles.micButton}>
        <Ionicons name="mic-outline" size={22} color={colors.white} />
      </View>
    </PressScale>
  );
}

function QuickActionGrid() {
  return (
    <View style={styles.quickGrid}>
      {quickActions.map((item) => (
        <PressScale key={item.title} style={styles.quickCard} onPress={() => router.push(item.route as never)}>
          {item.iconSet === "material" ? (
            <MaterialCommunityIcons name={item.icon as MaterialIconName} size={24} color={item.color} />
          ) : (
            <Ionicons name={item.icon as IonIconName} size={24} color={item.color} />
          )}
          <Text style={styles.quickText} numberOfLines={1}>
            {item.title}
          </Text>
        </PressScale>
      ))}
    </View>
  );
}

function HeroBanner() {
  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroBanner}
    >
      <View style={styles.videoIconBox}>
        <Ionicons name="videocam" size={24} color={colors.white} />
      </View>
      <View style={styles.heroTextBlock}>
        <Text style={styles.heroTitle} numberOfLines={2}>
          Consult Doctors in 15 mins
        </Text>
        <Text style={styles.heroSubtitle} numberOfLines={1}>
          Verified specialists
        </Text>
      </View>
      <Image source={{ uri: doctorImage }} style={styles.heroDoctor} />
      <PressScale style={styles.bookButton} onPress={() => router.push("/bookDoctor")}>
        <Text style={styles.bookText}>Book Now</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </PressScale>
    </LinearGradient>
  );
}

function NextAppointment() {
  return (
    <PressScale style={styles.appointmentCard} onPress={() => router.push("/doctorDetails" as never)}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTitle} numberOfLines={1}>
          Your Next Appointment
        </Text>
        <View style={styles.timeChip}>
          <Text style={styles.timeChipText}>50 min</Text>
        </View>
      </View>

      <View style={styles.doctorRow}>
        <Image source={{ uri: doctorImage }} style={styles.appointmentDoctor} />
        <View style={styles.doctorRowText}>
          <Text style={styles.doctorName}>Dr. Abhi</Text>
          <Text style={styles.doctorSpeciality}>Orthopedic Specialist</Text>
        </View>
      </View>

      <View style={styles.appointmentMeta}>
        <View style={styles.videoMeta}>
          <Ionicons name="videocam" size={18} color={colors.primary} />
        </View>
        <View style={styles.dateMetaItem}>
          <Ionicons name="calendar-outline" size={18} color={colors.dark} />
          <Text style={styles.metaText} numberOfLines={1}>
            12th January, Monday
          </Text>
        </View>
        <View style={styles.timeMetaItem}>
          <Ionicons name="time-outline" size={18} color={colors.dark} />
          <Text style={styles.metaText} numberOfLines={1}>
            4:00 PM
          </Text>
        </View>
      </View>
    </PressScale>
  );
}

function ExploreSpecialists() {
  return (
    <View style={styles.section}>
      <SectionHeader title="Explore Specialists" onPress={() => router.push("/bookDoctor")} />
      <View style={styles.specialistRow}>
        {specialists.map((item) => (
          <PressScale
            key={item.name}
            style={styles.specialistCard}
            onPress={() =>
              router.push({
                pathname: "/bookDoctor",
            params: { specialization: item.name },
              })
            }
          >
            {item.iconSet === "material" ? (
              <MaterialCommunityIcons name={item.icon as MaterialIconName} size={26} color={item.color} />
            ) : (
              <Ionicons name={item.icon as IonIconName} size={26} color={item.color} />
            )}
            <Text style={styles.specialistName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.specialistCount} numberOfLines={1}>
              {item.count}
            </Text>
          </PressScale>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { profile, displayName } = useApp();
  const avatarUri = profile.photo || profile.image;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header name={displayName} avatarUri={avatarUri} />
        <SearchBar />
        <QuickActionGrid />
        <HeroBanner />
        <NextAppointment />
        <ExploreSpecialists />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 126 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerCopy: { flex: 1, minWidth: 0, paddingRight: 12 },
  greeting: { color: colors.dark, fontSize: 24, fontWeight: "900", letterSpacing: 0 },
  morning: { color: colors.grey, fontSize: 14, fontWeight: "700", marginTop: 5 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
  },
  notificationDot: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  searchBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: colors.white,
    paddingLeft: 16,
    paddingRight: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 13 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  searchInput: { flex: 1, minWidth: 0, marginLeft: 10, color: colors.dark, fontSize: 15, fontWeight: "700" },
  micButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: colors.primary,
  },
  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
  },
  quickCard: {
    width: 78,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  quickText: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  heroBanner: {
    height: 82,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 22,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  videoIconBox: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginRight: 10,
  },
  heroTextBlock: { flex: 1, minWidth: 0, justifyContent: "center", paddingRight: 8 },
  heroTitle: { color: colors.white, fontSize: 18, lineHeight: 21, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "600", marginTop: 2 },
  heroDoctor: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.65)",
    marginRight: 8,
  },
  bookButton: {
    width: 124,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.white,
  },
  bookText: { color: colors.primary, fontSize: 14, fontWeight: "900" },
  section: { marginTop: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: { color: colors.dark, fontSize: 22, fontWeight: "900", letterSpacing: 0 },
  viewAll: { color: colors.primary, fontSize: 16, fontWeight: "900" },
  appointmentCard: {
    height: 190,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
    paddingTop: 16,
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 18,
    marginTop: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
  },
  appointmentHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  appointmentTitle: { flex: 1, color: colors.dark, fontSize: 18, fontWeight: "800", paddingRight: 12 },
  timeChip: {
    width: 86,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: colors.white,
  },
  timeChipText: { color: colors.dark, fontSize: 15, fontWeight: "700" },
  doctorRow: { flexDirection: "row", alignItems: "center", marginTop: 18 },
  appointmentDoctor: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.white,
  },
  doctorRowText: { marginLeft: 14 },
  doctorName: { color: colors.dark, fontSize: 20, fontWeight: "800" },
  doctorSpeciality: { color: colors.grey, fontSize: 14, fontWeight: "700", marginTop: 4 },
  appointmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  videoMeta: {
    width: "14%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  dateMetaItem: {
    width: "56%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeMetaItem: {
    width: "24%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: colors.dark, fontSize: 13, fontWeight: "600" },
  specialistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  specialistCard: {
    width: 78,
    height: 108,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.white,
    paddingVertical: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  specialistName: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },
  specialistCount: { color: colors.grey, fontSize: 11, fontWeight: "700", marginTop: 5, textAlign: "center" },
});

