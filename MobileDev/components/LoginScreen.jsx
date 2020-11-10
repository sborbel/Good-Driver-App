import React, {Component, createContext} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Button, Modal, TouchableOpacity} from 'react-native';
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

export default class Login extends Component{  
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            access_token: '',
            refresh_token: '',
            userID: '',
            dispModal: false,
            msg: '',
        };       
    }
    
    
    // make 3 different functions for the axios sequence
    getUserInfo = async (eml, pass) =>{
        var self = this
        await axios
            .get(self.context.baseUrl +'auth/status', {
                headers: {
                    Authorization: self.state.access_token
                }
            })
            .then(function(res){
                self.context.setAuthUser(eml, pass, res.data.username, res.data.role, self.state.refresh_token, self.state.userID);                                          
            })
            .then(function(){
                self.context.setSponsInit();                
            })
            .catch(err => { 
                console.log(err);
                console.log("Invalid Login");
                self.setState({dispModal: true, msg: 'Incorrect Email or password'});
            });
    }

    redirectUser = async () =>{
        var self = this
        const {navigation} = this.props; 
        switch(self.context.role){
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
    }
    
    validateUser = async (eml, pass) => {
        var self = this; 
        await axios
            .post(self.context.baseUrl + 'auth/login', {email: eml, password: pass})
            .then(function(res){
                self.setState({
                    userID: res.data.user_id, 
                    access_token: res.data.access_token, 
                    refresh_token: res.data.refresh_token})
            })
            .then(function(res){
                self.getUserInfo(eml, pass);
            })
            .then(function(res){
                self.redirectUser();
            })
            .catch(err => {
                console.log(err);
                console.log("Unable to validate");
                self.setState({dispModal: true, msg: 'Unable to validate'});
            });
    }

    render(){
        const Message = () =>{
            console.log("display error");
            if(!this.state.dispModal){
                return (null);
            }
            else{
                return(
                    <View style={styles.centeredView}>
                        <Modal visible={this.state.dispModal}
                        animationType="slide">
                            <View>
                                <View style={styles.modalView}>
                                    <Text style={styles.errText}>{this.state.msg}</Text>
                                    <TouchableOpacity onPress={() => this.setState({dispModal: false})}>
                                        <Text>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>   
                        </Modal>
                    </View> 
                )
            }
        }

        return(
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                <View style={styles.background}>
                <Message/>
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
    errtext:{
        textAlign: "center",
        fontSize: 20,
        color: 'crimson',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        }
    },
})


