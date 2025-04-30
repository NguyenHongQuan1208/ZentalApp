import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { GlobalColors } from "../constants/GlobalColors";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Constants
const VIDEO_SCENES = [
  {
    id: "1",
    title: "Ocean Waves",
    thumbnail:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Thumbnail/ocean-waves.jpg",
    videoUri:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/OceanWaves.mp4",
  },
  {
    id: "2",
    title: "Forest Stream",
    thumbnail:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Thumbnail/forest-stream.jpg",
    videoUri:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/ForestStream.mp4",
  },
  {
    id: "3",
    title: "Mountain View",
    thumbnail:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Thumbnail/mountain-view.jpg",
    videoUri:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/MountainView.mp4",
  },
  {
    id: "4",
    title: "Sunset Beach",
    thumbnail:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Thumbnail/sunset-beach.jpg",
    videoUri:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/SunsetBeach.mp4",
  },
  {
    id: "5",
    title: "Rainy Window",
    thumbnail:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Thumbnail/rainy-window.jpg",
    videoUri:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/RainyWindow.mp4",
  },
  {
    id: "6",
    title: "Fireplace",
    thumbnail:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Thumbnail/fireplace.jpg",
    videoUri:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/Fireplace.mp4",
  },
];

const DURATION_OPTIONS = [2, 5, 10];

export default function SerenitySceneScreen({ navigation }) {
  const { t } = useTranslation();
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const { width } = Dimensions.get("window");
  const itemWidth = useMemo(() => (width - 48) / 2, [width]);
  const isStartDisabled = useMemo(
    () => !selectedVideoId || !selectedDuration,
    [selectedVideoId, selectedDuration]
  );

  const handleVideoSelect = useCallback((videoId) => {
    setSelectedVideoId(videoId);
  }, []);

  const handleDurationSelect = useCallback((duration) => {
    setSelectedDuration(duration);
  }, []);

  const handleStartPress = useCallback(() => {
    if (!isStartDisabled) {
      const selectedScene = VIDEO_SCENES.find(
        (scene) => scene.id === selectedVideoId
      );
      navigation.navigate("VideoPlayer", {
        videoUri: selectedScene.videoUri,
        duration: selectedDuration * 60,
      });
    }
  }, [isStartDisabled, selectedVideoId, selectedDuration, navigation]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={GlobalColors.primaryBlack}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{t("Choose a Serenity Scene")}</Text>

        <View style={styles.thumbnailGrid}>
          {VIDEO_SCENES.map((scene) => (
            <SceneThumbnail
              key={scene.id}
              scene={scene}
              width={itemWidth}
              isSelected={selectedVideoId === scene.id}
              onSelect={handleVideoSelect}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t("Select Duration")}</Text>
        <View style={styles.durationContainer}>
          {DURATION_OPTIONS.map((duration) => (
            <DurationOption
              key={duration}
              duration={duration}
              isSelected={selectedDuration === duration}
              onSelect={handleDurationSelect}
            />
          ))}
        </View>
      </ScrollView>

      <StartButton onPress={handleStartPress} disabled={isStartDisabled} />
    </View>
  );
}

const SceneThumbnail = React.memo(({ scene, width, isSelected, onSelect }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[
        styles.thumbnailContainer,
        { width },
        isSelected && styles.selectedThumbnail,
      ]}
      onPress={() => onSelect(scene.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: scene.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <Text style={styles.sceneTitle}>{t(scene.title)}</Text>
    </TouchableOpacity>
  );
});

const DurationOption = React.memo(({ duration, isSelected, onSelect }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[styles.durationOption, isSelected && styles.selectedDuration]}
      onPress={() => onSelect(duration)}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.durationText, isSelected && styles.selectedDurationText]}
      >
        {t(`${duration} min`)}
      </Text>
    </TouchableOpacity>
  );
});

const StartButton = React.memo(({ onPress, disabled }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.startButton, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.startButtonText}>{t("start")}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 100,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: GlobalColors.primaryBlack,
  },
  thumbnailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  thumbnailContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GlobalColors.lightGray,
    backgroundColor: GlobalColors.lightBackground,
  },
  selectedThumbnail: {
    borderWidth: 3,
    borderColor: GlobalColors.primaryColor,
  },
  thumbnail: {
    width: "100%",
    height: 120,
  },
  sceneTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    textAlign: "center",
    fontWeight: "500",
    color: GlobalColors.pureWhite,
    fontSize: 14,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: GlobalColors.primaryBlack,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  durationOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: GlobalColors.lightGray,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedDuration: {
    backgroundColor: GlobalColors.primaryColor,
  },
  durationText: {
    fontWeight: "500",
    color: GlobalColors.primaryBlack,
  },
  selectedDurationText: {
    color: GlobalColors.pureWhite,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: GlobalColors.primaryWhite,
    borderTopWidth: 1,
    borderTopColor: GlobalColors.lightGray,
  },
  startButton: {
    backgroundColor: GlobalColors.primaryColor,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: GlobalColors.primaryGrey,
  },
  startButtonText: {
    color: GlobalColors.pureWhite,
    fontSize: 18,
    fontWeight: "bold",
  },
});
