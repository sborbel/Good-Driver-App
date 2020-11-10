import {createStackNavigator} from 'react-navigation-stack';
import Messages from '../components/MessagesScreen';
import ThreadScreen from '../components/ThreadsScreen';
import ViewUserMsg from '../components/UserMsgScreen';
const MessagesStack = createStackNavigator({
    messagesScreen: {
        screen: Messages,
        navigationOptions: {
            title: 'Message',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
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

export default MessagesStack;