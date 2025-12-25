import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Enum định nghĩa loại giao dịch tương ứng với schema
enum CategoryType {
  Income = "Income",
  Expense = "Expense",
}

interface Category {
  _id: string;
  name: string;
  type: CategoryType;
}

export default function AddTransaction() {
  const router = useRouter();

  // State cho form
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<CategoryType>(CategoryType.Expense);
  const [categoryId, setCategoryId] = useState("");

  // State cho dữ liệu category
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // 1. Fetch danh mục dựa trên loại (Income/Expense)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/by-type`, {
          params: { type },
        });
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0]._id); // Mặc định chọn cái đầu tiên
        } else {
          setCategoryId("");
        }
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
      }
    };
    fetchCategories();
  }, [type]);

  // 2. Hàm gửi dữ liệu lên Backend
  const handleSave = async () => {
    // Hàm helper để hiển thị thông báo tùy theo môi trường
    const showAlert = (
      title: string,
      message: string,
      onPress?: () => void
    ) => {
      if (Platform.OS === "web") {
        window.alert(`${title}: ${message}`);
        if (onPress) onPress();
      } else {
        Alert.alert(title, message, onPress ? [{ text: "OK", onPress }] : []);
      }
    };

    if (!amount || !categoryId) {
      showAlert("Error", "Please enter an amount and select a category");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/transactions`, {
        amount: Number(amount),
        note: note,
        categoryId: categoryId,
        type: type,
      });

      showAlert("Success", "Transaction saved successfully!", () => {
        setAmount("");
        setNote("");
        router.push("/history");
      });
    } catch (error) {
      showAlert("Error", "Could not save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1. Amount Input */}
      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#999"
        />
      </View>

      {/* 2. Type Selector */}
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[
            styles.typeBtn,
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
            styles.typeBtn,
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

      {/* 3. Category Selection */}
      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[
              styles.categoryBtn,
              categoryId === cat._id && styles.selectedCategory,
            ]}
            onPress={() => setCategoryId(cat._id)}
          >
            <Text
              style={[
                styles.catLabel,
                categoryId === cat._id && styles.whiteText,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. Note Input */}
      <View style={styles.card}>
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Write a note..."
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      {/* 5. Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Transaction</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: { fontSize: 14, color: "#666", marginBottom: 5 },
  amountInput: { fontSize: 32, fontWeight: "bold", color: "#333" },
  typeToggle: { flexDirection: "row", gap: 10, marginBottom: 20 },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#eee",
  },
  activeExpense: { backgroundColor: "#e74c3c" },
  activeIncome: { backgroundColor: "#2ecc71" },
  typeText: { fontWeight: "bold", color: "#666" },
  whiteText: { color: "#fff" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCategory: { backgroundColor: "#3498db", borderColor: "#3498db" },
  catLabel: { color: "#555" },
  noteInput: { fontSize: 16, paddingTop: 10 },
  saveButton: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
