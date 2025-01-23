import React from "react";
import { View, Image, StyleSheet } from "react-native";

function Avatar({ photoUrl, size = 100 }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <Image
          source={require("../../assets/default-avatar.png")}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      )}
    </View>
  );
}
export default Avatar;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
});
