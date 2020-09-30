import React, {Component, createContext} from 'react';

export const UserContext = createContext();

class UserContextProvider extends Component{
    state = {
        email: ' ',
        password: ' ',
        username: ' ',
        role: ' ',
        access_token: ' ',
        id: ' ',
    }

    setAuthUser = (eml, pass, user, rol, accTok, uid) => {
        this.setState({email: eml, password: pass, username: user, role: rol, access_token: accTok, id: uid})
    }

    updateUser = (eml, user) => {
        this.setState({email: eml, username: user})
    }
    render(){
        return(
            <UserContext.Provider value={{...this.state, setAuthUser: this.setAuthUser, updateUser: this.updateUser}}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserContextProvider;