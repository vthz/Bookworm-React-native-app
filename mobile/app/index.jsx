import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import {Image} from "expo-image"
import {Link} from "expo-router"
import { useEffect } from "react";
import {useAuthStore} from "../store/authStore";

export default function Index() {
  const {user, token, checkAuth, logout} = useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[])

  console.log(user, token)

  return (
    <View style={styles.container}>
      <Text>Hello {user?.username}</Text>
      <Text>Token {token}</Text>
      <Link href="/(auth)/signup">Signup</Link>
      <Link href="/(auth)">Login</Link>

      <TouchableOpacity onPress={logout}>
        <Text style={styles.title}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },
  title:{color:"blue"}
})