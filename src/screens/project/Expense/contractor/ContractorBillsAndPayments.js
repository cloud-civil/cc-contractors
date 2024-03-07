import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import {GoBack} from '../../../../components/HeaderButtons';
import styles from '../../../../styles/styles';
import Tabs from '../../../../components/Tabs';
import DailyContractorBills from './DailyContractorBills';
import {useNavigation} from '@react-navigation/native';
import ContractorPayments from './ContractorPayments';
import ContractorBills from './ContractorBills';

const ContractorBillsAndPayments = ({route}) => {
  const {activeContractor, project_id} = route.params;
  const navigation = useNavigation();
  const contractor = activeContractor;
  const token = useSelector(state => state.auth.token);
  const tabs = ['Payments', 'Bills', 'Daily Bills'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [reRender, setRender] = useState(0);

  const [paymentsByBillId, setPaymentsByBillId] = useState([]);
  const [contractorBills, setContractorBills] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   console.log('ran');
  //   callApi();
  //   callApi2();
  // }, [reRender]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    Promise.all([
      axiosInstance(token).get(
        `/expense/vendor/${project_id}/${activeContractor.contractor_id}/getContractorPayments`,
      ),
      axiosInstance(token).get(
        `/expense/contractor/${project_id}/${activeContractor.contractor_id}/getContractorBills`,
      ),
    ])
      .then(([response1, response2]) => {
        const ll = {};
        response1.data.data.forEach(p => {
          if (!ll[p.bill_id]) {
            ll[p.bill_id] = [p];
          } else {
            ll[p.bill_id].push(p);
          }
        });
        setPaymentsByBillId(ll);
        setContractorBills(response2.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error HomeScreen:', error?.response?.data?.message);
      });
  }, [reRender]);

  useEffect(() => {
    axiosInstance(token)
      .get(`/gacrbp/${project_id}/getAllContractorRateByProject`)
      .then(({data}) => {
        setRates(data.data);
      })
      .catch(err => {
        console.log(err, '/getAllContractorRateByProject');
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{marginTop: 34}} />
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -10,
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            Contractor Bill And Payments
          </Text>
        </View>
      </View>
      {contractor && (
        <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 8}}>
          {contractor.name}
        </Text>
      )}

      <Tabs
        data={tabs}
        numOfTab={3}
        minusWidth={20}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'Payments' ? (
        <ContractorPayments
          loading={loading}
          project_id={project_id}
          setRender={setRender}
          paymentsByBillId={paymentsByBillId}
          contractorBills={contractorBills}
          activeContractor={activeContractor}
        />
      ) : null}
      {activeTab === 'Bills' ? (
        <ContractorBills
          {...route.params}
          loading={loading}
          setRender={setRender}
          contractorBills={contractorBills}
          paymentsByBillId={paymentsByBillId}
          rates={rates}
        />
      ) : null}
      {activeTab === 'Daily Bills' && (
        <DailyContractorBills
          project_id={project_id}
          vendor_id={contractor.contractor_id}
        />
      )}
    </View>
  );
};

export default ContractorBillsAndPayments;
