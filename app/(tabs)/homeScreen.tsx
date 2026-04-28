import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const hasAppointment = true;

const avatarUri =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&q=80";

const categories = [
  { label: "Neuro", icon: "psychology" as const },
  { label: "Cardio", icon: "favorite-border" as const },
  { label: "Ortho", icon: "accessibility-new" as const },
  { label: "Pulmo", icon: "air" as const },
];

const tabs = [
  { label: "Home", icon: "home" as const, active: true, href: "/homeScreen" as const },
  { label: "Treat", icon: "medical-services" as const, active: false },
  { label: "Medicine", icon: "medication" as const, active: false },
  { label: "Hospital", icon: "local-hospital" as const, active: false },
  { label: "Profile", icon: "person" as const, active: false, href: "/profile" as const },
];

export default function HomeScreen() {
  const params = useLocalSearchParams<{ userName?: string }>();
  const userName = params.userName?.trim() || "User";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.helloText}>Hello,</Text>
            <Text style={styles.userName}>{userName}!</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.75}>
              <Ionicons name="notifications-outline" size={20} color="#667085" />
            </TouchableOpacity>
            <Image source={{ uri: avatarUri }} style={styles.profileImage} />
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color="#94A3B8" />
          <TextInput
            placeholder="Search Doctor"
            placeholderTextColor="#A5AFBF"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.label}
              style={styles.categoryItem}
              activeOpacity={0.8}
            >
              <View style={styles.categoryCard}>
                <MaterialIcons name={category.icon} size={27} color="#0967C9" />
              </View>
              <Text style={styles.categoryText}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
        {hasAppointment ? <AppointmentCard /> : <EmptyAppointmentCard />}

        <View style={styles.rowTitle}>
          <Text style={styles.sectionTitleNoMargin}>My Recent Visit</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentRow}
        >
          <RecentVisitCard />
          <RecentVisitCard compact />
        </ScrollView>
      </ScrollView>

      <View style={styles.bottomBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={styles.tabItem}
            activeOpacity={0.75}
            onPress={() => {
              if (tab.href) {
                router.push(tab.href);
              }
            }}
          >
            <MaterialIcons
              name={tab.icon}
              size={22}
              color={tab.active ? "#126AE5" : "#A8B4C5"}
            />
            <Text style={[styles.tabText, tab.active && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

function AppointmentCard() {
  return (
    <LinearGradient
      colors={["#0B75E5", "#005EC4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.appointmentCard}
    >
      <View style={styles.appointmentTop}>
        <Image source={{ uri: avatarUri }} style={styles.doctorAvatar} />
        <View style={styles.appointmentInfo}>
          <Text style={styles.doctorNameLight}>Dr. Abhi</Text>
          <Text style={styles.doctorSubtitleLight}>Orthopedic Consultation</Text>
        </View>
      </View>

      <View style={styles.appointmentMetaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="calendar-outline" size={15} color="#D7E9FF" />
          <Text style={styles.metaText}>Wed 7 Sep</Text>
        </View>
        <View style={styles.metaPill}>
          <Ionicons name="time-outline" size={15} color="#D7E9FF" />
          <Text style={styles.metaText}>10:30-11:30 AM</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function EmptyAppointmentCard() {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIconCircle}>
        <MaterialIcons name="event-busy" size={30} color="#0967C9" />
      </View>
      <Text style={styles.emptyTitle}>No upcoming appointments</Text>
      <Text style={styles.emptySubtitle}>
        You don&apos;t have any scheduled visits at the moment.
      </Text>
      <TouchableOpacity style={styles.bookButton} activeOpacity={0.85}>
        <Text style={styles.bookButtonText}>Book an Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

function RecentVisitCard({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.visitCard, compact && styles.visitCardCompact]}>
      <View style={styles.visitTop}>
        <Image source={{ uri: avatarUri }} style={styles.visitAvatar} />
        {!compact && (
          <View style={styles.visitInfo}>
            <Text style={styles.visitName}>Dr. Sarah Jenkins</Text>
            <Text style={styles.visitSpeciality}>Cardiologist</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.visitButton} activeOpacity={0.85}>
        <Text style={styles.visitButtonText}>{compact ? "" : "Book Now"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FF",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 42,
    paddingBottom: 112,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    minHeight: 64,
  },
  helloText: {
    color: "#374151",
    fontSize: 28,
    fontWeight: "400",
    lineHeight: 32,
  },
  userName: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 7,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#DCE9F9",
  },
  searchBox: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCD6E5",
    borderRadius: 18,
    paddingHorizontal: 18,
    marginBottom: 38,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    color: "#0F172A",
    fontSize: 15,
  },
  sectionTitle: {
    color: "#0B1220",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 22,
  },
  sectionTitleNoMargin: {
    color: "#0B1220",
    fontSize: 15,
    fontWeight: "800",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  categoryItem: {
    width: "22%",
    alignItems: "center",
  },
  categoryCard: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  categoryText: {
    color: "#111827",
    fontSize: 16,
    marginTop: 13,
  },
  appointmentCard: {
    borderRadius: 12,
    padding: 22,
    marginBottom: 27,
    shadowColor: "#006EE6",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 7,
  },
  appointmentTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  doctorAvatar: {
    width: 58,
    height: 58,
    borderRadius: 13,
    backgroundColor: "#D6F4F2",
  },
  appointmentInfo: {
    marginLeft: 18,
    flex: 1,
  },
  doctorNameLight: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  doctorSubtitleLight: {
    color: "#CDE5FF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  appointmentMetaRow: {
    flexDirection: "row",
    gap: 10,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  metaText: {
    color: "#E9F4FF",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 5,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D9E4F3",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 26,
    marginBottom: 27,
  },
  emptyIconCircle: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: "#EAF3FF",
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#0B1220",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptySubtitle: {
    color: "#59677A",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 250,
    textAlign: "center",
    marginBottom: 18,
  },
  bookButton: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#075CAD",
    borderRadius: 9,
    shadowColor: "#075CAD",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 5,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  seeAll: {
    color: "#075CAD",
    fontSize: 14,
    fontWeight: "700",
  },
  recentRow: {
    gap: 16,
  },
  visitCard: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 16,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  visitCardCompact: {
    width: 76,
    overflow: "hidden",
  },
  visitTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  visitAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D6F4F2",
  },
  visitInfo: {
    marginLeft: 14,
    flex: 1,
  },
  visitName: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "800",
  },
  visitSpeciality: {
    color: "#748196",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  visitButton: {
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF6FF",
    borderRadius: 10,
    marginTop: 16,
  },
  visitButtonText: {
    color: "#0B62C5",
    fontSize: 14,
    fontWeight: "800",
  },
  bottomBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 14,
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    color: "#A8B4C5",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },
  tabTextActive: {
    color: "#126AE5",
  },
});
