import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';

export default class Home extends Component{
    static contextType = UserContext;
    
    componentDidMount(){
        console.log("HomeScreen");
        this.context.setPoints();
    }
    render(){
        const {navigation} = this.props;
        return(
            <ThemeContext.Consumer>{(ThemeContext) => {
                const {lightTheme} = ThemeContext;
            return(
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); this.context.setPoints();}}>
                    <View style={lightTheme ? gStyles.lightBG : gStyles.darkBG}>
                    {console.log(this.context.relevantUsers)}
                        <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Hi, {this.context.username}. Welcome to the driver home page.</Text>
                        <Text style={lightTheme ? gStyles.lightSubText : gStyles.darkSubText}>
                            This page is currently under construction. There will be more soon!
                        </Text>
                        <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Point Total: {this.context.points}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
            }}</ThemeContext.Consumer>
        );
    }
}