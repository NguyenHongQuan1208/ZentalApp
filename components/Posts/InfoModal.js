// InfoModal.js
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import ProfileBar from "./ProfileBar";

const { height: screenHeight } = Dimensions.get("window");

const InfoModal = ({ visible, onClose, userIds, title }) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0 && !isClosing) {
          const newTranslateY = Math.max(0, gestureState.dy);
          translateY.setValue(newTranslateY);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            tension: 30,
            friction: 10,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        tension: 30,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeModal = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
      setIsClosing(false);
      onClose();
    });
  }, [onClose, isClosing]);

  const handleOverlayPress = useCallback(() => {
    if (!isClosing) {
      closeModal();
    }
  }, [closeModal, isClosing]);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <ProfileBar userId={item} />
    </View>
  );

  if (!isModalVisible) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={closeModal}
    >
      <Pressable style={styles.overlay} onPress={handleOverlayPress}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.modalView,
            {
              backgroundColor: GlobalColors.primaryWhite,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.dragHandle} />
          {title && <Text style={styles.modalTitle}>{title}</Text>}
          {userIds && userIds.length > 0 ? (
            <FlatList
              data={userIds}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <Text style={styles.modalText}>No likes yet.</Text>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "66%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
  listContent: {
    width: "100%",
    paddingBottom: 20,
  },
});

export default React.memo(InfoModal);
