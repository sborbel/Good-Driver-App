import React, {Component, createContext} from 'react';
import axios from 'axios';
export const UserContext = createContext();

class UserContextProvider extends Component{
    constructor(){
        super();   
        this.state = {
            baseUrl: 'http://192.168.1.145:5001/', //this will change in production
            relevantUsers: [],
            email: '',
            password: '',
            username: '',
            role: '',
            access_token: '',
            id: -1,
        };
    }
    setAuthUser = (eml, pass, user, rol, accTok, uid) => {
        this.setState({
            email: eml, 
            password: pass, 
            username: user, 
            role: rol, 
            access_token: accTok, 
            id: uid
        })
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

    isAuthenticated = () => {
        return true;
    }

    updateUser = (eml, user) => {
        this.setState({email: eml, username: user})
    }

    resetUser = () => {
        this.setState({email: '', password: '', username: '', role: '', access_token: '', id: ''})
    }

    render(){
        return(
            <UserContext.Provider value={{...this.state, 
                setAuthUser: this.setAuthUser, 
                updateUser: this.updateUser, 
                resetUser: this.resetUser, 
                setRelUsers: this.setRelUsers,
                isAuthenticated: this.isAuthenticated
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserContextProvider;