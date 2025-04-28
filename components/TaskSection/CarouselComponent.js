import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import StartButton from "./StartButton";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const { width: screenWidth } = Dimensions.get("window");

const slideData = [
  {
    id: "s1",
    icon: "flame",
    name: "Uplift",
    color: "#BC6A0B",
    slogan: "The power of the positive",
    instructions:
      "Where your focus goes, your energy flows. Boost your mood and broaden your thoughts with Uplift— a game designed to help you stay on the lookout for the positive in your surroundings. Notice how shifting your awareness inside of a game might just affect what you focus on outside of it.",
    benefits: [
      "Train your mind for positivity",
      "Lift your mood",
      "Shift your focus away from negative thinking",
    ],
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/uplift.jpg",
  },
  {
    id: "s2",
    icon: "fast-food",
    name: "Monster Mind Cleanse",
    color: "#D500A9",
    slogan: "Smash Away Your Stress",
    instructions:
      "In this game, you'll eliminate pesky monsters representing negative thoughts and work toward a more positive mindset. On the next screen, select a few monsters that symbolize your negative thoughts and feelings, or add your own. Then, tap on these monsters to get rid of them and boost your positivity!",
    benefits: [
      "Reduce the impact of your negative thoughts",
      "Stop ruminating on your worries",
      "Feel empowered to control your thoughts",
    ],
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/monster-mind-cleanse.jpg",
  },
  {
    id: "s3",
    icon: "medkit",
    name: "Breather",
    color: "#A4BE00",
    slogan: "Reduce Stress and find calm",
    instructions:
      "Consider Breather your instant stress reliever: it trains you to control your breathing to activate your body's natural \"calm\" response. It monitors your heart-rate variability (HRV) through your finger on the phone's camera, so make sure you sit straight but comfortably, and rest your hands on a table or your lap as you hold your phone.",
    benefits: [
      "Feel calmer in the moment",
      "Reduce stress",
      "Learn to control your breathing",
    ],
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/breather.jpg",
  },
  {
    id: "s4",
    icon: "happy",
    name: "Serenity Scene",
    color: "#D500A9",
    slogan: "Find a moment of peace",
    instructions:
      "Looking to dial down your anxiety? Our guided relaxation and meditation tracks can help reduce stress.\nChoose a nature scene to put your mind at ease. Set the session time and decide whether you want a guided session, ambient sounds, or both.",
    benefits: [
      "Reduce anxiety and stress",
      "Ease mental fatigue",
      "Feel more relaxed",
    ],
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/senerity-scence.jpg",
  },
];

const CarouselComponent = () => {
  const { t } = useTranslation();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const intervalRef = useRef(null);

  const extendedSlideData = useMemo(() => {
    return [
      slideData[slideData.length - 1],
      ...slideData,
      slideData[0]
    ];
  }, []);

  const handleScroll = useCallback(
    Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      { useNativeDriver: false }
    ),
    []
  );

  const handleScrollEnd = useCallback((event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);

    if (index === 0) {
      scrollViewRef.current?.scrollTo({
        x: screenWidth * (slideData.length),
        animated: false,
      });
      setCurrentIndex(slideData.length - 1);
    } else if (index === slideData.length + 1) {
      scrollViewRef.current?.scrollTo({
        x: screenWidth,
        animated: false,
      });
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index - 1);
    }
  }, []);

  const goToSlide = useCallback((index) => {
    scrollViewRef.current?.scrollTo({ x: screenWidth * (index + 1), animated: true });
    setCurrentIndex(index);
  }, []);

  const goToPreviousSlide = useCallback(() => {
    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      previousIndex = slideData.length - 1;
    }
    goToSlide(previousIndex);
  }, [currentIndex, goToSlide]);

  const goToNextSlide = useCallback(() => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slideData.length) {
      nextIndex = 0;
    }
    goToSlide(nextIndex);
  }, [currentIndex, goToSlide]);

  const handleStartPress = useCallback(() => {
    const currentSlide = slideData[currentIndex];
    navigation.navigate("Instruction", {
      icon: currentSlide.icon,
      name: currentSlide.name,
      color: currentSlide.color,
      slogan: currentSlide.slogan,
      instructions: currentSlide.instructions,
      benefits: currentSlide.benefits,
    });
  }, [currentIndex, navigation]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [goToNextSlide]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: screenWidth, animated: false });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {extendedSlideData.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.slide}>
            <Image
              source={{ uri: item.slideImg }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={[styles.overlay, { backgroundColor: `${item.color}99` }]} />
            <View style={styles.textContainer}>
              <Ionicons name={item.icon} size={44} color="#fff" />
              <Text style={styles.name}>{t(item.name)}</Text>
              <Text style={styles.slogan}>{t(item.slogan)}</Text>
              <StartButton onPress={handleStartPress} />
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <TouchableOpacity style={styles.chevronButtonLeft} onPress={goToPreviousSlide}>
        <Ionicons name="chevron-back" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.chevronButtonRight} onPress={goToNextSlide}>
        <Ionicons name="chevron-forward" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.dotsContainer}>
        {slideData.map((_, index) => (
          <TouchableOpacity
            key={`dot-${index}`}
            onPress={() => goToSlide(index)}
            style={styles.dot}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dotIndicator,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 240,
    position: "relative",
  },
  scrollContainer: {
    alignItems: "center",
  },
  slide: {
    width: screenWidth,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  slogan: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  chevronButtonLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -15 }],
    zIndex: 2,
    padding: 10,
  },
  chevronButtonRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -15 }],
    zIndex: 2,
    padding: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    marginHorizontal: 5,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});

export default React.memo(CarouselComponent);
