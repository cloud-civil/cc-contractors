/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import styles from '../../../../styles/styles';
import {shallowEqual, useSelector} from 'react-redux';
import {CreateStockModal} from './CreateStockModal';
import {getPermissions} from '../../../../utils';
import {useHooks} from '../hooks';
import StockGroups from './StockGroups';
import FloatingButton from '../../../../components/FloatingButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SearchedMaterial from './SearchedMaterial';

const InStock = props => {
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1014);
  const permission = x && JSON.parse(x.permission);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const {project_id: project_idd} = props;
  const app = useSelector(state => state.app, shallowEqual);
  const stock = useSelector(state => state.stock, shallowEqual);
  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocks = (stocks__[project_idd] && stocks__[project_idd].asArray) || [];
  const project_id = parseInt(project_idd, 10);
  const [searchTerm, setSearchTerm] = useState('');
  const runHooks = useMemo(() => {
    return useHooks(project_id, app, stock);
  }, [stock, project_id, app]);

  const hooks = runHooks;

  const [reRender, setRender] = useState(0);
  const [searchedData, setSearchedData] = useState(null);

  const [activity, setActivity] = useState({
    stock_id: null,
    activeStock: null,
    activeGroupId: 'main',
    createStock: false,
    createGroup: false,
    menuVisible: false,
    editStock: false,
    issueStock: false,
    moveToGroup: false,
    stockView: 'list',
    links: [],
    searchTerm: '',
  });

  const searchStocks = () => {
    if (searchTerm === '') {
      return;
    }
    axiosInstance(token)
      .get(`/search/stocks/${project_id}/${searchTerm}`)
      .then(({data}) => {
        setSearchedData(data.data);
        setActivity({...activity, searchTerm: searchTerm});
      })
      .catch(err => {
        console.error(err, '/search/stocks', err.response.data.message);
      });
  };

  useEffect(() => {
    if (searchTerm.length === 0 && searchedData) {
      setSearchedData(null);
    }
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="Search Material..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={searchStocks}
            returnKeyType="search"
            style={{
              height: 40,
              paddingHorizontal: 15,
              flex: 1,
            }}
          />
          <TouchableOpacity onPress={searchStocks} style={{padding: 10}}>
            <MaterialIcons name="search" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      {!searchedData ? (
        <StockGroups
          {...hooks}
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
        />
      ) : (
        <SearchedMaterial
          activity={activity}
          setActivity={setActivity}
          searchedData={searchedData}
          setSearchedData={setSearchedData}
          setSearchTerm={setSearchTerm}
          permission={permission}
        />
      )}

      {permission && !permission.read && (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text>Don&apos;t have permission to view materials.</Text>
        </View>
      )}

      <View>
        {activity.createStock && (
          <CreateStockModal
            activity={activity}
            setActivity={setActivity}
            project_id={project_id}
            activeGroupId={activity.activeGroupId}
          />
        )}
      </View>

      {permission && permission.write && (
        <FloatingButton
          size={60}
          onClick={() => setActivity(prev => ({...prev, createStock: true}))}
          buttonStyle={{margin: 8}}>
          <MaterialCommunityIcons name="tray-plus" size={28} color={'white'} />
        </FloatingButton>
      )}
    </View>
  );
};

export default InStock;
