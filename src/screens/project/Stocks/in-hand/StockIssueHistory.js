import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {GoBack} from '../../../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {shallowEqual, useSelector} from 'react-redux';
import styles from '../../../../styles/styles';
import Colors from '../../../../styles/Colors';
import DateComponent from '../../../../components/DateComponent';
import Feather from 'react-native-vector-icons/Feather';

const StockIssueHistory = ({route}) => {
  const {project_id, stock} = route.params;
  const navigation = useNavigation();
  const [issuedStocks, setIssuedStocks] = useState([]);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const taskCategoriesAsObject = useSelector(
    state => state.task.task_categories[project_id].asObject,
    shallowEqual,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance(token)
      .get(`/${project_id}/${stock.stock_id}/getAllIssuedListOfStock`)
      .then(({data}) => {
        setIssuedStocks(data.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err, '/getAllIssuedListOfStock');
      });
  }, []);

  return (
    <>
      <View style={{paddingTop: 44, backgroundColor: 'white'}} />
      <View
        style={{
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
            Material Issue History
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={{fontWeight: 600, fontSize: 16}}>{stock.name}</Text>
        <View style={{marginTop: 10}}>
          {!loading ? (
            <FlatList
              data={issuedStocks}
              renderItem={({item}) => {
                const task =
                  taskCategoriesAsObject &&
                  taskCategoriesAsObject[item.group_id];
                return (
                  <View style={styles.card}>
                    <View style={styles.assIcon}>
                      <Feather name="activity" color={'white'} size={24} />
                    </View>
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontWeight: '600'}}>{task.name}</Text>
                      <Text>
                        {item.quantity} {stock.unit}
                      </Text>
                    </View>

                    <View style={{marginLeft: 'auto'}}>
                      <DateComponent date={item.created_at} />
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={() => {
                return (
                  <View style={[styles.emptyTabView, {height: 400}]}>
                    <Text>No material issue history to show.</Text>
                  </View>
                );
              }}
            />
          ) : (
            <View style={styles.emptyTabView}>
              <ActivityIndicator color={Colors.primary} size={30} />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default StockIssueHistory;
