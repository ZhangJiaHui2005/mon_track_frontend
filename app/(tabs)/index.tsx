import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

interface Transaction {
  _id: string;
  amount: number;
  type: "Income" | "Expense";
}

export default function Dashboard() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL + "/transactions";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán số liệu
  const totalIncome = data
    .filter((t) => t.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = data
    .filter((t) => t.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpense;

  // Dữ liệu cho biểu đồ Pie
  const pieData = [
    { value: totalIncome, color: "#2ecc71", text: "Income" },
    { value: totalExpense, color: "#e74c3c", text: "Expense" },
  ];

  if (loading) return <ActivityIndicator size="large" color="#2ecc71" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Financial Overview</Text>

      {/* Main Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
        
        <View style={styles.row}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up-circle" size={20} color="#fff" />
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValue}>+${totalIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down-circle" size={20} color="#fff" />
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={styles.statValue}>-${totalExpense.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Income vs Expense Ratio</Text>
        <View style={styles.chartContent}>
          <PieChart
            data={pieData}
            donut
            radius={80}
            innerRadius={60}
            centerLabelComponent={() => (
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                {totalIncome > 0 || totalExpense > 0 
                  ? `${Math.round((totalExpense / (totalIncome + totalExpense)) * 100)}% Exp`
                  : "No Data"}
              </Text>
            )}
          />
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#2ecc71" }]} />
              <Text>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#e74c3c" }]} />
              <Text>Expense</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  balanceCard: {
    backgroundColor: "#333",
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  balanceLabel: { color: "rgba(255,255,255,0.7)", fontSize: 16 },
  balanceAmount: { color: "#fff", fontSize: 36, fontWeight: "bold", marginVertical: 10 },
  row: { flexDirection: "row", marginTop: 15, borderTopWidth: 0.5, borderColor: "#555", paddingTop: 15 },
  statItem: { alignItems: "center", flex: 1 },
  statLabel: { color: "#ccc", fontSize: 12 },
  statValue: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  chartCard: { backgroundColor: "#fff", padding: 20, borderRadius: 20, alignItems: "center" },
  chartTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  chartContent: { flexDirection: "row", alignItems: "center", gap: 20 },
  legendContainer: { gap: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});