import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import StartUp from '../components/StartupScreen';
import Login from '../components/LoginScreen';
import Register from '../components/RegisterScreen';
import DriverHome from '../components/DriverHomeScreen';
import DriverProf from '../components/DriverProfileScreen';
import DriverEditInfo from '../components/DriverEditInfo';
import DriverFaq from '../components/DriverFaqScreen';
import homeStack from './homeStack';

/* This is a temporary solution to a hilarious problem */

const DriverHomeStack = createStackNavigator({
    homeScrn: {       
        screen: DriverHome,
        navigationOptions: {
            title: 'Home',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});

const DriverProfStack = createStackNavigator({
    profileScrn: {
        screen: DriverProf,
        navigationOptions: {
            title: 'Profile',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
    editName: {
        screen: DriverEditInfo,
        navigationOptions: {
            title: 'Edit Info',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});

const DriverFaqStack = createStackNavigator({
    faqScrn: {
        screen: DriverFaq, // <- ADD THIS
        navigationOptions: {
            title: 'Frequently Asked Questions',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});

const DriverDrawer = createDrawerNavigator({
    home: {
        screen: DriverHomeStack,
        navigationOptions: {
            title: 'Home',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    prof: {
        screen: DriverProfStack,
        navigationOptions: {
            title: 'Profile',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    faq: {
        screen: DriverFaqStack,
        navigationOptions: {
            title: 'FAQ',
            headerStyle: {
                backgroundColor: 'gray'
            }
        }
    }
});

/*const SponsorAppStack =;
const AdminAppStack =;*/
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
    },
    {
      initialRouteName: 'Auth',
    }
  )
);