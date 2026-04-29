import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { colors } from "@/components/ui/premium";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  homeScreen: "home-outline",
  consult: "medical-outline",
  medicine: "bag-add-outline",
  hospital: "business-outline",
  profileTab: "person-outline",
};

const labels: Record<string, string> = {
  homeScreen: "Home",
  consult: "Consult",
  medicine: "Medicine",
  hospital: "Hospital",
  profileTab: "Profile",
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          const label =
            labels[route.name] ||
            (typeof options.tabBarLabel === "string" ? options.tabBarLabel : options.title || route.name);

          return (
            <PressScale
              key={route.key}
              style={styles.item}
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
              <View style={[styles.iconCircle, focused && styles.activeIconCircle]}>
                <Ionicons name={icons[route.name] || "ellipse-outline"} size={22} color={focused ? colors.white : "#94A3B8"} />
              </View>
              <Text style={[styles.label, focused && styles.activeLabel]} numberOfLines={1}>
                {label}
              </Text>
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
    left: 22,
    right: 22,
    bottom: 18,
  },
  bar: {
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 12,
  },
  item: {
    flex: 1,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.soft,
  },
  activeIconCircle: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 7,
  },
  label: {
    color: colors.grey,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
  },
  activeLabel: {
    color: colors.primary,
  },
});
