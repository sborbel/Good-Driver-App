import React, {Component} from 'react';
import {Text, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';
export default class Prof extends Component{
    static contextType = UserContext;
    
    render(){
        const {navigation} = this.props;

        const onEditPress = () => {
            console.log("going to edit page");
            navigation.navigate('editName');
        }
        return (
        <ThemeContext.Consumer>{(ThemeContext) => {
             const {lightTheme, swapTheme} = ThemeContext;

            return(
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                <View style={lightTheme ? gStyles.lightBG : gStyles.darkBG}>
                    <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Username: {this.context.username}</Text>
                    <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Email: {this.context.email}</Text>
                    <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Role: {this.context.role}</Text>
                    <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>ID: {this.context.id}</Text>
                    <Button title="Edit Info" onPress={onEditPress}/> 
                    <Button color='purple' title="Toggle Theme" onPress={swapTheme}/>
                </View>
            </TouchableWithoutFeedback> 
            )
        }}</ThemeContext.Consumer>
        )
    }
}

