import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import StartUp from '../components/StartupScreen';
import Login from '../components/LoginScreen';
import Register from '../components/RegisterScreen';
import DriverDrawer from '../Routes/DriverDrawer';
import SponsorDrawer from '../Routes/SponsorDrawer';
import AdminDrawer from '../Routes/AdminDrawer';

const AuthStack = createStackNavigator({ 
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
});

export default createAppContainer(
  createSwitchNavigator(
    {
        Auth: AuthStack,
        DriverApp: DriverDrawer,
        SponsorApp: SponsorDrawer,
        AdminApp: AdminDrawer,
    },
    {
      initialRouteName: 'Auth',
    }
  )
);