import React, {Component} from 'react';
import { UserContext } from '../contexts/UserContext';

export default class Logout extends Component{
static contextType = UserContext;

componentDidMount(){
    this.context.resetUser();
}
    render(){
        const {navigation} = this.props;
        return(
            navigation.navigate('Auth')
        )             
    }
}