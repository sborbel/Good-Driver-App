import axios from 'axios';
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Image, Modal, SafeAreaView, FlatList, ScrollView, Keyboard, RefreshControl} from 'react-native';
import { Notifier, Easing } from 'react-native-notifier';
import {Picker} from '@react-native-community/picker';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { gStyles } from '../styles/global';

export default class CatalogView extends Component{
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            sortOrder: 'alphabetical',
            catalog: [{    // object of all this sponsor's catalogs
                id: 0,
                name: "string",
                supplier: "string",
                created_date: "string",
                sponsor_name: "string",
             }],  
            catalogItem: [{    // object of all items across all this sponsor's catalogs        
                id: 0,
                name: "string",
                description: "string",
                image_url: "string",
                points_cost: 0,
                actual_cost: 0,
                created_date: "string",
                catalog_id: 0                  
            }], 
            currDisplayItem: {    // curr viewed item
                id: -1,
                name: "string",
                description: "string",
                image_url: "string",
                cost: 0,
                catalog_id: -1,
            },
            displayOrderId: -1,
            orderInfo: -1,
            order: [],
            displayModal: false,
            displayOrderModal: false,
            displayOrderItemModal: false,
            displayPriceModal: false,
            displaySortModal: false,
            isLoading: true,
            updated: false,
            loadingOrderItem: false,
        };
    }

    hasEnoughPoints = () => {
        return true;
    }
    
    sortItems = () => {
        var sortedItems = this.state.catalogItem;
        switch(this.state.sortOrder){
            case 'Alphabetical':
                sortedItems.sort(function(a, b){return a.name-b.name});
                break;
            case 'Price (Ascending)':
                sortedItems.sort(function(a, b){return b.points_cost-a.points_cost});
                break;
            case 'Price (Descending)':
                sortedItems.sort(function(a, b){return a.points_cost-b.points_cost});
                break; 
        }
        this.setState({catalogItem: sortedItems})
    }

    getCatolog = async () => {
        var self = this;
        console.log(self.context.baseUrl + 'api/catalogs/by_sponsor/' + self.context.curr_sponsor.sponsor_name)
        await axios
            .get(self.context.baseUrl + 'api/catalogs/by_sponsor/' + self.context.curr_sponsor.sponsor_name)
            .then(res =>{
                self.setState({catalog: res.data});
            })
            .catch(err =>{
                console.log("There was a conundrum");
            })
        for(let itr=0; itr<self.state.catalog.length; itr++){ 
            console.log(self.context.baseUrl + 'api/catalog_items/by_catalog/' + self.state.catalog[itr].id);
        await axios
            .get(self.context.baseUrl + 'api/catalog_items/by_catalog/' + self.state.catalog[itr].id)
            .then(res =>{
                self.setState({catalogItem: res.data});
            })
            .catch(err =>{
                console.log("There was a conundrum2");
            })
        }
        this.sortItems();
        self.setState({isLoading: false});
    }
    
    getOrderItemDetails = () => {
        var self = this;
        axios
            .get(self.context.baseUrl + 'api/catalog_items/' + 0)
    }
    

    submitOrder = () => {
        console.log("submitting...")

        if(this.fetchCurrCost() > this.context.curr_sponsor.current_points){
            this.setState({displayPriceModal: true})
            return;
        }
        var self = this;
        const submittedOrder = {
            id: parseInt(self.state.orderInfo.id),
            status: "submitted",
            user_id: parseInt(self.context.id),
            sponsor_name: self.context.curr_sponsor.sponsor_name,
        }       
        axios
            .put(self.context.baseUrl + 'api/orders/' + self.state.orderInfo.id, submittedOrder)
            .then(function(){
                self.setState({orderInfo: -1})
                self.setState({order: []})
            })
            .then(function(){
                self.context.setSpons(self.context.curr_sponsor.sponsor_name)
            })
            .then(function(){
                self.setState({displayOrderModal: false})
            })
            .catch(err=>{
                console.log(err)
            })
    }

    createOrder = () => {
        var self = this;
        axios
            .post(self.context.baseUrl + 'api/orders', {status: "active", user_id: parseInt(self.context.id), sponsor_name: self.context.curr_sponsor.sponsor_name})
            .then(res=>{
                self.setState({orderInfo: res.data});
            })
            .then(function(){
                self.setOrderItem()
            })
            .catch(err=>{
                console.log(err)
            })
    }
    
    refreshOrder = () => {
        var self = this;
        axios
            .get(self.context.baseUrl + 'api/order_items/by_order/' + self.state.orderInfo.id)
            .then(res=>{
                self.setState({order: res.data})
            })
            .catch(err=>{
                console.log(err)
            })
    }
    
    setOrderItem = async() => {
        var self = this;
        const itemToAdd = {
            order_id: parseInt(self.state.orderInfo.id),
            catalog_id: parseInt(self.state.currDisplayItem.catalog_id),
            catalog_item_id: parseInt(self.state.currDisplayItem.id),
            actual_cost: parseInt(self.state.currDisplayItem.actual_cost),
            points_cost: parseInt(self.state.currDisplayItem.points_cost),
            quantity: 10, // need to add quantity support
        }
        console.log(itemToAdd)
        await axios
            .post(self.context.baseUrl + 'api/order_items', itemToAdd)
            .then(function(){
                self.refreshOrder(); // refresh the order state to reflect newly added items
            })
    }
    addOrderItem = () => {
        console.log(this.state.orderInfo)
        if(this.state.orderInfo == -1){
            this.createOrder();
        }
        else{
            this.setOrderItem()
        }
        this.setState({displayModal: false})
    }

    removeOrderItem = (id) => {
        var self = this;
        axios
        .delete(self.context.baseUrl + 'api/order_items/' + parseInt(id))
        .then(function(){
            self.refreshOrder();
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
    setDisplayItem = (itemId, itemOrderId) => {
        var self = this;
        console.log(self.context.baseUrl + 'api/catalog_items/' + parseInt(itemId))
        axios
            .get(self.context.baseUrl + 'api/catalog_items/' + parseInt(itemId))
            .then(res=>{
                self.setState({currDisplayItem: res.data})
            })
            .then(res=>{
                self.setState({displayOrderId: itemOrderId})
            })
            .then(function(){
                self.setState({displayOrderItemModal: true})
            })
            .catch(err=>{
                console.log(err);
            })
    }

    fetchCurrCost = () =>{
        var total = 0;
        for(var i = 0; i< this.state.order.length; i++){
            total += this.state.order[i].points_cost;
        }
        return total;
    }
    componentDidUpdate(prevProps){
        console.log("Updated catalog")
        if (prevProps.isFocused !== this.props.isFocused) {
            console.log("Proper updated")
            this.getCatolog()
            this.setState({pointsToBe: this.context.currPoints})
        }
        if(!this.context.noChange()){
            console.log("Hello! We updated")
            this.setState({updated: true})
        }
    }
    
    componentDidMount(){
        console.log("Hello")
        this.getCatolog()
    }

    render(){
        if(this.state.updated){
            console.log("Notification pop")
            Notifier.showNotification({
                title: 'Congratulations!',
                description: 'Points have been added to your account!',
                duration: 0,
                showAnimationDuration: 800,
                showEasing: Easing.bounce,
                onHidden: () => this.setState({updated: false}),
                onPress: () => this.setState({updated: false}),
                hideOnPress: true,
            });
        }

        const PickerModal = () =>{
            if(!this.state.displaySortModal){
                return(
                    <Text>Sort by: {this.state.sortOrder}</Text>
                )
            }
            else{
                return( 
                    <View style={styles.centeredView}>
                        <Modal visible={this.state.displaySortModal}
                            animationType="slide">
                            <View>
                                <Picker
                                    selectedValue={this.state.sortOrder}
                                    enabled={true}
                                    onValueChange={(itemValue, itemIndex) =>{                                        
                                        this.setState({sortOrder: itemValue})
                                        this.sortItems();
                                        this.setState({displaySortModal: false})
                                    }
                                }>
                                    <Picker.Item label="Alphabetical" value="Alphabetical" />
                                    <Picker.Item label="Price (Ascending)" value="Price (Ascending)" />
                                    <Picker.Item label="Price (Descending)" value="Price (Descending)" />
                                </Picker>
                            </View>
                        </Modal>
                    </View>
                );
            }
        }

        const InfoModal = () =>{  
            if(!this.state.displayModal){
                return(null)
            }
            else{
                return(                   
                    <Modal visible={this.state.displayModal}
                        animationType="slide">
                            <View style={styles.modalView}>
                                <Image source={{uri: this.state.currDisplayItem.image_url}} style={{ width: 300, height: 300, borderWidth: 2 }}/>
                                <ScrollView>
                                    <Text style={{padding: 10, fontWeight: 'bold', fontSize: 22, alignSelf: 'flex-start'}}>{this.state.currDisplayItem.name}</Text>
                                    <Text style={{padding: 10, fontSize: 16, alignSelf: 'flex-start'}}>{this.state.currDisplayItem.description}</Text>
                                    <Text style={{padding: 8, fontWeight: 'bold', fontSize: 20, alignSelf: 'flex-start'}}>Point Cost: {this.state.currDisplayItem.points_cost}</Text>
                                </ScrollView>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.setState({displayModal: false})}>
                                        <View style={{backgroundColor: 'white', marginRight: 25, marginTop: 20, padding: 10}}>
                                            <Text>Return To Catalog</Text>
                                        </View>
                                    </TouchableOpacity>  
                                    <TouchableOpacity onPress={() => this.addOrderItem()}>
                                        <View style={{backgroundColor: 'lightblue', marginLeft: 25, marginTop: 20, padding: 10}}>
                                            <Text>Add to Order</Text>
                                        </View>
                                    </TouchableOpacity> 
                                </View>  
                            </View>   
                    </Modal>                   
                );   
            }
        }

        const OrderInfoModal = () =>{  
            if(!this.state.displayOrderItemModal){
                return(null)
            }
            else{
                return(                   
                    <Modal visible={this.state.displayOrderItemModal}
                        animationType="slide">
                            <View style={styles.modalView}>
                                <Image source={{uri: this.state.currDisplayItem.image_url}} style={{ width: 300, height: 300, borderWidth: 2 }}/>
                                <ScrollView>
                                    <Text style={{padding: 10, fontWeight: 'bold', fontSize: 22, alignSelf: 'flex-start'}}>Item: {this.state.currDisplayItem.name}</Text>
                                    <Text style={{padding: 10, fontSize: 16, alignSelf: 'flex-start'}}>{this.state.currDisplayItem.description}</Text>
                                    <Text style={{padding: 8, fontWeight: 'bold', fontSize: 20, alignSelf: 'flex-start'}}>Point Cost: {this.state.currDisplayItem.points_cost}</Text>
                                </ScrollView>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.setState({displayOrderItemModal: false})}>
                                        <View style={{backgroundColor: 'white', marginRight: 25, marginTop: 20, padding: 10}}>
                                            <Text>Return To Catalog</Text>
                                        </View>
                                    </TouchableOpacity>  
                                    <TouchableOpacity onPress={() => this.removeOrderItem(this.state.displayOrderId)}>
                                        <View style={{backgroundColor: 'lightblue', marginLeft: 25, marginTop: 20, padding: 10}}>
                                            <Text>Remove From Order</Text>
                                        </View>
                                    </TouchableOpacity> 
                                </View>  
                            </View>   
                    </Modal>                   
                );   
            }
        }

        const PriceModal = () =>{
            if(!this.state.displayPriceModal){
                return(null)
            }
            else{
                return(
                    <Modal visible={this.state.displayPriceModal}
                        animationType="slide"> 
                            <View style={styles.modalView}>
                                <View style={{backgroundColor: 'black', marginTop: 50}}>
                                    <Text style={{color: 'white'}}>Not enough funds to purchase items</Text>
                                </View>                                 
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.setState({displayPriceModal: false})}>
                                        <View style={{backgroundColor: 'white', marginTop: 20, padding: 10, marginBottom: 20}}>
                                            <Text style={{fontWeight: 'bold'}}>Return To Catalog</Text>
                                        </View>
                                    </TouchableOpacity>  
                                </View>  
                            </View>   
                    </Modal> 
                )
            }
        }

        // call api to display appropriate items
        const OrderViewModal = () =>{  
            if(!this.state.displayOrderModal){
                return(
                    <Text>View Cart</Text>
                )
            }
            else{
                return(
                    <View>
                        <PriceModal/> 
                        <OrderInfoModal/>                                    
                            <Modal visible={this.state.displayOrderModal}
                                animationType="slide"> 
                                    <View style={styles.modalView}>
                                        <View style={{backgroundColor: 'black'}}>
                                            <Text style={{color: 'white'}}>Current Order Items</Text>
                                        </View> 
                                        <SafeAreaView style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                                            <FlatList
                                                data={this.state.order}
                                                renderItem={renderOrderItem}
                                                keyExtractor={item => item.id.toString()}                           
                                            /> 
                                        </SafeAreaView>
                                        <View style={{flexDirection: 'row'}}>
                                                <View style={{backgroundColor: 'white',  marginTop: 20, padding: 10, marginBottom: 20}}>
                                                    <Text>Total Points Available: {this.context.curr_sponsor.current_points}</Text>
                                                </View>
                                                <View style={{backgroundColor: 'lightblue', marginTop: 20, padding: 10, marginBottom: 20}}>
                                                    <Text>Total Cost: {this.fetchCurrCost()}</Text>
                                                </View> 
                                        </View>  
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity onPress={() => this.setState({displayOrderModal: false})}>
                                                <View style={{backgroundColor: 'white', marginRight: 25, marginTop: 20, padding: 10, marginBottom: 20}}>
                                                    <Text style={{fontWeight: 'bold'}}>Return To Catalog</Text>
                                                </View>
                                            </TouchableOpacity>  
                                            <TouchableOpacity onPress={() => this.submitOrder()}>
                                                <View style={{backgroundColor: 'lightblue', marginTop: 20, padding: 10}}>
                                                    <Text style={{fontWeight: 'bold'}}>Checkout</Text>
                                                </View>
                                            </TouchableOpacity> 
                                        </View>  
                                    </View>   
                            </Modal> 
                    </View>                  
                );   
            }
        }
        
        const Item = ({item}) => (  
            <TouchableOpacity onPress={ () => this.setState({displayModal: true, currDisplayItem: item})}>
                <View style={styles.container}>
                    <View>
                        <Text style={{flexWrap: 'wrap', maxWidth: 240, fontSize: 17, margin: 5, fontWeight: 'bold'}}>{item.name}</Text>
                        <Text style={(this.context.curr_sponsor.current_points >= parseInt(item.points_cost)) ? styles.inPriceText : styles.outPriceText}>{item.points_cost} points</Text>
                    </View>
                    <Image source={{uri: item.image_url}} style={{width: 80, height: 80}}/>
                </View>
            </TouchableOpacity>
          );

          const OrderItem = ({item}) => (  
            <TouchableOpacity onPress={() => this.setDisplayItem(item.catalog_item_id, item.id)}>
                <View style={styles.container}>
                    <View>
                        <Text style={{flexWrap: 'wrap', maxWidth: 240, fontSize: 17, margin: 5, fontWeight: 'bold'}}>{item.id}</Text>
                        <Text style={(this.context.curr_sponsor.current_points >= parseInt(item.points_cost)) ? styles.inPriceText : styles.outPriceText}>{item.points_cost} points</Text>
                    </View>
                    <Image source={{uri: item.image_url}} style={{width: 80, height: 80}}/>
                </View>
            </TouchableOpacity>
          );
          
        const renderItem = ({ item }) => (
            <Item item={item}/>
        );

        const renderOrderItem = ({ item }) => (
            <OrderItem item={item}/>
        );

        const wait = (timeout) => {
            return new Promise(resolve => {
              setTimeout(resolve, timeout);
            });
        }

        const onRefresh = () =>{
            this.setState({isLoading: true})
            this.getCatolog()
            wait(1000).then(() => this.setState({isLoading: false}));
        }

        const {navigation} = this.props;
        if(this.state.isLoading){
            return (
                <View style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                    <Text style={{alignSelf: 'center', justifyContent: 'center'}}>Loading items...</Text>
                </View>
            )
        }
        else{
            return (
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
                    <SafeAreaView style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                            <InfoModal/>
                            <View style={{alignSelf: 'center', flexDirection: 'row', margin: 14}}>
                                <View style={{borderWidth: 1, margin: 10, borderColor: 'blue',}}>
                                    <TouchableOpacity onPress={() => this.setState({displaySortModal: true})}>
                                        <PickerModal/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{borderWidth: 1, margin: 10, borderColor: 'blue',}}>
                                    <TouchableOpacity onPress={() => this.setState({displayOrderModal: true})}>
                                        <OrderViewModal/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                data={this.state.catalogItem}
                                renderItem={renderItem}
                                keyExtractor={item => item.id.toString()}   
                                refreshControl={
                                    <RefreshControl refreshing={this.state.isLoading} onRefresh={onRefresh} />  
                                }                         
                            />                  
                    </SafeAreaView>
                </TouchableWithoutFeedback>
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
        flex: 1,
        backgroundColor: "gray",
        padding: 10,
        paddingTop: 30,
        alignItems: "center",
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
    inPriceText:{
        flexWrap: 'wrap', 
        maxWidth: 240, fontSize: 15, 
        margin: 5, 
        marginLeft: 10,
        color: 'lightgreen'
    },
    outPriceText:{
        flexWrap: 'wrap', 
        maxWidth: 240, 
        fontSize: 15, 
        margin: 5, 
        marginLeft: 10,
        color: 'crimson'
    }
})