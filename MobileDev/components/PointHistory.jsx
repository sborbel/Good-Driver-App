import React, {Component} from 'react';
import {Text, View, TouchableWithoutFeedback, Keyboard, Button, SafeAreaView, TouchableOpacity} from 'react-native';
import Accordion from 'react-bootstrap/Accordion'
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';
import axiosRetry from 'axios-retry';
import axios from 'axios';

export default class PointHistory extends Component{
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            mode: 0, // 0 = orders, 1 = events
            orders: [],
            ordersItems: [],
            events: [],
            displayModal: false,
            isLoading: true,
        };
    }
    
   /* getOrders = async () => {
        var self = this
        await axios
            .get(self.context.baseUrl + '/orders/by_user/' + self.context.id)
            .then(res =>{
                self.setState({orders: res.data})
            })
            .catch(err =>{
                console.log(err)
                console.log("Couldn't fetch orders");
            })
    }
    
    getEvents = async () => {
        var self = this
        await axios
            .get(self.context.baseUrl + '/events/by_user/' + self.context.id)
            .then(res =>{
                self.setState({events: res.data})
            })
            .catch(err =>{
                console.log(err)
                console.log("Couldn't fetch events");
            })
    }*/

    getOrderItems = async () => {
        var self = this;
        var currTemp = [];
        for(var i=0; i<self.state.orders.length; i++){
            await axios
                .get(self.context.baseUrl + 'order_items/by_order/' + self.state.orders[i].id)
                .then(res =>{
                    currTemp.push(res.data);
                    console.log('Orders: '+ currTemp);
                })
                .catch(err =>{
                    console.log(err);
                    console.log("Well there's been a problem now, hasn't there part 1?")
                })
        }
        this.setState({orderItems: orders});
    }

    componentDidMount(){
        this.setState({orders: this.context.getOrders()});
        this.setState({events: this.context.getEvents()});
        this.getOrderItems();
        console.log("Orders from history: " + this.state.orders);
        console.log("Events from history: " + this.state.events);
    }
    
    render(){
        var op; // 0 = orders, 1 = events
        // conditionally render based on opening orderitems or events
        const Item = ({item}) => (   
            <View style={styles.container}>
                <View>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 17, margin: 5, fontWeight: 'bold'}}>{item.name}</Text>
                    <Text style={{flexWrap: 'wrap', maxWidth: 260, fontSize: 15, margin: 5, marginLeft: 10}}>{item.points_cost} points</Text>
                </View>
                <Image source={{uri: item.image_url}} style={{width: 80, height: 80}}/>
            </View>
            
          );
          
        const renderItem = ({ item }) => (
            <Item item={item}/> // set option to toggle cost from points to dollar
        );
        
        const InfoModal = (option) =>{ 
            if(!this.state.displayModal){
                return(null);
            } 
            else{
                return(
                    <Modal visible={this.state.displayModal}
                        animationType="slide">
                        <SafeAreaView style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                            <View style={{alignSelf: 'center', borderWidth: 1, margin: 5, borderColor: 'blue'}}>
                                <TouchableOpacity onPress={() => this.setState({displayModal: true})}>
                                    <PickerModal/>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                onRefresh={console.log("hiya papaya")}
                                data={(this.state.mode==0) ? this.state.orderItems : this.state.events} //determine modal data
                                renderItem={renderItem}
                                keyExtractor={item => item.id.toString()}                                
                            />                  
                        </SafeAreaView>  
                    </Modal>
                   
                );   
            }
        }

        return(
            <ThemeContext.Consumer>{(ThemeContext) => {
                const {lightTheme} = ThemeContext;
                return(
                    <SafeAreaView>
                        <InfoModal option={op}/>
                        <TouchableOpacity>
                            <View style={{padding: 10, backgroundColor: 'yellow', borderRadius: 1}} onPress={() => this.setState({displayModal: true, mode: 0})}>
                                <Text>Open Order History</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{padding: 10, backgroundColor: 'yellow', borderRadius: 1}} onPress={() => this.setState({displayModal: true, mode: 1})}>
                                <Text>Open Event History</Text>
                            </View>
                        </TouchableOpacity>
                    </SafeAreaView>
                )
            }}
            </ThemeContext.Consumer>
        );
    }
}