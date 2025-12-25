import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";

enum CategoriesType {
  Income = "Income",
  Expense = "Expense",
}

interface Category {
  _id: string;
  name: string;
  type: CategoriesType;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>();
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<CategoriesType>(
    CategoriesType.Expense
  );

  const { width } = useWindowDimensions();

  const isLargeScreen = width > 768;

  const fetchCategories = async (type: CategoriesType) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3000/api/categories/by-type",
        {
          params: { type: type },
        }
      );

      console.log(response.data);

      setCategories(response.data);
    } catch (error) {
      console.log("Cannot fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories(filterType);
    }, [filterType])
  );

  const renderItem = ({ item }: { item: Category }) => {
    return (
      <View
        style={[
          styles.categoryItem,
          { width: isLargeScreen ? "50%" : "100%", alignSelf: "center" },
        ]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="pricetag-outline" size={20} color="#555" />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Bộ lọc Type */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === CategoriesType.Expense && styles.activeBtn,
          ]}
          onPress={() => setFilterType(CategoriesType.Expense)}
        >
          <Text
            style={[
              styles.filterText,
              filterType === CategoriesType.Expense && styles.activeText,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === CategoriesType.Income && styles.activeBtn,
          ]}
          onPress={() => setFilterType(CategoriesType.Income)}
        >
          <Text
            style={[
              styles.filterText,
              filterType === CategoriesType.Income && styles.activeText,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Categories In List</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/settings/add_category")}
        style={styles.fab}
      >
        <Ionicons name="add" color={"white"} size={20} />
      </TouchableOpacity>
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
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
  },
  activeBtn: { backgroundColor: "green" },
  filterText: { fontWeight: "600", color: "#666" },
  activeText: { color: "#fff" },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  categoryName: { flex: 1, fontSize: 16, color: "#333" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999" },

  fab: {
    borderRadius: 30,
    backgroundColor: "green",
    padding: 20,
    color: "white",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
