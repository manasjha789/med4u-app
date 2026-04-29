import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { colors } from "@/components/ui/premium";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  homeScreen: "home",
  consult: "medical",
  medicine: "medkit",
  hospital: "business",
  profileTab: "person",
};

export function PremiumTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title || route.name;

          return (
            <PressScale
              key={route.key}
              style={[styles.item, focused && styles.activeItem]}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            >
              <Ionicons
                name={icons[route.name] || "ellipse"}
                size={focused ? 20 : 21}
                color={focused ? colors.white : "#7A8798"}
              />
              <Text style={[styles.label, focused && styles.activeLabel]}>{label}</Text>
            </PressScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
  },
  bar: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 9,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  item: {
    flex: 1,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
  },
  activeItem: {
    flexDirection: "row",
    gap: 7,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 7,
  },
  label: {
    color: "#7A8798",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 4,
  },
  activeLabel: {
    color: colors.white,
    fontSize: 12,
    marginTop: 0,
  },
});
