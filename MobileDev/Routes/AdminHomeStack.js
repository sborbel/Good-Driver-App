import {createStackNavigator} from 'react-navigation-stack';
import AdminHome from '../components/AdminHomeScreen';

const AdminHomeStack = createStackNavigator({
    homeScrn: {       
        screen: AdminHome,
        navigationOptions: {
            title: 'Admin Home',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});

export default AdminHomeStack;