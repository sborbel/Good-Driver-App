import {createStackNavigator} from 'react-navigation-stack';
import StartUp from '../components/StartupScreen';
import Login from '../components/LoginScreen';
import Register from '../components/RegisterScreen';
import DriverHome from '../components/DriverHomeScreen';

const Screens = {
    homeScrn: {       
        screen: DriverHome,
        navigationOptions: {
            title: 'Home Screen',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
}
const homeStack = createStackNavigator(Screens);

export default homeStack;