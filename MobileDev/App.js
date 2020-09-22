import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Navigator from './Routes/startStack';

export default function App() {
  return ( /* make this work at highest level? */
    <TouchableWithoutFeedback onPress={() => { console.log("keyboard dropped") }}> 
      <Navigator/>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff333',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
