import {
  Dimensions,
  Text,
  Platform,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Modal as AndroidModal, Portal} from 'react-native-paper';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useState} from 'react';

const screenWidth = Dimensions.get('window').width;

const CustomModal = ({
  title,
  visible,
  closeModal,
  animationIn,
  animationOut,
  children,
  showHeader = true,
}) => {
  if (Platform.OS === 'ios') {
    return (
      <Modal
        isVisible={visible}
        avoidKeyboard={true}
        animationIn={animationIn ? animationIn : 'fadeIn'}
        animationOut={animationOut ? animationOut : 'fadeOut'}>
        {/* {visible && <Toast config={toastConfig} />} */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 10,
              width: screenWidth - 40,
              marginBottom: 10,
              marginTop: 20,
            }}>
            {showHeader && (
              <View style={styles.header}>
                <Text style={{fontWeight: '600', fontSize: 18, width: '80%'}}>
                  {title}
                </Text>
                <CloseButton closeModal={closeModal} />
              </View>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Portal>
      <AndroidModal visible={visible} dismissable={false}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 10,
            marginHorizontal: 16,
            marginBottom: 40,
            marginTop: 30,
          }}>
          <View style={styles.header}>
            <Text style={{fontWeight: '600', fontSize: 18, width: '80%'}}>
              {title}
            </Text>
            <CloseButton closeModal={closeModal} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </AndroidModal>
    </Portal>
  );
};

const CloseButton = ({closeModal}) => {
  const [isButtonPressed, setButtonPressed] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={closeModal}
      onPressIn={() => setButtonPressed(true)}
      onPressOut={() => setButtonPressed(false)}>
      <View
        style={{
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isButtonPressed ? '#e9e9e9' : '#fff',
          width: 36,
          height: 36,
        }}>
        <Ionicons
          name="close"
          size={26}
          color={'black'}
          style={{marginLeft: 1}}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CustomModal;
