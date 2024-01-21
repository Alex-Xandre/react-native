// Container.tsx

import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <View className="bg-white pb-5 h-full w-full flex justify-between items-center">
      <StatusBar style="light" />
      {children}
    </View>
  );
};

export default Container;
