import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View, Button, Alert } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Modal from "react-native-modal";
import { AuthContext } from "../features/AuthContext";
import { firebase } from "../../config";
import Loading from "./Loading";

const AdminMap = () => {
  const { user } = useContext(AuthContext);

  const [address, setAddress] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleStreetView = () => {
    // Handle opening street view here
    Alert.alert("Street View", `Open street view for ${user.name}`);
  };

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          setAddress(userDoc.data());
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {address ? (
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: parseFloat(address?.address.latitude),
              longitude: parseFloat(address?.address.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            customMapStyle={mapStyle}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(address?.address.latitude),
                longitude: parseFloat(address?.address.longitude),
              }}
              onPress={toggleModal}
            ></Marker>
          </MapView>
        ) : (
          <Loading />
        )}

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          className="m-0  w-full rounded-t-xl"
        >
          <View className="bg-white h-72 absolute bottom-0 w-full rounded-t-3xl">
            {/* Your details and Street View button can be placed here */}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default AdminMap;

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mapStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
