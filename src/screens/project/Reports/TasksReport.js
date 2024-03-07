import {View, Text, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateComponent from '../../../components/DateComponent';
import styles from '../../../styles/styles';

const Tasks = ({project_id}) => {
  const tasks_ = useSelector(state => state.task.tasks);
  const tasks__ = (tasks_ && tasks_[project_id]) || [];
  const tasks = (tasks__ && tasks__.asArray) || [];

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyTabView}>
        <Text>There is no tasks to show.</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={tasks}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <View style={styles.card}>
              <View style={styles.assIcon}>
                <MaterialCommunityIcons
                  name="transit-transfer"
                  size={28}
                  color={'white'}
                />
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={{marginBottom: 3}}>
                  <Text style={{fontWeight: 600}}>{item.name}</Text>{' '}
                </Text>
                <Text>
                  {item.completed} {item.unit}
                </Text>
              </View>
              <View style={{marginLeft: 'auto'}}>
                <DateComponent date={item.created_at} />
              </View>
            </View>
          );
        }}
      />
      {/* <ScrollView horizontal>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.text}
            widthArr={[40, 90, 80, 90, 120]}
          />
          <Rows
            data={tableData}
            textStyle={styles.text}
            widthArr={[40, 90, 80, 90, 120]}
          />
        </Table>
      </ScrollView> */}
    </View>
  );
};

// const styles = StyleSheet.create({
//   filterContainer: {marginVertical: 10},
//   filterOptions: {
//     flexDirection: 'row',
//     marginLeft: 'auto',
//     marginRight: 20,
//     alignItems: 'center',
//   },
//   tableScroll: {fontSize: 12},
//   head: {height: 40, backgroundColor: '#f1f8ff'},
//   text: {margin: 6, textAlign: 'center'},
// });

export default Tasks;
