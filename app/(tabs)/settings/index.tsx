import { SettingMenuItem } from "@/components/settings/setting_menu_item";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <SettingMenuItem
        label="Categories"
        iconName="list-outline"
        onPress={() => router.push("/settings/categories")}
      />

      <SettingMenuItem
        label="About"
        iconName="information-circle-outline"
        onPress={() => router.push("/settings/about")}
      />
    </View>
  );
}
