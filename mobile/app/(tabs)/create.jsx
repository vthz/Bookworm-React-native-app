import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { useState } from 'react'
import styles from "../../assets/styles/create.styles"
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import COLORS from "../../constants/colors";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {useAuthStore} from '../../store/authStore';
import {API_URL} from "../../constants/api"

export default function Create() {

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null); // to display the selected image
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading]= useState(false);
  
  const router = useRouter();
  const {token} = useAuthStore();
  const pickImage = async () => {
    try{
      // request permission to access the camera roll
      if(Platform.OS !== "web"){
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted"){
          Alert.alert("Permission denied","Sorry, we need camera roll permissions to make this work!");
          return;
        }
      }
      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:"images",
        allowsEditing:false,
        aspect:[4,3],
        quality:0.5, // lower qulity for smaller base64 representation
        base64: true,
      })
      if(!result.canceled){
        // console.log("Image result:", result);
        setImage(result.assets[0].uri);
      }

      if(result.assets[0].base64){
        setImageBase64(result.assets[0].base64);
      }else{
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setImageBase64(base64);
      }
    }catch(error){
      console.error("Error picking image: ", error);
      Alert.alert("Error", "An error occurred while picking the image.");
    }
  }
  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    try{
      setLoading(true);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length -1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}`:"image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,
          rating:rating.toString(),
          image:imageDataUrl,
        }),
      })

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Something went wrong");
      Alert.alert("Success", "Book recommendation submitted successfully!");
      setTitle("");
      setCaption("");
      setRating(3);
      setImage(null);
      setImageBase64(null);
      router.push("/");
    }catch(error){
      console.error("Error submitting form: ", error);
      Alert.alert("Error", "An error occurred while submitting the form.");
    } finally{
      setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i<=5; i++){
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons 
            name={i <= rating ? "star" : "star-outline"} 
            size={32} 
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          {/* Header  */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendations</Text>
            <Text style={styles.subtitle}>Share your favorites reads with others</Text>
          </View>

          <View style={styles.form}>
            {/* Book title  */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="book-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcons}/>
                <TextInput style={styles.input} placeholder='Enter book title' placeholderTextColor={COLORS.placeholderText} value={title} onChangeText={setTitle}/>
              </View>
            </View>
            {/* Ratings  */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Ratings</Text>
              {renderRatingPicker()}
            </View>
            {/* Image  */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary}/>
                    <Text style={styles.placeholderText}>Tap to select image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Caption</Text>
                <TextInput 
                  style={styles.textArea}
                  placeholder="Write your review or thoughts about this book..."
                  placeholderTextColor={COLORS.placeholderText}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                />
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}
            disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white}/>
              ):(
                <>
                  <Ionicons 
                  name="cloud-upload-outline"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}