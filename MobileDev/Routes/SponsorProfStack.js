import {createStackNavigator} from 'react-navigation-stack';
import SponsorProf from '../components/SponsorProfileScreen';
import SponsorRegDriver from '../components/RegisterDriverScreen';

const SponsorProfStack = createStackNavigator({
    prof: {       
        screen: SponsorProf,
        navigationOptions: {
            title: 'Sponsor Home',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    },
    newUser: {
        screen: SponsorRegDriver,
        navigationOptions: {
            title: 'Register New Driver',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'gray',
                height: 40,
            }
        }
    }
});
export default SponsorProfStack;