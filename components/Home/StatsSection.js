// StatsSection.js
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ProgressBar from "./ProgressBar";
import { GlobalColors } from '../../constants/GlobalColors';

const StatsSection = ({ postCounts, sectionColors, sectionTitles, sectionLevels, sectionProgress, refreshing, placeholderSections }) => {
  const progressBarElements = useMemo(() => {
    if (refreshing && placeholderSections.length > 0) {
      return placeholderSections.map((section) => (
        <View key={section} style={styles.progressItemContainer}>
          <Text style={styles.sectionTitle}>Loading...</Text>
          <ProgressBar
            progress={0}
            level={0}
            color="#ccc"
            barStyle={{ borderWidth: 0.5, borderColor: "#ccc" }}
          />
        </View>
      ));
    }

    // If no post counts, show no data message
    if (Object.keys(postCounts).length === 0 && !refreshing) {
      return (
        <Text style={styles.noDataText}>No posts yet. Start posting to see your progress!</Text>
      );
    }

    // Render actual progress bars
    return Object.entries(postCounts).map(([section, count]) => {
      const sectionColor = sectionColors[section] || "#000";
      const sectionTitle = sectionTitles[section] || "Unknown Section";
      const level = sectionLevels[section] || 0;
      const progress = sectionProgress[section] || 0;

      return (
        <View key={section} style={styles.progressItemContainer}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          <ProgressBar
            progress={progress}
            level={level}
            color={sectionColor}
            barStyle={{ borderWidth: 0.5, borderColor: sectionColor }}
          />
        </View>
      );
    });
  }, [postCounts, sectionColors, sectionTitles, sectionLevels, sectionProgress, refreshing, placeholderSections]);

  return (
    <View style={styles.progressBarsContainer}>
      <View style={styles.headerContainer}>
        <Image source={require("../../assets/stats.png")} style={styles.statsImage} />
        <Text style={styles.headerText}>My Stats</Text>
      </View>
      {progressBarElements}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarsContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statsImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: GlobalColors.primaryBlack,
  },
  progressItemContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: GlobalColors.primaryBlack,
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    padding: 16,
    fontWeight: "500",
  },
});

export default StatsSection;
