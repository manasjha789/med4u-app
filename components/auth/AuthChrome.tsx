import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "@/components/ui/premium";

export const authColors = {
  primary: colors.primary,
  secondary: colors.secondary,
  background: colors.background,
  border: colors.border,
  text: colors.dark,
  muted: colors.grey,
  field: colors.soft,
};

type IconName = keyof typeof Ionicons.glyphMap;

export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[authColors.primary, authColors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View pointerEvents="none" style={styles.heroOrbTop} />
          <View pointerEvents="none" style={styles.heroOrbBottom} />
          <MedicalIllustration />
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MedicalIllustration() {
  return (
    <View pointerEvents="none" style={styles.illustration}>
      <View style={styles.shieldWrap}>
        <Ionicons name="shield-checkmark" size={46} color={authColors.primary} />
      </View>
      <View style={styles.stethoscopeTubeLeft} />
      <View style={styles.stethoscopeTubeRight} />
      <View style={styles.heartbeat}>
        <Ionicons name="pulse" size={38} color="rgba(255,255,255,0.76)" />
      </View>
      <View style={styles.crossBadge}>
        <Ionicons name="medical" size={20} color={authColors.primary} />
      </View>
    </View>
  );
}

export function AuthField({
  icon,
  focused,
  children,
  style,
}: {
  icon: IconName;
  focused?: boolean;
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View pointerEvents="box-none" style={[styles.field, focused && styles.fieldFocused, style]}>
      <Ionicons
        pointerEvents="none"
        name={icon}
        size={19}
        color={focused ? authColors.primary : "#94A3B8"}
        style={styles.fieldIcon}
      />
      {children}
    </View>
  );
}

export function AuthTextInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      editable={true}
      placeholderTextColor="#94A3B8"
      selectionColor={authColors.primary}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function AuthButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.buttonShadow}>
      <LinearGradient
        colors={[authColors.primary, authColors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function CountryCodeBox() {
  return (
    <TouchableOpacity style={styles.countryBox} activeOpacity={0.82}>
      <Text style={styles.countryText}>+91</Text>
      <Ionicons name="chevron-down" size={15} color={authColors.muted} />
    </TouchableOpacity>
  );
}

export function AuthLink({
  copy,
  action,
  onPress,
}: {
  copy: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.linkRow}>
      <Text style={styles.linkCopy}>{copy} </Text>
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        <Text style={styles.linkAction}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: authColors.background },
  content: { flexGrow: 1, backgroundColor: authColors.background },
  hero: {
    minHeight: 330,
    justifyContent: "flex-end",
    paddingHorizontal: 26,
    paddingTop: 42,
    paddingBottom: 62,
    overflow: "hidden",
  },
  heroOrbTop: {
    position: "absolute",
    top: -60,
    right: -36,
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  heroOrbBottom: {
    position: "absolute",
    left: -52,
    bottom: 38,
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  illustration: {
    position: "absolute",
    right: 28,
    top: 52,
    width: 168,
    height: 168,
  },
  shieldWrap: {
    position: "absolute",
    right: 40,
    top: 28,
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  stethoscopeTubeLeft: {
    position: "absolute",
    left: 22,
    bottom: 34,
    width: 84,
    height: 84,
    borderLeftWidth: 7,
    borderBottomWidth: 7,
    borderColor: "rgba(59,130,246,0.22)",
    borderBottomLeftRadius: 42,
    transform: [{ rotate: "-16deg" }],
  },
  stethoscopeTubeRight: {
    position: "absolute",
    right: 6,
    bottom: 24,
    width: 62,
    height: 62,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderColor: "rgba(59,130,246,0.22)",
    borderBottomRightRadius: 31,
    transform: [{ rotate: "16deg" }],
  },
  heartbeat: { position: "absolute", left: 6, top: 34 },
  crossBadge: {
    position: "absolute",
    right: 18,
    bottom: 20,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.white,
  },
  heroCopy: { zIndex: 2, maxWidth: 245 },
  heroTitle: { color: colors.white, fontSize: 34, fontWeight: "900", letterSpacing: 0 },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: "700", lineHeight: 21, marginTop: 7 },
  card: {
    flex: 1,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 5,
  },
  field: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: authColors.border,
    backgroundColor: authColors.field,
    overflow: "hidden",
  },
  fieldFocused: {
    borderColor: authColors.secondary,
    shadowColor: authColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  fieldIcon: { position: "absolute", left: 15, top: 18, zIndex: 2 },
  input: {
    width: "100%",
    height: "100%",
    color: authColors.text,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 0,
    paddingLeft: 44,
    paddingRight: 15,
  },
  countryBox: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: authColors.field,
    borderWidth: 1,
    borderColor: authColors.border,
  },
  countryText: { color: authColors.text, fontSize: 15, fontWeight: "900" },
  buttonShadow: {
    borderRadius: 28,
    shadowColor: authColors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 6,
  },
  button: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
  },
  buttonText: { color: colors.white, fontSize: 17, fontWeight: "900" },
  linkRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24 },
  linkCopy: { color: authColors.muted, fontSize: 13, fontWeight: "700" },
  linkAction: { color: authColors.primary, fontSize: 13, fontWeight: "900" },
});
