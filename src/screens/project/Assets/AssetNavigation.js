/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvailableAssets from './AvailableAssets';
import UsedAssets from './UsedAssets';
import {shallowEqual, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {GoBack} from '../../../components/HeaderButtons';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BrokenAssets from './BrokenAssets';
import Tabs from '../../../components/Tabs';

const tabs = ['Used in sites', 'Available Assets', 'Broken Assets'];

const AssetNavigation = ({route}) => {
  const {project_id} = route.params;
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [assetUsedInSite, setAssetUsedInSite] = useState([]);
  const [usedLoading, setUsedLoading] = useState(true);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [brokenAssets, setBrokenAssets] = useState([]);
  const [reRender, setRender] = useState({
    used: 0,
    available: 0,
    broken: 0,
  });

  const props = {
    project_id,
    setRender,
    reRender,
  };

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAssetsUsedInSiteByProjectId?project_id=${project_id}`)
      .then(({data}) => {
        setAssetUsedInSite(data.data);
        setUsedLoading(false);
      })
      .catch(err => {
        console.log(
          err,
          '/getAssetsUsedInSiteByProjectId',
          err?.response?.data?.message,
        );
      });
  }, [reRender.used]);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAvailableAssets?org_id=${userOrg.org_id}`)
      .then(({data}) => {
        setAvailableAssets(data.data);
      })
      .catch(err => {
        console.log(err, '/getAvailableAssets', err?.response?.data?.message);
      });
  }, [reRender.available]);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getBrokenAssets?project_id=${project_id}`)
      .then(({data}) => {
        setBrokenAssets(data.data);
      })
      .catch(err => {
        console.log(err, '/getBrokenAssets', err?.response?.data?.message);
      });
  }, [reRender.broken]);

  return (
    <>
      <View style={{paddingTop: 44, backgroundColor: 'white'}} />
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
            Assets
          </Text>
        </View>
      </View>

      <Tabs
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfTab={3}
        minusWidth={0}
        backgroundColor="white"
        icons={icons}
      />

      {activeTab === tabs[0] && (
        <UsedAssets
          {...props}
          assetUsedInSite={assetUsedInSite}
          usedLoading={usedLoading}
        />
      )}
      {activeTab === tabs[1] && (
        <AvailableAssets {...props} availableAssets={availableAssets} />
      )}
      {activeTab === tabs[2] && (
        <BrokenAssets {...props} brokenAssets={brokenAssets} />
      )}
    </>
  );
};

const icons = [
  <MaterialCommunityIcons key={0} name="progress-wrench" size={20} />,
  <MaterialIcons key={1} name="event-available" size={20} />,
  <MaterialCommunityIcons key={2} name="timeline-alert-outline" size={20} />,
];

export default AssetNavigation;
