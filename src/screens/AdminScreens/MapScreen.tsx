import React from "react";
import { View, Text } from "react-native";
import AdminMap from "../../components/AdminMap";
import HeaderTitle from "../../components/HeaderTitle";
import Button from "../../components/Button";
const MapScreen = () => {
  return (
    <View className="w-full h-screen bg-[#f8fafc]">
      <HeaderTitle>My Shop</HeaderTitle>
      <View className="w-34 absolute top-0 right-2">
        <Button title="Edit Location" cN="!w-fit" />
      </View>
      <AdminMap />
    </View>
  );
};

export default MapScreen;
