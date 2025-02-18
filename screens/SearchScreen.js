import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import SearchInput from "../components/Search/SearchInput"; // Import the new SearchInput component

function SearchScreen({ navigation, route }) {
  const [searchValue, setSearchValue] = useState("");
  const [inputAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const showInput = route.params?.showInput;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Add user feedback for error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchValue) return users;
    const lowerSearchValue = searchValue.toLowerCase();
    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(lowerSearchValue) ||
        user.email?.toLowerCase().includes(lowerSearchValue)
    );
  }, [searchValue, users]);

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
            />
          )}
        </Animated.View>
      ),
    });

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
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()} // Ensure unique string id
            renderItem={renderItem}
            ListEmptyComponent={<Text>No users found.</Text>}
            initialNumToRender={10} // Adjust based on your needs
            windowSize={5} // Adjust based on your needs
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  loadingContainer: {
    padding: 12,
    alignItems: "center",
  },
});
