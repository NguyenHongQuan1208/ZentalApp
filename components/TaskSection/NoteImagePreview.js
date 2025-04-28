import React, { useState, useEffect } from "react";
import { View, Image, Pressable, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { fetchImageBySectionId } from "../../util/section-default-image-http";
import { useTranslation } from "react-i18next";

function NoteImagePreview({ imageUri, onPress, sectionId }) {
  const { t } = useTranslation();
  const [defaultImageUri, setDefaultImageUri] = useState(null);

  useEffect(() => {
    const getImage = async () => {
      if (!imageUri) {
        const uri = await fetchImageBySectionId(sectionId);
        setDefaultImageUri(uri);
      }
    };

    getImage();
  }, [sectionId, imageUri]);

  const finalImageUri = imageUri || defaultImageUri;

  return (
    <View style={styles.imagePreviewContainer}>
      <Image
        source={finalImageUri ? { uri: finalImageUri } : require("../../assets/image-preview.jpg")}
        style={styles.imagePreview}
      />
      <Pressable style={styles.overlayButton} onPress={onPress}>
        <Text style={styles.overlayButtonText}>{t("Take or Choose Photo")}</Text>
      </Pressable>
    </View>
  );
}

export default NoteImagePreview;

const styles = StyleSheet.create({
  imagePreviewContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
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
