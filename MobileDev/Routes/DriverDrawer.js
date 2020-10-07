import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import DriverHome from '../components/DriverHomeScreen';
import DriverProf from '../components/DriverProfileScreen';
import DriverEditInfo from '../components/EditInfo';
import DriverFaq from '../components/DriverFaqScreen';
import DriverLogout from '../components/LogoutUser';

const DriverHomeStack = createStackNavigator({
    homeScrn: {       
        screen: DriverHome,
        navigationOptions: {
            title: 'Driver Home',
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
        screen: DriverFaq,
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
                backgroundColor: 'gray',
            },
            
        }
    },
    Logout: {
        screen: DriverLogout,
    }
},{
    
    drawerBackgroundColor: '#595959',
    contentOptions: {
        activeBackground: '#262626',
        inactiveTintColor: '#f2f2f2',
    }
    
});
export default DriverDrawer;