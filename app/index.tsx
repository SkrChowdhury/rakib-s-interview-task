import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import HomeScreen from '@/screen/homeScreen'

const index = () => {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    container:{
        flex: 1,
    }
})