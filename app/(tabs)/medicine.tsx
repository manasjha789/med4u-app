import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, PrimaryButton, SectionHeader } from "@/components/ui/premium";

const brands = ["Apollo", "Tata 1mg", "Cipla", "Sun Pharma"];
const medicines = [
  ["Dolo 650", "Fever and pain relief", "Rs.32", "12% off"],
  ["Vitamin D3", "Bone health supplement", "Rs.149", "18% off"],
  ["Cetirizine", "Allergy relief", "Rs.24", "10% off"],
  ["ORS Sachet", "Hydration support", "Rs.18", "8% off"],
] as const;

export default function MedicineScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Medicine</Text>
            <Text style={styles.subtitle}>Genuine medicines, fast delivery.</Text>
          </View>
          <TouchableOpacity style={styles.cart} onPress={() => router.push("/medicineCart" as never)}>
            <Ionicons name="cart-outline" size={25} color={colors.primary} />
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchBox} onPress={() => router.push("/search")} activeOpacity={0.86}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput placeholder="Search medicines" editable={false} placeholderTextColor="#94A3B8" style={styles.searchInput} />
        </TouchableOpacity>

        <View style={styles.offer}>
          <View>
            <Text style={styles.offerTitle}>Flat 20% off</Text>
            <Text style={styles.offerText}>Upload prescription and get pharmacist support.</Text>
          </View>
          <Ionicons name="pricetag" size={36} color={colors.white} />
        </View>

        <SectionHeader title="Top Brands" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
          {brands.map((brand) => <Text key={brand} style={styles.brand}>{brand}</Text>)}
        </ScrollView>

        <SectionHeader title="Popular Medicines" action="Cart" onPress={() => router.push("/medicineCart" as never)} />
        <View style={styles.grid}>
          {medicines.map(([name, desc, price, discount]) => (
            <TouchableOpacity key={name} style={styles.medCard} activeOpacity={0.86} onPress={() => router.push("/medicineCart" as never)}>
              <View style={styles.medIcon}><Ionicons name="medical" size={26} color={colors.primary} /></View>
              <Text style={styles.medName}>{name}</Text>
              <Text style={styles.medDesc}>{desc}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.discount}>{discount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.upload} onPress={() => router.push("/medicineCart" as never)} activeOpacity={0.86}>
          <Ionicons name="cloud-upload-outline" size={34} color={colors.primary} />
          <View style={styles.uploadText}>
            <Text style={styles.uploadTitle}>Upload Prescription</Text>
            <Text style={styles.uploadDesc}>We will build your cart from the prescription.</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.orderAgain}>
          <Text style={styles.orderTitle}>Order again</Text>
          <Text style={styles.orderText}>Your last vitamins order is ready to repeat.</Text>
          <PrimaryButton title="Track Previous Order" onPress={() => router.push("/orderTracking" as never)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 126 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { color: colors.dark, fontSize: 30, fontWeight: "900" },
  subtitle: { color: colors.grey, fontSize: 15, fontWeight: "700", marginTop: 5 },
  cart: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.white },
  badge: { position: "absolute", top: 8, right: 8, minWidth: 18, height: 18, alignItems: "center", justifyContent: "center", borderRadius: 9, backgroundColor: colors.danger },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: "900" },
  searchBox: { height: 58, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 18, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, marginLeft: 10, color: colors.dark, fontSize: 15, fontWeight: "700" },
  offer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.primary, borderRadius: 26, padding: 20, marginTop: 18 },
  offerTitle: { color: colors.white, fontSize: 23, fontWeight: "900" },
  offerText: { color: "#DBEAFE", fontSize: 13, fontWeight: "700", marginTop: 6, maxWidth: 245 },
  brandRow: { gap: 10 },
  brand: { overflow: "hidden", color: colors.dark, fontSize: 14, fontWeight: "900", backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  medCard: { width: "48.2%", backgroundColor: colors.white, borderRadius: 22, padding: 15 },
  medIcon: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: colors.background },
  medName: { color: colors.dark, fontSize: 16, fontWeight: "900", marginTop: 12 },
  medDesc: { color: colors.grey, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 5 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  price: { color: colors.primary, fontSize: 15, fontWeight: "900" },
  discount: { color: colors.success, fontSize: 12, fontWeight: "900" },
  upload: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 24, padding: 18, marginTop: 18 },
  uploadText: { flex: 1, marginLeft: 14 },
  uploadTitle: { color: colors.dark, fontSize: 17, fontWeight: "900" },
  uploadDesc: { color: colors.grey, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 4 },
  orderAgain: { gap: 12, backgroundColor: colors.white, borderRadius: 24, padding: 18, marginTop: 18 },
  orderTitle: { color: colors.dark, fontSize: 19, fontWeight: "900" },
  orderText: { color: colors.grey, fontSize: 14, fontWeight: "700" },
});
