import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { colors } from "@/components/ui/premium";

export function DoctorCard({
  name,
  specialty,
  image,
  rating = "4.9",
  experience = "12 yrs",
  fee = "Rs.499",
  onPress,
}: {
  name: string;
  specialty: string;
  image?: string;
  rating?: string;
  experience?: string;
  fee?: string;
  onPress?: () => void;
}) {
  return (
    <PressScale style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri:
            image ||
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=220&q=80",
        }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.specialty}>{specialty}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={styles.meta}>{rating}</Text>
          <Text style={styles.sep}>•</Text>
          <Text style={styles.meta}>{experience}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.fee}>{fee}</Text>
        <View style={styles.bookPill}>
          <Text style={styles.bookText}>Book</Text>
        </View>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 248,
    borderRadius: 26,
    backgroundColor: colors.white,
    padding: 14,
    marginRight: 14,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 126,
    borderRadius: 22,
    backgroundColor: "#DCEBFF",
  },
  body: {
    marginTop: 13,
  },
  name: {
    color: colors.dark,
    fontSize: 17,
    fontWeight: "900",
  },
  specialty: {
    color: colors.grey,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  meta: {
    color: colors.dark,
    fontSize: 12,
    fontWeight: "800",
  },
  sep: {
    color: "#CBD5E1",
    fontWeight: "900",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  fee: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
  bookPill: {
    borderRadius: 999,
    backgroundColor: "#EAF2FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bookText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
});
