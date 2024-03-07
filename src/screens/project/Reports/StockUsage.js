import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../../../styles/styles';
import Feather from 'react-native-vector-icons/Feather';
import {formatDate} from '../../../utils';

const StockUsage = ({filteredStockData, project_id, loading}) => {
  if (filteredStockData.length === 0) {
    return (
      <View style={styles.emptyTabView}>
        <Text>There is no stocks to show.</Text>
      </View>
    );
  }
  const task_categories = useSelector(state => state.task.task_categories);
  const taskCategories = task_categories[project_id].asObject;
  const stocks = useSelector(state => state.stock.stocks[project_id].asObject);
  const users = useSelector(state => state.app.users.asObject);

  return (
    <View>
      {!loading ? (
        <>
          {taskCategories && filteredStockData && (
            <FlatList
              data={filteredStockData}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 0}}
              renderItem={({item}) => {
                return (
                  <View style={[styles.card, {}]}>
                    <View style={styles.assIcon}>
                      <Feather name="activity" size={24} color="white" />
                    </View>
                    <View style={styles.cardContent}>
                      <Text
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          marginBottom: 2,
                        }}>
                        {stocks[item.stock_id].name}
                      </Text>
                      <Text style={{overflow: 'hidden'}}>
                        {item.quantity} {stocks[item.stock_id].unit}{' '}
                        {stocks[item.stock_id].name} was issued on{' '}
                        {item.group_id
                          ? taskCategories[item.group_id].name
                          : 'Not Available'}{' '}
                        by {users[item.user_id].fname}{' '}
                        {users[item.user_id].lname} on{' '}
                        {formatDate(item.created_at)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator loading={loading} />
        </View>
      )}
    </View>
  );
};

export default StockUsage;
