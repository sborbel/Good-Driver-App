import {createStackNavigator} from 'react-navigation-stack';
import SponsorHome from '../components/SponsorHomeScreen';

const SponsorHomeStack = createStackNavigator({
    shomeScrn: {       
        screen: SponsorHome,
        navigationOptions: {
            title: 'Sponsor Home',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    },
    {
        
    }
);
export default SponsorHomeStack;