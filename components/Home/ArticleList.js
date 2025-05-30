import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { interval } from "date-fns";
import { useTranslation } from "react-i18next";

const articles = [
  {
    id: "1",
    title: "What is Happiness, Anyway?",
    description:
      "What is happiness—and what is it not? People have agonized over this question for centuries, but only recently has science begun to weigh in on the debate.",
    image:
      "https://storage.googleapis.com/a1aa/image/e2d4d9bf-c89e-4e6d-00de-94e4dd294ca8.jpg",
    bgColor: "#f3f4f6",
    textColor: "#1f2937",
    link: "https://www.happify.com/hd/what-is-happiness-anyway/",
  },
  {
    id: "2",
    title: "The Science of Happiness",
    description:
      "Positive psychology is often referred to as the science of happiness, or the study of what makes humans flourish. Learn how it can change your life.",
    image:
      "https://storage.googleapis.com/a1aa/image/2cf95416-2b1e-4c3e-5ed6-a3f3edead7d2.jpg",
    bgColor: "#fcd34d",
    textColor: "#1f2937",
    link: "https://www.happify.com/hd/what-is-the-science-of-happiness/",
  },
  {
    id: "3",
    title: "The 6 Skills That Will Increase Your Well-Being",
    description:
      "What's the key to lasting happiness? A decade's worth of research has confirmed that you can practice certain skills that will increase your happiness in life.",
    image:
      "https://storage.googleapis.com/a1aa/image/b6b08ea8-d85a-4b61-23d6-671a6034ae1d.jpg",
    bgColor: "#bfdbfe",
    textColor: "#1f2937",
    link: "https://www.happify.com/hd/the-6-skills-that-will-increase-your-well-being/",
  },
];

const ArticleCard = ({ item }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleReadMore = useCallback(() => {
    Linking.openURL(item.link);
  }, [item.link]);

  return (
    <View style={[styles.card, { backgroundColor: item.bgColor }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: item.textColor }]}>
          {t(item.title)}
        </Text>
        <Text
          style={[styles.description, { color: item.textColor }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleReadMore}
        >
          <Text style={[styles.readMore, { color: item.textColor }]}>
            {t("read_more")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ArticleList = () => {
  return (
    <FlatList
      data={articles}
      renderItem={({ item }) => <ArticleCard item={item} />}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={3}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  card: {
    borderRadius: 12,
    marginRight: 12,
    width: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  readMoreButton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  readMore: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ArticleList;
