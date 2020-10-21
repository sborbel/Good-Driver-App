import axios from 'axios';
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, TextInput, Button, FlatList} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { gStyles } from '../styles/global';
import {Formik} from 'formik';
import * as yup from 'yup';

const eventSchema = yup.object({
    points: yup.number()
        .required("Point Value is Required")
        .integer(),
    description: yup.string()
        .required("Description of Event is Required")
        .min(4),
})

export default class EventHandler extends Component{
    static contextType = UserContext;
    createEvent = async (info) =>{
        var self = this
        const {navigation} = this.props; 
        const url = this.context.baseUrl + 'events/';
        const newEvent = {
            points: parseInt(info.points),
            description: info.description,
            user_id: navigation.getParam('userID')
        }

        await axios
            .post(url, newEvent)
            .then(res =>{
                console.log("Event created!")
                navigation.pop();
            })
            .catch(err =>{
                console.log("Problem creating event!")
            })
    }

    render(){
        return( 
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                <View style={styles.background}>
                    <Formik
                        initialValues={{ points: '', description: ''}}
                        validationSchema={eventSchema}
                        onSubmit={(values) => {
                            this.createEvent(values)  
                        }}
                    >
                        {(props) => (                                        
                            <View>
                                <Text>Enter a point value</Text>
                                <TextInput
                                    keyboardType='number-pad'
                                    style={styles.InputBox}
                                    placeholder="Point Value"
                                    onChangeText={props.handleChange('points')}
                                    value={props.values.points}
                                    onBlur={props.handleBlur('usernapointsme')}
                                />
                                <Text style={{color: 'crimson'}}>{props.touched.points && props.errors.points}</Text>
                                
                                <Text style={{paddingTop: 50}}>Enter an event description</Text>
                                <TextInput
                                    style={styles.InputBox}
                                    placeholder="Description"
                                    onChangeText={props.handleChange('description')}
                                    value={props.values.description}
                                    onBlur={props.handleBlur('description')}
                                />
                                <Text style={{color: 'crimson'}}>{props.touched.description && props.errors.description}</Text>
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