import {ActivityIndicator, FlatList, Image, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {GoBack} from '../../../../components/HeaderButtons';
import {IMAGE_URL} from '@env';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import ImageView from 'react-native-image-viewing';
import QuantityCard from '../../../../components/QuantityCard';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {receiveGRN} from '../../../../cc-hooks/src/appSlice';
import {useNavigation} from '@react-navigation/native';
import {setStocks} from '../../../../cc-hooks/src/stockSlice';
import DateComponent from '../../../../components/DateComponent';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ReceiveGRNHistory = ({route}) => {
  const {activeStock, viewGrn, project_id} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocks__[project_id] && stocks__[project_id].asObject) || [];
  const [grnData, setGrnData] = useState(null);
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const [reRender, setRender] = useState(0);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const stock = useSelector(state => state.stock, shallowEqual);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance(token)
      .get(
        `/grn/getAllReceivedGrn/?project_id=${project_id}&grn_id=${viewGrn.grn_id}`,
      )
      .then(({data}) => {
        setGrnData(data.data);
        setLoading(false);
      })
      .catch(() => {});
  }, [reRender]);

  const totalReceived =
    grnData &&
    grnData.reduce((sum, item) => {
      const v = JSON.parse(item.verification);
      if (v?.verified) return item.received + sum;
      return sum;
    }, 0);

  const verifyGrn = __verifyGrn => {
    axiosInstance(token)
      .post('/grn/verifyGrn', {
        grn_id: viewGrn.grn_id,
        stock_id: viewGrn.stock_id,
        rgrn_id: __verifyGrn.rgrn_id,
        received: __verifyGrn.received,
        verification: JSON.stringify({
          verified: true,
          verified_by: authUser.user_id,
        }),
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'GRN verified succesfully.',
        });

        dispatch(
          receiveGRN({
            grn_id: viewGrn.grn_id,
            project_id,
            quantity: parseInt(__verifyGrn.received),
          }),
        );

        const stocksAsObject = {};
        const stocksArray = stock.stocks[project_id].asArray.map(s => {
          if (s.stock_id === viewGrn.stock_id) {
            const f = {...s, total: __verifyGrn.received + s.total};
            stocksAsObject[s.stock_id] = f;
            return f;
          }
          stocksAsObject[s.stock_id] = s;
          return s;
        });
        dispatch(
          setStocks({
            project_id,
            data: {
              asArray: stocksArray,
              asObject: stocksAsObject,
            },
          }),
        );
        setRender(prev => prev + 1);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to verify GRN.',
        });
        console.error(err);
      });
  };
  if (!viewGrn) {
    return null;
  }

  return (
    <>
      <View style={{paddingTop: 34, backgroundColor: 'white'}} />
      <View
        style={{
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',

          backgroundColor: 'white',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            Received GRN of {stocksObject[viewGrn.stock_id].name}
          </Text>
        </View>
      </View>

      {!loading ? (
        <View style={[styles.container, {backgroundColor: 'white'}]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <QuantityCard
              headline={'Ordered'}
              quantity={viewGrn.quantity}
              unit={stocksObject[viewGrn.stock_id].unit}
            />
            <QuantityCard
              headline={'Received'}
              quantity={totalReceived || 0}
              unit={stocksObject[viewGrn.stock_id].unit}
            />
          </View>
          {grnData.length ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={grnData}
              renderItem={({item: grn, index}) => {
                const verification = JSON.parse(grn.verification);
                const images = grn.images && JSON.parse(grn.images);
                let address = null;
                try {
                  const l = JSON.parse(grn.location);
                  address = l.address;
                } catch {
                  address = grn.location;
                }
                return (
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      borderBottomWidth: index === grnData.length - 1 ? 0 : 1,
                      borderBottomColor: '#ccc',
                      paddingBottom: 10,
                      marginBottom: 10,
                    }}
                    key={grn.rgrn_id}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{}}>
                        {grn.vehicle_no && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: 2,
                            }}>
                            <MaterialCommunityIcons
                              name="truck"
                              size={20}
                              color="#333"
                            />
                            <Text style={{marginLeft: 4, fontWeight: '600'}}>
                              {grn.vehicle_no}
                            </Text>
                          </View>
                        )}
                        {address && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              marginVertical: 2,
                              width: '80%',
                            }}>
                            <Entypo name="location" size={18} color="#333" />
                            <Text
                              style={{
                                marginLeft: 4,
                              }}>
                              {address}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={{
                          marginLeft: 'auto',
                        }}>
                        {grn.received_at && (
                          <DateComponent date={grn.received_at} />
                        )}
                        {!grn.has_invoice ? (
                          <Text
                            style={{
                              color: 'red',
                              marginBottom: 4,
                            }}>
                            Invoice Pending
                          </Text>
                        ) : null}
                        {verification && verification.verified ? (
                          <View style={styles.tag}>
                            <MaterialCommunityIcons
                              name="check-decagram"
                              color={'#fff'}
                              size={14}
                              style={{marginRight: 4}}
                            />
                            <Text style={styles.tagText}>Approved</Text>
                          </View>
                        ) : (
                          <>
                            {!(viewGrn.quantity <= totalReceived) ? (
                              <CustomButton
                                buttonStyle={{
                                  backgroundColor: Colors.primary,
                                  borderRadius: 4,
                                  marginBottom: 4,
                                  width: 100,
                                  marginLeft: 'auto',
                                  paddingVertical: 4,
                                  paddingHorizontal: 8,
                                }}
                                onClick={() => {
                                  verifyGrn(grn);
                                }}>
                                <Text
                                  style={{color: 'white', textAlign: 'center'}}>
                                  Approve
                                </Text>
                              </CustomButton>
                            ) : null}
                          </>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 6,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <QuantityCard
                          headline={'Received'}
                          quantity={grn.received}
                          unit={activeStock && stocksObject[activeStock].unit}
                        />
                      </View>
                      {images && images.length > 0 && (
                        <FlatList
                          style={{marginVertical: 2}}
                          data={images}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentbuttonStyle={{paddingRight: 50}}
                          renderItem={({item: img}) => {
                            const url = `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/thumbnail-${img.fullName}`;
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  setActiveImage([
                                    {
                                      uri: `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/preview-${img.fullName}`,
                                    },
                                  ]);
                                  setShowPhotoModal(true);
                                }}
                                activeOpacity={0.7}
                                key={img.fullName}>
                                <Image
                                  source={{
                                    uri: url,
                                    headers: {
                                      Authorization: token,
                                    },
                                  }}
                                  style={{
                                    width: 64,
                                    height: 48,
                                    borderRadius: 6,
                                    marginRight: 6,
                                  }}
                                />
                              </TouchableOpacity>
                            );
                          }}
                        />
                      )}
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={styles.emptyTabView}>
              <Text>There is no GRN order for this stock.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator size={30} color={Colors.primary} />
        </View>
      )}
      <ImageView
        images={activeImage}
        imageIndex={0}
        visible={showPhotoModal}
        onRequestClose={() => {
          setShowPhotoModal(false);
        }}
      />
    </>
  );
};

export default ReceiveGRNHistory;
