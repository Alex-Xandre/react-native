import React, { useRef, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Animated, Image } from "react-native";
import { useCart } from "../../../features/CartContext";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../components/Button";
import HeaderTitle from "../../../components/HeaderTitle";
import {firebase} from "../../../../config"
const CartContainer = () => {
  const { cartIsOpen, cart, toggleCart, addToCart, removeFromCart, clearCart } =
    useCart();
  const [shopName, setShopName] = useState("")
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: cartIsOpen ? 0 : 1000,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [cartIsOpen]);

  React.useEffect(() => {
    const unsubscribeUsers = firebase
      .firestore()
      .collection("users")
      .where("uid", "==", cart[0].uploaderUid )
      .onSnapshot((snapshot) => {
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShopName(userData[0].user_name)
      });
    return () => unsubscribeUsers();
  }, []);

  const handleBooking = () =>{
    console.log(cart)
    //uid
    //user info 
    //booking details
    //cart items
    //payment info
    //shop details
  }

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };
  const colors = ["#C4DFDF", "#D2E9E9", "#E3F4F4"];
  return (
    <Animated.View
      className={`absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-10`}
      style={{ transform: [{ translateY }] }}
    >
      <View className={`absolute top-0 right-0 bottom-0 w-full bg-[#f8fafc] `}>
        <HeaderTitle>My Cart</HeaderTitle>
        <TouchableOpacity
          onPress={toggleCart}
          className="w-24 absolute top-5 right-0"
        >
          <Text className="text-[#ff6347]">Close Cart</Text>
        </TouchableOpacity>
        {cart.length !== 0 ? (
          <>
            {cartIsOpen && (
              <ScrollView className={` w-full p-4 mb-24`}>
                {cart.map((item, index) => (
                  <View
                    key={index}
                    className="w-full white my-2  flex-row  p-5 "
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                  >
                    <View className="items-center ">
                      <View className="w-28 h-28 overflow-hidden rounded-lg">
                        <Image
                          source={{ uri: item.imageUrl }}
                          className="w-full h-full"
                        />
                      </View>
                    </View>
                    <View className=" w-full flex-col ml-5">
                      <Text className="text-[#0891b2] text-start text-base">
                        {item.category}
                      </Text>
<Text className="text-xs">@ {shopName}</Text>
                      <Text> ₱{item.price}</Text>
                      <View className="flex-row items-center space-x-2 absolute bottom-0 bg-[#0891b2] rounded-md ">
                        <TouchableOpacity
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Text className="bg-[#0891b2] py-1 px-4 text-lg rounded-full text-white">
                            -
                          </Text>
                        </TouchableOpacity>
                        <Text className="text-white">{item.quantity}</Text>
                        <TouchableOpacity onPress={() => addToCart(item)}>
                          <Text className="bg-[#0891b2] py-1 px-4 text-lg rounded-full text-white">
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
             
              </ScrollView>
            )}
            <View className="absolute bottom-0 w-full bg-white p-2">
            <View className="mr-2">
                  <Text className="w-full text-right text-lg">
                    Total Amount Payable: ₱{calculateTotalAmount()}
                  </Text>
                </View>
              <Button title="Proceed to Booking"cN="!w-fit" onPress={handleBooking} />
              <TouchableOpacity
                onPress={clearCart}
                className={`mt-4 p-2 border border-[#ff6347] rounded-md `}
              >
                <Text className="text-center text-[#ff6347] font-semibold">
                  Clear Cart
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text className="text-center text-lg font-semibold m-auto">Cart Empty</Text>
        )}
      </View>
    </Animated.View>
  );
};

export default CartContainer;
