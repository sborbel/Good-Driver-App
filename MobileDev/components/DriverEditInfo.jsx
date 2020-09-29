import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import {Formik} from 'formik';
import * as yup from 'yup';

const EditSchema = yup.object({
    email: yup.string()
        .required("Email is Required")
        .min(4),
    username: yup.string()
        .required("Username is Required")
        .min(4)
})

export default class Prof extends React.Component{
    static contextType = UserContext;
    render(){
        return(
            <UserContext.Consumer>{(userContext) =>{
                const {updateUser} = userContext;
                const {navigation} = this.props;
                return(
                    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                        <View style={styles.background}>
                            <Formik
                                initialValues={{ email: '', username: '' }}
                                validationSchema={EditSchema}
                                onSubmit={(values) => {
                                    updateUser(values.email, values.username);
                                    // no api call yet because it doesn't match the handle of email/username
                                }}
                            >
                            {(props) => (
                                <View>
                                    <Text style={styles.infoText}>Email:</Text>
                                    <TextInput
                                        style={styles.InputBox}
                                        placeholder={this.context.email}
                                        onChangeText={props.handleChange('email')}
                                        value={props.values.email}
                                        onBlur={props.handleBlur('email')}
                                    />
                                    <Text style={{color: 'crimson'}}>{props.touched.email && props.errors.email}</Text>
                                    <Text style={styles.infoText}>Username:</Text>
                                    <TextInput
                                        style={styles.InputBox}
                                        placeholder={this.context.username}
                                        onChangeText={props.handleChange('username')}
                                        value={props.values.username}
                                        onBlur={props.handleBlur('username')}
                                    />
                                    <Text style={{color: 'crimson'}}>{props.touched.password && props.errors.password}</Text>
                                    <Button title='Submit' onPress={props.handleSubmit}/>
                                </View>
                            )}
                            </Formik>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }}</UserContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#838b8b",
        flex: 1,
    },
    infoText:{
        color: "#f0ffff",
        fontSize: 20,
        padding: 20,
        fontWeight: "bold"
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