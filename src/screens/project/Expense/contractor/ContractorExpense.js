import {View, Text, FlatList} from 'react-native';
import SizeButton from '../../../../components/SizeButton';
import styles from '../../../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const Contractors = ({hooksData}) => {
  const navigation = useNavigation();
  const {project_id, contractors} = hooksData;

  return (
    <View>
      <FlatList
        data={contractors}
        renderItem={({item: contractor, index}) => {
          return (
            <SizeButton
              key={index}
              onClick={() => {
                navigation.navigate('contractor_bill', {
                  activeContractor: contractor,
                  project_id,
                });
              }}>
              <View style={styles.card}>
                <View style={styles.assIcon}>
                  <FontAwesome6Icon
                    name="building-user"
                    size={24}
                    color={'white'}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text>{contractor.name}</Text>
                </View>
              </View>
            </SizeButton>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={[styles.emptyTabView, {height: 400}]}>
              <Text>There is no contractor.</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Contractors;
