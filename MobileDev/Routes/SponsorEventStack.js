import {createStackNavigator} from 'react-navigation-stack';
import SelectUserForEvent from '../components/EventSelector';
import SelectEvent from '../components/EventCreationScreen';
const SponsorHomeStack = createStackNavigator({
    SelectUser: {       
        screen: SelectUserForEvent,
        navigationOptions: {
            title: 'Driver Select',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
    eventScrn: {       
        screen: SelectEvent,
        navigationOptions: {
            title: 'Event Select',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});
export default SponsorHomeStack;