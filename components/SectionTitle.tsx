import { StyleSheet, Text, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { colors } from "@/components/ui/premium";

export function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <PressScale onPress={onPress}>
          <Text style={styles.action}>{action}</Text>
        </PressScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 14,
  },
  title: {
    color: colors.dark,
    fontSize: 20,
    fontWeight: "900",
  },
  action: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
});
