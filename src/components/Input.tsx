// Input.tsx
import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";

interface InputProps extends TextInputProps {
  variant?: "default" | "rounded";
  label?: string;
  type?: any;
  onChangeText?: (text: string) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  type,
  variant = "default",
  label,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const inputStyle = variant === "rounded" ? "rounded" : "";

  const borderStyle = isFocused
    ? "border-0.5 border-blue-500"
    : "border-0.5 border-gray-400";

  return (
    <View className="flex items-center space-y-4 mt-3">
      <View className="bg-black/5 rounded-lg w-full p-3">
        <TextInput
          className=""
          placeholderTextColor={"gray"}
          placeholder={placeholder}
          value={value}
          keyboardType={type}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...props}
        />
      </View>
    </View>
  );
};

export default Input;
