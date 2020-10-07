import {createStackNavigator} from 'react-navigation-stack';
import Messages from '../components/MessagesScreen';
import ThreadScreen from '../components/ThreadsScreen';
import ViewUserMsg from '../components/UserMsgScreen';
const MessagesStack = createStackNavigator({
    messagesScreen: {
        screen: Messages,
        navigationOptions: {
            title: 'Message',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
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

export default MessagesStack;