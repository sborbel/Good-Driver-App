import {createStackNavigator} from 'react-navigation-stack';
import ThreadScreen from '../components/ThreadsScreen';
import ViewUserMsg from '../components/UserMsgScreen';
const ThreadStack = createStackNavigator({

    ThreadScrn: {
        screen: ThreadScreen,
        navgiationOptions: {
            title: 'Threads',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
    viewUserMessageScrn: {
        screen: ViewUserMsg,
        navgiationOptions: {
            title: 'User Messages',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});

export default ThreadStack;