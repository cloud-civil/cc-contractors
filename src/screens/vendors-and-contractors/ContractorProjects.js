import {FlatList, Text, View} from 'react-native';
import styles from '../../styles/styles';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../styles/Colors';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContractorRateModal from './ContractorRateModal';
import {formateAmount} from '../../utils';

const ContractorProjects = ({userOrg, activeContractor}) => {
  const projects = useSelector(state => state.project.projects);
  const token = useSelector(state => state.auth.token);
  const [rates, setRates] = useState([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axiosInstance(token)
      .get(
        `/gacr/${userOrg.org_id}/${activeContractor.contractor_id}/getAllContractorRate`,
      )
      .then(({data}) => {
        setRates(data.data);
      })
      .catch(err => console.log(err, '/gacr', err?.response?.data?.message));
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.subHeading}>Project Rates</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text style={{color: Colors.primary, fontWeight: '600'}}>
            Add New +
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalBar} />
      <FlatList
        data={rates}
        showsVerticalScrollIndicator={false}
        contentbuttonStyle={{marginVertical: 10}}
        renderItem={({item: rate, index}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: index === rates.length - 1 ? 0 : 1,
                borderBottomColor: '#ccc',
                paddingVertical: 10,
              }}>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <View style={styles.assIcon}>
                  <MaterialCommunityIcons
                    name="fire-truck"
                    color={Colors.textColor}
                    size={28}
                  />
                </View>
                <View style={{marginLeft: 6}}>
                  <Text style={{fontWeight: '600'}}>
                    {projects.asObject[rate.project_id].name}
                  </Text>
                  <Text style={{marginTop: 3}}>
                    Work Limit:{' '}
                    <Text style={{fontWeight: '600'}}>{rate.work_limit}</Text>
                  </Text>
                </View>
              </View>
              <View style={{marginLeft: 'auto'}}>
                <Text style={{fontWeight: '600', marginLeft: 'auto'}}>
                  {rate.name}
                </Text>
                <Text style={{marginTop: 3, marginLeft: 'auto'}}>
                  Rate:{' '}
                  <Text>
                    {formateAmount(rate.amount)}
                    {rate.unit && `/${rate.unit}`}
                  </Text>
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return <Text>There is no projects</Text>;
        }}
      />
      <ContractorRateModal
        showModal={showModal}
        setShowModal={setShowModal}
        activeContractor={activeContractor}
        rates={rates}
        userOrg={userOrg}
        setRates={setRates}
      />
    </View>
  );
};

export default ContractorProjects;
