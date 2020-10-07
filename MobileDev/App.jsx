import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, Component} from 'react';
import axios from 'axios'
import { StyleSheet, Text, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from "react-modal";
import Navigator from './Routes/routingTime';
import UserContextProvider from './contexts/UserContext'
import ThemeContextProvider from './contexts/ThemeContext';

export default class App extends React.Component {
  render() {
    return (
      <ThemeContextProvider>
          <UserContextProvider>
            <Navigator/>      
          </UserContextProvider>
      </ThemeContextProvider>       
    );
  }
}
