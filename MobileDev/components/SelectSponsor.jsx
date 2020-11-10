import React, {Component} from 'react';
import {Text, Button, TextInput, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export default class SponsorSelect extends Component{
    static contextType = UserContext;
    state = {
        isLoading: true,
    };

    render(){  
        const Item = ({ name, points, status }) => {
            return(
                <TouchableOpacity onPress={() => this.context.setSpons(name)}>
                    <View style={{padding: 20, backgroundColor: 'gray', borderWidth: 1, borderColor: 'white'}}>
                        <Text style={{color: 'white', padding: 5, fontWeight: "bold", fontSize: 20}}>{name}</Text>
                        <Text style={{color: 'white', padding: 5}}>Points with this sponsor: {points}</Text>
                        <Text style={{color: 'white', padding: 5}}>Status: {status}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
          
        const renderItem = ({ item }) => (
            <Item name={item.sponsor_name} points={item.current_points} status={item.status} />
        );

        const {navigation} = this.props;
        return(
            <SafeAreaView>
                <FlatList
                    onRefresh={console.log("hiya papaya")}
                    data={this.context.sponsors}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </SafeAreaView>
        );
        
    }
}