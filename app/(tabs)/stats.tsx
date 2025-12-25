import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import axios from "axios";

interface Transaction {
  _id: string;
  amount: number;
  type: "Income" | "Expense";
  createdAt: string;
}

export default function StatisticsScreen() {
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
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic xử lý dữ liệu theo tháng
  const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    // Khởi tạo mảng 12 tháng
    const monthlyStats = months.map((month, index) => ({
      label: month,
      income: 0,
      expense: 0,
    }));

    // Duyệt qua transactions để cộng dồn vào từng tháng
    data.forEach((t) => {
      const date = new Date(t.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (t.type === "Income") {
          monthlyStats[monthIndex].income += t.amount;
        } else {
          monthlyStats[monthIndex].expense += t.amount;
        }
      }
    });

    // Chuyển đổi sang định dạng của BarChart (mỗi tháng có 2 cột Income & Expense đứng cạnh nhau)
    const chartData: any[] = [];
    monthlyStats.forEach((m) => {
      // Cột Income (Xanh)
      chartData.push({
        value: m.income,
        label: m.label,
        spacing: 2,
        frontColor: "#2ecc71",
      });
      // Cột Expense (Đỏ)
      chartData.push({
        value: m.expense,
        frontColor: "#e74c3c",
      });
    });

    return chartData;
  };

  if (loading) return <ActivityIndicator size="large" color="#2ecc71" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monthly Statistics</Text>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartSubTitle}>Year {new Date().getFullYear()}</Text>
        
        <BarChart
          data={getMonthlyData()}
          barWidth={15}
          initialSpacing={10}
          spacing={20}
          noOfSections={4}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={"#ddd"}
          yAxisTextStyle={{ color: '#999', fontSize: 10 }}
          isAnimated
          // Định dạng hiển thị số tiền rút gọn (VD: 1k, 1M)
          formatYLabel={(label) => {
            const val = Number(label);
            return val >= 1000 ? `${val / 1000}k` : label;
          }}
        />

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#2ecc71" }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#e74c3c" }]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>

      {/* Tóm tắt nhanh số liệu của tháng hiện tại */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Current Month Summary</Text>
        <View style={styles.summaryRow}>
           <Text style={styles.summaryLabel}>Total Saved</Text>
           <Text style={styles.summaryValue}>
             {(getMonthlyData()[new Date().getMonth() * 2].value - getMonthlyData()[new Date().getMonth() * 2 + 1].value).toLocaleString()}đ
           </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333" },
  chartCard: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 20, 
    elevation: 3, 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20
  },
  chartSubTitle: { fontSize: 14, color: "#999", marginBottom: 20, textAlign: 'center' },
  legendRow: { flexDirection: "row", justifyContent: "center", marginTop: 20, gap: 20 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: "#666" },
  summaryCard: { backgroundColor: "#333", padding: 20, borderRadius: 15 },
  summaryTitle: { color: "#fff", fontSize: 16, marginBottom: 10, opacity: 0.8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: "#fff", fontSize: 14 },
  summaryValue: { color: "#fff", fontSize: 20, fontWeight: 'bold' }
});