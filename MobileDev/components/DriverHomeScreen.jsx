import React, {Component} from 'react';
import {Text, View, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Notifier, Easing } from 'react-native-notifier';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';

export default class Home extends Component{
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            updated: false
        };
    }
    
    componentDidUpdate(){
        if(!this.context.noChange()){
            console.log("Hello! We updated")
            this.setState({updated: true})
        }
    }
    componentDidMount(){
        console.log("HomeScreen");
    }
    render(){
        if(this.state.updated){
            Notifier.showNotification({
                title: 'Congratulations!',
                description: 'Points have been added to your account!',
                duration: 0,
                showAnimationDuration: 800,
                showEasing: Easing.bounce,
                onHidden: () => this.setState({updated: false}),
                onPress: () => this.setState({updated: false}),
                hideOnPress: true,
            });
        }

        const {navigation} = this.props;
        return(
            <ThemeContext.Consumer>{(ThemeContext) => {
                const {lightTheme} = ThemeContext;
            return(
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
                    <View style={lightTheme ? gStyles.lightBG : gStyles.darkBG}>
                    {console.log(this.context.relevantUsers)}
                        <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Hi, {this.context.username}. Welcome to the driver home page.</Text>
                        <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Current Sponsor: {this.context.curr_sponsor.sponsor_name}</Text>
                        <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Point Total: {this.context.curr_sponsor.current_points}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
            }}</ThemeContext.Consumer>
        );
    }
}