import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { GlobalColors } from "../constants/GlobalColors";
import LongButton from "../components/ui/LongButton";

function ReportScreen({ route, navigation }) {
  const { postId, headerTitle } = route.params;
  const [reason, setReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Inappropriate Content",
    "Spam",
    "Harassment",
    "False Information",
    "Other",
  ];

  useEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitle || "Report Post",
    });
  }, [navigation, headerTitle]);

  const handleReport = async () => {
    if (!reason.trim() || (reason === "Other" && !additionalDetails.trim())) {
      Alert.alert(
        "Incomplete Report",
        "Please provide a detailed reason for reporting this post."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReport(
        postId,
        reason === "Other" ? additionalDetails : reason
      );

      Alert.alert(
        "Report Submitted",
        "Thank you for helping us maintain a safe community. We'll review your report soon.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Report Submission Error:", error);
      Alert.alert(
        "Submission Failed",
        "Unable to submit report. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReport = async (postId, reportReason) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Report Post</Text>
        <Text style={styles.description}>
          Help us understand why this post violates our community guidelines:
        </Text>

        <View style={styles.reasonsContainer}>
          {reportReasons.map((reportReason, index) => (
            <Pressable
              key={index}
              style={[
                styles.reasonButton,
                reason === reportReason && styles.selectedReasonButton,
              ]}
              onPress={() => {
                setReason(reportReason);
                if (reportReason === "Other") {
                  setAdditionalDetails("");
                } else {
                  setAdditionalDetails(reportReason);
                }
              }}
            >
              <Text
                style={[
                  styles.reasonButtonText,
                  reason === reportReason && styles.selectedReasonButtonText,
                ]}
              >
                {reportReason}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Always show the TextInput */}
        <TextInput
          style={styles.input}
          placeholder="Additional details"
          value={reason === "Other" ? additionalDetails : reason}
          onChangeText={(text) => {
            if (reason === "Other") {
              setAdditionalDetails(text);
            }
          }}
          multiline
          numberOfLines={4}
        />

        <LongButton
          style={styles.longButton}
          onPress={handleReport}
          disabled={isSubmitting || !reason}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </LongButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  reasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  reasonButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 4,
    elevation: 2,
  },
  selectedReasonButton: {
    backgroundColor: GlobalColors.primaryColor,
  },
  reasonButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  selectedReasonButtonText: {
    color: "white",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  longButton: {
    width: "100%",
    paddingVertical: 12,
  },
});

export default ReportScreen;
