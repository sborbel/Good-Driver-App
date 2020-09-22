import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import StartUp from '../components/StartupScreen';
import Login from '../components/LoginScreen';
import Register from '../components/RegisterScreen';

const Screens = {
    startScrn: {       
        screen: StartUp
    },
    loginScrn: {
        screen: Login
    },
    registScrn: {
        screen: Register
    }
}
const HomeStack = createStackNavigator(Screens);

export default createAppContainer(HomeStack);