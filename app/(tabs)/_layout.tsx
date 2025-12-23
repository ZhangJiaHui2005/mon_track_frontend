import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "green",
        },

        headerTitleStyle: {
          color: "white",
        },

        headerTitleAlign: "center",
        tabBarActiveTintColor: "green",
      }}
    >
      {/* 1. Trang chủ */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      {/* 2. Lịch sử giao dịch */}
      <Tabs.Screen
        name="history"
        options={{
          title: "Lịch sử",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt-sharp" : "receipt-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      {/* 3. Nút Thêm giao dịch (Nút chính ở giữa) */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Thêm mới",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle-sharp" : "add-circle-outline"}
              color={color}
              size={30} // Cho icon to hơn một chút để nổi bật
            />
          ),
        }}
      />

      {/* 4. Thống kê */}
      <Tabs.Screen
        name="stats"
        options={{
          title: "Thống kê",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pie-chart-sharp" : "pie-chart-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      {/* 5. Cài đặt (Nơi quản lý Category) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Cài đặt",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              color={color}
              size={24}
            />
          ),

          headerShown: false
        }}
      />
    </Tabs>
  );
}
