import React from 'react';
import {FAB, Portal} from 'react-native-paper';
import {writeFile, DownloadDirectoryPath, readFile} from 'react-native-fs';
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
import * as ScopedStorage from 'react-native-scoped-storage';
import {PermissionsAndroid} from 'react-native';

export const FabContainerComponent = ({
  refreshPasswordList,
}: {
  refreshPasswordList: () => void;
}): JSX.Element => {
  const [isopen, setisOpen] = React.useState(false);
  const dbInstance = React.useContext(DatabaseContext);
  const secreteKey = React.useContext(SecreteKeyContext);
  const dispatchNotification = React.useContext(NotificationContext);

  const onStateChange = ({open}: {open: boolean}) => {
    setisOpen(open);
  };

  const askPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Approve',
          message: 'Application need access to file storage',
          buttonPositive: 'Approve',
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
      const data: Password[] = await getAllPasswords(dbInstance);

      const decryptedData = data.map((element: Password): Password => {
        return {
          ...element,
          password: decryptPassword(element.password, secreteKey),
        };
      });
      const csvData = Papa.unparse(decryptedData);
      const isPermitted = await askPermission();
      if (isPermitted) {
        const path = `${DownloadDirectoryPath}/data.csv`;
        await writeFile(path, csvData, 'utf8');
      } else {
        let dir = await ScopedStorage.openDocumentTree(true);

        await ScopedStorage.writeFile(
          dir.uri,
          csvData,
          'password.csv',
          '.csv',
          'utf8',
        );
      }
      dispatchNotification &&
        dispatchNotification(`file downloaded successfully`);
    } catch (error) {
      dispatchNotification &&
        dispatchNotification(`Something went wrong, please report`);
    }
  };

  const importFile = async () => {
    try {
      const res: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res[0].type === 'cancel') {
        // User canceled the file selection
        dispatchNotification &&
          dispatchNotification('You have not selected any file');
        return;
      }
      // Read the CSV file
      const fileData = await readFile(res[0].uri as string, 'utf8');
      // Parse the CSV data using papaparse
      const parsedData = Papa.parse(fileData, {header: true});
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
      refreshPasswordList();
    } catch (error) {
      dispatchNotification &&
        dispatchNotification('Something went wrong, please report');
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
