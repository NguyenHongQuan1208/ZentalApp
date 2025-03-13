import React from "react";
import { View, StyleSheet } from "react-native";
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
  return (
    <View style={styles.headerContainer}>
      <UserProfileHeader {...userData} />
      <View style={styles.buttonsContainer}>
        <CheckFollowButton
          title="Following"
          onPress={() => console.log("Following pressed")}
        />
        <CheckFollowButton
          title="Follower"
          onPress={() => console.log("Follower pressed")}
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
