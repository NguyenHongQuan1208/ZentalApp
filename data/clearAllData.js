import AsyncStorage from "@react-native-async-storage/async-storage";

async function clearAllData() {
  try {
    await AsyncStorage.clear();
    console.log("All data cleared from AsyncStorage.");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
}
