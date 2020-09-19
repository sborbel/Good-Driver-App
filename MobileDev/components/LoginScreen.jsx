import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard} from 'react-native';

function Login(props){
    const [Email, setEmail] = React.useState('');
    const [Password, setPassword] = React.useState('');
    return( <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped") }}>
            <View style={styles.background}>
                <TextInput
                    style={styles.InputBox}
                    placeholder="Enter your email"
                    onChangeText={(text) => setEmail(text)}
                    />
                    
                <TextInput
                    style={styles.InputBox}
                    placeholder="Enter your password"
                    onChangePasswordText={(text) => setPassword(text)}
                    />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#4ecdc4",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    InputBox: {
        marginBottom: 50,
        width: "70%",
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,   
        backgroundColor: "lightgray", 
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50,
        textAlign: "center",
    },
})
export default Login;