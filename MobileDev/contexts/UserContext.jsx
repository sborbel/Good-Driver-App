import React, {Component, createContext} from 'react';
import axios from 'axios';
export const UserContext = createContext();

class UserContextProvider extends Component{
    constructor(){
        super();   
        this.state = {
            baseUrl: 'http://good-driver-alb-1469583345.us-east-1.elb.amazonaws.com/',
            //baseUrl: 'http://192.168.1.145:5001/',
            relevantUsers: [],
            currPoints: 0,
            email: '',
            password: '',
            username: '',
            role: '',
            curr_sponsor: [],       // holds point values now
            sponsors: [],           // affiliations here
            access_token: '',
            refresh_token: '',
            id: -1,
            order: [],
            orderItems: [],
            events: [],
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

    // Don't need sponsor ID as driver
    /* First call to set sponsor, this sets an initial sponsor,
    but also returns an object of all affiliate sponsors for in-app switching*/
    setSponsInit = async () => {
        var self = this;
        var temp = []
        var curr;
        await axios
        .get(self.state.baseUrl + 'api/affiliations/affiliations/by_user/' + self.state.id)
        /* will have to pull sponsor name then call sponsor route, then
            itr through those users till sponsor manager is found */
        .then(res =>{                                                           
            console.log(res.data);                                                     
            temp = res.data                                                        
        })
        .then(function(){
            self.setState({sponsors: temp})   
        })
        .then(function(){
            if(temp.length > 0){
                curr = temp[0];
            }
        })
        .then(function(){
            self.setState({curr_sponsor: curr})
        })
        .catch(err =>{
            console.log('Could not retrieve sponsor');
        })
    }

    setSpons = async (spon) => {
        // update sponsor
        // refresh api
        // update again
        var self = this;
        for(var i=0; i<this.state.sponsors.length; i++){
            if(this.state.sponsors[i].sponsor_name == spon){ // get updated values of affiliation
                await axios
                    .get(self.state.baseUrl + 'api/affiliations/affiliations/' + this.state.sponsors[i].id)
                    .then(res =>{
                        self.setState({curr_sponsor: res.data})
                    })
            }
        }
    }

    getOrderDetails = () =>{
        var self = this;
        console.log(self.state.baseUrl + 'api/orders/by_user/' + self.state.id)
        axios
            .get(self.state.baseUrl + 'api/orders/by_user/' + self.state.id)
            .then(res =>{
                console.log(res.data);
                self.setState({order: res.data})
            })
    }
    
    // has order items in 2D array [n][m], where n is order number, and m is item in that order
    getOrderItemDetails = async () =>{
        var self = this;
        var tempEvents = [];
        self.getOrderDetails();
        for(var i=0; i<this.state.order.length; i++){
            tempEvents.push([]);
            await axios
                .get(self.state.baseUrl + 'api/order_items/by_order/' + self.state.order[i].id)
                .then(res =>{
                    console.log(res.data);
                    tempEvents[i].push(res.data);
                })
        }
        self.setState({orderItems: tempEvents});
    }
    
    noChange = () =>{
        if(this.state.curr_sponsor.current_points == this.state.currPoints)
            return true;
        this.setState({currPoints: this.state.curr_sponsor.current_points})
        return false;
    }

    setRelUsers = async () => {
        userID = [];
        // base 
        if(this.state.role == 'driver') 
            return;
        
        var ext = '';
        if(this.state.role == 'admin'){
            ext = 'api/affiliations/affiliations';
        }
        else if(this.state.role == 'sponsor_mgr' || this.state.role == 'sponsor'){
            ext = 'api/affiliations/affiliations/by_sponsor/' + this.state.curr_sponsor.sponsor_name;
        }
        console.log(this.state.baseUrl + ext);
        var self = this;
        let userID = []
        await axios
            .get(self.state.baseUrl + ext)
            .then(res =>{
                console.log(res.data);
                userID = res.data;
            })
            .catch(err => {
                console.log(err);
                console.log("error assigning user data");
            })
        // pull other info from id
        let users = [{}];
        for(var i=0; i<userID.length; i++){
            await axios
            .get(self.state.baseUrl + 'api/users/' + userID[i].user_id) // pull each user id and assign info
            .then(res =>{
                console.log(res.data);
                let user = {
                    email: res.data.email,
                    username: res.data.username,
                    role: res.data.role,
                    id: userID[i].user_id
                }
                users.push(user);
            })
            .catch(err => {
                console.log(err);
                console.log("error in user data loop");
            })
        }
        users.shift()       
        self.setState({relevantUsers: users})  
        console.log(self.state.relevantUsers)
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
            currPoints: 0,
            email: '',
            password: '',
            username: '',
            role: '',
            curr_sponsor: [],       // holds point values now
            sponsors: [],           // affiliations here
            access_token: '',
            refresh_token: '',
            id: -1,
            order: [],
            orderItems: [],
            events: [],
        })
    }
    
    getEvents = () => {
        var self = this
        axios
            .get(self.state.baseUrl + 'api/events/by_user/' + self.state.id + '/by_caller/' + self.state.id)
            .then(res =>{
                self.setState({events: res.data});
            })
            .catch(err =>{
                console.log(err)
                console.log("Couldn't fetch events");
            })
        var sortedItems = this.state.events;   
        sortedItems.sort(function(a, b){return parseFloat(b.created_date)-parseFloat(a.created_date)});
        console.log(sortedItems);    
        self.setState({events: sortedItems})
    }

    render(){
        return(
            <UserContext.Provider value={{...this.state, 
                setAuthUser: this.setAuthUser, 
                updateUser: this.updateUser, 
                resetUser: this.resetUser, 
                setRelUsers: this.setRelUsers,
                setSpons: this.setSpons,
                setSponsInit: this.setSponsInit,
                noChange: this.noChange,
                getOrderDetails: this.getOrderDetails,
                getOrderItemDetails: this.getOrderItemDetails,
                isAuthenticated: this.isAuthenticated,
                getEvents: this.getEvents,
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserContextProvider;