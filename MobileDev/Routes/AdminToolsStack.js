import {createStackNavigator} from 'react-navigation-stack';
import AdminTools from '../components/AdminTools';
import AdminEditInfo from '../components/EditInfo';

const AdminProfStack = createStackNavigator({
    toolScrn: {
        screen: AdminTools,
        navigationOptions: {
            title: 'Admin Tools',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});

export default AdminProfStack;