import {useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import Tabs from '../../../components/Tabs';
import AllUserBalances from './employees/AllUserBalances';
import AllowanceRequests from './employees/AllowanceRequests';

const tabs = ['Balance', 'Requests'];

const Employees = ({permissions, project_id}) => {
  const users = useSelector(state => state.app.users.asArray);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <View>
      <View style={{marginBottom: 10}}>
        <Tabs
          data={tabs}
          numOfTab={4}
          minusWidth={20}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </View>

      {activeTab === tabs[0] ? (
        <AllUserBalances
          project_id={project_id}
          users={users}
          permissions={permissions}
        />
      ) : null}
      {activeTab === tabs[1] ? (
        <AllowanceRequests
          project_id={project_id}
          users={users}
          permissions={permissions}
        />
      ) : null}
    </View>
  );
};

export default Employees;
