import {createStackNavigator} from 'react-navigation-stack';
import SponsorProf from '../components/SponsorProfileScreen';

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
});
export default SponsorProfStack;