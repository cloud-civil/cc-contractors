import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import ProjectStack from '../project/ProjectStack';
import UserDetails from '../org-users/UserDetails';
import AssetDetails from '../org-assets/AssetDetails';
import VendorDetails from '../vendors-and-contractors/VendorDetails';
import IssueCommnet from '../project/Issues/comments/IssueCommnet';
import TabNavigator from '../TabNavigator';
import ContractorDetails from '../vendors-and-contractors/ContractorDetails';
import ErrorBoundary from './ErrorBoundary';

const Stack = createNativeStackNavigator();

const AppStack = ({stateToken}) => {
  return (
    <ErrorBoundary stateToken={stateToken}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProjectStack"
            component={ProjectStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AssetDetails"
            component={AssetDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ContractorDetails"
            component={ContractorDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VendorDetails"
            component={VendorDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="IssueComment"
            component={IssueCommnet}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default AppStack;
