import { View, Text, StyleSheet } from "react-native";
import { memo } from "react";
import { GlobalColors } from "../../constants/GlobalColors";
import Avatar from "../Profile/Avatar";

const ProfileContainer = ({ photoUrl, userName }) => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileCard}>
        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <Avatar photoUrl={photoUrl} size={80} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Welcome </Text>
            <Text
              style={[
                styles.userNameText,
                { color: GlobalColors.primaryColor },
              ]}
            >
              {userName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(ProfileContainer);

const styles = StyleSheet.create({
  profileContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  profileCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalColors.primaryColor,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: GlobalColors.primaryColor,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: GlobalColors.primaryBlack,
    marginTop: 0,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 0,
    textAlign: "left",
    letterSpacing: 0.5,
  },
});
