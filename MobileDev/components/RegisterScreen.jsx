import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableWithoutFeedback, Keyboard, Button, TextInput} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import {Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const RegisterSchema = yup.object({
    username: yup.string()
        .required("Username is Required")
        .min(4),
    email: yup.string()
        .required("Email is Required")
        .min(4),
    password: yup.string()
        .required("Password is Required")
        .min(3)
})

export default class Register extends Component{
    static contextType = UserContext;
    createUser = async (info) =>{
        console.log(info.username);
        var self = this
        const {navigation} = this.props; 
        const url = 'auth/api/';
        const freshUser = {
            username: info.username,
            email: info.email,
            role: "driver", // default
            password: info.password,
            sponsor_name: "great big freight"
        }
        console.log(freshUser);
        await axios
            .post(this.context.baseUrl + url + 'register', freshUser)
            .then(res =>{
                console.log("Account created!")
                navigation.pop();
            })
            .catch(err =>{
                console.log("This account already exists!")
            })
    }

    render(){
        return( 
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                <View style={styles.background}>
                    <Formik
                        initialValues={{ username: '', email: '', password: '' }}
                        validationSchema={RegisterSchema}
                        onSubmit={(values) => {
                            this.createUser(values)  
                        }}
                    >
                        {(props) => (                                        
                            <View>
                                <Text>Create a Username</Text>
                                <TextInput
                                    style={styles.InputBox}
                                    placeholder="Enter a username"
                                    onChangeText={props.handleChange('username')}
                                    value={props.values.username}
                                    onBlur={props.handleBlur('username')}
                                />
                                <Text style={{color: 'crimson'}}>{props.touched.username && props.errors.username}</Text>
                                
                                <Text style={{paddingTop: 50}}>Create an Email</Text>
                                <TextInput
                                    style={styles.InputBox}
                                    placeholder="Enter an email"
                                    onChangeText={props.handleChange('email')}
                                    value={props.values.email}
                                    onBlur={props.handleBlur('email')}
                                />
                                <Text style={{color: 'crimson'}}>{props.touched.email && props.errors.email}</Text>
                                <Text style={{paddingTop: 50}}>Create a Password</Text>
                                <TextInput
                                    style={styles.InputBox}
                                    placeholder="Enter a password"
                                    onChangeText={props.handleChange('password')}
                                    secureTextEntry={true}
                                    onBlur={props.handleBlur('password')}
                                />                                            
                                <Text style={{color: 'crimson'}}>{props.touched.password && props.errors.password}</Text>
                                <Text style={{paddingTop: 50}}></Text>
                                <Button title='Submit' onPress={props.handleSubmit}/>
                            </View>
                        )}
                    </Formik>   
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#83A2D8",
        flex: 1,
        justifyContent: "center",
        paddingLeft: 10,
    },
    InputBox: {
        paddingHorizontal: 10,
        width: "70%",
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,   
        backgroundColor: "lightgray", 
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 50,
        textAlign: 'left',
    },
    text:{
        textAlign: "center",
        fontSize: 20,
        color: 'crimson',
    },
})