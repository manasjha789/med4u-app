import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, PrimaryButton, SectionHeader } from "@/components/ui/premium";

const items = [["Dolo 650", "2 strips", "Rs.64"], ["Vitamin D3", "1 bottle", "Rs.149"]];

export default function MedicineCartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.dark} /></TouchableOpacity>
        <Text style={styles.title}>Medicine Cart</Text>
        <Text style={styles.subtitle}>Review medicines before placing your order.</Text>
        <SectionHeader title="Items" />
        {items.map(([name, qty, price]) => (
          <View key={name} style={styles.item}>
            <View style={styles.icon}><Ionicons name="medical" size={24} color={colors.primary} /></View>
            <View style={styles.info}><Text style={styles.name}>{name}</Text><Text style={styles.qty}>{qty}</Text></View>
            <Text style={styles.price}>{price}</Text>
          </View>
        ))}
        <View style={styles.summary}><Text style={styles.total}>Total</Text><Text style={styles.totalPrice}>Rs.213</Text></View>
        <PrimaryButton title="Place Order" onPress={() => router.push("/orderTracking" as never)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 34 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white, marginBottom: 18 },
  title: { color: colors.dark, fontSize: 30, fontWeight: "900" },
  subtitle: { color: colors.grey, fontSize: 15, fontWeight: "700", marginTop: 6 },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 22, padding: 16, marginBottom: 12 },
  icon: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: colors.background },
  info: { flex: 1, marginLeft: 14 },
  name: { color: colors.dark, fontSize: 16, fontWeight: "900" },
  qty: { color: colors.grey, fontSize: 13, fontWeight: "700", marginTop: 4 },
  price: { color: colors.primary, fontSize: 15, fontWeight: "900" },
  summary: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.white, borderRadius: 22, padding: 18, marginVertical: 16 },
  total: { color: colors.dark, fontSize: 18, fontWeight: "900" },
  totalPrice: { color: colors.primary, fontSize: 18, fontWeight: "900" },
});
