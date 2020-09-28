import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import StartUp from '../components/StartupScreen';
import Login from '../components/LoginScreen';
import Register from '../components/RegisterScreen';

const Screens = {
    startScrn: {       
        screen: StartUp,
        navigationOptions: {
            title: 'Unlogged App Home',
            headerStyle: {
                backgroundColor: 'white',
                height: 60,
            }
        }
    },
    loginScrn: {
        screen: Login,
        navigationOptions: {
            title: 'Login Page',
            headerStyle: {
                backgroundColor: 'white',
                height: 60,
            }
        }
    },
    registScrn: {
        screen: Register,
        navigationOptions: {
            title: 'Registration Page',
            headerStyle: {
                backgroundColor: 'white',
                height: 60,
            }
        }
    }
}
const HomeStack = createStackNavigator(Screens);

export default createAppContainer(HomeStack);