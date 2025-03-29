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
  Vibration, // Thêm Vibration
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalColors } from "../constants/GlobalColors";
import GameModal from "../components/BalloonGame/GameModal";

const { width, height } = Dimensions.get("window");

const positiveWords = [
  "Hope",
  "Love",
  "Joy",
  "Peace",
  "Strong",
  "Happy",
  "Kind",
  "Good",
  "Brave",
  "Free",
  "Wise",
  "True",
  "Calm",
  "Shine",
  "Bold",
  "Glow",
  "Play",
  "Lift",
  "Rise",
  "Trust",
  "Heal",
];

const negativeWords = [
  "Fear",
  "Sad",
  "Angry",
  "Hate",
  "Weak",
  "Pain",
  "Loss",
  "Dull",
  "Cold",
  "Sick",
  "Dark",
  "Tear",
  "Fail",
  "Hurt",
  "Broke",
  "Worn",
  "Sour",
  "Grim",
  "Bash",
  "Gloom",
  "Foul",
];

const BalloonGame = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [balloons, setBalloons] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const animations = useRef(new Map()).current;
  const explodeAnimations = useRef(new Map()).current; // Thêm để quản lý animation nổ

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
      scale: new Animated.Value(1), // Thêm scale để tạo hiệu ứng nổ
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

    animations.get(balloon.id)?.stop();

    if (balloon.isPositive) {
      // Hiệu ứng cho balloon tích cực
      setScore((prev) => prev + 1);
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
      animations.delete(balloon.id);
    } else {
      // Hiệu ứng cho balloon tiêu cực
      setLives((prev) => prev - 1);
      Vibration.vibrate(200); // Rung trong 200ms

      // Animation nổ: phóng to rồi mờ dần
      const explodeAnimation = Animated.sequence([
        Animated.timing(balloon.scale, {
          toValue: 1.5, // Phóng to
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(balloon.scale, {
          toValue: 0, // Thu nhỏ và biến mất
          duration: 150,
          useNativeDriver: true,
        }),
      ]);

      explodeAnimations.set(balloon.id, explodeAnimation);
      explodeAnimation.start(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
        animations.delete(balloon.id);
        explodeAnimations.delete(balloon.id);
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(spawnBalloon, 2000);
    return () => clearInterval(interval);
  }, [isPaused, isGameStarted]);

  const togglePause = () => {
    setIsPaused((prev) => {
      const newPausedState = !prev;
      if (newPausedState) {
        animations.forEach((anim) => anim.stop());
      } else {
        balloons.forEach((balloon) => {
          const currentY = balloon.y.__getValue();
          if (currentY > -180) {
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
    animations.clear();
    explodeAnimations.clear();
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsGameStarted(false);
    setIsPaused(true);
    animations.forEach((anim) => anim.stop());
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
          <Ionicons name="chevron-back" size={30} />
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
              transform: [
                { translateX: balloon.x },
                { translateY: balloon.y },
                { scale: balloon.scale }, // Thêm scale cho hiệu ứng nổ
              ],
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  lives: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D32F2F",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    overflow: "hidden",
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
    backgroundColor: GlobalColors.secondColor,
    color: "black",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default BalloonGame;