import {useRef, useState} from 'react';
import {View, Image, StyleSheet, PanResponder} from 'react-native';
import {IMAGE_URL} from '@env';
import {useSelector} from 'react-redux';

const ZoomableImage = ({imageName, project_id}) => {
  const userOrg = useSelector(state => state.auth.org);
  const token = useSelector(state => state.auth.token);

  const source = `${IMAGE_URL}/api/project_image/${userOrg.org_id}/${project_id}/preview-${imageName}`;

  const imageRef = useRef();
  const [scale, setScale] = useState(1);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      setScale(gestureState.scale);
    },
    onPanResponderRelease: () => {
      if (scale < 1) {
        setScale(1);
      }
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Image
        ref={imageRef}
        source={{
          uri: source,
          headers: {
            Authorization: token,
          },
        }}
        style={{
          width: '100%',
          height: '100%',
          transform: [{scale}],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default ZoomableImage;
