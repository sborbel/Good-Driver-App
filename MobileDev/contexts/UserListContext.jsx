import React, {Component, createContext} from 'react';

export const UserListContext = createContext();

class UserListContextProvider extends Component{
    state = {
        users: []
    }

    setUsers = (usersObj) => {
        this.setState({users: usersObj})
        console.log(users);
    }

    getUserId = (eml) => {
        for(var i=0; i<users.length; i++){
            if(users[i].email == eml)
                return users[i].id;
        }
        return null;
    }

    render(){
        return(
            <UserListContext.Provider value={{...this.state, setUsers: this.setUsers, getUserId: this.getUserId}}>
                {this.props.children}
            </UserListContext.Provider>
        );
    }
}

export default UserListContextProvider;