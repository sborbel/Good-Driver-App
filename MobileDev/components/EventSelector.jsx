import axios from 'axios';
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Image, Modal, SafeAreaView, FlatList, RefreshControl} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { gStyles } from '../styles/global';

export default class SelectForEvent extends Component{
    static contextType = UserContext;
    state = {
        isLoading: false,
    };

    render(){
        
        const Item = ({ email, username, id }) => {
            if(id == this.context.id){  // do not display sponsor as an option for points logging
                return(null);
            }
            else{
                return(
                    <TouchableOpacity onPress={ () => navigation.navigate('eventScrn', {userID: id})}>
                        <View style={{padding: 20, backgroundColor: 'gray', borderWidth: 1, borderColor: 'white'}}>
                            <Text style={{color: 'white', padding: 5, fontWeight: "bold", fontSize: 20}}>{username}</Text>
                            <Text style={{color: 'white', padding: 5}}>{email}</Text>
                            <Text style={{color: 'white', padding: 5}}>ID: {id}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
          
        const renderItem = ({ item }) => (
            <Item email={item.email} username={item.username} id={item.id} />
        );

        const {navigation} = this.props;

        const wait = (timeout) => {
            return new Promise(resolve => {
              setTimeout(resolve, timeout);
            });
        }

        const onRefresh = () =>{
            this.setState({isLoading: true})
            this.context.setRelUsers();
            wait(1000).then(() => this.setState({isLoading: false}));
            console.log('refreshed')
        }

        if(this.state.isLoading){
            return (
                <View style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                    <Text style={{alignSelf: 'center', justifyContent: 'center'}}>Loading items...</Text>
                </View>
            )
        }
        else{
            return(
                <SafeAreaView>
                    <FlatList
                        onRefresh={console.log("hiya papaya")}
                        data={this.context.relevantUsers}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={this.state.isLoading} onRefresh={onRefresh} />  
                        }
                    />
                </SafeAreaView>
            );
        }
        
    }
}