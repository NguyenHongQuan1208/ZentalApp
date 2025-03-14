import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getFollowing, getFollowers } from "../util/follow-http";

const FollowListScreen = ({ route, navigation }) => {
  const { type, userId } = route.params;
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set header title based on type
  useEffect(() => {
    navigation.setOptions({
      headerTitle: type === "following" ? "Following List" : "Followers List",
    });
  }, [navigation, type]);

  // Fetch data based on type
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === "following") {
          const followingList = await getFollowing(userId);
          setListData(followingList);
        } else {
          const followersList = await getFollowers(userId);
          setListData(followersList);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, userId]);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render the list
  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.id}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No users found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default FollowListScreen;
