import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [disease, setDisease] = useState("");
  const [allergy, setAllergy] = useState("");
  const [medication, setMedication] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleSave = () => {
    router.replace({
      pathname: "/homeScreen",
      params: { userName: name.trim() || "User" },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.topArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="person" size={44} color="#fff" />
          </View>

          <Text style={styles.title}>Create Profile</Text>
          <Text style={styles.subtitle}>
            Complete your health details for better care
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Personal Information</Text>

          {/* Name */}
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          {/* Age */}
          <View style={styles.inputBox}>
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Age"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
              style={styles.input}
            />
          </View>

          {/* Gender */}
          <View style={styles.inputBox}>
            <Ionicons name="male-female-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Gender"
              value={gender}
              onChangeText={setGender}
              style={styles.input}
            />
          </View>

          {/* Height */}
          <View style={styles.inputBox}>
            <Ionicons name="resize-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Height (cm)"
              keyboardType="number-pad"
              value={height}
              onChangeText={setHeight}
              style={styles.input}
            />
          </View>

          {/* Weight */}
          <View style={styles.inputBox}>
            <Ionicons name="barbell-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Weight (kg)"
              keyboardType="number-pad"
              value={weight}
              onChangeText={setWeight}
              style={styles.input}
            />
          </View>

          {/* Blood Group */}
          <View style={styles.inputBox}>
            <Ionicons name="water-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Blood Group"
              value={bloodGroup}
              onChangeText={setBloodGroup}
              style={styles.input}
            />
          </View>

          <Text style={styles.heading}>Medical Information</Text>

          {/* Disease */}
          <View style={styles.inputBox}>
            <Ionicons name="medkit-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Any existing disease?"
              value={disease}
              onChangeText={setDisease}
              style={styles.input}
            />
          </View>

          {/* Allergy */}
          <View style={styles.inputBox}>
            <Ionicons name="alert-circle-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Any allergy?"
              value={allergy}
              onChangeText={setAllergy}
              style={styles.input}
            />
          </View>

          {/* Medication */}
          <View style={styles.inputBox}>
            <Ionicons name="flask-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Current medications"
              value={medication}
              onChangeText={setMedication}
              style={styles.input}
            />
          </View>

          {/* Emergency Contact */}
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Emergency Contact Number"
              keyboardType="phone-pad"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              style={styles.input}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>
              SAVE PROFILE
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Your health data is secure with Med4U
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },

  topArea: {
    alignItems: "center",
    marginTop: 40,
  },

  logoCircle: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 14,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 24,
    borderRadius: 28,
    padding: 24,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#60A5FA",
    marginBottom: 16,
    marginTop: 8,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },

  footer: {
    textAlign: "center",
    marginVertical: 26,
    color: "#64748B",
    fontSize: 14,
  },
});
