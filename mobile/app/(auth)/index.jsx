import { Platform, Image, View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useEffect } from 'react'
import styles from "../../assets/styles/login.styles"
import { useState } from 'react';
import COLORS from '../../constants/colors';
import {Ionicons} from "@expo/vector-icons"
import {Link} from "expo-router"
import {useAuthStore} from "../../store/authStore"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const {isLoading, login} = useAuthStore();

  const handleLogin = async() => {
    const result = await login(email, password);
    if (!result.success) Alert.alert("Error", result.error)
  }

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding":"height"}>
    <View style={styles.container}>
      <View styles={styles.topIllustration}>
        <Image
          source={require("../../assets/images/reading_glass.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.formContainer}>
          {/* // Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
              />
            </View>
          
          </View>

          {/* // password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              {/* Left */}
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              {/* Right */}
              <TouchableOpacity
                onPress={()=> setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
              <Ionicons
                name={showPassword ? "eye-outline":"eye-off-outline"}
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}
            disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff"/>) : (<Text style={styles.buttonText}>Login</Text>
              )}
          </TouchableOpacity>
          {/* Footer  */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account</Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}