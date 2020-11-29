import axios from 'axios';
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, TextInput, Button, FlatList, SafeAreaView, Image, ScrollView, Modal} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { gStyles } from '../styles/global';
import {Formik} from 'formik';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 5 });
export default class EventHandler extends Component{
    static contextType = UserContext;
    constructor(){
        super();
        this.state = {
            items : [{
                name: "null",
                description: "null",    // use as id since catalog ids can be same
                image_url: "null",
                points_cost: "null",
                actual_cost: -1,
                catalog_id: -1,
                created_date: "0",
            }],
            currDispItem: [{
                name: "null",
                description: "null",    // use as id since catalog ids can be same
                image_url: "null",
                points_cost: "null",
                actual_cost: -1,
                catalog_id: -1,
                created_date: "0",
            }],
            displayModal: false,
            isLoading: true,
        };
    }

    createQuery = (info) =>{
        var self = this;
        var words = info.query.split(' ');    // parse words
        const param = {
            source: 'ebay',
            keywords: words
        }
        axios
            .post(self.context.baseUrl + 'api/itemreqs', param)
            .then(res=>{
                self.setState({items: res.data})
            })
            .then(function(){
                if(self.state.items.length > 0)
                    self.setState({isLoading: false})
                else
                    self.setState({isLoading: true})
            })
    }
    
    addCatalogItem = async()=>{
        var self = this;
        var catID = {};
        await axios
            .get(self.context.baseUrl + 'api/catalogs/by_sponsor/' + self.context.curr_sponsor.sponsor_name)
            .then(res =>{
                catID = res.data
                console.log(catID)
            })
            
            .catch(err =>{
                console.log("There was a conundrum");
            })
            const catItem = {
                name: self.state.currDispItem.name[0],
                description: self.state.currDispItem.description[0],    
                image_url: self.state.currDispItem.image_url[0],
                points_cost: parseInt(self.state.currDispItem.points_cost[0]),
                actual_cost: parseInt(self.state.currDispItem.actual_cost[0]),
                catalog_id: parseInt(catID[0].id),
            }
            
        await axios
            .post(self.context.baseUrl + 'api/catalog_items', catItem)
            .then(function(){
                console.log("cat item added")
            })
            .catch( err =>{
                console.log(err)
            })
    }
    
    render(){
        const SearchBar = () =>{
            return(
                <View style={styles.searchBar}>
                        <Text>Search:</Text>  
                        <Formik
                            initialValues={{query: ''}}
                            onSubmit={(values) => {
                             this.createQuery(values)  
                            }}
                        >
                            {(props) => (                                     
                                <View style={styles.searchBar}>
                                    <TextInput
                                        style={styles.InputBox}
                                        placeholder="Search an Item"
                                        onChangeText={props.handleChange('query')}
                                        value={props.values.points}
                                        onBlur={props.handleBlur('query')}
                                    />
                                    <View style={{marginVertical: 5, marginHorizontal: 5}}>
                                        <Button title='Submit' onPress={props.handleSubmit}/>
                                    </View>
                                </View>
                            )}
                        </Formik>   
                </View>   
            )
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
                                <Image source={{uri: this.state.currDispItem.image_url[0]}} style={{ width: 300, height: 300, borderWidth: 2 }}/>
                                <ScrollView>
                                    <Text style={{padding: 10, fontWeight: 'bold', fontSize: 22, alignSelf: 'flex-start'}}>{this.state.currDispItem.name[0]}</Text>
                                    <Text style={{padding: 10, fontSize: 16, alignSelf: 'flex-start'}}>{this.state.currDispItem.description[0]}</Text>
                                    <Text style={{padding: 8, fontWeight: 'bold', fontSize: 20, alignSelf: 'flex-start'}}>Point Cost: {this.state.currDispItem.points_cost[0]}</Text>
                                    <Text style={{padding: 8, fontWeight: 'bold', fontSize: 20, alignSelf: 'flex-start'}}>Dollar Cost: {this.state.currDispItem.actual_cost[0]}</Text>
                                </ScrollView>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.setState({displayModal: false})}>
                                        <View style={{backgroundColor: 'white', marginRight: 25, marginTop: 20, padding: 10}}>
                                            <Text>Return To Search</Text>
                                        </View>
                                    </TouchableOpacity>  
                                    <TouchableOpacity onPress={() => this.addCatalogItem()}>
                                    <View style={{backgroundColor: 'lightblue', marginLeft: 25, marginTop: 20, padding: 10}}>
                                        <Text>Add to Catalog</Text>
                                    </View>
                                </TouchableOpacity> 
                                </View>  
                        </View>   
                    </Modal>                   
                );   
            }
        }
        
        const Item = ({item}) => (  
            <TouchableOpacity onPress={ () => this.setState({displayModal: true, currDispItem: item})}>
                <View style={styles.container}>
                    <View>
                        <Text numberOfLines={3} style={{flexWrap: 'wrap', maxWidth: 240, fontSize: 17, margin: 5, fontWeight: 'bold'}}>{item.name[0]}</Text>
                        <Text style={styles.outPriceText}>{item.points_cost} points</Text>
                    </View>
                    <Image source={{uri: item.image_url[0]}} style={{width: 80, height: 80}}/>
                </View>
            </TouchableOpacity>
        );
          
        const renderItem = ({ item }) => (
            <Item item={item}/> // set option to toggle cost from points to dollar
        );
        <SearchBar/>
        if(this.state.isLoading){
            return( 
                <View style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>   
                    <View style={styles.searchBar}>
                        <Text>Search:</Text>  
                        <Formik
                            initialValues={{query: ''}}
                            onSubmit={(values) => {
                                this.createQuery(values)  
                            }}
                        >
                            {(props) => (                                     
                                <View style={styles.searchBar}>
                                    <TextInput
                                        style={styles.InputBox}
                                        placeholder="Search an Item"
                                        onChangeText={props.handleChange('query')}
                                        value={props.values.points}
                                        onBlur={props.handleBlur('query')}
                                    />
                                    <View style={{marginVertical: 5, marginHorizontal: 5}}>
                                        <Button title='Submit' onPress={props.handleSubmit}/>
                                    </View>
                                </View>
                            )}
                        </Formik>   
                    </View>           
                </TouchableWithoutFeedback>
                </View>
            );
        }
        else{
            return(   
                    <View style={{flex: 1}}>
                        <SearchBar/>
                        <TouchableWithoutFeedback>    
                            <SafeAreaView style={{flex: 1, backgroundColor: 'gray', height: 500}}>
                                <InfoModal/>
                                <FlatList
                                    initialNumToRender={12}
                                    data={this.state.items}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.description[0].toString()}                                
                                />                  
                            </SafeAreaView>  
                        </TouchableWithoutFeedback> 
                    </View>        
            )
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
    searchBar: {
        flexDirection: "row",
        backgroundColor: "gray",
        
        paddingLeft: 10,
        paddingTop: 5,
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
})