import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function VideoPlayerScreen({ route, navigation }) {
    const { videoUri, duration } = route.params;
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [status, setStatus] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigation.goBack();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigation, duration]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    const handleVideoPlaybackStatusUpdate = (status) => {
        setStatus(status);
        if (status.isLoaded && isLoading) {
            setIsLoading(false);
        }
        if (status.didJustFinish) {
            videoRef.current?.replayAsync();
        }
    };

    const togglePlayPause = async () => {
        if (isPlaying) {
            await videoRef.current?.pauseAsync();
        } else {
            await videoRef.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = async () => {
        await videoRef.current?.setIsMutedAsync(!isMuted);
        setIsMuted(!isMuted);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };


    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4a90e2" />
                    <Text style={styles.loadingText}>Loading video...</Text>
                </View>
            )}

            <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: videoUri }}
                resizeMode={ResizeMode.COVER}
                shouldPlay={isPlaying}
                isLooping
                isMuted={isMuted}
                volume={0.7}
                onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
            />

            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" color="white" size={24} />
                </TouchableOpacity>

                <View style={styles.controlsContainer}>
                    <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            color="white"
                            size={24}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                        <Ionicons
                            name={isMuted ? "volume-mute" : "volume-medium"}
                            color="white"
                            size={24}
                        />
                    </TouchableOpacity>

                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                            {formatTime(timeRemaining)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    video: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 16,
        justifyContent: "space-between",
    },
    backButton: {
        width: 40,
        height: 40,
        marginTop: 28,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    controlsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 25,
        padding: 10,
        marginBottom: 30,
    },
    controlButton: {
        marginHorizontal: 15,
        padding: 8,
    },
    timerContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    timerText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 10,
    },
    loadingText: {
        color: "white",
        marginTop: 10,
        fontSize: 16,
    },
});