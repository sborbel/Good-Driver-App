import {createStackNavigator} from 'react-navigation-stack';
import AdminProf from '../components/AdminProfileScreen';
import AdminEditInfo from '../components/EditInfo';

const AdminProfStack = createStackNavigator({
    profileScrn: {
        screen: AdminProf,
        navigationOptions: {
            title: 'Profile',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
    editName: {
        screen: AdminEditInfo,
        navigationOptions: {
            title: 'Edit Info',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    }
});

export default AdminProfStack;