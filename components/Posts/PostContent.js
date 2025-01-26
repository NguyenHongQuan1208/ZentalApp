import React, { useState } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const PostContent = ({ content }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  return (
    <Text style={styles.content}>
      {showFullContent
        ? content || "No content"
        : content?.length > 100
        ? `${content.substring(0, 100)}... `
        : content || "No content"}
      {content && content.length > 100 && (
        <Text
          style={styles.showMoreText}
          onPress={() => setShowFullContent(!showFullContent)}
        >
          {showFullContent ? " Show less" : "Show more"}
        </Text>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  content: {
    fontSize: 14,
    color: GlobalColors.primaryBlack,
    lineHeight: 20,
    marginBottom: 6,
    textAlign: "auto",
  },
  showMoreText: {
    color: GlobalColors.primaryColor,
    fontSize: 14,
  },
});

export default PostContent;
