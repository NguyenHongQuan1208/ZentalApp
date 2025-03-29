import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { GlobalColors } from "../constants/GlobalColors";
import { Ionicons } from "@expo/vector-icons";

// Sample video data
const videoScenes = [
    {
        id: "1",
        title: "Ocean Waves",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUri: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/OceanWaves.mp4",
    },
    {
        id: "2",
        title: "Forest Stream",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUri: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/ForestStream.mp4",
    },
    {
        id: "3",
        title: "Mountain View",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUri: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/MountainView.mp4",
    },
    {
        id: "4",
        title: "Sunset Beach",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    },
    {
        id: "5",
        title: "Rainy Window",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUri: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/RainyWindow.mp4",
    },
    {
        id: "6",
        title: "Fireplace",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUri: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Serenity/Video/Fireplace.mp4",
    },
];

// Duration options in minutes
const durationOptions = [2, 5, 10];

export default function SerenitySceneScreen({ navigation }) {
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);

    const handleVideoSelect = (videoId) => {
        setSelectedVideoId(videoId);
    };

    const handleDurationSelect = (duration) => {
        setSelectedDuration(duration);
    };

    const handleStartPress = () => {
        if (selectedVideoId && selectedDuration) {
            const selectedScene = videoScenes.find(scene => scene.id === selectedVideoId);
            navigation.navigate("VideoPlayer", {
                videoUri: selectedScene.videoUri,
                duration: selectedDuration * 60,
            });
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const { width } = Dimensions.get("window");
    const itemWidth = (width - 48) / 2;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="chevron-back" size={28} color={GlobalColors.primaryBlack} />
                </TouchableOpacity>

                <Text style={styles.title}>Choose a Serenity Scene</Text>

                <View style={styles.thumbnailGrid}>
                    {videoScenes.map((scene) => (
                        <TouchableOpacity
                            key={scene.id}
                            style={[
                                styles.thumbnailContainer,
                                { width: itemWidth },
                                selectedVideoId === scene.id && styles.selectedThumbnail,
                            ]}
                            onPress={() => handleVideoSelect(scene.id)}
                        >
                            <Image source={{ uri: scene.thumbnail }} style={styles.thumbnail} />
                            <Text style={styles.sceneTitle}>{scene.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Select Duration</Text>
                <View style={styles.durationContainer}>
                    {durationOptions.map((duration) => (
                        <TouchableOpacity
                            key={duration}
                            style={[styles.durationOption, selectedDuration === duration && styles.selectedDuration]}
                            onPress={() => handleDurationSelect(duration)}
                        >
                            <Text style={[styles.durationText, selectedDuration === duration && styles.selectedDurationText]}>
                                {duration} min
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Fixed Start Button at bottom */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.startButton, (!selectedVideoId || !selectedDuration) && styles.disabledButton]}
                    onPress={handleStartPress}
                    disabled={!selectedVideoId || !selectedDuration}
                >
                    <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalColors.primaryWhite,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 40,
        paddingBottom: 100, // Extra padding to avoid button overlap
    },
    backButton: {
        marginTop: 16,
        marginBottom: 10,
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
        borderRadius: 6,
        resizeMode: "cover",
    },
    sceneTitle: {
        marginTop: 8,
        textAlign: "center",
        fontWeight: "500",
        color: GlobalColors.primaryBlack,
        fontSize: 14,
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
    selectedDurationText: {
        color: GlobalColors.pureWhite,
    },
    durationText: {
        fontWeight: "500",
        color: GlobalColors.primaryBlack,
    },
    buttonContainer: {
        position: 'absolute',
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
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: 'bold',
    },
});