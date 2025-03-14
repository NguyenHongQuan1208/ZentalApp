import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getFollowing, getFollowers } from "../util/follow-http";
import ProfileBar from "../components/Posts/ProfileBar";

const FollowListScreen = ({ route, navigation }) => {
  const { type, userId, currentUserId } = route.params;
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let list;
        if (type === "following") {
          list = await getFollowing(userId);
        } else {
          list = await getFollowers(userId);
        }
        setListData(list);

        // Set the header title after the data has been fetched
        navigation.setOptions({
          headerTitle: `${list.length} ${
            type === "following" ? "Following" : "Followers"
          }`,
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, userId, navigation]); // Ensure navigation is in the dependency array

  const renderItem = useCallback(
    ({ item, index }) => (
      <ProfileBar
        userId={item.id}
        style={index === 0 ? styles.firstItem : {}}
        type={type}
        currentUserId={currentUserId}
      />
    ),
    []
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No users found.</Text>}
        initialNumToRender={10} // Adjust based on your needs
        windowSize={21} // Adjust based on your needs
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  firstItem: {
    marginTop: 4,
  },
});

export default FollowListScreen;
