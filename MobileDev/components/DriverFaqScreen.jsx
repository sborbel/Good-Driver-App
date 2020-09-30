import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
export default class Faq extends React.Component{
    render(){
        const {navigation} = this.props;
        return(
        <View style={styles.background}>
            <Text style={styles.infoText}>Put some sample questions here. Use stackNav or modal?</Text>
        </View>
        
    )}
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#838b8b",
        flex: 1,
    },
    infoText:{
        color: "#f0ffff",
        fontSize: 24,
        padding: 20,
        fontWeight: "bold"
    }
})