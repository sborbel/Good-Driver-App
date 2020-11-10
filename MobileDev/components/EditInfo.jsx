import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';
import {Formik} from 'formik';
import * as yup from 'yup';

const EditSchema = yup.object({
    email: yup.string()
        .required("Email is Required")
        .min(4),
    password: yup.string()
        .required("Password is Required")
        .min(4)
})

export default class Prof extends Component{
    render(){
        return(
            <ThemeContext.Consumer>{(themeContext) =>(
                <UserContext.Consumer>{(userContext) =>{
                    const {lightTheme} = themeContext;
                    const {updateUser} = userContext;
                    const {navigation} = this.props;
                    return(
                        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                            <View style={styles.background}>
                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={EditSchema}
                                    onSubmit={(values) => {
                                        updateUser(values.email, values.password);
                                        // no api call yet because anticipating changes
                                        navigation.pop();
                                    }}
                                >
                                {(props) => (
                                    <View style={lightTheme ? gStyles.lightBG : gStyles.darkBG}>
                                        <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Enter new email:</Text>
                                        <TextInput
                                            style={styles.InputBox}
                                            placeholder='Email'
                                            onChangeText={props.handleChange('email')}
                                            value={this.context.email}
                                            onBlur={props.handleBlur('email')}
                                        />
                                        <Text style={{color: 'crimson'}}>{props.touched.email && props.errors.email}</Text>
                                        <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Enter new password:</Text>
                                        <TextInput
                                            style={styles.InputBox}
                                            placeholder='Password'
                                            onChangeText={props.handleChange('password')}
                                            secureTextEntry={true}
                                            value={this.context.password}
                                            onBlur={props.handleBlur('password')}
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
            )}</ThemeContext.Consumer>
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