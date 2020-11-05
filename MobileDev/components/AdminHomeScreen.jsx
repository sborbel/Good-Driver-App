import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';

class AdminHome extends React.Component{
    static contextType = UserContext;

    componentDidMount(){
        this.context.setRelUsers();
    }
    render(){
        const {navigation} = this.props;
        return(
            <Text>This is the ADMIN home screen, home slice</Text>
        );
    }
}
export default AdminHome;