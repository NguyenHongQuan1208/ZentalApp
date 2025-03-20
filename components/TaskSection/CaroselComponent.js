import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: screenWidth } = Dimensions.get("window");

const slideData = [
  {
    id: "s1",
    icon: "flame",
    name: "Uplift",
    slogan: "Slogan 1",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/uplift.jpg",
  },
  {
    id: "s2",
    icon: "fast-food",
    name: "Negative Knockout",
    slogan: "Slogan 2",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/negative-knockout.jpg",
  },
  {
    id: "s3",
    icon: "medkit",
    name: "Breather",
    slogan: "Slogan 3",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/breather.jpg",
  },
  {
    id: "s4",
    icon: "happy",
    name: "Serenity Scene",
    slogan: "Slogan 4",
    slideImg:
      "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Slider/senerity-scence.jpg",
  },
];

// Thêm slide cuối cùng vào đầu mảng và slide đầu tiên vào cuối mảng
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

    // Nếu trượt đến slide "giả" đầu tiên, chuyển đến slide thực tế cuối cùng
    if (index === 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          x: screenWidth * (extendedSlideData.length - 2),
          animated: false,
        });
      }, 10); // Giảm thời gian delay để mượt hơn
      setCurrentIndex(extendedSlideData.length - 2);
    }

    // Nếu trượt đến slide "giả" cuối cùng, chuyển đến slide thực tế đầu tiên
    if (index === extendedSlideData.length - 1) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({ x: screenWidth, animated: false });
      }, 10); // Giảm thời gian delay để mượt hơn
      setCurrentIndex(1);
    }
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
            <View style={styles.textContainer}>
              <Ionicons name={item.icon} size={30} color="#fff" />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.slogan}>{item.slogan}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
  },
  slide: {
    width: screenWidth, // Full width of the screen for each slide
    height: 250,
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
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure text is above the image
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  slogan: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SlideComponent;
