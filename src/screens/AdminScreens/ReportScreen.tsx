import React, { useContext } from "react";
import { View, Text } from "react-native";

import { firebase } from "../../../config";
import { AuthContext } from "../../features/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const ReportScreen = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = React.useState<any>();
  const tableHeaders = ["Date", "Price", "Status", "Action"];
  React.useEffect(() => {
    if (user !== null) {
      const unsubscribe = firebase
        .firestore()
        .collection("bookings")
        .where("laundryId", "==", user.uid)
        .onSnapshot((snapshot) => {
          const itemsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(itemsData);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);
  console.log(user);

  return (
    <View>
      <View>
        <Text>Total Sales:</Text>
      </View>
      <View>
        <Text>Bookings:</Text>
      </View>
      <View>
        <Text> Categories:</Text>
      </View>

      <View className="m-2 bg-white p-2 rounded-md shadow-md">
        <View className="flex-row justify-between mb-2">
          {tableHeaders.map((header, index) => (
            <View key={index} className="flex-1 mr-2 ">
              <Text className="text-blue-500 font-bold text-start">{header}</Text>
            </View>
          ))}
        </View>

        {data &&
          data.map((rowData, index) => {
            const timestampObject = rowData.bookingDate;
            const timestampMilliseconds = timestampObject.seconds * 1000;
            const date = new Date(timestampMilliseconds);
            const formattedDate = date.toLocaleString(); // Adjust the format as needed

            return (
              <View key={index} className="flex-row mb-2 w-full">
                <View className="flex-1">
                  <Text className="text-start">{formattedDate}</Text>
                </View>
                <View className="flex-1 ">
                  <Text className="text-start">₱ {rowData.total}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-start">{rowData.status}</Text>
                </View>
                <TouchableOpacity
                  className="flex-1 rounded underline" // Add your desired color
                  onPress={() => console.log("Action clicked")}
                >
                  <Text className="text-left">Update</Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default ReportScreen;
