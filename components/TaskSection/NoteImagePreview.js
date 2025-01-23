import React, { useState, useEffect } from "react";
import { View, Image, Pressable, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { fetchImageBySectionId } from "../../util/section-default-image-http";

function NoteImagePreview({ imageUri, onPress, sectionId }) {
  const [defaultImageUri, setDefaultImageUri] = useState(null);

  useEffect(() => {
    // Nếu không có imageUri, mới gọi Firebase để lấy ảnh
    if (!imageUri) {
      const getImage = async () => {
        const uri = await fetchImageBySectionId(sectionId);
        setDefaultImageUri(uri);
      };

      getImage();
    }
  }, [sectionId, imageUri]); // Re-fetch khi `sectionId` thay đổi hoặc `imageUri` thay đổi

  // Sử dụng imageUri nếu có, ngược lại dùng ảnh mặc định từ Firebase
  const finalImageUri = imageUri || defaultImageUri;

  return (
    <View style={styles.imagePreviewContainer}>
      {finalImageUri ? (
        <Image source={{ uri: finalImageUri }} style={styles.imagePreview} />
      ) : (
        <Image
          source={require("../../assets/image-preview.jpg")}
          style={styles.imagePreview}
        />
      )}

      <Pressable style={styles.overlayButton} onPress={onPress}>
        <Text style={styles.overlayButtonText}>Take or Choose Photo</Text>
      </Pressable>
    </View>
  );
}
export default NoteImagePreview;

const styles = StyleSheet.create({
  imagePreviewContainer: {
    width: "100%",
    aspectRatio: 1 / 1,
    borderRadius: "10%",
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlayButton: {
    position: "absolute",
    top: "44%",
    left: "20%",
    bottom: "44%",
    right: "20%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  overlayButtonText: {
    color: GlobalColors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
});
