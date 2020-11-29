import axios from 'axios';
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Image, Modal, SafeAreaView, FlatList, ScrollView, Keyboard, RefreshControl} from 'react-native';
import { Notifier, Easing } from 'react-native-notifier';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { gStyles } from '../styles/global';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 5 });

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
            },
            order: [{}],
            displayModal: false,
            pointsToBe: 0,
            displaySortModal: false,
            isLoading: true,
            updated: false
        };
    }

    removeItem = () =>{
        var self = this;
        axios({
            method: 'delete',
            timeout: 10000,
            url: self.context.baseUrl + 'api/catalog_items/' + self.state.currDisplayItem.id
        })
        .then(function(){
            self.setState({displayModal: false})
        })
    }
    
    getItems = () =>{
        var self = this;
        for(let itr=0; itr<self.state.catalog.length; itr++){ 
            axios({
                method: 'get',
                timeout: 10000,
                url: self.context.baseUrl + 'api/catalog_items/by_catalog/' + self.state.catalog[itr].id,
            })
                .then(res =>{
                    self.setState({catalogItem: res.data});
                })
                .catch(err =>{
                    console.log("Could not fetch catalog items");
                })
        }
    }

    getCatolog = () => {
        var self = this;
        axios({
            method: 'get',
            timeout: 10000,
            url: self.context.baseUrl + 'api/catalogs/by_sponsor/' + self.context.curr_sponsor.sponsor_name,
        })
            .then(res =>{
                self.setState({catalog: res.data});
            })
            .then(function(){
                self.getItems()
            })
            .then(function(){
                self.setState({isLoading: false});
            })
            .catch(err =>{
                console.log("Could not fetch catalog");
            })
    }
    
    componentDidUpdate(prevProps){
        if(!this.context.noChange()){
            this.setState({updated: true})
        }
    }
    
    componentDidMount(){
        console.log("Hello")
        this.getCatolog()
    }
    componentWillUnmount(){
        console.log("Goodbye")
    }

    render(){

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
                                    <Text style={{padding: 6, fontWeight: 'bold', fontSize: 20, alignSelf: 'flex-start'}}>Point Cost: {this.state.currDisplayItem.points_cost}</Text>
                                </ScrollView>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.setState({displayModal: false})}>
                                        <View style={{backgroundColor: 'white', marginRight: 25, marginTop: 20, padding: 10}}>
                                            <Text>Return To Catalog</Text>
                                        </View>
                                    </TouchableOpacity>  
                                    <TouchableOpacity onPress={() => this.removeItem()}>
                                        <View style={{backgroundColor: 'white', marginRight: 25, marginTop: 20, padding: 10}}>
                                            <Text>Remove Catalog Item</Text>
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
                        <Text numberOfLines={3} style={{flexWrap: 'wrap', maxWidth: 240, fontSize: 17, margin: 5, fontWeight: 'bold'}}>{item.name}</Text>
                        <Text style={(this.context.curr_sponsor.current_points >= parseInt(item.points_cost)) ? styles.inPriceText : styles.outPriceText}>{item.points_cost} points</Text>
                    </View>
                    <Image source={{uri: item.image_url}} style={{width: 80, height: 80}}/>
                </View>
            </TouchableOpacity>
          );
          
        const renderItem = ({ item }) => (
            <Item item={item}/> // set option to toggle cost from points to dollar
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
            console.log('refreshed')
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