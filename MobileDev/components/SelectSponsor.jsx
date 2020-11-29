import React, {Component} from 'react';
import {Text, Button, TextInput, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export default class SponsorSelect extends Component{
    static contextType = UserContext;
    state = {
        isLoading: false,
    };

    render(){  
        const {navigation} = this.props;
        const Item = ({ name, points, status }) => {
            let yes = "Currently active"
            let no = ""
            return(
                <TouchableOpacity onPress={() => this.context.setSpons(name)}>
                    <View style={{padding: 20, backgroundColor: 'gray', borderWidth: 1, borderColor: 'white'}}>
                        <Text style={{color: 'white', padding: 5, fontWeight: "bold", fontSize: 20}}>{name}</Text>
                        <Text style={{color: 'white', padding: 5}}>Points with this sponsor: {points}</Text>
                        <Text style={{color: 'white', padding: 5}}>Status: {status}</Text>
                        <Text style={{color: 'lightgreen', padding: 5}}>{(name == this.context.curr_sponsor.sponsor_name) ? yes : no}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
          
        const renderItem = ({ item }) => (
            <Item name={item.sponsor_name} points={item.current_points} status={item.status} />
        );

        const wait = (timeout) => {
            return new Promise(resolve => {
              setTimeout(resolve, timeout);
            });
        }

        const onRefresh = () =>{
            this.setState({isLoading: true})
            this.context.setSponsInit()
            wait(1000).then(() => this.setState({isLoading: false}));
        }

        if(this.state.isLoading){
            return (
                <View style={{flex: 1, backgroundColor: 'gray', height: 200}}>
                    <Text style={{alignSelf: 'center', justifyContent: 'center'}}>Loading sponsors...</Text>
                </View>
            )
        }
        else{
            return(
                <SafeAreaView>
                    <FlatList
                        onRefresh={console.log("hiya papaya")}
                        data={this.context.sponsors}
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