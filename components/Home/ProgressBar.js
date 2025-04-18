import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { memo } from "react";

const ProgressBar = ({ progress, level, color, barStyle }) => {
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [progress, animatedValue]);

    const widthInterpolated = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.progressContainer}>
            <View style={[styles.progressBar, barStyle]}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        {
                            width: widthInterpolated,
                            backgroundColor: color || "#ccc",
                        },
                    ]}
                />
                <View style={styles.levelIndicator}>
                    <Text style={styles.levelText}>Lv. {level}</Text>
                </View>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
            </View>
        </View>
    );
};

// Wrap the component with memo to prevent unnecessary re-renders
export default memo(ProgressBar);

const styles = StyleSheet.create({
    progressContainer: {
        width: "100%",
        marginBottom: 0,
    },
    progressBar: {
        height: 24,
        backgroundColor: "#f0f2f5",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
    },
    progressFill: {
        height: "100%",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
        opacity: 0.85,
    },
    levelIndicator: {
        position: "absolute",
        left: 8,
        top: "50%",
        transform: [{ translateY: -8 }],
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 1.5,
    },
    progressTextContainer: {
        position: "absolute",
        right: 8,
        top: "50%",
        transform: [{ translateY: -8 }],
    },
    progressText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#1a1a1a",
    },
    levelText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#1a1a1a",
        letterSpacing: 0.2,
    },
});
