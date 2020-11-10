import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, Component} from 'react';
import {Text, View} from 'react-native';
import { NotifierWrapper } from 'react-native-notifier';
import Navigator from './Routes/routingTime';
import UserContextProvider from './contexts/UserContext'
import ThemeContextProvider from './contexts/ThemeContext';

export default class App extends React.Component {
  render() {
    return (
      <ThemeContextProvider>
          <UserContextProvider>
            <View style={{width: "1000%", padding: 26, backgroundColor: 'light-gray'}}/>
              <NotifierWrapper>
                <Navigator/>  
              </NotifierWrapper>    
          </UserContextProvider>
      </ThemeContextProvider>       
    );
  }
}
