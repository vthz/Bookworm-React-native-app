import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../store/authStore'
import styles from "../../assets/styles/home.styles"
import { useState, useEffect } from 'react'
import { API_URL } from '../../constants/api'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { formatPublishDate } from '../../lib/utils'
import COLORS from "../../constants/colors";


export default function Home() {
  const {logout} = useAuthStore();

  const {token} = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  console.log("Token: ", token)
  const fetchBooks = async (pageNum=1, refresh=false) => {
    try{
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong while fetching books");
     
      // setBooks([])
      // setBooks((prevBooks) => [...prevBooks, ...data.books]);

      const uniqueBooks = 
        refresh || pageNum === 1
        ? data.books 
        : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) =>
        [...books, ...data.books].find((book) => book._id === id)
      );
      setBooks(uniqueBooks);
      
      setHasMore(pageNum<data.totalPages);
      setPage(pageNum);
      console.log(books)
    }catch(error){
      console.error("Error fetching books: ", error);
      Alert.alert("Error", "An error occurred while fetching books.");
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing){
      await fetchBooks(page + 1);
    }
  }

  const renderItem = ({item}) => {
    // write a console log inside the renderItem function to see the item object
    console.log("Item-SN2020: ", item.image)
    if (!item) return null;
    return (
      <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source= {{uri: item.user.profileImage}} style={styles.avatar}/>
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} contentFit="cover"/>
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
    )
  }

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i =1; i<5; i++){
      stars.push(
        <Ionicons
          key={i}
          name={i<=rating? "star" : "star-outline"}
          size={16}
          color={i<=rating? "#f4b400" : COLORS.textSecondary}
          style={{marginRight:2}}
        />
      )
    }
  }

  // console.log("Books2: ", books)

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm</Text>
            <Text style={styles.headerSubtitle}>Discover great reads from the community</Text>
          </View>
        }

        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator styles={styles.footerLoader} size="small" color={COLORS.primary}/>
          ) : null
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubText}>Be the first to share a book!</Text>
          </View>
        }
      />
      
    </View>
  )
}