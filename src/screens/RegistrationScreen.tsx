import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import Input from "../components/Input";
import Container from "../components/Container";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import Title from "../components/Title";
import TitleContainer from "../components/TitleContainer";
import { firebase } from "../../config";

interface RegistrationScreenProps {
  navigation: any;
}

type InputType = "default" | "numeric" | "email";

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  navigation,
}) => {
  const [data, setData] = useState<{
    [key: string]: string;
  }>({
    first_name: "",
    last_name: "",
    contact: "",
    address: "",
    user_name: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof data, value: string) => {
    setData({ ...data, [field]: value });
  };

  const submit = async () => {
    const {
      first_name,
      last_name,
      contact,
      user_name,
      email,
      password,
    } = data;
  
    try {
     
      const authUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const uid = authUser.user.uid;
  
      // Send email verification
      await firebase.auth().currentUser?.sendEmailVerification({
        handleCodeInApp: true,
        url: "https://laundry-app-80707.firebaseapp.com",
      });
  
      try {
        // Set additional user data in Firestore
        const userRef = firebase.firestore().collection("users").doc(uid);
  
        await userRef.set({
          uid,
          first_name,
          last_name,
          contact,
          user_name,
          email,
          password, // Note: Storing passwords in plaintext is not secure. This is just for demonstration purposes.
        });
  
        console.log("User data saved to Firestore");
      } catch (error) {
        console.error("Error saving user data to Firestore:", error);
      }
  
      alert("Registration successful. Verification email sent.");
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <Container>
      <TitleContainer>
        <Title variant="bold">Registration</Title>
      </TitleContainer>
      <ScrollView style={{ width: "100%" }}>
        <FormContainer className="pt-20">
          {RegistrationJson.map((input, index) => (
            <Input
              key={index}
              variant="rounded"
              value={data[input.id]}
              placeholder={input.placeholder}
              type={input.type as InputType}
              onChangeText={(text) => handleChange(input.id, text)}
            />
          ))}
          <Button title="Register" variant="primary" onPress={submit} />
          <Button
            title="Back to Login"
            variant="secondary"
            onPress={() => navigation.navigate("Login")}
          />
        </FormContainer>
      </ScrollView>
    </Container>
  );
};

export default RegistrationScreen;

const RegistrationJson: any[] = [
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
    id: "address",
    type: "default",
    placeholder: "Address",
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
