import React, { useState, useEffect, useRef } from "react";
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
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalColors } from "../constants/GlobalColors";
import GameModal from "../components/BalloonGame/GameModal";

const { width, height } = Dimensions.get("window");

const positiveWords = ["Hope", "Love", "Joy", "Peace", "Strong", "Happy"];
const negativeWords = ["Fear", "Sad", "Angry", "Hate", "Weak", "Pain"];

const BalloonGame = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [balloons, setBalloons] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const animations = useRef(new Map()).current;

  const spawnBalloon = () => {
    if (isPaused || !isGameStarted) return;

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

    const animation = Animated.timing(balloon.y, {
      toValue: -180,
      duration: 5000,
      useNativeDriver: true,
    });

    animations.set(balloon.id, animation);
    animation.start(({ finished }) => {
      if (finished) {
        setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
        animations.delete(balloon.id);
      }
    });
  };

  const handleBalloonPress = (balloon) => {
    if (isPaused || !isGameStarted) return;

    if (balloon.isPositive) {
      setScore((prev) => prev + 1);
    } else {
      setLives((prev) => prev - 1);
    }
    animations.get(balloon.id)?.stop();
    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    animations.delete(balloon.id);
  };

  useEffect(() => {
    const interval = setInterval(spawnBalloon, 2000);
    return () => clearInterval(interval);
  }, [isPaused, isGameStarted]);

  const togglePause = () => {
    setIsPaused((prev) => {
      const newPausedState = !prev;
      if (newPausedState) {
        // Khi pause, dừng tất cả animation
        animations.forEach((anim) => anim.stop());
      } else {
        // Khi resume, tiếp tục animation từ vị trí hiện tại
        balloons.forEach((balloon) => {
          const currentY = balloon.y.__getValue();
          if (currentY > -180) {
            // Chỉ tiếp tục nếu balloon chưa ra khỏi màn hình
            const remainingDistance = -180 - currentY;
            const remainingTime = (remainingDistance / (height + 180)) * 5000;

            const animation = Animated.timing(balloon.y, {
              toValue: -180,
              duration: remainingTime > 0 ? remainingTime : 5000,
              useNativeDriver: true,
            });

            animations.set(balloon.id, animation);
            animation.start(({ finished }) => {
              if (finished) {
                setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
                animations.delete(balloon.id);
              }
            });
          }
        });
      }
      return newPausedState;
    });
  };

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setScore(0);
    setLives(3);
    setBalloons([]);
    setIsPaused(false);
    animations.clear(); // Xóa tất cả animation khi bắt đầu lại
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsGameStarted(false);
    setIsPaused(true);
    animations.forEach((anim) => anim.stop()); // Dừng tất cả animation khi game over
  };

  useEffect(() => {
    if (lives <= 0) {
      handleGameOver();
    }
  }, [lives]);

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
            color={GlobalColors.secondaryColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePause} style={styles.pauseButton}>
          <Ionicons
            name={isPaused ? "play" : "pause"}
            size={30}
            color={GlobalColors.secondaryColor}
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

      <GameModal
        visible={!isGameStarted && !isGameOver}
        message="Tap the positive word"
        onClose={startGame}
        buttonText="Start"
      />

      <GameModal
        visible={isGameOver}
        message={`Game Over!\nFinal Score: ${score}`}
        onClose={startGame}
        buttonText="Start Again"
      />
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
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pauseButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    fontSize: 22, // Tăng kích thước chữ
    fontWeight: "bold",
    color: "#2E7D32", // Màu xanh lá đậm cho Score
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Nền trắng mờ
    paddingVertical: 5, // Padding dọc
    paddingHorizontal: 15, // Padding ngang
    borderRadius: 10, // Bo góc
    overflow: "hidden", // Đảm bảo bo góc không bị cắt
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  lives: {
    fontSize: 22, // Tăng kích thước chữ
    fontWeight: "bold",
    color: "#D32F2F", // Màu đỏ đậm cho Lives
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Nền trắng mờ
    paddingVertical: 5, // Padding dọc
    paddingHorizontal: 15, // Padding ngang
    borderRadius: 10, // Bo góc
    overflow: "hidden", // Đảm bảo bo góc không bị cắt
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
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
});

export default BalloonGame;
