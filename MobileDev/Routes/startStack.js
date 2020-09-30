import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import StartUp from '../components/StartupScreen';
import Login from '../components/LoginScreen';
import Register from '../components/RegisterScreen';
import homeStack from './homeStack';

const Screens = {
    startScrn: {       
        screen: StartUp,
        navigationOptions: {
            title: 'Unlogged App Home',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
    loginScrn: {
        screen: Login,
        navigationOptions: {
            title: 'Login Page',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
    registScrn: {
        screen: Register,
        navigationOptions: {
            title: 'Registration Page',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
    homeScrn: {
        screen: homeStack
    }
}
const StartStack = createStackNavigator(Screens);

export default StartStack;