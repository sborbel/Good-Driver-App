import {createStackNavigator} from 'react-navigation-stack';
import ThreadScreen from '../components/ThreadsScreen';
import ViewUserMsg from '../components/UserMsgScreen';
const ThreadStack = createStackNavigator({

    ThreadScrn: {
        screen: ThreadScreen,
        navgiationOptions: {
            title: 'Threads',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    viewUserMessageScrn: {
        screen: ViewUserMsg,
        navgiationOptions: {
            title: 'User Messages',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
});

export default ThreadStack;