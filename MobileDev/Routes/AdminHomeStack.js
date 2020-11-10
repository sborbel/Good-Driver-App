import {createStackNavigator} from 'react-navigation-stack';
import AdminHome from '../components/AdminHomeScreen';

const AdminHomeStack = createStackNavigator({
    homeScrn: {       
        screen: AdminHome,
        navigationOptions: {
            title: 'Admin Home',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
});

export default AdminHomeStack;