import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

type UserAvatarProps = {
  imageUri?: string;
  size?: number;
};

export function UserAvatar({ imageUri, size = 56 }: UserAvatarProps) {
  const uri = imageUri?.trim();
  const radius = size / 2;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: radius }]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} />
      ) : (
        <Ionicons name="person-outline" size={Math.round(size * 0.48)} color="#94A3B8" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5,
  },
});
