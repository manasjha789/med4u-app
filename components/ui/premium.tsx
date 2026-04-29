import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export const colors = {
  background: "#F8FAFC",
  primary: "#0F766E",
  secondary: "#14B8A6",
  lightBlue: "#14B8A6",
  dark: "#0F172A",
  grey: "#64748B",
  white: "#FFFFFF",
  card: "#FFFFFF",
  successMint: "#ECFDF5",
  accentPurple: "#0F766E",
  success: "#16A34A",
  warning: "#0F766E",
  danger: "#EF4444",
  border: "#E2E8F0",
  soft: "#F8FAFC",
  mint: "#CCFBF1",
  paleMint: "#F0FDFA",
};

type IconName = keyof typeof Ionicons.glyphMap;

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={shared.header}>
      <View style={shared.headerText}>
        <Text style={shared.title}>{title}</Text>
        {subtitle ? <Text style={shared.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={shared.sectionHeader}>
      <Text style={shared.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
          <Text style={shared.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  tone = "primary",
}: {
  title: string;
  onPress?: () => void;
  tone?: "primary" | "danger" | "light";
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        shared.primaryButton,
        tone === "danger" && shared.dangerButton,
        tone === "light" && shared.lightButton,
      ]}
    >
      <Text style={[shared.primaryButtonText, tone === "light" && shared.lightButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function ServiceCard({
  title,
  subtitle,
  icon,
  onPress,
  style,
}: {
  title: string;
  subtitle?: string;
  icon: IconName;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={[shared.card, style]}>
      <View style={shared.iconCircle}>
        <Ionicons name={icon} size={25} color={colors.primary} />
      </View>
      <View style={shared.cardText}>
        <Text style={shared.cardTitle}>{title}</Text>
        {subtitle ? <Text style={shared.cardSubtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={19} color="#94A3B8" />
    </TouchableOpacity>
  );
}

export function DoctorCard({
  name,
  speciality,
  image,
  onPress,
}: {
  name: string;
  speciality: string;
  image?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={shared.doctorCard}>
      {image ?? (
        <View style={shared.doctorAvatar}>
          <Ionicons name="person" size={26} color={colors.primary} />
        </View>
      )}
      <View style={shared.cardText}>
        <Text style={shared.cardTitle}>{name}</Text>
        <Text style={shared.cardSubtitle}>{speciality}</Text>
        <View style={shared.ratingRow}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={shared.ratingText}>4.9</Text>
          <Text style={shared.dot}>  -  </Text>
          <Text style={shared.ratingText}>12 yrs exp</Text>
        </View>
      </View>
      <Text style={shared.fee}>Rs.499</Text>
    </TouchableOpacity>
  );
}

export function SkeletonCard({ width = "100%" }: { width?: ViewStyle["width"] }) {
  return (
    <View style={[shared.skeleton, { width }]}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export const shared = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  headerText: { flex: 1 },
  title: { color: colors.dark, fontSize: 30, fontWeight: "900", letterSpacing: 0 },
  subtitle: { color: colors.grey, fontSize: 15, fontWeight: "600", marginTop: 5 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: { color: colors.dark, fontSize: 20, fontWeight: "900" },
  sectionAction: { color: colors.primary, fontSize: 14, fontWeight: "900" },
  card: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  iconCircle: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  cardText: { flex: 1, marginLeft: 14 },
  cardTitle: { color: colors.dark, fontSize: 16, fontWeight: "900" },
  cardSubtitle: { color: colors.grey, fontSize: 13, fontWeight: "600", marginTop: 4, lineHeight: 18 },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    borderRadius: 17,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  dangerButton: { backgroundColor: colors.danger, shadowColor: colors.danger },
  lightButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0.05,
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: "900" },
  lightButtonText: { color: colors.primary },
  doctorCard: {
    width: 292,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 14,
    marginRight: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  doctorAvatar: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingText: { color: colors.dark, fontSize: 12, fontWeight: "800" },
  dot: { color: "#CBD5E1", fontSize: 12, fontWeight: "800" },
  fee: { color: colors.primary, fontSize: 13, fontWeight: "900" },
  skeleton: {
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
