import React, {Component} from 'react';
import {ImageBackground, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text} from 'react-native';

function StartUp({navigation}){

    const onLoginPress = () => {
        console.log("login pressed");
        navigation.navigate('loginScrn');
    }

    const onRegisterPress = () => {
        console.log("register pressed");
        navigation.navigate('registScrn');
    }
    return (
        <TouchableWithoutFeedback onPress={() => { console.log("keyboard dropped") }}>
            <ImageBackground
                style={styles.background}
                source={require("../assets/Backgrounds/sampleBG.jpg")}>    
                <TouchableOpacity onPress={onLoginPress}>
                    <View style={styles.loginButton}>
                        <Text style={styles.buttonText}>Login</Text> 
                    </View>
                </TouchableOpacity>
                <View style={styles.space}></View>
                <TouchableOpacity onPress={onRegisterPress}>
                    <View style={styles.registerButton}>
                        <Text style={styles.buttonText}>Register</Text> 
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButton:{
        padding: 12,
        width: "1000%",
        height: 70,
        backgroundColor: "#4ecdc4",
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
        opacity: .8,
    },
    buttonText:{
        textAlign: "center",
        paddingTop: 6,
        fontSize: 30,
    },
    space:{
        width:"60%",
        height: 40,
    },
    registerButton:{
        padding: 12,
        width: "70%",
        height: 70,
        backgroundColor: "#83A2D8",
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        opacity: .8,
    },
})

export default StartUp;
 