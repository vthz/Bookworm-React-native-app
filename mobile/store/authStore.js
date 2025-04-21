import {create} from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {API_URL} from "../constants/api"

export const useAuthStore = create((set, get)=>({
    user:null,
    token:null,
    isLoading:false,

    register: async (username, email, password) => {
        set({isLoading: true})
        try{
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, email, password})
            });
            const data = await response.json();
            if (!response.ok) {
                set({isLoading: false})
                throw new Error(data.message || "Something went wrong")
            }
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)
            set({user: data.user, token: data.token, isLoading: false})
            return {success:true}
        }catch(error){
            console.log("Auth store - something went wrong", error)
            set({isLoading:false})
            return {success:false, error:error.message}
        }
    },

    checkAuth: async () => {
        try{
            const userJson = await AsyncStorage.getItem("user")
            const token = await AsyncStorage.getItem("token")
            const user = userJson ? JSON.parse(userJson) : null
            set({token, user});
        }catch(error){
            console.log("Auth store - something went wrong", error)
        }
    },

    logout: async () => {
        try{
            await AsyncStorage.removeItem("user")
            await AsyncStorage.removeItem("token")
            set({user: null, token: null})
        }catch(error){
            console.log("Auth store - something went wrong", error)
        }
    },

    login: async (email, password) => {
        set({isLoading: true})
        try{
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password})
            });
            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Something went wrong");
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)
            set({token:data.token, user:data.user, isLoading:false})
            return {success:true}
        }catch(error){
            console.log("Auth store - something went wrong", error)
            set({isLoading:false})
            return {success:false, error:error.message}
        }
    }
}));