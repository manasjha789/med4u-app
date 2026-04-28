import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { UserAvatar } from "@/components/UserAvatar";
import { useApp } from "@/context/AppContext";
import { colors } from "@/components/ui/premium";

export function Header({
  title,
  subtitle,
  onBellPress,
  onAvatarPress,
}: {
  title: string;
  subtitle?: string;
  onBellPress?: () => void;
  onAvatarPress?: () => void;
}) {
  const { profile } = useApp();
  const avatarUri = profile.photo || profile.image;

  return (
    <View style={styles.header}>
      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.actions}>
        <PressScale style={styles.glassButton} onPress={onBellPress}>
          <Ionicons name="notifications-outline" size={21} color={colors.dark} />
          <View style={styles.dot} />
        </PressScale>
        <PressScale onPress={onAvatarPress}>
          <UserAvatar imageUri={avatarUri} />
        </PressScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 14,
  },
  title: {
    color: colors.dark,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.grey,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  glassButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.86)",
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  dot: {
    position: "absolute",
    top: 13,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});
