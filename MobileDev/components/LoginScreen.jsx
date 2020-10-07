import React, {Component, createContext} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button, Modal} from 'react-native';
import PropTypes from "prop-types";
import {Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { UserContext } from '../contexts/UserContext';

const LoginSchema = yup.object({
    email: yup.string()
        .required("Email is Required")
        .min(4),
    password: yup.string()
        .required("Password is Required")
        .min(3)
})

axiosRetry(axios, { retries: 5 });

export default class Login extends Component{  
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            access_token: '',
            userID: '',
        };       
    }
    
    validateUser = async (eml, pass) => {
        console.log(eml + "\n" + pass);
        var self = this
        const {navigation} = this.props; 
        const url = `http://192.168.1.145:5001/auth/`;
        await axios
            .post(url + 'login', {email: eml, password: pass})
            .then(function(res){
                self.setState({userID: res.data.user_id, access_token: res.data.access_token})
            })
            .catch(err => {
                console.log(err);
            });
        await axios
            .get(url +'status', {
                headers: {
                    Authorization: self.state.access_token
                }
            })
            .then(function(res){
                self.context.setAuthUser(eml, pass, res.data.username, res.data.role, self.state.access_token, self.state.userID);
                switch(res.data.role){
                    case 'driver':
                        navigation.navigate('DriverApp');
                        break;
                    case 'sponsor':
                        navigation.navigate('SponsorApp');
                        break;
                    case 'sponsor_mgr':
                        navigation.navigate('SponsorApp');
                        break;
                    case 'admin':
                        navigation.navigate('AdminApp');
                        break;
                    default:
                        console.log("Something went wrong");
                    }                                           
            })
            .catch(err => {
                console.log(err);
                console.log("couldn't retrieve user");
            });
    }

    render(){

        return(
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                <View style={styles.background}>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={(values) => {
                            this.validateUser(values.email, values.password)  
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
    },
    text:{
        textAlign: "center",
        fontSize: 20,
        color: 'crimson',
    },
})

/*Login.propTypes = {
    handleLoginScreenSubmit: PropTypes.func,
    isAuthenticated: PropTypes.func
};*/

