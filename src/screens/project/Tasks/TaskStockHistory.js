import {FlatList, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../../../styles/styles';
import {formatDate} from '../../../utils';
import {shallowEqual, useSelector} from 'react-redux';
import {GoBack} from '../../../components/HeaderButtons';
import {useState} from 'react';
import {getTaskCategoryStocks} from './utils';
import {useStocks} from './hooks';
import Tabs from '../../../components/Tabs';
import {useNavigation} from '@react-navigation/native';

const TaskStockHistory = ({route}) => {
  const {activeStock, project_id, activeGroupId} = route.params;
  const navigation = useNavigation();
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const stocksAsObject = (stocks__ && stocks__.asObject) || [];
  const stockName = stocksAsObject[activeStock.stock_id].name;
  const stockUnit = stocksAsObject[activeStock.stock_id].unit;
  const tabs = ['Received', 'Used'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const taskStocks = useSelector(state => state.task.taskStocks, shallowEqual);
  const allTaskStocksOfProject = taskStocks[project_id] || [];
  const task_stocks = getTaskCategoryStocks(allTaskStocksOfProject);
  const stocksInfo = useStocks(task_stocks, activeGroupId);
  const {allIssuedStocks, allUsedStocks} = stocksInfo;

  const totalReceived =
    allIssuedStocks &&
    allIssuedStocks
      .filter(x => x.stock_id === activeStock.stock_id)
      .reduce((total, item) => total + item.quantity, 0);

  const totalUsed =
    allUsedStocks &&
    allUsedStocks
      .filter(x => x.stock_id === activeStock.stock_id)
      .reduce((total, item) => total + item.quantity, 0);

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
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            {stockName}
          </Text>
        </View>
      </View>
      <Text style={{}}>
        Total available:{' '}
        <Text style={{fontWeight: 600}}>{totalReceived - totalUsed}</Text>{' '}
        {stockUnit}
      </Text>
      <View>
        <Tabs
          data={tabs}
          numOfTab={2}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          minusWidth={10}
        />
      </View>
      <View style={{marginTop: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginVertical: 5}}>
            Stock {activeTab} History
          </Text>
          <Text style={{fontWeight: 500}}>
            Total: {activeTab === tabs[0] ? totalReceived : totalUsed}{' '}
            {stockUnit}
          </Text>
        </View>
        {activeTab === 'Received' && allIssuedStocks.length > 0 ? (
          <View>
            <FlatList
              contentbuttonStyle={{marginTop: 10}}
              data={allIssuedStocks}
              renderItem={({item: currentStock}) => {
                if (currentStock.stock_id !== activeStock.stock_id) return null;
                if (currentStock.status !== 101) return null;
                return (
                  <View
                    key={currentStock.tstock_id}
                    style={[styles.card, {backgroundColor: 'white'}]}>
                    <View style={styles.assIcon}>
                      <Feather name="activity" color={'white'} size={28} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                        alignItems: 'center',
                        marginLeft: 10,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#666',
                            fontWeight: 600,
                          }}>
                          {stockName}
                        </Text>
                        <Text style={{fontSize: 13, marginTop: 4}}>
                          <Text style={{fontWeight: 600}}>
                            +{currentStock.quantity}
                          </Text>{' '}
                          {stockUnit} received
                        </Text>
                      </View>
                      <Text style={{fontSize: 14}}>
                        {formatDate(currentStock.created_at)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : null}
        {activeTab === 'Received'
          ? allIssuedStocks.filter(
              currentStock =>
                currentStock.stock_id === activeStock.stock_id &&
                currentStock.status === 101,
            ).length === 0 && (
              <Text
                style={{
                  fontSize: 15,
                  color: 'grey',
                  textAlign: 'center',
                  marginTop: 200,
                }}>
                There is no received stock in task{' '}
                {stocksAsObject[activeStock.stock_id].name}
              </Text>
            )
          : null}

        {activeTab === 'Used' ? (
          <View
          //  style={{height: '90%'}}
          >
            <FlatList
              contentbuttonStyle={{marginTop: 10}}
              data={allUsedStocks}
              renderItem={({item: currentStock}) => {
                if (currentStock.stock_id !== activeStock.stock_id) return null;
                if (currentStock.status !== 102) return null;
                return (
                  <View
                    key={currentStock.tstock_id}
                    style={[styles.card, {backgroundColor: 'white'}]}>
                    <View style={styles.assIcon}>
                      <Feather name="activity" color={'white'} size={28} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                        alignItems: 'center',
                        marginLeft: 10,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#666',
                            fontWeight: 600,
                          }}>
                          {stockName}
                        </Text>
                        <Text style={{fontSize: 13, marginTop: 4}}>
                          <Text style={{fontWeight: 600}}>
                            -{currentStock.quantity}
                          </Text>{' '}
                          {stockUnit} used
                        </Text>
                      </View>
                      <Text style={{fontSize: 14}}>
                        {formatDate(currentStock.created_at)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : null}
        {activeTab === 'Used'
          ? allUsedStocks.filter(
              currentStock =>
                currentStock.stock_id === activeStock.stock_id &&
                currentStock.status === 102,
            ).length === 0 && (
              <Text
                style={{
                  fontSize: 15,
                  color: 'grey',
                  textAlign: 'center',
                  marginTop: 200,
                }}>
                There is no used stock in task{' '}
                {stocksAsObject[activeStock.stock_id].name}
              </Text>
            )
          : null}
      </View>
    </View>
  );
};

export default TaskStockHistory;
