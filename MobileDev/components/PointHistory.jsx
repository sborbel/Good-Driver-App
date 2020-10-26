import React, {Component} from 'react';
import {Text, View, TouchableWithoutFeedback, FlatList, StyleSheet, Button, SafeAreaView, TouchableOpacity, Modal} from 'react-native';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';
import axiosRetry from 'axios-retry';
import axios from 'axios';

axiosRetry(axios, { retries: 5 });

export default class PointHistory extends Component{
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            mode: 0, // 0 = orders, 1 = events
            ordersItems: [[{}]],
            displayModal: false,
            isLoading: true,
        };
    }

    // put orderItems into flat array
    flattenItems = () =>{
        var tempEvents = [];
        for(var i=0; i<this.context.orderItems.length; i++){
            for(var j=0; j<this.context.orderItems[i].length; j++){
                tempEvents.push(this.context.orderItems[i][j]);
            }
        }
        this.setState({orderItems: tempEvents});
    }
    
    componentDidMount(){
        this.context.getEvents();
        this.context.getOrderDetails();
        this.context.getOrderItemDetails();
        this.flattenItems();
        this.setState({isLoading: false});
    }
    
    render(){
        // conditionally render based on opening orderitems or events
        const raiseModal = (set) => {
            this.setState({displayModal: true, mode: set})
        }
        
        const Item = ({events}) => (   
            <View style={styles.container}>
                <View>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 17, margin: 5, fontWeight: 'bold'}}>{events.description}</Text>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 15, margin: 5, marginLeft: 10}}> Point Value: {events.points} </Text>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 15, margin: 5, marginLeft: 10}}> Date: {events.created_date} </Text>
                </View>
            </View>
            
        );

        const Order = ({ord}) => (   
            <View style={styles.container}>
                <View>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 17, margin: 5, fontWeight: 'bold'}}>Point Value: {ord.points_cost}</Text>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 15, margin: 5, marginLeft: 10}}> ID: {ord.id} </Text>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 15, margin: 5, marginLeft: 10}}> Date: {ord.created_date} </Text>
                </View>
            </View>
            
          ); 
        const renderEvent = ({ item }) => (
            <Item events={item}/> // set option to toggle cost from points to dollar
        );

        const renderOrder = ({ item }) => (
            <Order ord={item}/> // set option to toggle cost from points to dollar
        );
        
        const HistModal = () =>{ 
            if(!this.state.displayModal){
                return(null);
            } 
            else{
                return(
                    <Modal visible={this.state.displayModal}
                        animationType="slide">
                          <SafeAreaView style={{flex: 1}}>
                                <FlatList
                                    onRefresh={console.log("refreshed")}
                                    data={(this.state.mode == 0) ? this.state.orderItems : this.context.events} //determine modal data
                                    renderItem={(this.state.mode == 0) ? renderOrder : renderEvent}
                                    keyExtractor={item => item.id.toString()}                                
                                />  
                            </SafeAreaView>   
                            <TouchableOpacity onPress={() => this.setState({displayModal: false})}>
                                <View style={{padding: 15, backgroundColor: "gray"}}>
                                    <Text style={{alignSelf: 'center'}}>Exit</Text>
                                </View>
                            </TouchableOpacity>               
                    </Modal>
                   
                );   
            }
        }

        if(this.state.isLoading){
            return(null)
        }
        else{
            return(
                <ThemeContext.Consumer>{(ThemeContext) => {
                    const {lightTheme} = ThemeContext;
                    return(
                        <SafeAreaView>
                            <HistModal/>
                            <View>
                                <TouchableOpacity onPress={() => raiseModal(0)}>
                                    <View style={{padding: 10, backgroundColor: 'yellow', borderRadius: 1}}>
                                        <Text>Open Order History</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => raiseModal(1)}>
                                    <View style={{padding: 10, backgroundColor: 'yellow', borderRadius: 1}}>
                                        <Text>Open Event History</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                        
                    )
                }}
                </ThemeContext.Consumer>
            );
        }
    }
}

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
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        padding: 5,
        width: 350,
        height: 100,
        backgroundColor: 'white',
        margin: 10    
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