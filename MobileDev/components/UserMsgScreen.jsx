import React, {Component, useEffect} from 'react';
import {Text, Modal, TextInput, View, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, FlatList, SafeAreaView, StyleSheet, Button} from 'react-native';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { UserContext } from '../contexts/UserContext';
import {Formik} from 'formik';
import * as yup from 'yup';


const MsgSchema = yup.object({
    subject: yup.string()
        .required("Header is required")
        .min(1),
    content: yup.string()
        .required("Message content is required")
        .min(1)
})

axiosRetry(axios, { retries: 5 });

class UserMsg extends Component{
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            messages : [{
                id: -1,
                thread_id: 0,
                sender_id: 0,
                recipient_id: 0,
                subject: "val",
                content: "con",
                created_date: "0",
            }],
            displayModal: false,
            isLoading: true,
        };
    }

    getMessages = async () => {
        const {navigation} = this.props;    
        var self = this;   
        console.log('http://192.168.1.145:5001/messages/by_thread/' + navigation.getParam('threadID'));
        await axios
            .get('http://192.168.1.145:5001/messages/by_thread/' + navigation.getParam('threadID'))
            .then(res=>{
                console.log(res.data);
                self.setState({messages: res.data});
                self.setState({isLoading: false});
            })
            .catch(err =>{
                console.log(err);
                console.log("Messages won't load");
            })
    }
    
    createMessage = async (info) => {
        const {navigation} = this.props;  
        console.log("going here");
        const newMsg = {
            content: info.content,
            recipient_id: this.state.messages[0].recipient_id,
            sender_id: parseInt(this.context.id),
            subject: info.subject,
            thread_id: navigation.getParam('threadID'),
        };
        console.log(newMsg);
        await axios
            .post('http://192.168.1.145:5001/messages', newMsg)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
        this.getMessages();
    }

    componentDidMount(){
        console.log("hello");
        this.getMessages();
    }

    render(){
        const RaiseModal = () =>{ 
            if(!this.state.displayModal){
                return(null);
            } 
            else{
                return(
                    <View style={styles.centeredView}>
                        <Modal visible={this.state.displayModal}
                            animationType="slide">
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Some info about message</Text>
                                    <TouchableOpacity onPress={() => this.setState({displayModal: false})}>
                                        <Text>Cancels</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>   
                        </Modal>
                    </View>
                );   
            }
        }
        
        const Item = ({ subject, content, sid, rid }) => (
            <TouchableOpacity onPress={ () => this.setState({displayModal: true})}>
                <View style={(this.context.id == sid) ? styles.container : styles.replyContainer}>
                    <Text style={{color: 'white',  fontSize: 8}}>From: {sid}, To: {rid}</Text>
                    <Text style={(this.context.id == sid) ? styles.title : styles.replyTitle}>{subject}</Text>
                    <Text style={(this.context.id == sid) ? styles.text : styles.replyText}>{content}</Text>
                </View>
            </TouchableOpacity>
          );
          
        const renderItem = ({ item }) => (
            <Item subject={item.subject} content={item.content} sid={item.sender_id} rid={item.recipient_id}/>
        );

        const MessagesBox = () => (
            <View style={styles.background}>
                <Formik
                    initialValues={{ subject: '', content: '' }}
                    validationSchema={MsgSchema}
                    onSubmit={(values) => {
                        console.log(values);
                        this.createMessage(values);
                    }}
                >
                    {(props) => (                                        
                        <View style={styles.composeContainer}>
                            <TextInput
                                style={{borderColor: 'black', borderBottomWidth: 1, padding: 10}}
                                placeholder = 'Subject...'
                                placeHolderTextColor = '#404040'
                                onChangeText={props.handleChange('subject')}
                                value={props.values.subject}
                                onBlur={props.handleBlur('subject')}
                            />
                            <Text style={{color: 'crimson'}}>{props.touched.email && props.errors.email}</Text>
                            <TextInput
                                style={{borderColor: 'black', borderBottomWidth: 1, padding: 10}}
                                placeholder = 'Content...'
                                multiline = {true}
                                placeHolderTextColor = '#404040'
                                onChangeText={props.handleChange('content')}
                                value={props.values.content}
                                onBlur={props.handleBlur('content')}
                            />   
                            <TouchableOpacity onPress={props.handleSubmit}>
                                <View style={styles.submitButton}>  
                                    <Text style={{alignSelf: "center", paddingTop: 5}}>Submit</Text>
                                </View>
                            </TouchableOpacity>                                                       
                            <Text style={{color: 'crimson'}}>{props.touched.password && props.errors.password}</Text>                           
                        </View>
                    )}
                </Formik>   
            </View>
        )

        const {navigation} = this.props;
        if(this.state.messages.isLoading){
            return <Text>No messages to display</Text>
        }
        else{
            console.log(this.state.messages);
            return(
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{flex: 1}}
                    keyboardVerticalOffset={55}
                >
                    <SafeAreaView style={{flex: 1, backgroundColor: 'gray'}}>
                        <RaiseModal/>
                            <FlatList
                                onRefresh={console.log("hiya papaya")}
                                data={this.state.messages}
                                renderItem={renderItem}
                                keyExtractor={item => item.id.toString()}
                                
                            />
                        <MessagesBox/>                   
                    </SafeAreaView>
                </KeyboardAvoidingView>
            );
        }
    }
} 
export default UserMsg;

const styles = StyleSheet.create({
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
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'flex-end',
        padding: 5,
        width: 250,
        backgroundColor: 'purple',
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 0,
        marginBottom: 10    
    },
    replyContainer: {
        padding: 5,
        flex: 1,
        flexDirection: 'column',
        width: 250,
        alignSelf: 'flex-start',  
        backgroundColor: 'black',
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 25,
        marginBottom: 10   
    },
    title: {
        color: 'white', padding: 5, fontWeight: "bold", fontSize: 16, alignSelf: 'flex-end'
    },
    replyTitle: {
        color: 'white', padding: 5, fontWeight: "bold", fontSize: 16, alignSelf: 'flex-start'
    },
    text: {
        color: 'white', 
        padding: 5, 
        paddingLeft: 10,
        fontSize: 12
    },
    replyText: {
        color: 'white', 
        padding: 5, 
        paddingRight: 10,
        fontSize: 12
    },
    composeContainer: {
        backgroundColor: 'lightgray'
    },
    composeText: {
        alignSelf: 'center'
    },
    submitButton:{  
        top: 7, 
        alignSelf: "center",
        width: "20%",
        height: 30,
        backgroundColor: "#4ecdc4",
        borderTopRightRadius: 100,
        borderBottomLeftRadius: 100,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 100,
        opacity: .8,
    },
})