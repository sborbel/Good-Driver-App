import React, {Component} from 'react';
import { UserContext } from '../contexts/UserContext';

export default class Logout extends Component{
    render(){
        const {navigation} = this.props;
        return(
            <UserContext.Consumer>{(usercontext) => {
                const {resetUser} = usercontext;
                resetUser();
                return(
                    navigation.navigate('Auth')
                )            
            }}</UserContext.Consumer>  
        )             
    }
}