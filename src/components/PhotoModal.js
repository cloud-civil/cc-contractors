import {useIsFocused} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PhotoModal = ({
  visible,
  closeModal,
  animationIn,
  animationOut,
  children,
}) => {
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && (
        <>
          {/* {visible && (
            <StatusBar translucent backgroundColor="rgba(0,0,0,0.7)" />
          )} */}
          <Modal
            isVisible={visible}
            avoidKeyboard
            animationIn={animationIn ? animationIn : 'zoomInUp'}
            animationOut={animationOut ? animationOut : 'zoomOutUp'}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={closeModal}
                  style={styles.closeButton}>
                  <Ionicons name="close" size={30} color={'black'} />
                </TouchableOpacity>
                {children}
              </View>
            </View>
          </Modal>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    padding: 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
    borderRadius: 30,
    marginBottom: 10,
  },
});

export default PhotoModal;
