import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getFollowing, getFollowers } from "../util/follow-http";
import ProfileBar from "../components/Posts/ProfileBar";
import Ionicons from "react-native-vector-icons/Ionicons"; // Thêm biểu tượng

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

  const handleUnfollow = useCallback(
    (userIdToRemove) => {
      setListData((prevList) => {
        const updatedList = prevList.filter(
          (item) => item.id !== userIdToRemove
        );
        // Cập nhật tiêu đề sau khi danh sách đã thay đổi
        navigation.setOptions({
          headerTitle: `${updatedList.length} ${
            type === "following" ? "Following" : "Followers"
          }`,
        });
        return updatedList;
      });
    },
    [navigation, type]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <ProfileBar
        userId={item.id}
        style={index === 0 ? styles.firstItem : {}}
        type={type}
        currentUserId={currentUserId}
        allowRemoveFollowers={userId === currentUserId}
        onUnfollow={() => handleUnfollow(item.id)} // Truyền hàm handleUnfollow
      />
    ),
    [type, currentUserId, userId, handleUnfollow]
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No users found.</Text>
    </View>
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
        ListEmptyComponent={ListEmptyComponent} // Sử dụng ListEmptyComponent đã tạo
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
});

export default FollowListScreen;
