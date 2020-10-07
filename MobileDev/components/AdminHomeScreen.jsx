import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';

class AdminHome extends React.Component{
    static contextType = UserContext;
    render(){
        const {navigation} = this.props;
        return(
        <Text>Hi, {this.context.username}. Welcome to the admin home page.</Text>
    )}
}
export default AdminHome;