import React, {Component} from 'react';
import {Text, Button, TextInput, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 5 });

class Threads extends Component{
    static contextType = UserContext;
      
    constructor(){
        super();
        this.state = {
            threads : [{
                id: -1,
                status: "null",
                creator_id: 0,
                created_date: "0"
            }],
            isLoading: true,
        }
    };
    
    /* Fetch threads on a need to know basis
        drivers fetch threads they're on
        sponsors fetch threds they are on and their drivers
        admins fetch all threads
    */
    fetchThreads = async () =>{
        const {navigation} = this.props;
        var self = this;    
        console.log('http://192.168.1.145:5001/threads/by_user/' + (self.context.role != "driver" ? navigation.getParam('userID') : self.context.id));
        await axios
            .get('http://192.168.1.145:5001/threads/by_user/' + (self.context.role != "driver" ? navigation.getParam('userID') : self.context.id))
            .then(res =>{
                self.setState({threads: res.data})
                self.setState({isLoading: false})
                console.log(res.data);
            })
            .catch(err =>{
                console.log(err);
                console.log("Threads won't load");
            })
    }

    createThread = async () =>{
        console.log("Thread creation function");
        var self = this;
        const threadInfo = {
            status: "Active",
            creator_id: parseInt(self.context.id),
        }
        await axios
            .post('http://192.168.1.145:5001/threads', threadInfo) // set thread to be owned by the sponsor manager
            .then(res=>{
                console.log("Thread should be created")
            })
        this.fetchThreads();

    }

    componentDidMount(){
        this.fetchThreads();
    }
    
    render(){        
        const Item = ({ creator, status, date, id }) => (
            <TouchableOpacity onPress={() => navigation.navigate('viewUserMessageScrn', {threadID: id})}>
                <View style={{padding: 20, backgroundColor: 'gray', borderWidth: 1, borderColor: 'white'}}>
                <Text style={{color: 'white', padding: 5}}>{creator}</Text>
                    <Text style={{color: 'white', padding: 5, fontWeight: "bold", fontSize: 20}}>{status}</Text>
                    <Text style={{color: 'white', padding: 5}}>{date}</Text>
                </View>
            </TouchableOpacity>
          );
          
        const renderItem = ({ item }) => (
            <Item creator={item.creator_id} status={item.status} date={item.created_date} id={item.id} />
        );

        const NewThreadBanner = () =>{
            return(
                <TouchableOpacity onPress={() => this.createThread()}>
                    <View style={{padding: 10, alignItems: 'center', backgroundColor: 'lightblue'}}>
                        <Text>Create New Thread?</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        const {navigation} = this.props;
        if(this.state.isLoading){
            return(               
                <View styles={{flex: 1, alignSelf: "center"}}>
                    <Text style={{alignSelf: "center", paddingTop: 5}}>Loading...</Text>
                </View>
                )
        }
        else{
            return(
                <View style={{flex: 1}}>
                    <NewThreadBanner/>
                    <SafeAreaView style={{flex: 1}}>                  
                        <FlatList
                            data={this.state.threads}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                        />
                    </SafeAreaView>
                </View>
            );
        }
    }
} 
export default Threads;

const styles = StyleSheet.create({
    submitButton:{
        alignSelf: "center",
        alignItems: "center",
        width: "50%",
        height: 30,
        backgroundColor: "#4ecdc4",
        borderTopRightRadius: 100,
        borderBottomLeftRadius: 100,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 100,
        opacity: .8,
    },
})