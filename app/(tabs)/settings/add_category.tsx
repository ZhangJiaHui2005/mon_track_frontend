import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

enum CategoryType {
  Income = "Income",
  Expense = "Expense",
}

export default function AddCategory() {
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>(CategoryType.Expense);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL + "/categories";

  const handleCreate = async () => {
    if (!name.trim()) {
      if (Platform.OS === "web") {
        window.alert("Please enter category's name");
      } else {
        Alert.alert("Error", "Please enter category's name");
      }
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        API_URL,
        {
          name: name.trim(),
          type: type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (Platform.OS === "web") {
        window.alert("Category added successfully");
        router.back();
      } else {
        Alert.alert("Success", "Category has been added", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Cannot create new category";
      Alert.alert("Lỗi", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { width: isLargeScreen ? "50%" : "100%", alignSelf: "center" },
      ]}
    >
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Foods, Salary, ..."
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Type:</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === CategoryType.Expense && styles.activeExpense,
          ]}
          onPress={() => setType(CategoryType.Expense)}
        >
          <Text
            style={[
              styles.typeText,
              type === CategoryType.Expense && styles.whiteText,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            type === CategoryType.Income && styles.activeIncome,
          ]}
          onPress={() => setType(CategoryType.Income)}
        >
          <Text
            style={[
              styles.typeText,
              type === CategoryType.Income && styles.whiteText,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Save category</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  typeContainer: { flexDirection: "row", marginBottom: 30, gap: 10 },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  activeExpense: { backgroundColor: "red" },
  activeIncome: { backgroundColor: "green" },
  typeText: { fontWeight: "bold", color: "#666" },
  whiteText: { color: "#fff" },
  submitButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
