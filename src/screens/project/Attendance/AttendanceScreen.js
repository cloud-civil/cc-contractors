import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import styles from '../../../styles/styles';
import {GoBack} from '../../../components/HeaderButtons';
import {useEffect, useMemo, useRef, useState} from 'react';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import {formatDate, months} from '../../../utils';
import Colors from '../../../styles/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AttendanceModal from './AttendanceModal';
import FloatingButton from '../../../components/FloatingButton';
import DateTimePicker from 'react-native-ui-datepicker';
import {useNavigation} from '@react-navigation/native';
import {weeks} from '../../../cc-utils/src';
import {TouchableOpacity} from 'react-native-gesture-handler';

function monthsDiff(date) {
  const pickedDate = new Date(date);
  const selectedYear = pickedDate.getFullYear();
  const monthDiff = pickedDate.getMonth() + 1;
  return {monthDiff, selectedYear};
}

function areDatesEqual(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function areMonthsEqual(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

const currentDate = new Date();

const AttendanceScreen = ({route}) => {
  const {contractor, project_id} = route.params;
  const token = useSelector(state => state.auth.token);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const flatListRef = useRef(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [todaysAttendance, setTodaysAttendance] = useState(null);
  const [todayDateLoading, setTodayDateLoading] = useState(true);
  const [attendanceObject, setAttendanceObject] = useState({});
  const [reRender, setRender] = useState(0);
  const [activity, setActivity] = useState({
    date: new Date(),
    selectedMonth: currentDate.getMonth() + 1,
    selectedYear: currentDate.getFullYear(),
  });
  const [totalDays, setTotalDays] = useState(currentDate.getDate());

  const currentMonthDates = useMemo(() => {
    return [...Array(totalDays).keys()].map(num => num + 1);
  }, [totalDays]);

  useEffect(() => {
    getAllAttendanceOfAMonth(activity.selectedMonth, activity.selectedYear);
  }, [activity.selectedMonth, activity.selectedYear, reRender]);

  const getAllAttendanceOfAMonth = (selectedMonth, selectedYear) => {
    if (contractor && contractor.contractor_id) {
      axiosInstance(token)
        .get(
          `/getAllAttendanceOfAMonth?project_id=${project_id}&contractor_id=${contractor.contractor_id}&year=${selectedYear}&month=${selectedMonth}`,
        )
        .then(({data}) => {
          console.log(data.data);
          const newObj = {};
          data.data.forEach(item => {
            newObj[new Date(item.attendance_date).toDateString()] = item;
          });
          setAttendanceObject(newObj);
        })
        .catch(err => {
          console.log(err, err?.response?.data?.message);
        });
    }
  };

  const getAttendanceofDate = () => {
    // setTodayDateLoading(true);
    axiosInstance(token)
      .get(
        `/${project_id}/${
          contractor.contractor_id
        }/${activity.date.getTime()}/getTodaysAttendance`,
      )
      .then(({data}) => {
        if (data.data.length > 0) {
          setTodaysAttendance(data.data[0]);
        } else {
          setTodaysAttendance(null);
        }
        setTodayDateLoading(false);
      })
      .catch(err => {
        console.log(err, '/getTodaysAttendance', err?.response?.data?.message);
        setTodayDateLoading(false);
      });
  };

  useEffect(() => {
    getAttendanceofDate();
    const nextMonth = new Date(
      activity.date.getFullYear(),
      activity.date.getMonth() + 1,
      0,
    );
    if (!areMonthsEqual(activity.date, currentDate)) {
      setTotalDays(nextMonth.getDate());
    } else {
      setTotalDays(currentDate.getDate());
    }
  }, [activity.date]);

  const onDatePick = date => {
    setTodayDateLoading(true);
    if (areMonthsEqual(new Date(date), activity.date)) {
      setActivity({...activity, date: new Date(date)});
    } else {
      const diff = monthsDiff(date);
      setActivity({
        ...activity,
        date: new Date(date),
        selectedMonth: diff.monthDiff,
        selectedYear: diff.selectedYear,
      });
    }
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: new Date(date).getDate() - 1,
          viewPosition: 0.5,
        });
      }
    }, 300);
  };

  const todaysAttendanceMetadata = todaysAttendance
    ? JSON.parse(todaysAttendance.metadata)
    : null;

  return (
    <View style={styles.container}>
      <View style={{marginTop: 34}} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -10,
          }}>
          <GoBack onClick={() => navigation.goBack()} />
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: '#3e3e3e',
              }}>
              {contractor.name} Attendance
            </Text>
          </View>
        </View>
        <View style={{marginLeft: 'auto', marginRight: 10}}>
          <TouchableOpacity
            onPress={() => {
              setDatePickerVisible(!isDatePickerVisible);
            }}>
            <MaterialCommunityIcons
              name="calendar-month"
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{}}>
        <View style={{marginBottom: 10}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDatePickerVisible(!isDatePickerVisible)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ddd',
              padding: 3,
              borderRadius: 6,
              marginBottom: 20,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#f2f2f2',
                marginHorizontal: 3,
                padding: 4,
                borderRadius: 6,
              }}>
              <Text style={{textAlign: 'center', fontWeight: 500}}>
                {months[activity.date.getMonth()]}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#f2f2f2',
                marginHorizontal: 3,
                padding: 4,
                borderRadius: 6,
              }}>
              <Text style={{textAlign: 'center', fontWeight: 500}}>
                {activity.date.getFullYear()}
              </Text>
            </View>
          </TouchableOpacity>
          <FlatList
            ref={flatListRef}
            onContentSizeChange={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd({animated: true});
              }
            }}
            getItemLayout={(data, index) => ({
              length: 62,
              offset: 62 * index,
              index,
            })}
            data={currentMonthDates}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              const newDate = new Date(
                activity.date.getFullYear(),
                activity.date.getMonth(),
                item,
              );
              const newLocalDateString = newDate.toDateString();
              const weekName =
                weeks[
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    item,
                  ).getDay()
                ];
              return (
                <TouchableOpacity
                  onPress={() => {
                    setTodayDateLoading(true);
                    setActivity({
                      ...activity,
                      date: new Date(
                        attendanceObject[newLocalDateString]?.attendance_date ||
                          newDate,
                      ),
                    });
                  }}>
                  <View
                    style={{
                      margin: 4,
                      width: 54,
                      height: 60,
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color:
                          new Date(activity.date).getDate() === item
                            ? Colors.primary
                            : 'black',
                        fontSize: 12,
                      }}>
                      {weekName}
                    </Text>
                    <Text
                      style={{
                        color:
                          new Date(activity.date).getDate() === item
                            ? Colors.primary
                            : 'black',
                        marginVertical: 3,
                      }}>
                      {item}
                    </Text>
                    <View
                      style={{
                        width: 40,
                        marginTop: 4,
                        borderTopLeftRadius: 100,
                        borderTopRightRadius: 100,
                        borderTopWidth: 8,
                        borderTopColor:
                          new Date(activity.date).getDate() === item
                            ? Colors.primary
                            : attendanceObject[newLocalDateString]
                            ? 'green'
                            : 'red',
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {isDatePickerVisible && (
          <View>
            <DateTimePicker
              mode="date"
              maximumDate={new Date()}
              value={activity.date}
              onValueChange={date => {
                console.log('clicked');
                onDatePick(date);
                setDatePickerVisible(false);
              }}
            />
          </View>
        )}

        {!todayDateLoading ? (
          <>
            {todaysAttendance ? (
              <View
                style={{
                  marginTop: 10,
                  fontSize: 14,
                }}>
                <Text style={{marginBottom: 10, fontWeight: 600, fontSize: 16}}>
                  Attendance of {formatDate(activity.date)}
                </Text>

                <Text style={{textTransform: 'capitalize'}}>
                  Work shift:{' '}
                  <Text style={{fontWeight: 600}}>
                    {todaysAttendance.work_shift}
                  </Text>
                </Text>
                <Text style={{marginTop: 4}}>
                  Total Amount:{' '}
                  <Text style={{fontWeight: 600}}>
                    {todaysAttendanceMetadata.totalAmount} INR
                  </Text>
                </Text>
                <Text style={{marginTop: 4}}>
                  Paid:{' '}
                  <Text style={{fontWeight: 600}}>
                    {todaysAttendanceMetadata.paid} INR
                  </Text>
                </Text>

                <View>
                  <FlatList
                    data={todaysAttendanceMetadata.labourData}
                    renderItem={({item: labour, index: idx}) => {
                      return (
                        <View
                          key={idx}
                          style={{
                            borderTopWidth: 1,
                            borderTopColor: '#ccc',
                            marginTop: 8,
                            paddingTop: 4,
                          }}>
                          <Text style={{marginTop: 4}}>
                            {labour.labourType} workers:{' '}
                            <Text style={{fontWeight: 600}}>
                              {labour.quantity}
                            </Text>
                          </Text>
                          <Text style={{marginTop: 4}}>
                            Amount per {labour.labourType} worker:{' '}
                            <Text style={{fontWeight: 600}}>
                              {labour.amount} INR
                            </Text>
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
              </View>
            ) : (
              <Text style={{marginVertical: 10, lineHeight: 22}}>
                No Attendance for{' '}
                {areDatesEqual(activity.date, new Date())
                  ? 'today'
                  : formatDate(activity.date)}
                {'\n'}Click the below button to mark attendance.
              </Text>
            )}
          </>
        ) : (
          <View style={[styles.emptyTabView, {height: 200}]}>
            <ActivityIndicator size={30} color={Colors.primary} />
          </View>
        )}
      </View>
      <FloatingButton
        buttonStyle={{margin: 10}}
        onClick={() => setShowModal(true)}>
        <MaterialCommunityIcons
          name="calendar-check-outline"
          color={'white'}
          size={28}
        />
      </FloatingButton>
      <AttendanceModal
        reRender={reRender}
        setRender={setRender}
        showModal={showModal}
        setShowModal={setShowModal}
        contractor={contractor}
        project_id={project_id}
      />
    </View>
  );
};

export default AttendanceScreen;
