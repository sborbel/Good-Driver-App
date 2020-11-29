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
        .min(3),
    points: yup.number()
        .required("Point Value is Required")
        .integer(),
})

export default class Register extends Component{
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            user: {},  
        }
    }
    createAffiliation = (info) =>{
        var self = this
        const newUser = {
            user_id: parseInt(self.state.user.user_id),
            sponsor_name: self.context.curr_sponsor.sponsor_name,
            status: "active",
            current_points: parseInt(info.points)
        }
        console.log(newUser)
        axios
            .post(this.context.baseUrl + 'api/affiliations/affiliations', newUser)
            .then(function(){
                console.log("New driver created")
            })
            .catch(err=>{
                console.log(err)
            })
    }

    createUser = (info) =>{
        var self = this
        const {navigation} = this.props; 
        const url = 'auth/api/';
        const freshUser = {
            username: info.username,
            email: info.email,
            role: "driver",
            password: info.password,
        }
        axios
            .post(this.context.baseUrl + 'api/users', freshUser)
            .then(res=>{
                self.setState({user: res.data})
            })
            .then(function(){    
                self.createAffiliation(info)
            })
            .then(function(){
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
                        initialValues={{ username: '', email: '', password: '', points: '' }}
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
                                <Text style={{paddingTop: 50}}>Enter starting point value (Can be 0)</Text>
                                <TextInput
                                     keyboardType='number-pad'
                                    style={styles.InputBox}
                                    placeholder="Enter a point value"
                                    onChangeText={props.handleChange('points')} 
                                    onBlur={props.handleBlur('points')}
                                />                                            
                                <Text style={{color: 'crimson'}}>{props.touched.points && props.errors.points}</Text>
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
        backgroundColor: "gray",
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