import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { firebase } from "../../../../config";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../../../components/Loading";
import { useCart } from "../../../features/CartContext";
import CartAppbar from "./CartAppbar";

const CategoryUserScreen = ({ route, navigation }) => {
  const [items, setItems] = React.useState<any>([]);
  const { addToCart, removeFromCart, cart } = useCart();

  React.useEffect(() => {
    const unsubscribeUsers = firebase
      .firestore()
      .collection("users")
      .where("email", "==", route.params.user.email)
      .onSnapshot((snapshot) => {
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (userData.length > 0) {
          const userUID = userData[0].uid;

          const unsubscribeItems = firebase
            .firestore()
            .collection("items")
            .where("uploaderUid", "==", userUID)
            .onSnapshot((itemsSnapshot) => {
              const itemsData = itemsSnapshot.docs.map((itemDoc) => ({
                id: itemDoc.id,
                ...itemDoc.data(),
              }));

              setItems(itemsData);
            });

          return () => unsubscribeItems();
        } else {
          console.log("No user found with the specified email");
        }
      });
    return () => unsubscribeUsers();
  }, [route.params.user.email]);

  const { width: screenWidth } = Dimensions.get("window");
  const itemWidth = screenWidth / 2.3;

  const handleToggleCart = (item) => {
    const isInCart = cart.some((cartItem) => cartItem.id === item.id);

    const itemWithNumericPrice = {
      ...item,
      quantity: 1,
      price: parseFloat(item.price),
    };

    if (isInCart) {
      removeFromCart(item.id);
    } else {
      addToCart(itemWithNumericPrice);
    }
  };
  console.log(route.params.user);

  const colors = ["#C4DFDF", "#D2E9E9", "#E3F4F4"];
  return (
    <View style={{ flex: 1 }}>
      <Text className="text-xl p-2 pl-5 font-semibold bg-white  text-[#0891b2]">
        {route.params.user.user_name} Services Offered
      </Text>
      <ScrollView style={{ zIndex: 0 }}>
        {items ? (
          <View className="p-5 rounded flex-wrap flex-row gap-2.5 z-0">
            {items.map((item, index) => {
              const isInCart = cart.some((cartItem) => cartItem.id === item.id);
              const hasItemsFromDifferentShop = cart.some(
                (cartItem) => cartItem.uploaderUid !== route.params.user.uid
              );

              return (
                <View
                  key={index}
                  style={{
                    width: itemWidth,
                  }}
                  className="z-0 rounded overflow-hidden bg-white items-center"
                >
                  <Text
                    className="w-full text-slate-700 text-left text-base font-semibold p-2.5"
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                  >
                    ₱{item?.price}
                  </Text>
                  <View className="items-center px-5 pt-5">
                    <View className="w-28 h-28 overflow-hidden rounded-lg">
                      <Image
                        source={{ uri: item.imageUrl }}
                        className="w-full h-full"
                      />
                    </View>
                    <Text className="text-[#0891b2] text-center w-full text-base">
                      {item.category}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: 10,
                      paddingHorizontal: 20,
                      paddingBottom: 20,
                      width: "100%",
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{item.description}</Text>
                    {item.status ? (
                      <View>
                        {item.uploaderUid === route.params.user.uid &&
                        !hasItemsFromDifferentShop ? (
                          <TouchableOpacity
                            onPress={() => handleToggleCart(item)}
                            style={{
                              backgroundColor: isInCart ? "#ff6347" : "#008000",
                            }}
                            className="w-full rounded-sm mt-2.5 py-2"
                          >
                            <Text
                              style={{ color: "#fff", textAlign: "center" }}
                            >
                              {isInCart ? "Remove from Cart" : "Add to Cart"}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text style={{ color: "red" }}>
                            You already have items from a different shop in your
                            cart.
                          </Text>
                        )}
                      </View>
                    ) : (
                      <Text style={{ color: "red" }}>
                        Service not Available
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Loading />
        )}
      </ScrollView>

      <CartAppbar />
    </View>
  );
};

export default CategoryUserScreen;
