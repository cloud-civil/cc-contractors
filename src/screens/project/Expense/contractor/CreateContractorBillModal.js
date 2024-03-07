import {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import CustomModal from '../../../../components/CustomModal';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import styles from '../../../../styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../../styles/Colors';
import {CustomButton} from '../../../../components/CustomButton';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';
import Input from '../../../../components/Input';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  getGroupTasks,
  groupTaskCategoriesForApp,
} from '../../../../cc-utils/src/tasks';

const initData = {
  selectedIdx: 0,
  task_id: '',
  unit: 0,
  amount: 0,
  gst: 0,
  discount: 0,
  remarks: '',
  contractor_rate_id: '',
};

const FormComponent = ({
  activeContractor,
  project_id,
  setShowAddBillModal,
  setRender,
  contractorBills,
  rates,
}) => {
  const token = useSelector(state => state.auth.token);
  const [state, setState] = useState({
    activeGroupId: 'main',
    activeTaskId: null,
    links: [],
    selectedTask: null,
    billedTask: null,
    previewBill: false,
    billData: {
      netAmount: 0,
      totalAmount: 0,
      gst: 0,
    },
  });

  const [formData, setFormData] = useState(initData);

  const [hookState, setHooksState] = useState({
    groupTasks: [],
    taskCategoriesAsGroup: null,
    taskCategoriesAsObject: null,
  });

  useEffect(() => {
    if (activeContractor && activeContractor.contractor_id) {
      axiosInstance(token)
        .get(`/${project_id}/getTaskCategories`)
        .then(({data}) => {
          const {task_categories, tasks} = data.data;
          const groupTasks = getGroupTasks(tasks);
          const {taskCategoriesAsGroup, taskCategoriesAsObject} =
            groupTaskCategoriesForApp(task_categories);
          setHooksState({
            ...hookState,
            groupTasks,
            taskCategoriesAsGroup,
            taskCategoriesAsObject,
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [activeContractor]);

  const {taskCategoriesAsGroup, groupTasks, taskCategoriesAsObject} = hookState;

  const ratesAsObject = {};
  rates.forEach(r => {
    ratesAsObject[r.contractor_rate_id] = r;
  });
  const billedTask = {};

  contractorBills.forEach(b => {
    if (!billedTask[b.task_id]) {
      billedTask[b.task_id] = b.unit;
    } else {
      billedTask[b.task_id] += b.unit;
    }
  });

  const addContractorBill = () => {
    const submitAmount = calculateAmount().totalAmount;
    const submitData = {
      task_id: state.activeTaskId,
      unit: parseFloat(formData.unit),
      amount: submitAmount,
      project_id,
      contractor_id: activeContractor.contractor_id,
      contractor_rate_id: formData.contractor_rate_id,
      gst: formData.gst,
      discount: formData.discount,
      remarks: formData.remarks,
    };
    console.log(submitData);
    axiosInstance(token)
      .post('/expense/contractor/addContractorBill', submitData)
      .then(() => {
        setShowAddBillModal(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Bill created for vendor succesfully.',
        });
        setRender(prev => prev + 1);
        setFormData(initData);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to create bill',
        });
        console.log(
          err,
          '/expense/contractor/addContractorBill',
          err?.response?.data?.message,
        );
      });
  };

  const calculateAmount = () => {
    if (!ratesAsObject[formData.contractor_rate_id]) {
      return {
        netAmount: 0,
        totalAmount: 0,
      };
    }
    let netAmount =
      ratesAsObject[formData.contractor_rate_id].amount * formData.unit;
    let gst = 0;
    let totalAmount = 0;
    if (formData.gst) {
      gst = (formData.gst / 100) * netAmount;
    }
    totalAmount = netAmount + gst;
    return {
      netAmount,
      totalAmount,
    };
  };

  const goBack = ({links, setState, state}) => {
    const __links = links;
    if (__links.length === 0) {
      return;
    } else if (__links.length === 1) {
      setState({
        ...state,
        links: [],
        activeGroupId: 'main',
      });
    } else {
      const activeGroupId = __links[__links.length - 2];
      __links.pop();
      setState({
        ...state,
        links: __links,
        activeGroupId,
      });
    }
  };

  const previewBill = () => {
    if (state.previewBill) {
      setState({
        ...state,
        previewBill: false,
        billData: {
          netAmount: 0,
          totalAmount: 0,
        },
      });
    } else {
      setState({
        ...state,
        previewBill: true,
        billData: calculateAmount(),
      });
    }
  };

  return (
    <View style={{minHeight: 400}}>
      {state.previewBill ? (
        <View style={{marginTop: 10}}>
          <Text>Net Amount: {state.billData.netAmount} INR</Text>
          <Text>GST: {formData.gst}%</Text>
          <Text>Total Amount: {state.billData.totalAmount} INR</Text>
        </View>
      ) : (
        <View>
          <View
            style={{
              marginVertical: 10,
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{marginRight: 4}}
                  onPress={() => {
                    goBack({links: state.links, setState, state});
                  }}>
                  <MaterialIcons name="arrow-back-ios" size={22} />
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {state.links.map(link => {
                    return (
                      <Text key={link} style={{fontSize: 14, color: 'grey'}}>
                        {taskCategoriesAsObject[link].name} /{' '}
                      </Text>
                    );
                  })}
                </View>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={{color: '#8d8d8d', fontSize: 15, fontWeight: 500}}>
                  Select Task Category
                </Text>
                {taskCategoriesAsGroup &&
                  taskCategoriesAsGroup[state.activeGroupId] &&
                  taskCategoriesAsGroup[state.activeGroupId].map(tc => {
                    return (
                      <TouchableOpacity
                        key={tc.group_id}
                        onPress={() => {
                          setState({
                            ...state,
                            activeGroupId: tc.group_id,
                            links: [...state.links, tc.group_id],
                          });
                        }}
                        style={{marginVertical: 5}}>
                        <Text>{tc.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                <View style={{marginTop: 10}}>
                  <Text
                    style={{color: '#8d8d8d', fontSize: 15, fontWeight: 500}}>
                    Select Task
                  </Text>
                  {groupTasks &&
                    groupTasks[state.activeGroupId] &&
                    groupTasks[state.activeGroupId].map(tc => {
                      let billableValue = 0;
                      if (billedTask[tc.task_id]) {
                        if (tc.completed - billedTask[tc.task_id] > 0) {
                          billableValue = tc.target - billedTask[tc.task_id];
                        }
                      } else {
                        billableValue = tc.target;
                      }
                      return (
                        <TouchableOpacity
                          key={tc.task_id}
                          style={{
                            marginVertical: 5,
                          }}
                          onPress={() => {
                            setState({
                              ...state,
                              activeTaskId: tc.task_id,
                              selectedTask: tc,
                              billedTask: billedTask[tc.task_id] || null,
                            });
                            setFormData({
                              ...formData,
                              unit: billableValue,
                              contractor_rate_id: '',
                            });
                          }}>
                          <Text
                            style={{
                              color:
                                tc.task_id === state.activeTaskId
                                  ? 'red'
                                  : 'black',
                            }}>
                            {tc.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </View>
            </View>
            {state.selectedTask ? (
              <View
                style={{
                  marginVertical: 10,
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  paddingBottom: 10,
                }}>
                <Text>Task: {state.selectedTask.name}</Text>
                <Text>
                  Target: {state.selectedTask.target} {state.selectedTask.unit}
                </Text>
                <Text>
                  Billed: {state.billedTask || 0} {state.selectedTask.unit}
                </Text>
              </View>
            ) : null}
          </View>

          <View>
            <Input
              label="Remaining billable unit (50 Nos) for task Electricity"
              value={formData.unit.toString()}
              onChangeText={value => {
                setFormData({
                  ...formData,
                  unit: value,
                });
              }}
              keyboardType="numeric"
            />

            <SelectDropdown
              buttonStyle={styles.dropdownButtonStyle}
              // rowTextStyle={{textAlign: 'left'}}
              buttonTextStyle={styles.dropdownButtonText}
              defaultButtonText="Rate type"
              renderDropdownIcon={() => (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={'#666'}
                  style={{margin: -6}}
                />
              )}
              renderSearchInputLeftIcon={() => (
                <MaterialIcons name="search" size={20} />
              )}
              dropdownStyle={{
                borderRadius: 8,
              }}
              data={rates}
              on
              onSelect={selectedItem => {
                let can = false;
                rates.forEach(r => {
                  if (
                    parseInt(selectedItem.contractor_rate_id) ===
                      r.contractor_rate_id &&
                    r.unit === state?.selectedTask?.unit
                  ) {
                    can = true;
                  }
                });
                if (can) {
                  setFormData({
                    ...formData,
                    contractor_rate_id: selectedItem.contractor_rate_id,
                  });
                } else {
                  // Toast.show({
                  //   type: 'error',
                  //   text1: 'Failed',
                  //   text2:
                  //     'Cannot select item because the work units are different',
                  // });
                  Alert.alert(
                    'Failed',
                    'Cannot select item because the work units are different',
                  );
                }
              }}
              buttonTextAfterSelection={() => {
                return (
                  <Text style={{textTransform: 'capitalize'}}>
                    {ratesAsObject?.[formData?.contractor_rate_id]?.name ||
                      'Rate type'}
                  </Text>
                );
              }}
              rowTextForSelection={item => {
                return (
                  <Text style={{textTransform: 'capitalize'}}>{item.name}</Text>
                );
              }}
            />

            {formData.contractor_rate_id ? (
              <View style={{marginBottom: 10, marginTop: 4}}>
                <Text>
                  <Text style={{fontWeight: '500'}}>
                    {formData.contractor_rate_id
                      ? ratesAsObject[formData.contractor_rate_id].amount
                      : null}{' '}
                    INR
                  </Text>{' '}
                  per{' '}
                  {formData.contractor_rate_id
                    ? ratesAsObject[formData.contractor_rate_id]?.unit
                    : null}{' '}
                </Text>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '49%'}}>
                <Input
                  label="GST (Optional)%"
                  value={formData.gst.toString()}
                  onChangeText={value => {
                    setFormData({
                      ...formData,
                      gst: parseInt(value || 0, 10),
                    });
                  }}
                  keyboardType="numeric"
                />
              </View>

              <View style={{width: '49%'}}>
                <Input
                  label="Discount (INR)"
                  value={formData.discount.toString()}
                  onChangeText={value => {
                    setFormData({
                      ...formData,
                      discount: parseInt(value || 0, 10),
                    });
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Input
              label="Remarks"
              value={formData.remarks}
              onChangeText={value => {
                setFormData({
                  ...formData,
                  remarks: value,
                });
              }}
            />
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
        }}>
        <View style={{width: '40%'}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: '#f2f2f2',
              borderRadius: 8,
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
            onClick={previewBill}>
            <Text style={{color: '#2d2d2d', fontSize: 16}}>
              {state.previewBill ? 'Cancel' : 'Preview Bill'}
            </Text>
          </CustomButton>
        </View>
        <View style={{width: '58%'}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              borderRadius: 8,
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
            }}
            onClick={addContractorBill}>
            <Text style={{color: 'white', fontSize: 16}}>
              Add Contractor Bill
            </Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const CreateContractorBillModal = props => {
  const {setShowAddBillModal, showAddBillModal} = props;
  return (
    <CustomModal
      visible={showAddBillModal}
      closeModal={() => {
        setShowAddBillModal(false);
      }}
      title="Add Contractor Bill">
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default CreateContractorBillModal;
