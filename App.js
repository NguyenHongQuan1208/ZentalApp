import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import TaskDetailScreen from "./screens/TaskDetailScreen";
import { GlobalColors } from "./constants/GlobalColors";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { View, Text, Alert, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import IconButton from "./components/ui/IconButton";
import TaskScreen from "./screens/TaskScreen";
import NewPosts from "./screens/NewPostScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import TaskNoteScreen from "./screens/TaskNoteScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EnterUserNameScreen from "./screens/EnterUserNameScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import PersonalProfileScreen from "./screens/PersonalProfileScreen";
import RefreshTokenContextProvider from "./store/RefreshTokenContext";
import ConfirmPostScreen from "./screens/ConfirmPostScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AppOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: GlobalColors.primaryColor },
        headerTintColor: "white",
        headerTitleAlign: "center",
        tabBarStyle: { backgroundColor: GlobalColors.primaryColor },
        tabBarActiveTintColor: GlobalColors.primaryBlack,
        tabBarInactiveTintColor: GlobalColors.inActivetabBarColor,
      })}
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Zental Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Task"
        component={TaskScreen}
        options={{
          title: "Today Tasks",
          tabBarLabel: "Task",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sunny" size={size} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="Posts"
        component={NewPosts}
        options={{
          title: "New Posts",
          tabBarLabel: "Posts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paper-plane" size={size} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="Chats"
        component={ChatScreen}
        options={{
          title: "Start Chatting",
          tabBarLabel: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          headerRight: ({ tintColor }) => {
            return (
              <IconButton icon="notifications" size={24} color={tintColor} />
            );
          },
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalColors.primaryColor },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalColors.primaryGrey },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="hand-holding-heart" size={24} color="white" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                  marginLeft: 8,
                }}
              >
                Welcome to Zental
              </Text>
            </View>
          ),
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerTitle: "Sign up to feel Relief",
          headerTitleAlign: "center",
          headerBackVisible: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  function logoutHandler() {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Modal cancelled"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => authCtx.logout(),
        style: "destructive",
      },
    ]);
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalColors.primaryColor },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalColors.primaryGrey },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="EnterUserName"
        component={EnterUserNameScreen}
        options={{
          headerRight: ({ tintColor }) => {
            return (
              <IconButton
                icon="exit"
                size={24}
                color={tintColor}
                onPress={logoutHandler}
              />
            );
          },
          headerTitle: "Please Fill The Form",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="AppOverview"
        component={AppOverview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          headerTitle: "Activity Task",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="TaskNote"
        component={TaskNoteScreen}
        options={{
          headerTitle: "Note Your Task",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="ConfirmPost"
        component={ConfirmPostScreen}
        options={{
          headerTitle: "Post Your Task",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          contentStyle: {
            backgroundColor: GlobalColors.pureWhite,
          },
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: "Edit Profile",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="PersonalProfile"
        component={PersonalProfileScreen}
        options={{
          headerTitle: "Personal Profile",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
      {/* {true && <AuthenticatedStack />} */}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <RefreshTokenContextProvider>
            <Root />
          </RefreshTokenContextProvider>
        </AuthContextProvider>
      </GestureHandlerRootView>
    </>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
  loadingText: {
    color: GlobalColors.primaryColor,
  },
});
