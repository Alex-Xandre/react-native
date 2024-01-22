import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
} from "react-native";
import { firebase } from "../../../config";
import { AuthContext } from "../../features/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import { signout } from "../../features/AuthReducer";
import { useDispatch } from "react-redux";

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<any>({});
  const  dispatch  = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          setUserData(userDoc.data());
          setData(userDoc.data());
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

  const showEditProfileModal = () => {
    setModalVisible(true);
  };

  const hideEditProfileModal = () => {
    setModalVisible(false);
  };

  const handleChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <View className="flex-1 relative">
      <ScrollView className="w-full h-screen bg-[#f8fafc]">
        {userData ? (
          <View className="w-full flex justify-center items-center m-0 ">
            <View className="w-full flex gap-4 m-0 items-center pt-3 pb-8 bg-[#0891b2] rounded-b-xl">
              <Text className="text-xl font-semibold text-white ">Profile</Text>
              <View className="relative">
                <Image
                  source={{ uri: userData?.profile }}
                  className="w-24 h-24 rounded-full opacity-70 "
                />
              </View>
              <Text className="text-white mt-5 text-2xl semibold">
                {userData.first_name} {userData.last_name}
              </Text>
            </View>
            <View className="mt-5 w-full flex flex-row p-8 gap-4 border-b border-gray-200">
              <MaterialCommunityIcons
                name="account-outline"
                color="#3498db"
                size={20}
              />
              <Text className="m-0 w-fit">{userData.user_name}</Text>
            </View>

            <View className="mt-5 w-full flex flex-row p-8 gap-4 border-b border-gray-200">
              <MaterialCommunityIcons
                name="email-outline"
                color="#3498db"
                size={20}
              />
              <Text className="m-0 w-fit">{userData.email}</Text>
            </View>

            <View className="mt-5 w-full flex flex-row p-8 gap-4 border-b border-gray-200">
              <MaterialCommunityIcons
                name="phone-outline"
                color="#3498db"
                size={20}
              />
              <Text className="m-0 w-fit">{userData.contact}</Text>
            </View>

            <View className="w-full p-3">
              <Button title="Logout" onPress={() => dispatch(signout())} />
            </View>
          </View>
        ) : (
          <Loading />
        )}
        <TouchableWithoutFeedback onPress={showEditProfileModal}>
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 16,
              backgroundColor: "#3498db",
              borderRadius: 30,
              width: 60,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="account-edit-outline"
              color="white"
              size={30}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* Edit Profile Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={hideEditProfileModal}
        >
          <View className="bg-white h-full">
            <View
              className="bg-white p-4 "
              style={{
                elevation: 5,
              }}
            >
              {/* Update Profile Form */}
              {data && (
                <View className="w-full flex justify-center items-center m-0 h-full  ">
                  <View className="w-full  bg-white pb-4 border-b border-gray-300">
                    <Text className={`text-[#3498db] text-lg font-semibold `}>
                      Update Profile
                    </Text>

                    <TouchableOpacity
                      onPress={hideEditProfileModal}
                      className="-mt-5"
                    >
                      <Text style={{ color: "red", textAlign: "right" }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView className="w-full mt-5">
                    <View className="w-full flex gap-4 m-0 items-center pt-3 pb-8 bg-[#0891b2] rounded-xl">
                      <View className="relative">
                        <Image
                          source={{ uri: data?.profile }}
                          className="w-24 h-24 rounded-full opacity-70 "
                        />
                      </View>
                      <Text className="text-white mt-5 text-2xl semibold">
                        {data.first_name} {data.last_name}
                      </Text>
                    </View>

                    {UpdateProfileJSon.map((field) => (
                      <View key={field.id} className="w-full">
                        <Input
                          placeholder={field.placeholder}
                          keyboardType={field.type}
                          value={data[field.id]}
                          onChangeText={(text) => handleChange(field.id, text)}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const UpdateProfileJSon: any[] = [
  {
    id: "first_name",
    type: "default",
    placeholder: "First Name",
  },
  {
    id: "last_name",
    type: "default",
    placeholder: "Last Name",
  },
  {
    id: "contact",
    type: "numeric",
    placeholder: "Contact",
  },

  {
    id: "user_name",
    type: "default",
    placeholder: "User Name",
  },
  {
    id: "email",
    type: "email-address",
    placeholder: "Email Address",
  },
  {
    id: "password",
    placeholder: "Password",
  },
];
