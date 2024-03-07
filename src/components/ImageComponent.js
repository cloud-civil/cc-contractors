import {useState} from 'react';
import {Image, View} from 'react-native';
import {Skeleton} from './Skeleton';

const ImageComponent = props => {
  const {imageUrl, token, style} = props;
  const [isImageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={{position: 'relative'}}>
      <Image
        onLoad={() => {
          console.log('image loaded');
          setImageLoaded(true);
        }}
        source={{
          uri: imageUrl,
          headers: {
            Authorization: token,
          },
        }}
        style={style}
      />
      {!isImageLoaded && (
        <View style={{position: 'absolute'}}>
          <Skeleton style={style} />
        </View>
      )}
    </View>
  );
};

export default ImageComponent;
