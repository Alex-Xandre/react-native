// App.tsx
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../store";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import HomeScreen from "./screens/HomeScreen";
import { firebase } from "../config";
import { login, signout } from "./features/AuthReducer";
import { AuthContextProvider } from "./features/AuthContext";
import DashboardScreen from "./screens/UserScreens/DashboardScreen";
import MainMenuUser from "./screens/HomeScreenUser";
import CategoryUserScreen from "./screens/UserScreens/UserUtil/CategoryUserScreen";
import { CartContextProvider, useCart } from "./features/CartContext";
import BookingUserScreen from "./screens/UserScreens/UserUtil/BookingUserScreen";
import PaymentUserScreen from "./screens/UserScreens/UserUtil/PaymentUserScreen";

const Stack = createStackNavigator();

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const [roles, setRoles] = React.useState<any>(null);

  React.useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(login({ user }));
      } else {
        dispatch(signout());
      }
    });

    return () => subscriber();
  }, [dispatch]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          setRoles(userDoc.data().roles);
        } else {
          console.log("User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            {roles === true ? (
              <Stack.Screen
                options={{ headerShown: false }}
                name="HomeUser"
                component={HomeScreen}
              />
            ) : (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="HomeUserPage"
                  component={MainMenuUser}
                />
                <Stack.Screen
                  name="BookingUserScreen"
                  component={BookingUserScreen}
                  options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="CategoryUserScreen"
                  component={CategoryUserScreen}
                  options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="PaymentUserScreen"
                  component={PaymentUserScreen}
                  options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                  }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Registration"
              component={RegistrationScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </AuthContextProvider>
    </Provider>
  );
};
