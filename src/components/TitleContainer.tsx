import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface FormContainer {
  children: ReactNode;
  className?: any;
}

const TitleContainer: React.FC<FormContainer> = ({ children, className }) => {
  return (
    <View className=" bg-[#3498db] rounded-br-full h-1/2 flex items-center justify-center w-full ">
      {children}
    </View>
  );
};

export default TitleContainer;
