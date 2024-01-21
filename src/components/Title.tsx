import React from "react";
import { Text as RNText, TextStyle, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  variant?: "normal" | "bold" | "italic";
  style?: TextStyle;
}

const Title: React.FC<CustomTextProps> = ({
  children,
  variant = "normal",
  style,
  ...props
}) => {
  const textStyle =
    variant === "normal"
      ? "text-base"
      : variant === "bold"
      ? "font-semibold text-xl text-5xl"
      : "italic";

  return (
    <RNText
      className={`text-white tracking-wider     ${textStyle}`}
      style={style}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Title;
