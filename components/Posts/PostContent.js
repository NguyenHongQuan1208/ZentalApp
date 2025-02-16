import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const PostContent = ({ content }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  // Giới hạn số dòng hiển thị ban đầu
  const numberOfLines = showFullContent ? undefined : 3;

  return (
    <>
      <Text
        style={styles.content}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
      >
        {content || "No content"}
      </Text>
      {content && content.length > 100 && (
        <View style={styles.showMoreContainer}>
          <Text
            style={styles.showMoreText}
            onPress={() => setShowFullContent(!showFullContent)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={showFullContent ? "Show less" : "Show more"}
          >
            {showFullContent ? "Show less" : "Show more"}
          </Text>
        </View>
      )}
    </>
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
  showMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
  },
  showMoreText: {
    color: GlobalColors.primaryColor,
    fontSize: 14,
  },
});

export default React.memo(PostContent);
