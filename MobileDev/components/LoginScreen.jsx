import React, {Component, createContext} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from "prop-types";
import {Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserContext } from '../contexts/UserContext';
import { UserListContext } from '../contexts/UserListContext';

const LoginSchema = yup.object({
    email: yup.string()
        .required("Email is Required")
        .min(4),
    password: yup.string()
        .required("Password is Required")
        .min(4)
})



export default class Login extends Component{  
    //static contextType = UserContext;
    
    constructor(){
        super()
        access_token = '';
    }
    render(){
        const {navigation} = this.props;
        return( 
            <UserListContext.Consumer>{(userlistContext) => (
                <UserContext.Consumer>{(userContext) =>{
                    const {getUserId} = userlistContext;
                    const {setAuthUser} = userContext;
                    return(
                        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                            <View style={styles.background}>
                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={LoginSchema}
                                    onSubmit={(values) => {
                                        console.log(values);
                                        const url = `http://192.168.1.145:5001/auth/login`;
                                        axios
                                        .post(url, values)
                                        .then(res => {
                                            console.log(res.data.access_token);
                                            access_token = res.data.access_token; 
                                            console.log("It worked, this is token: " + access_token);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            //this.createMessage("danger", "Incorrect email and/or password.");
                                        });

                                        axios.get('http://192.168.1.145:5001/auth/status', {
                                            headers: {
                                                Authorization: access_token
                                            }
                                        })
                                        .then(res =>{
                                            console.log("info: ");
                                            console.log(res.data);
                                            setAuthUser(values.email, values.password, res.data.username, res.data.role, access_token, getUserId(values.email));
                                            console.log("Logging in..." + this.context.username);
                                            navigation.navigate('DriverApp');
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            console.log("couldn't retrieve user");
                                            //this.createMessage("danger", "Incorrect email and/or password.");
                                        });
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
                }}</UserContext.Consumer>
            )}</UserListContext.Consumer>
        );
    }
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
    icon: {
        left: 230,
        width: 30,
        height: 18
    }
})

/*Login.propTypes = {
    handleLoginScreenSubmit: PropTypes.func,
    isAuthenticated: PropTypes.func
};*/

