/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../../../styles/styles';
import {shallowEqual, useSelector} from 'react-redux';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {formateAmount, getPermissions} from '../../../../utils';
import FloatingButton from '../../../../components/FloatingButton';
import RequestStockModal from './RequestStockModal';
import {CreatePOModal} from '../purchase-orders/CreatePOModal';
import ApproveRequestModal from './ApproveRequestModal';

const RequestStock = props => {
  const {project_id, vendors, user_roles, project_permissions} = props;
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1027);
  const permission = x && JSON.parse(x.permission);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocks__[project_id] && stocks__[project_id].asObject) || [];
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);
  const [activeStockRequest, setActiveStockRequest] = useState(null);
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const [reRender, setRender] = useState(0);
  const [activity, setActivity] = useState({
    requestedStocks: [],
    loading: true,
    activeRequest: null,
    showApproveModal: false,
    showRequestStockModal: false,
  });

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAllRequestedStocksForProject?project_id=${project_id}`)
      .then(({data}) => {
        setActivity(prev => ({
          ...prev,
          requestedStocks: data.data,
          loading: false,
        }));
      })
      .catch(err => {
        console.error('getAllRequestedStocksForProject', err);
      });
  }, [reRender]);

  return (
    <View style={styles.container}>
      {permission && permission.read ? (
        <>
          {activity.requestedStocks.length ? (
            <FlatList
              data={activity.requestedStocks}
              renderItem={({item: stock}) => {
                if (stock.status === 'po_created') return null;
                const ver = JSON.parse(stock.verification);
                return (
                  <View key={stock.stock_id} style={styles.card}>
                    <View style={styles.assIcon}>
                      <Feather name="activity" size={24} color="white" />
                    </View>
                    <View
                      style={{
                        marginLeft: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                      }}>
                      <View>
                        <Text style={{fontSize: 16, fontWeight: '600'}}>
                          {stocksObject[stock.stock_id].name}
                        </Text>
                        <Text style={{fontSize: 13}}>
                          Requested: {formateAmount(stock.quantity)}{' '}
                          {stocksObject[stock.stock_id].unit}
                        </Text>
                      </View>
                      {permission.verify && !ver.verified ? (
                        <View>
                          <CustomButton
                            buttonStyle={{
                              backgroundColor: Colors.primary,
                              borderRadius: 4,
                              marginBottom: 4,
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingVertical: 5,
                              paddingHorizontal: 8,
                            }}
                            onClick={() => {
                              setActivity(prev => ({
                                ...prev,
                                activeRequest: stock,
                                showApproveModal: true,
                              }));
                            }}>
                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: 'center',
                                color: 'white',
                                marginRight: 3,
                              }}>
                              Approve
                            </Text>
                            <MaterialCommunityIcons
                              name="check-circle-outline"
                              size={15}
                              color={'white'}
                            />
                          </CustomButton>
                        </View>
                      ) : null}
                      {ver.verified ? (
                        <View
                          style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'green',
                              marginBottom: 6,
                            }}>
                            <MaterialCommunityIcons name="check-decagram" />{' '}
                            Approved
                          </Text>
                          <CustomButton
                            buttonStyle={{
                              backgroundColor: Colors.primary,
                              borderRadius: 4,
                              marginBottom: 4,
                              paddingVertical: 5,
                              paddingHorizontal: 8,
                            }}
                            onClick={() => {
                              setActiveStockRequest(stock);
                              setShowCreatePOModal(true);
                            }}>
                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: 'center',
                                color: 'white',
                              }}>
                              Create P.O
                            </Text>
                          </CustomButton>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={styles.emptyTabView}>
              {activity.loading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text>No requested stock found.</Text>
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyTabView}>
          <Text>No permission to view requested stocks.</Text>
        </View>
      )}
      <CreatePOModal
        project_id={project_id}
        vendors={vendors}
        project_permissions={project_permissions}
        user_roles={user_roles}
        showModal={showCreatePOModal}
        setShowModal={setShowCreatePOModal}
        activeStockRequest={activeStockRequest}
        setActiveStockRequest={setActiveStockRequest}
      />
      {activity.showRequestStockModal && (
        <RequestStockModal
          activity={activity}
          setActivity={setActivity}
          project_id={project_id}
          reRender={reRender}
          setRender={setRender}
        />
      )}
      {activity.activeRequest && activity.showApproveModal && (
        <ApproveRequestModal
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
          authUser={authUser}
          requestedStocks={activity.requestedStocks}
        />
      )}
      {permission && permission.write && (
        <FloatingButton
          onClick={() =>
            setActivity(prev => ({...prev, showRequestStockModal: true}))
          }
          buttonStyle={{margin: 8}}>
          <Feather
            name="git-pull-request"
            color={'white'}
            size={28}
            style={{marginTop: -4}}
          />
        </FloatingButton>
      )}
    </View>
  );
};

export default RequestStock;
