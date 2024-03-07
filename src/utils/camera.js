import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import {imageUpload} from '../apiHooks';
import {setUploadedUrls} from '../cc-hooks/src/imageSlice';

export const checkCameraPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      return true;
    } else {
      const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
      const hasPermission = await PermissionsAndroid.check(permission);
      return hasPermission;
    }
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

export const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      return true;
    } else {
      const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
      const granted = await PermissionsAndroid.request(permission, {
        title: 'Camera Permission',
        message: 'Your app needs access to the camera to take pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const takePicture = async (
  project_id,
  token,
  org_id,
  dispatch,
  setImageUploadLoading,
) => {
  const permissionGranted = await checkCameraPermission();

  if (!permissionGranted) {
    const requestPermissionResult = await requestCameraPermission();

    if (!requestPermissionResult) {
      ToastAndroid.showWithGravity(
        'You need to grant camera permission to take pictures. Go to settings to permit.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      return;
    }
  }

  try {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 3000,
      maxHeight: 4000,
    };
    launchCamera(options)
      .then(data => {
        if (data.didCancel) {
          return;
        }
        if (data.errorCode === 'camera_unavailable') {
          Toast.show({
            type: 'error',
            text1: 'Unavailable',
            text2: 'Camera not available',
          });
          return;
        }
        setImageUploadLoading(true);
        imageUpload(data.assets[0], org_id, project_id, token)
          .then(res => {
            dispatch(setUploadedUrls(res.data.data));
            setImageUploadLoading(false);
          })
          .catch(err => {
            console.log(err, 'Could not upload image.');
            Toast.show({
              type: 'error',
              text1: 'Failed',
              text2: 'Could not upload image.',
            });
            setImageUploadLoading(false);
          });
      })
      .catch(
        err => console.log(err, '/takePicture', err?.response?.data?.message),
        setImageUploadLoading(false),
      );
  } catch (error) {
    console.log('Error taking picture:', error);
    setImageUploadLoading(false);
  }
};
