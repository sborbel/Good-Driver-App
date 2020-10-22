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
            orders: [{}],
            ordersItems: [[{}]],
            displayModal: false,
            isLoading: true,
        };
    }


    getOrderItemsDetails = async () => {
        var self = this;
        var currTemp = [[{}]];
        for(var i=0; i<self.state.orders.length; i++){
            await axios
                .get(self.context.baseUrl + 'order_items/by_order/' + self.context.orders[i].id)
                .then(res =>{
                    currTemp.push(res.data);
                    console.log('Orders: ' + currTemp);
                })
                .catch(err =>{
                    console.log(err);
                    console.log("Well there's been a problem now, hasn't there part 1?")
                })
        }
        var itemInfo = [{

        }];
        // fetch info from catalog for each order item (in a 2D array of size [n][m], pushed for each m items from an order, for n orders)
        for(var i=0; i<currTemp.length; i++){
            for(var j=0; j<currTemp[i].length; j++){
                await axios
                .get(self.context.baseUrl + 'catalog_items/' + currTemp[i][j].id)
                .then(res =>{
                    itemInfo.push(res.data);
                })
                .catch(err =>{
                    console.log("Well, we're back in error town aren't we.");
                })
            }
        }
        self.setState({orderItems: itemInfo});
    }

    componentDidMount(){
        this.context.getEvents();
        this.context.getOrderDetails();
        this.getOrderItemsDetails();
        console.log("Orders from history: " + this.state.orders);
        console.log("Events from history: " + this.context.events);
        this.setState({isLoading: false});
    }
    
    render(){
        var op; // 0 = orders, 1 = events
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
          
        const renderEvent = ({ item }) => (
            <Item events={item}/> // set option to toggle cost from points to dollar
        );

        const renderOrder = ({ item }) => (
            <Item events={item}/> // set option to toggle cost from points to dollar
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
                                <Text style={{alignSelf: 'center'}}>Exit</Text>
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