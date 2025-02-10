import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import PropTypes from "prop-types";

const { height: screenHeight } = Dimensions.get("window");

const OptionsModal = ({ visible, onClose, onSelect, title }) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const panResponder = useMemo(
    () =>
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
      }),
    [closeModal, isClosing, translateY]
  );

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
  }, [visible, translateY]);

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
  }, [onClose, isClosing, translateY]);

  const handleOverlayPress = useCallback(() => {
    if (!isClosing) {
      closeModal();
    }
  }, [closeModal, isClosing]);

  if (!isModalVisible) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.overlay} onPress={handleOverlayPress} />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.dragHandle} />

          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={() => onSelect("All Posts")}>
            <Text style={styles.modalOption}>All Posts</Text>
          </Pressable>
          <Pressable onPress={() => onSelect("Public Posts")}>
            <Text style={styles.modalOption}>Public Posts</Text>
          </Pressable>
          <Pressable onPress={() => onSelect("Private Posts")}>
            <Text style={styles.modalOption}>Private Posts</Text>
          </Pressable>
          <View style={styles.overlayExtension} />
        </Animated.View>
      </View>
    </Modal>
  );
};

OptionsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    paddingTop: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "blue",
  },
  overlayExtension: {
    position: "absolute",
    bottom: -screenHeight,
    left: 0,
    right: 0,
    height: screenHeight,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    marginBottom: 10,
    alignSelf: "center",
  },
});

export default OptionsModal;
