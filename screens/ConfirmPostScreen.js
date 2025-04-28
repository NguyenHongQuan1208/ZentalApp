import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import Target from "../components/TaskSection/Target";
import { GlobalColors } from "../constants/GlobalColors";
import CustomSwitch from "../components/ui/CustomSwitch";
import EmotionButton from "../components/TaskSection/EmotionButton";
import LongButton from "../components/ui/LongButton";
import { getAllPosts, updatePost, addPost } from "../util/posts-data-http";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

const EMOTIONS = [
  { label: "Tons!", icon: "happy", value: 4 },
  { label: "A Lot", icon: "happy-outline", value: 3 },
  { label: "So so", icon: "sad-outline", value: 2 },
  { label: "Nah", icon: "sad", value: 1 },
];

function ConfirmPostScreen({ navigation, route }) {
  // Destructure route params
  const {
    content,
    imageUri,
    sectionId,
    sectionColor,
    title,
    uid,
    icon,
    color,
  } = route.params;

  // State
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isCommunityVisible, setIsCommunityVisible] = useState(false);

  // Handlers
  const handleSelectEmotion = (index) => setSelectedEmotion(index);
  const toggleCommunityVisibility = () =>
    setIsCommunityVisible((prev) => !prev);

  const handlePost = async () => {
    try {
      const publicStatus = isCommunityVisible ? 1 : 0;
      const pleasurePoint =
        selectedEmotion !== null ? EMOTIONS[selectedEmotion].value : 1;

      const posts = await getAllPosts();
      const existingPost = posts.find(
        (post) =>
          post.sectionId === sectionId && post.uid === uid && post.status === 0
      );

      const postData = {
        content,
        imageUri,
        status: 1,
        publicStatus,
        pleasurePoint,
        sectionId,
        sectionColor,
        title,
        uid,
        createdAt: new Date(),
      };

      if (existingPost) {
        await updatePost(existingPost.id, postData);
        Alert.alert("Success", "Post Created");
      } else {
        await addPost(postData);
        Alert.alert("Success", "Post successfully created");
      }

      navigation.navigate("AppOverview", {
        screen: publicStatus === 0 ? "Task" : "Posts",
      });
    } catch (error) {
      console.error("Post error:", error);
      Alert.alert("Error", "Failed to create post");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Target icon={icon} target={title} color={color} size={13} />
          <Text style={[styles.title, { color }]}>You decide How</Text>
        </View>

        <View style={styles.emotionSection}>
          <Text style={styles.question}>How much did you enjoy this?</Text>
          <View style={styles.buttonsContainer}>
            {EMOTIONS.map((emotion, index) => (
              <EmotionButton
                key={index}
                emotion={emotion}
                isSelected={selectedEmotion === index}
                onSelect={() => handleSelectEmotion(index)}
              />
            ))}
          </View>
        </View>

        <View style={styles.communitySection}>
          <Text style={styles.communityText}>
            Zental Community can see this post
          </Text>
          <CustomSwitch
            isOn={isCommunityVisible}
            onToggle={toggleCommunityVisibility}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <LongButton style={styles.longButton} onPress={handlePost}>
          POST IT!
        </LongButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  emotionSection: {
    alignItems: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  communitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: GlobalColors.inActivetabBarColor,
    marginTop: 20,
    width: "100%",
  },
  communityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalColors.inActivetabBarColor,
    flexWrap: "wrap",
    width: "80%",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingBottom: aspectRatio <= 1.78 ? 16 : 32,
  },
  longButton: {
    marginTop: 8,
    paddingVertical: 12,
  },
});

export default ConfirmPostScreen;
