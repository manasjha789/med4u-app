import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { colors } from "@/components/ui/premium";

type IconName = keyof typeof Ionicons.glyphMap;

export function ActionCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle?: string;
  icon: IconName;
  onPress?: () => void;
}) {
  return (
    <PressScale style={styles.card} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 116,
    justifyContent: "space-between",
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 16,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 4,
  },
  iconWrap: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
  },
  title: {
    color: colors.dark,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 12,
  },
  subtitle: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 4,
  },
});
