import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';

export default class Home extends React.Component{
    static contextType = UserContext;
    render(){
        const {navigation} = this.props;
        return(
        <Text>Hi, {this.context.username}. Welcome to an empty home page.</Text>
    )}
}

//export default Home;