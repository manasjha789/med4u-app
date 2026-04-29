import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/components/ui/premium";

export function BrandMark({ size = 72 }: { size?: number }) {
  const iconSize = Math.round(size * 0.42);

  return (
    <LinearGradient
      colors={[colors.secondary, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.mark, { width: size, height: size, borderRadius: size * 0.32 }]}
    >
      <View style={[styles.shield, { width: size * 0.62, height: size * 0.62 }]}>
        <Ionicons name="shield-checkmark" size={iconSize} color="#FFFFFF" />
        <View style={styles.heartBadge}>
          <Ionicons name="heart" size={Math.round(size * 0.16)} color="#EF4444" />
        </View>
      </View>
    </LinearGradient>
  );
}

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.logoRow}>
      <BrandMark size={compact ? 52 : 88} />
      <View style={styles.logoTextWrap}>
        <Text style={[styles.logoText, compact && styles.logoTextCompact]}>Med4U</Text>
        {!compact ? <Text style={styles.tagline}>Your Health, Our Priority</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    alignItems: "center",
  },
  mark: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 22,
    elevation: 8,
  },
  shield: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heartBadge: {
    position: "absolute",
    right: -4,
    bottom: 5,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },
  logoTextWrap: {
    alignItems: "center",
  },
  logoText: {
    color: colors.dark,
    fontSize: 38,
    fontWeight: "900",
    marginTop: 16,
    letterSpacing: 0,
  },
  logoTextCompact: {
    fontSize: 24,
    marginTop: 8,
  },
  tagline: {
    color: colors.grey,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
  },
});
