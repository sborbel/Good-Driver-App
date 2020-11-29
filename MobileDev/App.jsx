import 'react-native-gesture-handler';
import React, {useState, useEffect, Component} from 'react';
import {View} from 'react-native';
import { NotifierWrapper } from 'react-native-notifier';
import Navigator from './Routes/routingTime';
import UserContextProvider from './contexts/UserContext'
import ThemeContextProvider from './contexts/ThemeContext';

export default class App extends React.Component {
  render() {
    return (
      <ThemeContextProvider>
          <UserContextProvider>
            <View style={{width: "1000%", padding: 10, backgroundColor: 'black'}}/>
              <NotifierWrapper>
                <Navigator/>  
              </NotifierWrapper>    
          </UserContextProvider>
      </ThemeContextProvider>       
    );
  }
}
