import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingMenuItemProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  backgroundColor?: string;
}

export const SettingMenuItem = ({
  label,
  iconName,
  onPress,
  backgroundColor = "green",
}: SettingMenuItemProps) => {
  const { width } = useWindowDimensions();

  const isLargeScreen = width > 768;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: backgroundColor,
          opacity: pressed ? 0.7 : 1,
          width: isLargeScreen ? "50%" : "100%",
          alignSelf: "center",
        },
      ]}
    >
      <View style={styles.leftContent}>
        <Ionicons name={iconName} size={22} color="white" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="rgba(255,255,255,0.7)"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
