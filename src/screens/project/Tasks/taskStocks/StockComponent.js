import {View, Text, Dimensions, FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../../../styles/styles';
import SizeButton from '../../../../components/SizeButton';
import {shallowEqual, useSelector} from 'react-redux';
import {getPermissions} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';
import {getTaskCategoryStocks} from '../utils';
import {useStocks} from '../hooks';
import FloatingButton from '../../../../components/FloatingButton';
import {useMemo, useState} from 'react';
import CreateStockLimitModal from './CreateStockLimitModal';

const StockComponent = props => {
  const navigation = useNavigation();
  const {activeGroupId, project_id, activeGroup} = props;
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const stocksAsObject = (stocks__ && stocks__.asObject) || [];
  const taskStocks = useSelector(
    state => state.task.taskStocks[project_id] || [],
    shallowEqual,
  );
  const [showLimitModal, setShowLimitModal] = useState(false);

  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1020);
  const permission = x && JSON.parse(x.permission);

  const allTaskStocks = getTaskCategoryStocks(taskStocks);

  const runHooks = useMemo(() => {
    return useStocks(allTaskStocks, activeGroupId);
  }, [activeGroupId, taskStocks]);

  const {allStocks} = runHooks;

  return (
    <>
      <View style={[styles.container, {}]}>
        {Object.keys(allStocks).length && permission && permission.read ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Object.values(allStocks)}
            renderItem={({item: tstock}) => (
              <SizeButton
                key={tstock.stock_id}
                onClick={() => {
                  navigation.navigate('TaskStockHistory', {
                    activeStock: tstock,
                    project_id,
                    activeGroupId,
                  });
                }}>
                <View style={styles.card}>
                  <View style={styles.assIcon}>
                    <Feather name="activity" color="white" size={26} />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginLeft: 10,
                      width: '84%',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-evenly',
                      }}
                      className="hover">
                      <Text style={{fontWeight: 600, fontSize: 18}}>
                        {stocksAsObject[tstock.stock_id]?.name}
                      </Text>
                      <Text>
                        Limit: {tstock.stockLimit}{' '}
                        {stocksAsObject[tstock.stock_id]?.unit}
                      </Text>
                    </View>
                    <View>
                      <MaterialIcons name="arrow-forward-ios" />
                    </View>
                  </View>
                </View>
              </SizeButton>
            )}
          />
        ) : !permission || !permission.read ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text>Don&apos;t have permission to view tasks stocks.</Text>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height - 200,
            }}>
            <Text>No stocks under {activeGroup}</Text>
          </View>
        )}
      </View>
      {permission && permission.write && (
        <FloatingButton
          buttonStyle={{margin: 10}}
          onClick={() => {
            setShowLimitModal(true);
          }}>
          <MaterialIcons name="auto-graph" color={'white'} size={28} />
        </FloatingButton>
      )}
      {showLimitModal && (
        <CreateStockLimitModal
          project_id={project_id}
          showModal={showLimitModal}
          setShowModal={setShowLimitModal}
          activeGroupId={activeGroupId}
        />
      )}
    </>
  );
};
export default StockComponent;
