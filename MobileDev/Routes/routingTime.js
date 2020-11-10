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
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    loginScrn: {
        screen: Login,
        navigationOptions: {
            title: 'Login Page',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    registScrn: {
        screen: Register,
        navigationOptions: {
            title: 'Registration Page',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
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