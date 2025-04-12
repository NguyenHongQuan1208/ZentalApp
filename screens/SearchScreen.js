import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { GlobalColors } from "../constants/GlobalColors";
import { getAllUsers } from "../util/user-info-http";
import ProfileBar from "../components/Posts/ProfileBar";
import SearchInput from "../components/Search/SearchInput";

const SearchScreen = ({ navigation, route }) => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const showInput = route.params?.showInput;

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search value
  const filteredUsers = useMemo(() => {
    if (!searchValue.trim()) return [];
    const lowerSearchValue = searchValue.toLowerCase();
    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(lowerSearchValue) ||
        user.email?.toLowerCase().includes(lowerSearchValue)
    );
  }, [searchValue, users]);

  // Animate search input when showInput changes
  useEffect(() => {
    if (showInput) {
      Animated.parallel([
        Animated.timing(inputAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      fadeAnimation.setValue(0);
    }
  }, [showInput]);

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Animated.View
          style={{
            width: inputAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 320],
            }),
            opacity: fadeAnimation,
          }}
        >
          {showInput && (
            <SearchInput
              value={searchValue}
              onChangeText={setSearchValue}
              onClear={() => setSearchValue("")}
              autoFocus={true}
            />
          )}
        </Animated.View>
      ),
    });
  }, [navigation, showInput, searchValue]);

  const renderItem = useCallback(
    ({ item }) => <ProfileBar userId={item.id} />,
    []
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={GlobalColors.primaryColor} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {searchValue ? (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No users found</Text>
              }
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={10}
            />
          ) : (
            <Text style={styles.placeholderText}>
              Search for users by username or email
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    textAlign: "center",
    marginTop: 20,
    color: GlobalColors.textSecondary,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: GlobalColors.textSecondary,
  },
});

export default React.memo(SearchScreen);