// Breather.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from '../components/ui/BackButton'; // Import the BackButton component

const { width } = Dimensions.get("window");
const circleSize = width * 0.7;

const Breather = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState("Inhale");
  const [key, setKey] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);

  const phases = {
    Inhale: 4,
    Hold: 4,
    Exhale: 6,
  };

  useEffect(() => {
    if (isPlaying) {
      startFadeAnimation();
    } else {
      fadeAnim.setValue(1);
    }
  }, [isPlaying, phase]);

  const startFadeAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: phases[phase] * 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: phases[phase] * 500,
        useNativeDriver: true,
      }),
    ]).start((finished) => {
      if (finished && isPlaying) {
        startFadeAnimation();
      }
    });
  };

  const handleComplete = () => {
    let nextPhase;
    if (phase === "Inhale") {
      nextPhase = "Hold";
    } else if (phase === "Hold") {
      nextPhase = "Exhale";
    } else {
      nextPhase = "Inhale";
    }

    setPhase(nextPhase);
    setKey((prevKey) => prevKey + 1);

    return [true, 0];
  };

  const toggleBreathing = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setKey((prevKey) => prevKey + 1);
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "Inhale":
        return "#4CAF50"; // Green
      case "Hold":
        return "#2196F3"; // Blue
      case "Exhale":
        return "#9C27B0"; // Purple
      default:
        return "#4CAF50";
    }
  };

  const getPhaseGradient = () => {
    switch (phase) {
      case "Inhale":
        return ["#4CAF50", "#8BC34A"];
      case "Hold":
        return ["#2196F3", "#03A9F4"];
      case "Exhale":
        return ["#9C27B0", "#E91E63"];
      default:
        return ["#4CAF50", "#8BC34A"];
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Breather/relax-ocean.mp4" }}
        ref={videoRef}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping={true}
        shouldPlay={isPlaying}
        isMuted={false}
        volume={0.3}
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Use the BackButton component */}
      <BackButton onPress={() => navigation.goBack()} style={{ marginTop: 32, marginLeft: 16 }} />

      <View style={styles.content}>
        <Text style={styles.title}>Mindful Breathing</Text>

        <Animated.Text
          style={[
            styles.instruction,
            {
              color: getPhaseColor(),
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [0.9, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          {phase}
        </Animated.Text>

        <View style={styles.circleContainer}>
          <CountdownCircleTimer
            key={key}
            isPlaying={isPlaying}
            duration={phases[phase]}
            colors={[getPhaseColor()]}
            trailColor="rgba(255, 255, 255, 0.2)"
            strokeWidth={15}
            size={circleSize}
            onComplete={handleComplete}
          >
            {({ remainingTime }) => (
              <LinearGradient
                colors={getPhaseGradient()}
                style={styles.timerBackground}
              >
                <Text style={styles.timerText}>{remainingTime}</Text>
              </LinearGradient>
            )}
          </CountdownCircleTimer>
        </View>

        <Text style={styles.guideText}>
          {phase === "Inhale"
            ? "Breathe in deeply..."
            : phase === "Hold"
              ? "Hold your breath..."
              : "Release slowly..."}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isPlaying ? "#FF5252" : getPhaseColor(),
              shadowColor: getPhaseColor(),
            },
          ]}
          onPress={toggleBreathing}
        >
          <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Begin"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 15,
    color: "#FFFFFF",
    fontFamily: "Helvetica Neue",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  instruction: {
    fontSize: 36,
    fontWeight: "800",
    marginVertical: 20,
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  timerBackground: {
    width: circleSize * 0.8,
    height: circleSize * 0.8,
    borderRadius: circleSize * 0.4,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "200",
    color: "white",
    fontFamily: "Helvetica Neue",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 40,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  guideText: {
    marginTop: 30,
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    letterSpacing: 0.8,
    lineHeight: 26,
    maxWidth: "80%",
  },
});

export default Breather;
