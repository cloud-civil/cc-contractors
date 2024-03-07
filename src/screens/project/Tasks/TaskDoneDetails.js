import React from 'react';
import {
  FlatList,
  Image,
  Text,
  // TouchableOpacity,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {GoBack} from '../../../components/HeaderButtons';
import {formatDate} from '../../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMAGE_URL} from '@env';
import {shallowEqual, useSelector} from 'react-redux';
import {useState} from 'react';
import QuantityCard from '../../../components/QuantityCard';
import ImageView from 'react-native-image-viewing';
import {useNavigation} from '@react-navigation/native';

const TaskDoneDetails = ({route}) => {
  const {data, project_id, contractor, unit} = route.params;
  const navigation = useNavigation();
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const images = JSON.parse(data.images);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const stockUsed = JSON.parse(data.metadata).stocks;
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const stocksAsObject = (stocks__ && stocks__.asObject) || [];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const imageSlides = images.map(item => {
    return {
      uri: `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/preview-${item.fullName}`,
    };
  });
  console.log(data);
  return (
    <>
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
            Task Done Details
          </Text>
        </View>
      </View>
      <View style={{marginHorizontal: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{width: 250}}>
            <Text style={{fontWeight: '500'}}>Word done By </Text> {contractor}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="clock-time-three-outline"
              size={16}
              color="#333"
            />
            <Text style={{color: '#333', marginLeft: 4}}>
              {formatDate(data.created_at)}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <QuantityCard
            headline={'Completed'}
            quantity={data.completed}
            unit={unit}
            backgroundColor={'white'}
          />
        </View>
        {stockUsed.length ? (
          <View>
            <Text
              style={{
                fontWeight: 600,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                paddingBottom: 5,
                marginBottom: 10,
              }}>
              Stocks Used
            </Text>
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{width: '100%'}}
                data={stockUsed}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc',
                        paddingBottom: 6,
                        marginBottom: 6,
                      }}>
                      {/* <QuantityCard
                        width={100}
                        headline={stocksAsObject?.[item.stock_id]?.name}
                        quantity={item?.quantity}
                        unit={stocksAsObject?.[item.stock_id]?.unit}
                        backgroundColor={'white'}
                      /> */}
                      <Text>{stocksAsObject?.[item.stock_id]?.name}</Text>
                      <Text>
                        {item?.quantity} {stocksAsObject?.[item.stock_id]?.unit}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        ) : null}
        <View style={{marginVertical: 10}}>
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              const url = `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/thumbnail-${item.fullName}`;
              return (
                <TouchableOpacity
                  onPress={() => {
                    setActiveImageIdx(index);
                    setShowPhotoModal(true);
                  }}
                  activeOpacity={0.7}
                  key={item.fullName}
                  style={{marginRight: 6}}>
                  <Image
                    style={{width: 90, height: 120, borderRadius: 8}}
                    source={{
                      uri: url,
                      headers: {
                        Authorization: token,
                      },
                    }}
                  />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => {
              return <Text>There is no image</Text>;
            }}
          />
        </View>

        <ImageView
          images={imageSlides}
          imageIndex={activeImageIdx}
          FooterComponent={({imageIndex}) => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginBottom: 50,
                }}>
                {imageSlides.map((item, index) => (
                  <View key={index}>
                    <View
                      style={{
                        backgroundColor:
                          imageIndex === index ? 'white' : 'gray',
                        width: 20,
                        height: 4,
                        borderRadius: 100,
                        margin: 4,
                      }}
                    />
                  </View>
                ))}
              </View>
            );
          }}
          visible={showPhotoModal}
          onRequestClose={() => {
            setShowPhotoModal(false);
            setActiveImageIdx(0);
          }}
        />
      </View>
    </>
  );
};

export default TaskDoneDetails;
