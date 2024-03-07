/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {Text} from 'react-native';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import Tabs from '../../components/Tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SizeButton from '../../components/SizeButton';
import styles from '../../styles/styles';
import {FlatList} from 'react-native-gesture-handler';

const LowStock = ({project_id}) => {
  const token = useSelector(state => state.auth.token);
  const tabs = ['Low Stocks'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [lowstocks, setLowStocks] = useState([]);

  useEffect(() => {
    if (project_id) {
      axiosInstance(token)
        .get(`/getLowStockByProjectId?project_id=${project_id}`)
        .then(({data}) => {
          setLowStocks(data.data);
        });
    }
  }, [project_id]);

  return (
    <View style={{marginHorizontal: 10}}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          marginVertical: 10,
          marginLeft: 10,
        }}>
        Stocks
      </Text>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          height: 300,
          padding: 10,
          paddingBottom: 0,
        }}>
        <Tabs
          numOfTab={3}
          data={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          minusWidth={40}
        />
        {lowstocks.length > 0 ? (
          <FlatList
            data={lowstocks}
            showsVerticalScrollIndicator={false}
            contentbuttonStyle={{
              paddingBottom: 10,
            }}
            renderItem={({item, index}) => {
              return (
                <SizeButton key={item.stock_id}>
                  <View
                    style={[
                      styles.cardBorder,
                      {
                        width: Dimensions.get('window').width - 46,
                        borderBottomWidth:
                          lowstocks.length - 1 !== index ? 1 : 0,
                      },
                    ]}>
                    <View style={styles.assIcon}>
                      <MaterialCommunityIcons
                        name="transit-transfer"
                        size={26}
                        color={'white'}
                      />
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{width: '74%'}}>
                        <Text
                          numberOfLines={1}
                          style={{marginBottom: 2, fontWeight: 600}}>
                          {item.name}
                        </Text>
                        {/* <Text>
                          {item.completed || 0}/{item.target}
                          {item.unit}
                        </Text> */}
                      </View>
                      <View style={{marginLeft: 'auto'}}>
                        <Text style={{fontSize: 12}}>
                          {item.total} {item.unit}
                        </Text>
                      </View>
                    </View>
                  </View>
                </SizeButton>
              );
            }}
          />
        ) : (
          <View style={{marginTop: 100}}>
            <Text style={{textAlign: 'center'}}>No stocks to show.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default LowStock;
