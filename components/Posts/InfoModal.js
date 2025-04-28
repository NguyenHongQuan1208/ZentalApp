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
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import LikeCommentProfileBar from "./LikeCommentProfileBar";

const { height: screenHeight } = Dimensions.get("window");

const InfoModal = ({ visible, onClose, userIds, title }) => {
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

  const renderItem = useCallback(
    ({ item }) => <LikeCommentProfileBar userId={item} onClose={closeModal} />,
    [closeModal]
  );

  const keyExtractor = useCallback((item) => item, []);

  // Memoized FlatList with optimizations
  const MemoizedFlatList = useMemo(
    () => (
      <FlatList
        data={userIds}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    ),
    [userIds, renderItem, keyExtractor]
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
            MemoizedFlatList
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContent: {
    width: "100%",
    paddingBottom: 20,
  },
});

export default React.memo(InfoModal);
