import { View, Image, Pressable, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
function NoteImagePreview({ imageUri, onPress }) {
  return (
    <View style={styles.imagePreviewContainer}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
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
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  overlayButton: {
    position: "absolute",
    top: "40%",
    left: "20%",
    bottom: "40%",
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
