import React, { useRef, useState, useEffect } from "react";
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

const { width: screenWidth } = Dimensions.get("window");

const slideData = [
  {
    id: "s1",
    icon: "flame",
    name: "Uplift",
    color: "#BC6A0B",
    slogan: "The power of the positive",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/uplift.jpg",
  },
  {
    id: "s2",
    icon: "fast-food",
    name: "Negative Knockout",
    color: "#D500A9",
    slogan: "Wipe out your worries",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/negative-knockout.jpg",
  },
  {
    id: "s3",
    icon: "medkit",
    name: "Breather",
    color: "#A4BE00",
    slogan: "Reduce Stress and find calm",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/breather.jpg",
  },
  {
    id: "s4",
    icon: "happy",
    name: "Serenity Scene",
    color: "#D500A9",
    slogan: "Find a moment of peace",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/senerity-scence.jpg",
  },
];

// Add the last slide to the beginning and the first slide to the end of the array
const extendedSlideData = [
  slideData[slideData.length - 1],
  ...slideData,
  slideData[0],
];

const SlideComponent = () => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);

    // If scrolled to the first fake slide, go to the real last slide
    if (index === 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          x: screenWidth * (extendedSlideData.length - 2),
          animated: false,
        });
      }, 10);
      setCurrentIndex(extendedSlideData.length - 2);
    }

    // If scrolled to the last fake slide, go to the real first slide
    if (index === extendedSlideData.length - 1) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({ x: screenWidth, animated: false });
      }, 10);
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % extendedSlideData.length;
      scrollViewRef.current.scrollTo({
        x: screenWidth * nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 5000); // Change slide every 5 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToSlide = (index) => {
    scrollViewRef.current.scrollTo({ x: screenWidth * index, animated: true });
    setCurrentIndex(index);
  };

  const goToPreviousSlide = () => {
    const previousIndex =
      (currentIndex - 1 + extendedSlideData.length) % extendedSlideData.length;
    goToSlide(previousIndex);
  };

  const goToNextSlide = () => {
    const nextIndex = (currentIndex + 1) % extendedSlideData.length;
    goToSlide(nextIndex);
  };

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
        initialScrollIndex={1}
      >
        {extendedSlideData.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: item.slideImg }} style={styles.image} />
            <View
              style={[styles.overlay, { backgroundColor: item.color + "99" }]}
            />
            <View style={styles.textContainer}>
              <Ionicons name={item.icon} size={44} color="#fff" />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.slogan}>{item.slogan}</Text>
              <StartButton
                onPress={() => console.log(`Starting ${item.name}`)}
              />
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      <TouchableOpacity
        style={styles.chevronButtonLeft}
        onPress={goToPreviousSlide}
      >
        <Ionicons name="chevron-back" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.chevronButtonRight}
        onPress={goToNextSlide}
      >
        <Ionicons name="chevron-forward" size={30} color="#fff" />
      </TouchableOpacity>
      <View style={styles.dotsContainer}>
        {slideData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index + 1)}
            style={styles.dot}
          >
            <View
              style={[
                styles.dotIndicator,
                currentIndex === index + 1
                  ? styles.activeDot
                  : styles.inactiveDot,
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
    width: "100%", // Ensure it takes full width
    height: 240, // Fixed height for the carousel
    position: "relative", // Position relative to allow absolute positioning of icons
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
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
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
  },
  slogan: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chevronButtonLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -15 }], // Center the icon vertically
    zIndex: 2, // Ensure it's above other elements
  },
  chevronButtonRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -15 }], // Center the icon vertically
    zIndex: 2, // Ensure it's above other elements
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%", // Ensure dots are centered horizontally
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

export default SlideComponent;
