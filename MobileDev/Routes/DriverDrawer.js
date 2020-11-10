import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import DriverHome from '../components/DriverHomeScreen';
import DriverProf from '../components/DriverProfileScreen';
import DriverEditInfo from '../components/EditInfo';
import SponsorSelect from '../components/SelectSponsor';
import DriverHistory from '../components/PointHistory';
import DriverFaq from '../components/DriverFaqScreen';
import DriverCatalog from '../components/CatalogScreen';
import DriverLogout from '../components/LogoutUser';
import ThreadStack from '../Routes/ThreadStack';

const DriverHomeStack = createStackNavigator({
    homeScrn: {       
        screen: DriverHome,
        navigationOptions: {
            title: 'Driver Home',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
});

const DriverProfStack = createStackNavigator({
    profileScrn: {
        screen: DriverProf,
        navigationOptions: {
            title: 'Profile',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    editName: {
        screen: DriverEditInfo,
        navigationOptions: {
            title: 'Edit Info',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    pointHistory: {
        screen: DriverHistory,
        navigationOptions: {
            title: 'Points History',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    sponsorSelect: {
        screen: SponsorSelect,
        navigationOptions: {
            title: 'Sponsor Select',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        } 
    }
});

const DriverFaqStack = createStackNavigator({
    faqScrn: {
        screen: DriverFaq,
        navigationOptions: {
            title: 'Frequently Asked Questions',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
});

const DriverCatalogStack = createStackNavigator({
    faqScrn: {
        screen: DriverCatalog,
        navigationOptions: {
            title: 'Catalog',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
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
    cat: {
        screen: DriverCatalogStack,
        navigationOptions: {
            title: 'Catalog',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    thread: {
        screen: ThreadStack,
        navigationOptions: {
            title: 'Messages',
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