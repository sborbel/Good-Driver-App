import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import homeStack from './homeStack';
import startStack from './startStack';

const HomeDrawNav = createDrawerNavigator({
    start: {
        screen: startStack,
    },
    home: {
        screen: homeStack,
    }
});

export default createAppContainer(HomeDrawNav);