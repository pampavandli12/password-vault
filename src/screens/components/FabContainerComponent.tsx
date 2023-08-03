import React from 'react';
import {FAB, Portal} from 'react-native-paper';
import {
  writeFile,
  DownloadDirectoryPath,
  readFile,
  DocumentDirectoryPath,
} from 'react-native-fs';
import Papa from 'papaparse';
import {DatabaseContext} from '../providers/DatabaseProvide';
import {getAllPasswords, insertMany} from '../utils/dbQueryHandler';
import {Password} from '../utils/types';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SecreteKeyContext} from '../providers/SecreteKeyProvider';
import {decryptPassword, encryptPassword} from '../utils/utils';
import {NotificationContext} from '../providers/NotificationProvider';
import {PermissionsAndroid} from 'react-native';

export const FabContainerComponent = (): JSX.Element => {
  const [isopen, setisOpen] = React.useState(false);
  const dbInstance = React.useContext(DatabaseContext);
  const secreteKey = React.useContext(SecreteKeyContext);
  const dispatchNotification = React.useContext(NotificationContext);

  const onStateChange = ({open}: {open: boolean}) => {
    setisOpen(open);
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Please approve to write file',
          message: 'This permission is needed to export the file',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const exportToCsv = async () => {
    if (!dbInstance) return;
    try {
      const isPermitted = requestCameraPermission();
      if (!isPermitted) {
        dispatchNotification &&
          dispatchNotification('File can not be exported');
        return;
      }
      const data: Password[] = await getAllPasswords(dbInstance);
      const decryptedData = data.map((element: Password): Password => {
        return {
          ...element,
          password: decryptPassword(element.password, secreteKey),
        };
      });
      const csvData = Papa.unparse(decryptedData);

      // Define the file path and name
      const path = `${DownloadDirectoryPath}/data.csv`;
      await writeFile(path, csvData, 'utf8');
      dispatchNotification &&
        dispatchNotification(`file downloaded at download/data.csv`);
    } catch (error) {
      console.error(error);
      dispatchNotification &&
        dispatchNotification(`something went wrong, please report`);
    }
  };

  const importFile = async () => {
    try {
      // Define the file path and name
      //const path = `${DocumentDirectoryPath}/data.csv`;
      const isPermitted = requestCameraPermission();
      if (!isPermitted) {
        dispatchNotification &&
          dispatchNotification('File can not be exported');
        return;
      }
      const res: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('------------res', res);
      if (res[0].type === 'cancel') {
        // User canceled the file selection
        return;
      }
      // Read the CSV file
      const fileData = await readFile(res[0].uri as string, 'utf8');

      // Parse the CSV data using papaparse
      const parsedData = Papa.parse(fileData, {header: true});
      console.log('Parsed CSV data:', parsedData.data);
      const passwordList: Password[] = parsedData.data;
      const encryptedPassword = passwordList.map(
        (element: Password): Password => {
          return {
            email: element.email,
            title: element.title,
            username: element.username,
            note: element.note,
            website: element.website,
            password: encryptPassword(element.password, secreteKey),
          };
        },
      );
      console.log(encryptedPassword);
      const response = await insertMany(dbInstance, encryptedPassword);
      dispatchNotification &&
        dispatchNotification('File imported successfully');
    } catch (error) {
      console.error('Error reading CSV file:', error);
    }
  };

  return (
    <>
      <Portal>
        <FAB.Group
          open={isopen}
          visible
          icon="file-settings"
          variant="secondary"
          actions={[
            {
              icon: 'export',
              label: 'Export',
              onPress: exportToCsv,
            },
            {
              icon: 'import',
              label: 'Import',
              onPress: importFile,
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (isopen) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </>
  );
};
