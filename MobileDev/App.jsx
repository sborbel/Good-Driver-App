import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, Component} from 'react';
import axios from 'axios'
import { StyleSheet, Text, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from "react-modal";
import Navigator from './Routes/routingTime';
import UserContextProvider from './contexts/UserContext'
import UserListContextProvider from './contexts/UserListContext';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      myID: "Init",
      title: "Good Driver Rewards Program",
      accessToken: null,
      messageType: null,
      messageText: null,
      showModal: false,
      role: ""
    };
  }

  render() {
    return (
      <UserListContextProvider>
        <UserContextProvider>
          <Navigator/>       
        </UserContextProvider>
      </UserListContextProvider>
    );
  }
}
