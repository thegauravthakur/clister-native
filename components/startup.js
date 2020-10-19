import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { useSetRecoilState } from "recoil";
import { userState } from "../recoil/atoms";

const Startup = ({ children }) => {
  const setCurrentUser = useSetRecoilState(userState);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      await auth().onAuthStateChanged((user) => {
        setCurrentUser(user ? user.uid : null);
        setLoading(false);
      });
    };
    fetchUser().then();
  }, []);
  if (loading) {
    return <Text>loading</Text>;
  }
  return <View>{children}</View>;
};

export default Startup;
