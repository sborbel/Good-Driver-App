import React, {Component} from 'react';
import {Text, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';
export default class Prof extends Component{
    static contextType = UserContext;
    componentDidMount(){
        console.log("profile mount")
    }
    render(){
        const {navigation} = this.props;

        const onEditPress = () => {
            console.log("going to edit page");
            navigation.navigate('editName');
        }

        const onHistPress = () => {
            console.log("going to history page");
            navigation.navigate('pointHistory');
        }

        const onSponPress = () =>{
            console.log("going to sponsor select page");
            navigation.navigate('sponsorSelect');
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
                    <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Points Available: {this.context.curr_sponsor.current_points}</Text>
                    <Button title="Edit Info" onPress={onEditPress}/> 
                    <Button color='purple' title="Toggle Theme" onPress={swapTheme}/>
                    <Button title="View Transaction History" onPress={onHistPress}/>
                    <Button title="Change current sponsor" onPress={onSponPress}/>
                </View>
            </TouchableWithoutFeedback> 
            )
        }}</ThemeContext.Consumer>
        )
    }
}

