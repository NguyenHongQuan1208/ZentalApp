import React, { useState } from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const PostImage = ({ imageUri, style }) => {
  const [isImageLoading, setIsImageLoading] = useState(false);

  return (
    <View style={[styles.imageContainer, style]}>
      {isImageLoading && (
        <View style={styles.loadingBackground}>
          <ActivityIndicator
            size="large"
            color={GlobalColors.primaryColor}
            style={styles.imageLoadingIndicator}
          />
        </View>
      )}
      <Image
        source={{ uri: imageUri }}
        style={[styles.postImage, style]}
        onLoadStart={() => setIsImageLoading(true)}
        onLoadEnd={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  loadingBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite, // Background màu primaryWhite
    borderRadius: 10, // Bo góc để phù hợp với hình ảnh
  },
  imageLoadingIndicator: {
    position: "absolute",
  },
});

export default PostImage;
