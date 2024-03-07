import {View, Text} from 'react-native';
import {GoBack} from '../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';

const DocumentScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{}}>
      <View style={{marginTop: 44}} />
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            Documents
          </Text>
        </View>
      </View>
      <View style={{marginHorizontal: 10}}>
        <Text>Document</Text>
      </View>
    </View>
  );
};

export default DocumentScreen;
