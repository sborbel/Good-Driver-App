import React, {Component, useEffect, useState} from 'react';
import {Text, StyleSheet, TextInput, View, TouchableWithoutFeedback, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import { UserContext } from '../contexts/UserContext';

class Messages extends Component{
    static contextType = UserContext;
    state = {
        isLoading: true,
    };
    componentDidMount(){
        this.context.setRelUsers();
    }

    render(){
        
        const Item = ({ email, username, id }) => (
            <TouchableOpacity onPress={ () => navigation.navigate('ThreadScrn', {userID: id})}>
                <View style={{padding: 20, backgroundColor: 'gray', borderWidth: 1, borderColor: 'white'}}>
                    <Text style={{color: 'white', padding: 5, fontWeight: "bold", fontSize: 20}}>{username}</Text>
                    <Text style={{color: 'white', padding: 5}}>{email}</Text>
                    <Text style={{color: 'white', padding: 5}}>ID: {id}</Text>
                </View>
            </TouchableOpacity>
          );
          
        const renderItem = ({ item }) => (
            <Item email={item.email} username={item.username} id={item.id} />
        );

        const {navigation} = this.props;
        return(
            <SafeAreaView>
                <FlatList
                    onRefresh={console.log("hiya papaya")}
                    data={this.context.relevantUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </SafeAreaView>
        );
        
    }
} 
export default Messages;

