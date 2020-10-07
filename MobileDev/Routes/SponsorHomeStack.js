import {createStackNavigator} from 'react-navigation-stack';
import SponsorHome from '../components/SponsorHomeScreen';

const SponsorHomeStack = createStackNavigator({
    shomeScrn: {       
        screen: SponsorHome,
        navigationOptions: {
            title: 'Sponsor Home',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});
export default SponsorHomeStack;