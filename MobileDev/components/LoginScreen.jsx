import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import globalStyles from '../styles/global.js';
import {Formik} from 'formik';
import * as yup from 'yup';

const LoginSchema = yup.object({
    email: yup.string()
        .required("Email is Required")
        .min(4),
    password: yup.string()
        .required("Password is Required")
        .min(6)
})

function Login(props){
    return( <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped") }}>
            <View style={styles.background}>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                >
                    {(props) => (
                        <View>
                        <Text>Email</Text>
                            <TextInput
                                style={styles.InputBox}
                                placeholder="Enter your email"
                            
                                onChangeText={props.handleChange('email')}
                                value={props.values.email}
                                onBlur={props.handleBlur('email')}
                            />
                            <Text style={{color: 'crimson'}}>{props.touched.email && props.errors.email}</Text>
                            <Text style={{paddingTop: 50}}>Password</Text>
                            <TextInput
                                style={styles.InputBox}
                                placeholder="Enter your password"
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

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#4ecdc4",
        flex: 1,
        justifyContent: "center",
        paddingLeft: 10,
    },
    InputBox: {
        paddingHorizontal: 20,
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
})
export default Login;