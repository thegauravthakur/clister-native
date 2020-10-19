import React, { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import { Redirect } from "react-router-native";
import firestore from "@react-native-firebase/firestore";
import {
  Body,
  Button,
  Header,
  Icon,
  Input,
  Item,
  Label,
  Left,
  Right,
  Title,
  Toast,
} from "native-base";

const SignUp = ({ history }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  if (currentUser) {
    return <Redirect to={"/tasks/default"} />;
  }
  return (
    <View>
      <Header>
        <Left>
          <Button transparent>
            <Icon type="FontAwesome" name="bars" />
          </Button>
        </Left>
        <Body>
          <Title>CLister</Title>
        </Body>
        <Right>
          <Button onPress={() => history.push("/")} transparent>
            <Title>Log In</Title>
          </Button>
        </Right>
      </Header>
      <View style={style.root}>
        <Text style={style.title}>SignUp</Text>
        <Item style={{ marginBottom: 20 }} floatingLabel>
          <Label>Email</Label>
          <Input
            autoCompleteTypes={"email"}
            keyboardType={"email-address"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </Item>
        <Item style={{ marginBottom: 40 }} floatingLabel>
          <Label>Password</Label>
          <Input
            autoCompleteType={"password"}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </Item>

        {loading ? (
          <ActivityIndicator color="teal" />
        ) : (
          <Button
            full
            onPress={async () => {
              setLoading(true);
              await auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async ({ user }) => {
                  const { uid } = user;
                  await firestore()
                    .collection(uid)
                    .doc("default")
                    .set({ task: [] })
                    .then(() => {
                      setCurrentUser(uid);
                      setLoading(false);
                      console.log(uid);
                    });
                })
                .catch((error) => {
                  setLoading(false);
                  switch (error.code) {
                    case "auth/email-already-in-use":
                      Toast.show({
                        text: "Email already in use",
                        buttonText: "Okay",
                        type: "danger",
                      });
                      break;
                    default:
                      Toast.show({
                        text: error.code,
                        buttonText: "Okay",
                        type: "danger",
                      });
                  }
                });
            }}
          >
            <Text style={{ color: "white" }}>Sign Up</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    alignItems: "center",
  },
  title: {
    color: "teal",
    fontSize: 50,
  },
  button: {
    width: 200,
  },
});

export default SignUp;
