import axios from 'axios';
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Image, Modal, SafeAreaView, FlatList, ScrollView} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
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
                name: "string",
                description: "string",
                image_url: "string",
                cost: 0,
            },
            order: [{}],
            displayModal: false,
            pointsToBe: 0,
            displaySortModal: false,
            isLoading: true,
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
        console.log(self.context.baseUrl + 'catalogs/by_sponsor/' + self.context.sponsor_name)
        await axios
            .get(self.context.baseUrl + 'catalogs/by_sponsor/' + self.context.sponsor_name)
            .then(res =>{
                self.setState({catalog: res.data});
            })
            .catch(err =>{
                console.log("There was a conundrum");
            })
        for(let itr=0; itr<self.state.catalog.length; itr++){ 
            console.log(self.context.baseUrl + 'catalog_items/by_catalog/' + self.state.catalog[itr].id);
        await axios
            .get(self.context.baseUrl + 'catalog_items/by_catalog/' + self.state.catalog[itr].id)
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
    
    createOrder = () => {
        var self = this;
        axios
            .post(self.context.baseUrl + 'orders', {status: "active", user_id: parseInt(self.id)})
            // doesn't return an id. can just retroactively collect based on status (must assume that all other orders
            // for this user are closed, thus must PUT that), add an array of orderItems to order AFTER checkout complete
    }
    
    addOrderItem = () => {
        if(this.state.order.length == 0){
            this.createOrder();
        }

    }
    
    componentDidUpdate(prevProps){
        console.log("Updated catalog")
        if (prevProps.isFocused !== this.props.isFocused) {
            this.getCatolog()
            this.setState({pointsToBe: this.context.points})
        }
    }
    
    componentDidMount(){
        console.log("Hello")
        this.getCatolog()
        this.setState({pointsToBe: this.context.points})
    }
    componentWillUnmount(){
        console.log("Goodbye")
    }

    render(){
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
                                <Text style={{padding: 10, fontWeight: 'bold', fontSize: 16, alignSelf: 'flex-start'}}>Updated Points Available: {this.state.pointsToBe}</Text>
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
        
        const Item = ({item}) => (
           
            <TouchableOpacity onPress={ () => this.setState({displayModal: true, currDisplayItem: item})}>
                <View style={styles.container}>
                    <View>
                        <Text style={{flexWrap: 'wrap', maxWidth: 240, fontSize: 17, margin: 5, fontWeight: 'bold'}}>{item.name}</Text>
                        <Text style={(this.context.points >= parseInt(item.points_cost)) ? styles.inPriceText : styles.outPriceText}>{item.points_cost} points</Text>
                    </View>
                    <Image source={{uri: item.image_url}} style={{width: 80, height: 80}}/>
                </View>
            </TouchableOpacity>
          );
          
        const renderItem = ({ item }) => (
            <Item item={item}/> // set option to toggle cost from points to dollar
        );

        const {navigation} = this.props;
        if(this.state.isLoading){
            return (<Text>No Items to display</Text>)
        }
        else{
            return (
                <SafeAreaView style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                        <InfoModal/>
                        <View style={{alignSelf: 'center', borderWidth: 1, margin: 5, borderColor: 'blue'}}>
                            <TouchableOpacity onPress={() => this.setState({displaySortModal: true})}>
                                <PickerModal/>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={this.state.catalogItem}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}                                
                        />                  
                </SafeAreaView>
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
        padding: 35,
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