/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../../../styles/styles';
import {shallowEqual, useSelector} from 'react-redux';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import Colors from '../../../../styles/Colors';
import {useNavigation} from '@react-navigation/native';
import {getPermissions} from '../../../../utils';
import SizeButton from '../../../../components/SizeButton';
import FloatingButton from '../../../../components/FloatingButton';
import {ReceiveGRNModal} from './ReceiveGRNModal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DateComponent from '../../../../components/DateComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddStock = props => {
  const navigation = useNavigation();
  const {project_id, vendors} = props;
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1015);
  const permission = x && JSON.parse(x.permission);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const [grns, setGrns] = useState([]);

  const stocks = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocks[project_id] && stocks[project_id].asObject) || [];
  const stocksArray = (stocks[project_id] && stocks[project_id].asArray) || [];
  const [activity, setActivity] = useState({
    activeGRN: null,
    selectedStock: null,
    showCreateGRNModal: false,
    showReceiveGRNModal: false,
    reRender: 0,
  });
  const [pageOffsetId, setPageOffsetId] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance(token)
      .get(
        `/grn/getAllGrn?project_id=${project_id}&page_offset_id=${pageOffsetId}`,
      )
      .then(({data}) => {
        if (data.data.length) {
          setGrns(data.data);
        } else {
          setGrns([]);
        }
        setLoading(false);
      })
      .catch(() => {});
  }, [pageOffsetId, activity.reRender]);

  return (
    <View style={styles.container}>
      {!loading ? (
        <>
          {grns && permission && permission.read ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 70,
              }}
              data={grns}
              renderItem={({item, index}) => {
                const __stock = stocksObject && stocksObject[item.stock_id];
                if (!__stock) return null;
                return (
                  <SizeButton
                    key={index}
                    onClick={() => {
                      navigation.navigate('receivedGRN', {
                        activeStock: item.stock_id,
                        viewGrn: item,
                        project_id,
                      });
                    }}>
                    <View style={[styles.card]}>
                      <View style={styles.assIcon}>
                        <Ionicons
                          name="document-text-outline"
                          color={'white'}
                          size={24}
                        />
                      </View>
                      <View style={{marginLeft: 10}}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '600',
                            marginBottom: 2,
                          }}>
                          {__stock.name}
                        </Text>
                        <Text>
                          Received:{' '}
                          <Text style={{fontWeight: '600'}}>
                            {item.received}
                          </Text>{' '}
                          {__stock.unit}
                        </Text>
                      </View>
                      <View style={{marginLeft: 'auto'}}>
                        <DateComponent date={item.created_at} />
                      </View>
                      {/* <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 6,
                          }}>
                          <QuantityCard
                            headline={'Received'}
                            quantity={item.received}
                            unit={stocksObject?.[item?.stock_id]?.unit}
                          />
                        </View>
                        <View style={{marginLeft: 'auto', minWidth: 92}}>
                          {item.received < item.quantity &&
                          permission &&
                          permission.write ? (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: Colors.primary,
                                borderRadius: 4,
                                marginBottom: 4,
                                paddingVertical: 4,
                                paddingHorizontal: 8,
                              }}
                              onClick={() => {
                                setActivity(prev => ({
                                  ...prev,
                                  activeGRN: item,
                                  showReceiveGRNModal: true,
                                  selectedStock: stocksObject?.[item?.stock_id],
                                }));
                              }}>
                              <Text
                                style={{color: 'white', textAlign: 'center'}}>
                                Receive
                              </Text>
                            </CustomButton>
                          ) : null}
                          {item.quantity === item.received && (
                            <View style={[styles.tag, {marginLeft: 5}]}>
                              <MaterialCommunityIcons
                                name="check-decagram"
                                size={14}
                                color="#fff"
                              />
                              <Text style={styles.tagText}>Complete</Text>
                            </View>
                          )}
                        </View>
                      </View> */}
                    </View>
                  </SizeButton>
                );
              }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: Dimensions.get('window').height - 320,
                    }}>
                    <Text>There is no Good receive note.</Text>
                  </View>
                );
              }}
              ListFooterComponent={() => {
                return (
                  <PageinationComponent
                    pageOffsetId={pageOffsetId}
                    setPageOffsetId={setPageOffsetId}
                  />
                );
              }}
            />
          ) : permission && !permission.read ? (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text>Don&apos;t have permission to view GRN.</Text>
            </View>
          ) : null}
        </>
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
      {permission && permission.write && (
        <FloatingButton
          onClick={() =>
            setActivity(prev => ({...prev, showReceiveGRNModal: true}))
          }
          buttonStyle={{margin: 10}}>
          <MaterialCommunityIcons
            name="notebook-plus-outline"
            size={28}
            color={'white'}
          />
        </FloatingButton>
      )}

      {activity.showReceiveGRNModal && (
        <ReceiveGRNModal
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
          vendors={vendors}
          stocksArray={stocksArray}
        />
      )}

      {/* {activity.showCreateGRNModal && (
        <CreateGRNModal
          vendors={vendors}
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
        />
      )}
      {activity.showReceiveGRNModal && (
        <ReceiveGRNModal
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
        />
      )} */}
    </View>
  );
};

const PageinationComponent = ({setPageOffsetId, pageOffsetId}) => {
  return (
    <View style={{marginTop: 'auto'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
          <TouchableOpacity key={item}>
            <View
              style={{
                width: 30,
                height: 30,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 3,
                backgroundColor: 'white',
                borderRadius: 20,
              }}>
              <Text
                style={{
                  color: item === pageOffsetId ? Colors.primary : 'black',
                }}>
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 6,
        }}>
        <TouchableOpacity
          onPress={() => {
            if (pageOffsetId > 1) {
              setPageOffsetId(prev => prev - 1);
            }
          }}>
          <View
            style={{
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 2,
              margin: 8,
              borderRadius: 4,
              borderColor: '#bbb',
            }}>
            <Text>Prev</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPageOffsetId(prev => prev + 1)}>
          <View
            style={{
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 2,
              margin: 8,
              borderRadius: 4,
              borderColor: '#bbb',
            }}>
            <Text>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddStock;
