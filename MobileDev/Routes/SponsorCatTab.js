import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import { createTopTabNavigator} from 'react-navigation';  
import ViewCatalog from '../components/ViewCatalog';
import AddItems from '../components/AddCatItem';

const SponsorCatTab = createMaterialTopTabNavigator({
  
        ViewCatalog: {       
            screen: ViewCatalog,
            navigationOptions: {
                title: 'View Catalog',
                tabBarLabel: 'View Catalog',
                width: 100,
            }
        },
        AddItems: {       
            screen: AddItems,
            navigationOptions: {
                title: 'Add Items',
                tabBarLabel: 'Add Items',
                width: 100,
            }
        },
    },
    {
        tabBarPosition: 'top'
    }
);
export default SponsorCatTab;