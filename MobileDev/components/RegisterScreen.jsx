import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native';

function Register(props){
    return( <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped") }}>
                <View style={styles.background}>
                    <Text>Welcome to the registration screen</Text>
                </View>
            </TouchableWithoutFeedback>
            );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#83A2D8",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})

export default Register;