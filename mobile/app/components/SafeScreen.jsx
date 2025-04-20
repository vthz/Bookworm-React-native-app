import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeScreen({children}) {
    const insets = useSafeAreaInsets();
    return <View style={[styles.container, {paddingTop:insets.top}]}>{children}</View>;
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.background,
    }
});