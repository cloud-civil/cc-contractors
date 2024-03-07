import {View, Text, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../../styles/styles';
import {useSelector} from 'react-redux';
import DateComponent from '../../../components/DateComponent';

const UserExpense = ({filteredUserExpenseData}) => {
  const users = useSelector(state => state.app.users.asObject);

  if (filteredUserExpenseData?.length === 0) {
    return (
      <View style={styles.emptyTabView}>
        <Text>User expense is empty.</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        style={{marginBottom: 160}}
        data={filteredUserExpenseData}
        renderItem={({item}) => {
          return (
            <View style={styles.card}>
              <View style={styles.assIcon}>
                <MaterialCommunityIcons
                  name="credit-card-minus"
                  size={28}
                  color={'white'}
                />
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={{marginBottom: 3}}>
                  <Text style={{fontWeight: 600}}>
                    {users[item.user_id].fname} {users[item.user_id].lname}
                  </Text>{' '}
                </Text>
                <Text>{item.expense} INR</Text>
              </View>
              <View style={{marginLeft: 'auto'}}>
                <DateComponent date={item.created_at} />
              </View>
            </View>
          );
        }}
      />

      {/* <ScrollView horizontal>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row
            data={tableHead}
            style={customStyles.head}
            textStyle={customStyles.text}
            widthArr={[30, 70, 120, 80, 100]}
          />
          <Rows
            data={tableData}
            textStyle={customStyles.text}
            widthArr={[30, 70, 120, 80, 100]}
          />
        </Table>
      </ScrollView> */}
    </View>
  );
};

// const customStyles = StyleSheet.create({
//   container: {margin: 20},
//   head: {height: 40, backgroundColor: '#f1f8ff'},
//   text: {margin: 6, textAlign: 'center'},
// });

export default UserExpense;
