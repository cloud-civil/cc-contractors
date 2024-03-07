import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {formatDate} from '../../../../utils';
import {IMAGE_URL} from '@env';

const CommentSection = ({
  loadingComments,
  commentData,
  users,
  userOrg,
  project_id,
  token,
  showImage,
}) => {
  return (
    <View style={{marginVertical: 10, paddingBottom: 60}}>
      <Text style={{fontWeight: 600, fontSize: 20, marginBottom: 14}}>
        Comments
      </Text>
      {!loadingComments ? (
        <>
          {commentData.length ? (
            <FlatList
              data={commentData}
              renderItem={({item}) => {
                const images = item.images && JSON.parse(item.images);
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <View style={customStyle.avatarContent}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          fontWeight: 600,
                        }}>
                        {users[item.user_id].fname[0]}
                      </Text>
                    </View>
                    <View>
                      <Text style={{fontWeight: 600, marginBottom: 2}}>
                        {users[item.user_id].fname} {users[item.user_id].lname}
                      </Text>
                      {item.comment && (
                        <Text style={{marginBottom: 2}}>{item.comment}</Text>
                      )}
                      {images && images.length > 0 && (
                        <FlatList
                          style={{marginVertical: 2}}
                          data={images}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentbuttonStyle={{paddingRight: 50}}
                          renderItem={({item: img}) => {
                            const url = `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/thumbnail-${img.fullName}`;
                            return (
                              <TouchableOpacity
                                onPress={() => showImage(img.fullName)}
                                activeOpacity={0.7}
                                key={img.fullName}>
                                <Image
                                  source={{
                                    uri: url,
                                    headers: {
                                      Authorization: token,
                                    },
                                  }}
                                  style={{
                                    width: 120,
                                    height: 90,
                                    borderRadius: 10,
                                    marginRight: 6,
                                    //   marginBottom: 8,
                                  }}
                                />
                              </TouchableOpacity>
                            );
                          }}
                        />
                      )}
                      <Text style={{fontSize: 12}}>
                        {formatDate(item.created_at)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={{marginTop: 100}}>
              <Text style={{textAlign: 'center'}}>No Comments yet</Text>
            </View>
          )}
        </>
      ) : (
        <View>
          <ActivityIndicator loading={loadingComments} />
        </View>
      )}
    </View>
  );
};

const customStyle = StyleSheet.create({
  avatarContent: {
    width: 30,
    height: 30,
    backgroundColor: 'grey',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default CommentSection;
