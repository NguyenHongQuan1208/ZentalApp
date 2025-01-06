import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import TaskDetailScreen from "./screens/TaskDetailScreen";
import { GlobalColors } from "./constants/GlobalColors";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { View, Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import IconButton from "./components/ui/IconButton";
import TaskScreen from "./screens/TaskScreen";
import NewPosts from "./screens/NewPostScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AppOverview() {
  const authCtx = useContext(AuthContext);
  function logoutHandler() {
    authCtx.logout();
  }
  return (
    <BottomTabs.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: GlobalColors.primaryColor },
        headerTintColor: "white",
        headerTitleAlign: "center",
        tabBarStyle: { backgroundColor: GlobalColors.primaryColor },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: GlobalColors.inActivetabBarColor,
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
          title: "My Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
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
        contentStyle: { backgroundColor: GlobalColors.primaryBlack },
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
        }}
      />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalColors.primaryColor },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalColors.primaryBlack },
      }}
    >
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

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
