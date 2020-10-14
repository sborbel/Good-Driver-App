import React, {Component, createContext} from 'react';
import axios from 'axios';
export const UserContext = createContext();

class UserContextProvider extends Component{
    constructor(){
        super();   
        this.state = {
            baseUrl: 'http://192.168.1.145:5001/', //this will change in production
            relevantUsers: [],
            points: 0,
            email: '',
            password: '',
            username: '',
            role: '',
            sponsor_name: '',
            access_token: '',
            refresh_token: '',
            id: -1,
            order: [],
        };
    }
    setAuthUser = (eml, pass, user, rol, refTok, uid) => {
        this.setState({
            email: eml, 
            password: pass, 
            username: user, 
            role: rol, 
            refresh_token: refTok, 
            id: uid,
        })
    }

    setSpons = (spon) => {
        this.setState({
            sponsor_name: spon,
        })
        console.log(this.state.sponsor_name);
    }

    getOrderDetails = async () =>{
        var self = this;
        console.log(self.state.baseUrl + 'orders/by_user/' + self.state.id)
        await axios
            .get(self.state.baseUrl + 'orders/by_user/' + self.state.id)
            .then(res =>{
                console.log(res.data);
                self.setState({order: res.data})
            })
    }
    
    // tally points from events, tally points from orders. save net total.
    setPoints = async () => {
        var self = this;
        var currTemp = [];
        var pointTotal = 0;
        
        self.getOrderDetails();
        // add up all points spent across all orderItems from all orders for this user
        for(var i=0; i<this.state.order.length; i++){
            await axios
                .get(self.state.baseUrl + 'order_items/by_order/' + self.state.order[i].id)
                .then(res =>{
                    currTemp = res.data;
                    console.log('Orders: '+ currTemp);
                })
                .catch(err =>{
                    console.log(err);
                    console.log("Well there's been a problem now, hasn't there part 1?")
                })
            for(var j=0; j<currTemp.length; j++){
                pointTotal -= currTemp[j].points_cost;
            }
        }

        // add up all points gained across all events for this user
        await axios
            .get(self.state.baseUrl + 'events/by_user/' + self.state.id)
            .then(res =>{
                currTemp = res.data;
            })
            .catch(err =>{
                console.log("Well there's been a problem now, hasn't there part 2?")
            })
        for(var i=0; i<currTemp.length; i++){
            pointTotal += currTemp[i].points;
        }
        self.setState({points: pointTotal});
    }
    
    setRelUsers = async () => {
        // base 
        if(this.state.role == 'driver') 
            return;
        
        var ext = '';
        if(this.state.role == 'admin'){
            ext = 'users';
        }
        else if(this.state.role == 'sponsor'){
            ext = 'users/by_sponsor/' + this.state.username;
        }
        ext.replace('\s', '%20');
        console.log(this.state.baseUrl + ext);
        var self = this;
        await axios
            .get(this.state.baseUrl + ext)
            .then(res =>{
                console.log(res.data);
                self.setState({relevantUsers: res.data});
            })
            .catch(err => {
                console.log(err);
                console.log("Something has gone horribly wrong");
            })  
    }

    isAuthenticated = async () => {
        var self = this;
        await axios
            .get(this.state.baseUrl + 'auth/refresh', {refresh_token: refresh_token, user_id: user_id})
            .then(res => {
                self.setState({access_token: res.data.accessToken, refresh_token: res.data.refresh_token})
                return true;
            })
            .catch(err => {
                return false;
            })
    }

    updateUser = (eml, user) => {
        this.setState({email: eml, username: user})
    }

    resetUser = () => {
        this.setState({
            relevantUsers: [],
            points: 0,
            email: '',
            password: '',
            username: '',
            role: '',
            sponsor_name: '',
            access_token: '',
            refresh_token: '',
            id: -1,
            order: []
        })
    }

    getOrders = async () => {
        this.getOrderDetails();
    }
    
    getEvents = async () => {
        var self = this
        var events = [];
        await axios
            .get(self.state.baseUrl + 'events/by_user/' + self.state.id)
            .then(res =>{
                events = res.data;
            })
            .catch(err =>{
                console.log(err)
                console.log("Couldn't fetch events");
            })
        return events;
    }

    render(){
        return(
            <UserContext.Provider value={{...this.state, 
                setAuthUser: this.setAuthUser, 
                updateUser: this.updateUser, 
                resetUser: this.resetUser, 
                setRelUsers: this.setRelUsers,
                setSpons: this.setSpons,
                setPoints: this.setPoints,
                getOrderDetails: this.getOrderDetails,
                isAuthenticated: this.isAuthenticated,
                getOrders: this.getOrders,
                getEvents: this.getEvents,
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserContextProvider;