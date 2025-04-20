import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import React from 'react'
import styles from "../../assets/styles/signup.styles"
import {Ionicons} from "@expo/vector-icons"
import COLORS from '../../constants/colors';
import { useState } from 'react';
import {useRouter} from "expo-router"
import { useAuthStore } from '../../store/authStore';

export default function Signup() {

    const router = useRouter();
    const {user, isLoading, register} = useAuthStore();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
      const result = await register(username, email, password);
      if(!result.success) Alert.alert("Error", result.error);
      if(result.success) Alert.alert("Success", "Account created successfully")
    };

  return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding":"height"}>
            <View style={styles.container}>
              <View style={styles.card}>
                {/* Header  */}
                <View style={styles.header}>
                  <Text style={styles.title}>Bookworm</Text>
                  <Text style={styles.subtitle}>Share your favorite reads</Text>
                </View>

                <View styl={styles.formContainer}>
                  {/* Username input  */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="johndoe"
                        placeholderTextColor={COLORS.placeholderText}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                  {/* Email  */}
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
                  {/* Password  */}
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

                  <TouchableOpacity style={styles.button} onPress={handleSignUp}
                    disabled={isLoading}>
                      {isLoading ? (
                        <ActivityIndicator color="#fff"/>) : (<Text style={styles.buttonText}>Sign Up</Text>
                      )}
                  </TouchableOpacity>
                  {/* Footer  */}
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                      <TouchableOpacity onPress={()=> router.back()}>
                        <Text style={styles.link}>Login</Text>
                      </TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>
        </KeyboardAvoidingView>      
  )
}