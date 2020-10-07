import {createDrawerNavigator} from 'react-navigation-drawer';
import AdminProfStack from '../Routes/AdminProfStack'
import AdminHomeStack from '../Routes/AdminHomeStack'
import AdminLogout from '../components/LogoutUser';
const AdminDrawer = createDrawerNavigator({
    Home: {
        screen: AdminHomeStack,
        navigationOptions: {
            title: 'Home',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    Prof: {
        screen: AdminProfStack,
        navigationOptions: {
            title: 'Profile',
            headerStyle: {
                backgroundColor: 'gray',
            }
        }
    },
    logout: {
        screen: AdminLogout,
    }
});
export default AdminDrawer;