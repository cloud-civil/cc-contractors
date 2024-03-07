import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import TaskComponent from './onlyTasks/TaskComponent';
import StockComponent from './taskStocks/StockComponent';
import {GoBack} from '../../../components/HeaderButtons';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Tabs from '../../../components/Tabs';
import {useState} from 'react';

const tabs = ['Tasks', 'Materials'];

const TaskAndStockNavigation = ({route}) => {
  const {activeGroupId, project_id, activeGroup} = route.params;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const props = {
    activeGroup,
    project_id,
    activeGroupId,
  };

  return (
    <>
      <View style={{paddingTop: 44, backgroundColor: 'white'}} />
      <View
        style={{
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',

          backgroundColor: 'white',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            {activeGroup}
          </Text>
        </View>
      </View>

      <Tabs
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfTab={2}
        minusWidth={0}
        backgroundColor="white"
        icons={icons}
      />

      {activeTab === tabs[0] && <TaskComponent {...props} />}
      {activeTab === tabs[1] && <StockComponent {...props} />}
    </>
  );
};

const icons = [
  <MaterialCommunityIcons key={0} name="transit-transfer" size={20} />,
  <Feather key={1} name="activity" size={20} />,
];

export default TaskAndStockNavigation;
