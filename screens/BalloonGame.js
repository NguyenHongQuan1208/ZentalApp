import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ImageBackground,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { GlobalColors } from "../constants/GlobalColors";

const { width, height } = Dimensions.get("window");

const positiveWords = ["Hope", "Love", "Joy", "Peace", "Strong", "Happy"];
const negativeWords = ["Fear", "Sad", "Angry", "Hate", "Weak", "Pain"];

const BalloonGame = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [balloons, setBalloons] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const spawnBalloon = () => {
    if (isPaused) return; // Don't spawn balloons if the game is paused

    const isPositive = Math.random() > 0.5;
    const word = isPositive
      ? positiveWords[Math.floor(Math.random() * positiveWords.length)]
      : negativeWords[Math.floor(Math.random() * negativeWords.length)];

    const balloon = {
      id: Date.now(),
      word,
      isPositive,
      x: Math.random() * (width - 120),
      y: new Animated.Value(height),
    };

    setBalloons((prev) => [...prev, balloon]);

    Animated.timing(balloon.y, {
      toValue: -180,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    });
  };

  const handleBalloonPress = (balloon) => {
    if (isPaused) return; // Don't handle presses if the game is paused

    if (balloon.isPositive) {
      setScore((prev) => prev + 1);
    } else {
      setLives((prev) => prev - 1);
    }
    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
  };

  useEffect(() => {
    const interval = setInterval(spawnBalloon, 2000);
    return () => clearInterval(interval);
  }, [isPaused]); // Add isPaused to the dependency array

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  if (lives <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOver}>Game Over!</Text>
        <Text style={styles.score}>Final Score: {score}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/sky.jpg")}
      style={styles.container}
    >
      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color={GlobalColors.secondaryColor} // Change to a contrasting color
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePause} style={styles.pauseButton}>
          <Ionicons
            name={isPaused ? "play" : "pause"} // Change icon based on pause state
            size={30}
            color={GlobalColors.secondaryColor} // Change to a contrasting color
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scoreBoard}>
        <View style={styles.scoreBoardTextContainer}>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.lives}>Lives: {lives}</Text>
        </View>
      </View>

      {balloons.map((balloon) => (
        <Animated.View
          key={balloon.id}
          style={[
            styles.balloonContainer,
            {
              transform: [{ translateX: balloon.x }, { translateY: balloon.y }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => handleBalloonPress(balloon)}>
            <Image
              source={require("../assets/hot-air-ballon.png")}
              style={styles.balloon}
            />
            <Text style={styles.word}>{balloon.word}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50, // Increased top padding to push down
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.2)", // Slight translucent background
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // More opaque background for better visibility
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3, // Increased shadow opacity for depth
    shadowRadius: 4,
    elevation: 5, // Increased elevation for better visibility on Android
  },
  pauseButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // More opaque background for better visibility
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3, // Increased shadow opacity for depth
    shadowRadius: 4,
    elevation: 5, // Increased elevation for better visibility on Android
  },
  scoreBoard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  scoreBoardTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
  },
  lives: {
    fontSize: 20,
    fontWeight: "bold",
  },
  balloonContainer: {
    position: "absolute",
  },
  balloon: {
    width: 160,
    height: 240,
    resizeMode: "contain",
  },
  word: {
    position: "absolute",
    width: 70,
    borderRadius: 13,
    top: "40%",
    left: 40,
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: GlobalColors.primaryColor,
    color: "black",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameOver: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height / 3,
  },
});

export default BalloonGame;
