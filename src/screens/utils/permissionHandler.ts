import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const requestFileWritePermission = async () => {
  try {
    const checkExistingPermission = await checkFilePermission();

    if (checkExistingPermission === RESULTS.GRANTED) {
      return true;
    }

    const granted = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
  } catch (err) {
    console.warn(err);
  }
};

export const checkFilePermission = async () => {
  return check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
};
