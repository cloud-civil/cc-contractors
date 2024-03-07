import {FlatList, Text, View} from 'react-native';
import SizeButton from '../../../../components/SizeButton';
import styles from '../../../../styles/styles';
import DateComponent from '../../../../components/DateComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

const MyRequests = props => {
  const {requests} = props;
  const usersAsObject = useSelector(state => state.app.users.asObject);

  return (
    <View style={{marginBottom: 10}}>
      <FlatList
        data={requests}
        renderItem={({item, index}) => {
          return (
            <SizeButton key={index} onPress={() => {}}>
              <View style={styles.card}>
                <View style={styles.assIcon}>
                  <MaterialCommunityIcons
                    name="credit-card-clock"
                    size={26}
                    color={'white'}
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 14}}>
                    {usersAsObject[item.user_id].fname}{' '}
                    {usersAsObject[item.user_id].lname}
                  </Text>
                  <Text style={{marginTop: 3}}>
                    <Text style={{fontWeight: 600}}>{item.amount}</Text> INR
                  </Text>
                </View>
                <View style={{marginLeft: 'auto'}}>
                  <DateComponent
                    date={item.created_at}
                    style={{marginTop: 4}}
                  />
                </View>
              </View>
            </SizeButton>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={[styles.emptyTabView, {height: 400}]}>
              <Text>You don&apos;t have any requests yet.</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MyRequests;
