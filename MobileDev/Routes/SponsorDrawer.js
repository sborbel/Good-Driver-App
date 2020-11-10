import {createDrawerNavigator} from 'react-navigation-drawer';
import SponsorHomeStack from '../Routes/SponsorHomeStack'
import SponsorProfStack from '../Routes/SponsorProfStack'
import SponsorLogout from '../components/LogoutUser';
import MessagesStack from '../Routes/MessagesStack';
import SponsorEventStack from '../Routes/SponsorEventStack';
import SponsorCatTab from '../Routes/SponsorCatTab';
const SponsorDrawer = createDrawerNavigator({
    home: {
        screen: SponsorHomeStack,
        navigationOptions: {
            title: 'Home',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    prof: {
        screen: SponsorProfStack,
        navigationOptions: {
            title: 'Profile',
            headerStyle: {
                backgroundColor: 'gray',
                
            }
        }
    },
    catalog: {
        screen: SponsorCatTab,
        navigationOptions: {
            title: 'Edit Catalog',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    events: {
        screen: SponsorEventStack,
        navigationOptions: {
            title: 'Log Driver Events',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    messages: {
        screen: MessagesStack,
        navigationOptions: {
            title: 'Messages',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    logout: {
        screen: SponsorLogout,
    },
    }
);

export default SponsorDrawer;