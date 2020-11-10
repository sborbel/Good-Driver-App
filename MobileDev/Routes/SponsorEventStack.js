import {createStackNavigator} from 'react-navigation-stack';
import SelectUserForEvent from '../components/EventSelector';
import SelectEvent from '../components/EventCreationScreen';
const SponsorEventStack = createStackNavigator({
    SelectUser: {       
        screen: SelectUserForEvent,
        navigationOptions: {
            title: 'Driver Select',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    eventScrn: {       
        screen: SelectEvent,
        navigationOptions: {
            title: 'Event Select',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
});
export default SponsorEventStack;