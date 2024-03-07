import {FlatList, Image, View} from 'react-native';
import {ImageLoadingSkeleton} from './Skeleton';
import {IMAGE_URL} from '@env';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {deleteImage} from '../cc-hooks/src/imageSlice';

const UploadImageComponent = ({imageUploadLoading, token}) => {
  const dispatch = useDispatch();

  const uploadedUrls = useSelector(
    state => state.image.uploadedUrls,
    shallowEqual,
  );

  const imageArray = imageUploadLoading
    ? [...uploadedUrls, {skeleton: true, fileName: -10000}]
    : uploadedUrls;

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      style={{marginBottom: 10}}
      data={imageArray}
      horizontal={true}
      renderItem={({item}) => {
        if (item.skeleton) {
          return <ImageLoadingSkeleton key={item.fileName} />;
        } else {
          return (
            <View
              style={{marginRight: 10, position: 'relative'}}
              key={item.fileName}>
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
                  onPress={() =>
                    dispatch(deleteImage({fileName: item.fileName}))
                  }>
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
  );
};

export default UploadImageComponent;
