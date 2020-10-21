import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import { UserContext } from '../contexts/UserContext';

class Home extends Component{
    static contextType = UserContext;

    componentDidMount(){
        this.context.setRelUsers();
    }
    render(){
        const {navigation} = this.props;
        return(
            <Text>This is the sponsor home screen, home slice</Text>
        );
    }
} 
export default Home;