import {useState} from 'react';
import {
  View,
  Text,
  // TouchableOpacity
  FlatList,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import styles from '../../../../styles/styles';
import Colors from '../../../../styles/Colors';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {CustomButton} from '../../../../components/CustomButton';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {deleteImage, resetImages} from '../../../../cc-hooks/src/imageSlice';
import Toast from 'react-native-toast-message';
import {useEffect} from 'react';
import {useStocks} from '../hooks';
import {getTaskCategoryStocks} from '../utils';
import CustomModal from '../../../../components/CustomModal';
import Input from '../../../../components/Input';
import {takePicture} from '../../../../utils/camera';
import {ImageLoadingSkeleton} from '../../../../components/Skeleton';
import {IMAGE_URL} from '@env';

const initData = {
  quantity: 0,
  contractor_id: null,
  images: [],
  amount: 0,
};

const filterReceivedStocks = activeTaskStocks => {
  let received = {};
  activeTaskStocks.forEach(st => {
    if (st.status === 101) {
      if (!received[st.stock_id]) {
        received[st.stock_id] = st;
      } else if (received[st.stock_id]) {
        received[st.stock_id].quantity =
          received[st.stock_id].quantity + st.quantity;
      }
    }
  });
  const y = JSON.parse(JSON.stringify(received));
  let f = [];
  Object.values(y).forEach(x => {
    f.push(x);
  });
  return f;
};

const FormComponent = props => {
  const {
    project_id,
    activeTask,
    setShowModal,
    activeGroupId: x,
    activeTaskCompleted,
    reRender,
    setRender,
  } = props;
  const dispatch = useDispatch();
  const activeGroupId = x === 'main' ? activeTask.parent_id : x;
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const stocks = (stocks__ && stocks__.asObject) || [];
  const taskStocks = useSelector(
    state => state.task.taskStocks[project_id],
    shallowEqual,
  );
  const activeTaskStocks = (taskStocks && taskStocks[activeGroupId]) || [];
  const [__completed, setTaskDone] = useState(0);
  const contractors = useSelector(
    state => state.app.contractors.asArray,
    shallowEqual,
  );
  const [state, setState] = useState(initData);
  const [groupData, setGroupData] = useState({});
  const [stocksGroupData, setStocksGroupData] = useState({});

  const allTaskStocks = getTaskCategoryStocks(taskStocks);
  const stocksInfo = useStocks(allTaskStocks, activeGroupId);
  const {allStocks} = stocksInfo;

  const receivedStocks = filterReceivedStocks(
    JSON.parse(JSON.stringify(activeTaskStocks)),
  );

  const userOrg = useSelector(state => state.auth.org);
  const uploadedUrls = useSelector(state => state.image.uploadedUrls);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    if (activeTaskCompleted) {
      const u = activeTaskCompleted;
      const metadata = u.metadata && JSON.parse(u.metadata).stocks;
      setTaskDone(u.completed);
      setState({
        quantity: u,
        contractor_id: u.contractor_id,
        images: [],
        amount: u.amount,
      });
      let sgd = {};
      metadata &&
        metadata.forEach(x => {
          sgd[x.stock_id] = x;
        });
      setStocksGroupData(sgd);
    }
  }, []);

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  const updateTaskDone = () => {
    const completed = parseInt(__completed, 10);
    if (completed + __completed > activeTask.target) {
      Toast.show({
        type: 'error',
        text1: 'Invalid',
        text2: 'Trying to assign more value than target',
      });
      return;
    }

    const allUsedStocks = [];
    Object.values(stocksGroupData).forEach(y => {
      allUsedStocks.push(y);
    });
    const u = activeTaskCompleted;
    const metadata = u.metadata && JSON.parse(u.metadata).stocks;
    let sgd = {};
    metadata &&
      metadata.forEach(x => {
        sgd[x.stock_id] = x;
      });
    const deleteStocks = [];
    Object.values(sgd).forEach(value => {
      if (!stocksGroupData[value.stock_id]) {
        deleteStocks.push(value);
      }
    });

    const submitData = {
      task_done_id: activeTaskCompleted.task_done_id,
      project_id,
      task_id: activeTask.task_id,
      group_id: activeGroupId,
      user_id: authUser.user_id,
      completed: parseFloat(completed),
      stocks: allUsedStocks,
      deleteStocks,
      contractor_id: state.contractor_id,
      images: JSON.stringify(uploadedUrls),
      files: [],
    };

    axiosInstance(token)
      .post('/updateTaskCompleted', submitData)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Task done updated succesfully.',
        });
        setRender(reRender + 1);
        resetFields();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to update task done',
        });
        console.error(error.message, JSON.stringify(error));
        // resetFields();
      });
  };

  const makeData = () => {
    return {
      ...state,
      quantity: parseInt(state.quantity),
    };
  };

  const addToCart = () => {
    const d = makeData();
    if (!d) {
      return false;
    }

    setGroupData({
      ...groupData,
      [state.stock_id]: d,
    });
    setState(initData);
  };

  const chooseActiveStock = stock_id => {
    if (groupData[stock_id]) {
      setState(groupData[stock_id]);
    } else {
      setState({
        ...state,
        stock_id,
        quantity: 0,
      });
    }
  };

  const resetFields = () => {
    setShowModal(false);
    setTaskDone(0);
    dispatch(resetImages());
  };

  return (
    <View style={{marginTop: 6}}>
      {activeTask && (
        <Text style={{marginBottom: 10, fontWeight: 500}}>
          Target: {activeTask.target} {activeTask.unit}
        </Text>
      )}
      <Input
        value={__completed.toString()}
        disabled
        label={
          activeTask ? `Completed Task (${activeTask.unit})` : 'Completed Task'
        }
        keyboardType="numeric"
        onChangeText={setTaskDone}
      />

      <SelectDropdown
        buttonStyle={styles.dropdownButtonStyle}
        defaultButtonText="Select Contractor"
        buttonTextStyle={styles.dropdownButtonText}
        renderDropdownIcon={() => (
          <MaterialIcons name="keyboard-arrow-down" size={24} color={'#666'} />
        )}
        renderSearchInputLeftIcon={() => (
          <MaterialIcons name="search" size={20} />
        )}
        dropdownStyle={{
          borderRadius: 8,
        }}
        data={contractors}
        onSelect={selectedItem => {
          setState({
            ...state,
            contractor_id: selectedItem.contractor_id,
          });
        }}
        buttonTextAfterSelection={selectedItem => {
          return selectedItem.name;
        }}
        rowTextForSelection={item => {
          return item.name;
        }}
      />

      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        {Object.values(groupData).map(x => {
          return (
            <View
              key={x.stock_id}
              style={{
                padding: 5,
                borderRadius: 6,
                marginBottom: 6,
                marginRight: 8,
                alignItems: 'center',
                backgroundColor: Colors.primary,
                flexDirection: 'row',
              }}
              className="hover">
              <Text style={{color: 'white'}}>
                {stocks[x.stock_id] && stocks[x.stock_id].name}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const z = Object.values(groupData).filter(
                    f => f.stock_id !== x.stock_id,
                  );
                  setGroupData(z);
                  setState(initData);
                }}>
                <Ionicons name="close" color="white" size={16} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {Object.keys(allStocks).length !== 0 ? (
        <SelectDropdown
          buttonStyle={styles.dropdownButtonStyle}
          defaultButtonText="Select Material"
          buttonTextStyle={styles.dropdownButtonText}
          renderDropdownIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={'#666'}
            />
          )}
          renderSearchInputLeftIcon={() => (
            <MaterialIcons name="search" size={20} />
          )}
          dropdownStyle={{
            borderRadius: 8,
          }}
          data={Object.values(allStocks)}
          onSelect={selectedItem => {
            chooseActiveStock(parseInt(selectedItem.stock_id, 10));
          }}
          buttonTextAfterSelection={selectedItem => {
            return stocks[selectedItem.stock_id].name;
          }}
          rowTextForSelection={item => {
            return stocks[item.stock_id].name;
          }}
        />
      ) : (
        <Text style={{marginBottom: 14, color: '#444'}}>
          No Material Issued for Task
        </Text>
      )}

      {!state.stock_id ? null : (
        <Input
          value={state.quantity.toString()}
          label={`${stocks[state.stock_id].name} used`}
          keyboardType="numeric"
          onChangeText={e => {
            setState({
              stock_id: state.stock_id,
              quantity: e,
            });
          }}
        />
      )}

      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 10}}
        keyExtractor={item => item.id}
        data={
          imageUploadLoading
            ? [...uploadedUrls, {skeleton: true, id: 10000}]
            : uploadedUrls
        }
        horizontal={true}
        renderItem={({item}) => {
          if (item.skeleton) {
            return <ImageLoadingSkeleton key={item.id} />;
          } else {
            return (
              <View
                style={{marginRight: 10, position: 'relative'}}
                key={item.id}>
                <Image
                  source={{
                    uri: `${IMAGE_URL}/previewUploadedImage/thumbnail-${item.fullName}`,
                    headers: {
                      Authorization: token,
                    },
                  }}
                  style={{width: 60, height: 80, borderRadius: 8}}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 18,
                    height: 18,
                  }}>
                  <TouchableOpacity
                    onPress={() => dispatch(deleteImage({id: item.id}))}>
                    <MaterialIcons
                      name="delete-outline"
                      size={18}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
        }}
      />

      <View style={{flexDirection: 'row'}}>
        {receivedStocks.length !== 0 && (
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              borderRadius: 8,
              height: 45,
              width: 45,
              marginRight: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={addToCart}>
            <MaterialIcons name="add-shopping-cart" size={26} color={'white'} />
          </CustomButton>
        )}
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            height: 45,
            width: 45,
            borderRadius: 10,
            marginRight: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleTakePicture}>
          <MaterialIcons name="camera-alt" size={22} color={'white'} />
        </CustomButton>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={updateTaskDone}>
          <Text style={{color: 'white', fontSize: 16}}>Update Task</Text>
        </CustomButton>
      </View>
    </View>
  );
};
export const EditTaskDoneModal = props => {
  const {activeTask, showModal, setShowModal} = props;
  const navigation = useNavigation();
  return (
    <CustomModal
      visible={showModal}
      title={`Update Completed Task ${activeTask && activeTask.name}`}
      closeModal={() => {
        setShowModal(false);
      }}>
      <FormComponent {...props} navigation={navigation} />
    </CustomModal>
  );
};
