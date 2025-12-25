import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

// Enum định nghĩa loại giao dịch
enum TransactionType {
  Income = "Income",
  Expense = "Expense",
}

interface Transaction {
  _id: string;
  amount: number;
  note: string;
  type: TransactionType;
  categoryId: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<TransactionType | "All">("All");

  // Sử dụng biến môi trường cho URL
  const API_URL = process.env.EXPO_PUBLIC_API_URL + "/transactions"; 

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // Giả sử bạn có endpoint lấy lịch sử, nếu chưa có hãy dùng base url /transactions
      const response = await axios.get(API_URL);
      setTransactions(response.data);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Logic lọc dữ liệu tại Frontend để mượt mà
  const filteredData = filterType === "All" 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  const renderItem = ({ item }: { item: Transaction }) => {
    const isExpense = item.type === TransactionType.Expense;

    return (
      <View style={styles.transactionItem}>
        <View style={[styles.iconCircle, { backgroundColor: isExpense ? "#ffebee" : "#e8f5e9" }]}>
          <Ionicons 
            name={isExpense ? "arrow-down-circle" : "arrow-up-circle"} 
            size={24} 
            color={isExpense ? "red" : "green"} 
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.noteText} numberOfLines={1}>
            {item.note || "Không có ghi chú"}
          </Text>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </View>

        <Text style={[styles.amountText, { color: isExpense ? "red" : "green" }]}>
          {isExpense ? "-" : "+"}{item.amount.toLocaleString()}đ
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Bộ lọc giống trang Categories */}
      <View style={styles.filterContainer}>
        {["All", "Expense", "Income"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterBtn,
              filterType === type && styles.activeBtn,
            ]}
            onPress={() => setFilterType(type as any)}
          >
            <Text style={[styles.filterText, filterType === type && styles.activeText]}>
              {type === "All" ? "Tất cả" : type === "Expense" ? "Chi tiêu" : "Thu nhập"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có giao dịch nào</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  filterContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0",
  },
  activeBtn: { backgroundColor: "green" },
  filterText: { fontWeight: "600", color: "#666", fontSize: 13 },
  activeText: { color: "#fff" },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    // Đổ bóng nhẹ
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContainer: { flex: 1 },
  noteText: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 2 },
  dateText: { fontSize: 12, color: "#999" },
  amountText: { fontSize: 17, fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999" },
});