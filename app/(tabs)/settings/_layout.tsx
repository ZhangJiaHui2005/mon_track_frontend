import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "green",
        },

        headerTintColor: "white",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="categories" options={{ title: "Categories" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="add_category" options={{presentation: 'modal'}} />
    </Stack>
  );
}
