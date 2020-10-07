import React, {Component, createContext} from 'react';

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
    state = {
        lightTheme: true,
        light: { bg: '#ffffff', text: '#000000'},
        dark: { bg: '#1e1e2f', text: '#f2f2f2'}
    }

    swapTheme = () => {
        this.setState({lightTheme: !this.state.lightTheme});
    }

    render (){
        return(
            <ThemeContext.Provider value={{...this.state, swapTheme: this.swapTheme}}>
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}
export default ThemeContextProvider;