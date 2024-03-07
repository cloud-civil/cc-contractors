import {FlatList, Text, View} from 'react-native';
import SizeButton from '../../../../components/SizeButton';
import styles from '../../../../styles/styles';
import DateComponent from '../../../../components/DateComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyExpense = props => {
  const {expenses} = props;
  return (
    <View style={{marginBottom: 10}}>
      <FlatList
        data={expenses}
        renderItem={({item: all}) => {
          return (
            <SizeButton key={all.expense_id} onPress={() => {}}>
              <View style={styles.card}>
                <View style={styles.assIcon}>
                  <MaterialCommunityIcons
                    name="credit-card-minus"
                    size={26}
                    color={'white'}
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 14}}>
                    {all.expense} INR
                  </Text>
                </View>
                <View style={{marginLeft: 'auto'}}>
                  <DateComponent date={all.created_at} style={{marginTop: 4}} />
                </View>
              </View>
            </SizeButton>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={[styles.emptyTabView, {height: 400}]}>
              <Text>You don&apos;t have any expenses yet.</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MyExpense;
