import {Text, View, Dimensions} from 'react-native';
import SizeButton from '../../components/SizeButton';
import styles from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomButton} from '../../components/CustomButton';
import Colors from '../../styles/Colors';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';

const InProgressIssue = props => {
  const {issuesData, setActiveIssue, setShowUpdateIssueModal} = props;
  const users = useSelector(state => state.app.users.asObject);

  return (
    <View style={{marginTop: 10}}>
      {issuesData.updatedIssues && issuesData.updatedIssues.length ? (
        <FlatList
          data={issuesData.updatedIssues}
          showsVerticalScrollIndicator={false}
          contentbuttonStyle={{
            paddingBottom: 10,
          }}
          renderItem={({item}) => {
            return (
              <SizeButton
                key={item.issue_id}
                // onClick={() =>
                //   navigation.navigate('IssueComment', {
                //     activeIssue: item,
                //     project_id,
                //   })
                // }
              >
                <View
                  style={[
                    styles.cardBorder,
                    {
                      width: Dimensions.get('window').width - 36,
                      borderBottomWidth: 1,
                    },
                  ]}>
                  <View
                    style={[
                      styles.assIcon,
                      item.priority === 'high'
                        ? {backgroundColor: '#FE390F'}
                        : item.priority === 'medium'
                        ? {backgroundColor: '#FEAB0F'}
                        : null,
                    ]}>
                    <MaterialCommunityIcons
                      name="alert-circle-outline"
                      size={26}
                      color={'white'}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{width: '80%'}}>
                      <Text style={{marginBottom: 2, fontWeight: 600}}>
                        {item.issue_name}
                      </Text>
                      <Text numberOfLines={1} style={{fontSize: 13}}>
                        {item.description}
                      </Text>
                      <Text style={{fontSize: 13}}>
                        Assigned to:{' '}
                        <Text style={{fontWeight: 500}}>
                          {users[item.assigned_to].fname}{' '}
                          {users[item.assigned_to].lname}
                        </Text>
                      </Text>
                    </View>
                    <CustomButton
                      onClick={() => {
                        setActiveIssue(item);
                        setShowUpdateIssueModal(true);
                      }}
                      buttonStyle={{
                        padding: 6,
                        backgroundColor: '#f2f2f2',
                        borderRadius: 8,
                        marginRight: 10,
                      }}>
                      <MaterialCommunityIcons
                        name="update"
                        size={24}
                        color={Colors.primary}
                      />
                    </CustomButton>
                  </View>
                </View>
              </SizeButton>
            );
          }}
        />
      ) : (
        <View style={{marginTop: 100}}>
          <Text style={{textAlign: 'center'}}>No issues in progress.</Text>
        </View>
      )}
    </View>
  );
};

export default InProgressIssue;
