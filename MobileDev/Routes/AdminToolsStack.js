import {createStackNavigator} from 'react-navigation-stack';
import AdminTools from '../components/AdminTools';
import AdminEditInfo from '../components/EditInfo';

const AdminProfStack = createStackNavigator({
    toolScrn: {
        screen: AdminTools,
        navigationOptions: {
            title: 'Admin Tools',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
});

export default AdminProfStack;