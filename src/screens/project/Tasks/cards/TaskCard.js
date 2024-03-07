const TaskCard = () => {
  return (
    <SizeButton
      key={item.task_id}
      onClick={() => {
        navigation.navigate('TaskDoneHistory', {
          activeTask: item,
          activeGroupId,
        });
      }}>
      <View style={styles.card}>
        <View
          style={[
            styles.assIcon,
            {
              width: '14%',
              height: Dimensions.get('window').width * 0.13,
            },
          ]}>
          <MaterialCommunityIcons
            name="transit-transfer"
            color="white"
            size={30}
          />
        </View>
        <View style={{width: '82%', marginLeft: 10}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontWeight: 600,
                width: '60%',
              }}>
              {item.name}{' '}
            </Text>
            <Text style={{fontSize: 13}}>
              {getDateRange(item.start_date, item.end_date)}
            </Text>
          </View>
          <View
            style={{
              marginVertical: 10,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 12, marginRight: 6}}>
              {parseInt(progress) || 0}%
            </Text>
            <LinearProgressBar
              progress={progress || 0}
              width={Dimensions.get('window').width * 0.65}
              height={4}
              color={
                progress && progress >= 60
                  ? '#03DB03'
                  : progress && progress < 60 && progress && progress > 30
                  ? '#E8BB05'
                  : 'red'
              }
              backgroundColor={'#ccc'}
            />
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontWeight: 600,
                textAlign: 'right',
                fontSize: 14,
              }}>
              Target:{' '}
              <Text style={{fontWeight: 400}}>
                {parseInt(item.completed) || 0}/{parseInt(item.target)}{' '}
                {item.unit}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* {permission && permission.delete && (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: '#f2f2f2',
                                borderRadius: 8,
                                marginRight: 10,
                                padding: 6,
                              }}
                              onClick={() => {
                                handleDeleteTask(item.task_id);
                              }}>
                              <MaterialIcons
                                name="delete-outline"
                                size={24}
                                color="red"
                              />
                            </CustomButton>
                          )} */}
              {/* {permission && permission.update && (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: '#f2f2f2',
                                borderRadius: 8,
                                marginRight: 10,
                                padding: 6,
                              }}
                              onClick={() => {
                                setActivity(prev => ({
                                  ...prev,
                                  activeTask: item,
                                  showEditTaskModal: true,
                                }));
                              }}>
                              <MaterialCommunityIcons
                                name="pencil"
                                size={24}
                                color={Colors.primary}
                              />
                            </CustomButton>
                          )} */}
              {permission && permission.write && (
                <CustomButton
                  buttonStyle={{
                    backgroundColor: '#f2f2f2',
                    borderRadius: 8,
                    padding: 6,
                  }}
                  onClick={() => {
                    setActivity(prev => ({
                      ...prev,
                      activeTask: item,
                      showUpdateTaskModal: true,
                    }));
                  }}>
                  <MaterialIcons
                    name="update"
                    size={22}
                    color={Colors.primary}
                  />
                </CustomButton>
              )}
            </View>
          </View>
        </View>
      </View>
    </SizeButton>
  );
};
