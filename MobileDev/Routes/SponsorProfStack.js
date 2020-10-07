import {createStackNavigator} from 'react-navigation-stack';
import SponsorProf from '../components/SponsorProfileScreen';

const SponsorProfStack = createStackNavigator({
    prof: {       
        screen: SponsorProf,
        navigationOptions: {
            title: 'Sponsor Home',
            headerStyle: {
                backgroundColor: 'gray',
                height: 60,
            }
        }
    },
});
export default SponsorProfStack;