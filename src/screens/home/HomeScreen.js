/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {View, FlatList} from 'react-native';

import {axiosInstance} from '../../apiHooks/axiosInstance';
import {
  setContractorsData,
  setOrgAssetsData,
  setUsers,
  setVendorsData,
} from '../../cc-hooks/src/appSlice';
import {setProjects} from '../../cc-hooks/src/projectSlice';
import {useServiceProviderContext} from '../../cc-hooks/src/searchHook';
import Fuse from 'fuse.js';
import CreateProjectModal from '../Modals/CreateProjectModal';
import DashBoard from '../DashBoard/DashBoard';
import {createHookData} from '../../cc-utils/src';
import {parseProjects} from '../../cc-utils/src/home';
import ProjectComponent from './ProjectComponent';
import PaymentModal from '../Modals/PaymentModal';

const userOptions = {
  keys: ['fname', 'lname', 'phone'],
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const {dispatch: searchDispatch} = useServiceProviderContext();
  const authUser = useSelector(state => state.auth.user);
  const userOrg = useSelector(state => state.auth.org);
  const projects = useSelector(state => state.project.projects);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (authUser.phone) {
      axiosInstance(token)
        .get(
          `/getProjectsOfUser?org_id=${userOrg.org_id}&user_id=${authUser.user_id}`,
        )
        .then(response => {
          const projects = parseProjects(response.data.data);
          dispatch(setProjects(projects));
          // dispatch(setProjects(response.data.data));
        })
        .catch(error => {
          console.error('getProjectsOfUser:', JSON.stringify(error));
        });
    }
  }, [authUser, userOrg]);

  useEffect(() => {
    if (userOrg && userOrg.org_id) {
      // eslint-disable-next-line no-undef
      Promise.all([
        axiosInstance(token).get(`/getAssetsByOrgId?org_id=${userOrg.org_id}`),
        axiosInstance(token).get(`/getVendorsByOrgId?org_id=${userOrg.org_id}`),
        axiosInstance(token).get(
          `/getContractorsByOrgId?org_id=${userOrg.org_id}`,
        ),
        axiosInstance(token).get(
          `/getUsersOfOrganization?org_id=${userOrg.org_id}`,
        ),
      ])
        .then(([response1, response2, response3, response4]) => {
          dispatch(
            setOrgAssetsData({
              data: createHookData('asset_id', response1.data.data),
            }),
          );
          dispatch(setVendorsData(response2.data.data));
          dispatch(setContractorsData(response3.data.data));
          dispatch(setUsers(response4.data.data));
          searchDispatch({
            keys: ['search'],
            values: [new Fuse(response3.data.data, userOptions)],
          });
        })
        .catch(error => {
          console.error('Error HomeScreen:', error?.response?.data?.message);
        });
    }
  }, [userOrg]);

  return (
    <View style={{flex: 1}}>
      <View style={{height: 40}} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[1]}
        renderItem={() => {
          return (
            <>
              <ProjectComponent
                projects={projects}
                setShowCreateProjectModal={setShowCreateProjectModal}
                setShowPaymentModal={setShowPaymentModal}
                navigation={navigation}
                authUser={authUser}
                userOrg={userOrg}
              />
              <DashBoard />
            </>
          );
        }}
      />

      {showCreateProjectModal && (
        <CreateProjectModal
          showModal={showCreateProjectModal}
          setShowModal={setShowCreateProjectModal}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          showModal={showPaymentModal}
          setShowModal={setShowPaymentModal}
        />
      )}
    </View>
  );
};

export default HomeScreen;
