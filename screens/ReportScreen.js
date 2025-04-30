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
  ActivityIndicator,
} from "react-native";
import { GlobalColors } from "../constants/GlobalColors";
import LongButton from "../components/ui/LongButton";
import { reportPost } from "../util/report-http";
import { useTranslation } from "react-i18next";

function ReportScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { postId, currentUserId, headerTitle } = route.params;
  const [reason, setReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Giữ lý do báo cáo bằng tiếng Anh
  const reportReasons = {
    inappropriate: "Inappropriate Content",
    spam: "Spam",
    harassment: "Harassment",
    false_info: "False Information",
    other: "Other",
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t("Report Post"),
    });
  }, [navigation, t]);

  const handleReport = async () => {
    if (
      !reason.trim() ||
      (reason === reportReasons.other && !additionalDetails.trim())
    ) {
      Alert.alert(t("Incomplete Report"), t("report_validation_message"));
      return;
    }

    if (
      reason === reportReasons.other &&
      additionalDetails.trim().length < 10
    ) {
      Alert.alert(t("Incomplete Report"), t("details_validation_message"));
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const reportData = {
        reason: reason === reportReasons.other ? additionalDetails : reason,
        timestamp: timestamp,
        repporterId: currentUserId,
        isViewed: 0,
      };

      await reportPost(postId, reportData);

      Alert.alert(t("Report Submitted"), t("report_success_message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Report Submission Error:", error);
      Alert.alert(t("Submission Failed"), t("submission_error_message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{t("Report Post")}</Text>
        <Text style={styles.description}>{t("report_description")}</Text>

        <View style={styles.reasonsContainer}>
          {Object.entries(reportReasons).map(([key, value]) => (
            <Pressable
              key={key}
              style={[
                styles.reasonButton,
                reason === value && styles.selectedReasonButton,
              ]}
              onPress={() => {
                setReason(value);
                if (value !== reportReasons.other) {
                  setAdditionalDetails(value);
                } else {
                  setAdditionalDetails("");
                }
              }}
            >
              <Text
                style={[
                  styles.reasonButtonText,
                  reason === value && styles.selectedReasonButtonText,
                ]}
              >
                {t(key)}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder={t("additional_details_placeholder")}
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
          multiline
          numberOfLines={4}
        />

        <LongButton
          style={styles.longButton}
          onPress={handleReport}
          disabled={isSubmitting || !reason}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            t("submit_report")
          )}
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
