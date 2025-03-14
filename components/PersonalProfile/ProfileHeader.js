import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Nhập useNavigation
import UserProfileHeader from "./UserProfileHeader";
import CheckFollowButton from "./CheckFollowButton";
import FilterButton from "./FilterButton";
import FollowButton from "./FollowButton";
import { GlobalColors } from "../../constants/GlobalColors";

const ProfileHeader = ({
  userData,
  currentUserId,
  userId,
  isFollowing,
  toggleFollow,
  openModal,
}) => {
  const navigation = useNavigation(); // Lấy đối tượng navigation

  // Hàm điều hướng đến danh sách người theo dõi
  const navigateToFollowingList = () => {
    navigation.navigate("FollowList", {
      userId,
      type: "following",
      currentUserId,
    });
  };

  // Hàm điều hướng đến danh sách người theo dõi
  const navigateToFollowersList = () => {
    navigation.navigate("FollowList", {
      userId,
      type: "followers",
      currentUserId,
    });
  };

  return (
    <View style={styles.headerContainer}>
      <UserProfileHeader {...userData} />
      <View style={styles.buttonsContainer}>
        <CheckFollowButton
          title="Following"
          onPress={navigateToFollowingList} // Điều hướng đến danh sách người đang theo dõi
        />
        <CheckFollowButton
          title="Followers"
          onPress={navigateToFollowersList} // Điều hướng đến danh sách người theo dõi
        />
        {currentUserId === userId ? (
          <FilterButton onPress={openModal} />
        ) : (
          <FollowButton
            isFollowing={isFollowing}
            onToggleFollow={toggleFollow}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: GlobalColors.pureWhite,
    paddingBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: -10,
  },
});

export default ProfileHeader;
