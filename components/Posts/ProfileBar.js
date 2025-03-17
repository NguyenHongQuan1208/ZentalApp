import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Avatar from "../Profile/Avatar";
import { getUser } from "../../util/user-info-http";
import useRealtimeUser from "../../hooks/useRealtimeUser";
import { GlobalColors } from "../../constants/GlobalColors";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { handleFollowRequest } from "../../util/follow-http";
import ConfirmationDialog from "../PersonalProfile/ConfirmationDialog";

const ProfileBar = React.memo(
  ({
    userId,
    onClose,
    style,
    type,
    currentUserId,
    allowRemoveFollowers,
    onUnfollow,
  }) => {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [userName, setUserName] = useState("User Name");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
      const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const user = await getUser(userId);
          setUserName(user.username);
          setPhotoUrl(user.photoUrl);
        } catch (err) {
          setError(err.message || "Failed to fetch user data.");
          console.error("Error fetching user data:", err);
        } finally {
          setIsLoading(false);
        }
      };

      if (userId) {
        fetchUserData();
      } else {
        setError("No userId provided.");
        setIsLoading(false);
      }
    }, [userId]);

    const handleUserDataChange = (userData) => {
      setUserName(userData.username || "User Name");
      setPhotoUrl(userData.photoUrl || null);
    };

    useRealtimeUser(userId, handleUserDataChange);

    const handleProfilePress = useCallback(() => {
      if (userId) {
        if (onClose) {
          onClose(); // Call onClose function if it exists
        }
        navigation.navigate("PersonalProfile", { userId: userId });
      }
    }, [navigation, userId, onClose]);

    const showConfirmationDialog = () => {
      setIsDialogVisible(true); // Show the confirmation dialog
    };

    const handleRemovePress = () => {
      showConfirmationDialog(); // Show the dialog instead of Alert
    };

    const handleConfirmUnfollow = () => {
      handleFollowRequest(userId, currentUserId);
      if (onUnfollow) {
        onUnfollow(userId); // Call onUnfollow prop after confirming
      }
      setIsDialogVisible(false); // Close the dialog after confirming
    };

    const handleCancelUnfollow = () => {
      setIsDialogVisible(false); // Close the dialog if canceled
    };

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={GlobalColors.primaryColor} />
        </View>
      );
    }

    if (error) {
      return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    return (
      <>
        <Pressable
          onPress={handleProfilePress}
          style={({ pressed }) => [
            styles.pressable,
            { opacity: pressed ? 0.7 : 1 },
            style,
          ]}
          accessible={true}
          accessibilityLabel={`View profile of ${userName}`}
        >
          <View style={styles.container}>
            <Avatar photoUrl={photoUrl} size={40} />
            <Text style={styles.userName}>{userName}</Text>
            {type === "followers" && allowRemoveFollowers && (
              <Pressable onPress={handleRemovePress} style={styles.closeIcon}>
                <Ionicons name="close-circle-outline" size={20} color="red" />
              </Pressable>
            )}
          </View>
        </Pressable>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          visible={isDialogVisible}
          title="Confirm Unfollow"
          message={`Are you sure you want to remove ${userName} from your followers list?`}
          onConfirm={handleConfirmUnfollow}
          onCancel={handleCancelUnfollow}
          confirmText="Yes"
          cancelText="Cancel"
        />
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 4,
  },
  userName: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  loadingContainer: {
    padding: 12,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 12,
  },
  pressable: {
    borderRadius: 8,
  },
  closeIcon: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileBar;
