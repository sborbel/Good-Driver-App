import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';

export default class Prof extends React.Component{
    static contextType = UserContext;

    render(){
        const {navigation} = this.props;

        const onEditPress = () => {
            console.log("going to edit page");
            navigation.navigate('editName');
        }

        return(
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
            <View style={styles.background}>
                <Text style={styles.infoText}>Username: {this.context.username}</Text>
                <Text style={styles.infoText}>Email: {this.context.email}</Text>
                <Text style={styles.infoText}>Role: {this.context.role}</Text>
                <Text style={styles.infoText}>ID: {this.context.id}</Text>
                <Button style={{paddingTop: 50}} title="Edit Info" onPress={onEditPress}/>
            </View>
        </TouchableWithoutFeedback>
        
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
