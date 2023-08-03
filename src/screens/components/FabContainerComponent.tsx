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
import {getAllPasswords} from '../utils/dbQueryHandler';
import {Password} from '../utils/types';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SecreteKeyContext} from '../providers/SecreteKeyProvider';
import {decryptPassword} from '../utils/utils';

export const FabContainerComponent = (): JSX.Element => {
  const [isopen, setisOpen] = React.useState(false);
  const dbInstance = React.useContext(DatabaseContext);
  const secreteKey = React.useContext(SecreteKeyContext);

  const onStateChange = ({open}: {open: boolean}) => {
    setisOpen(open);
  };

  const exportToCsv = async () => {
    console.log('check this');
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

      // Define the file path and name
      const path = `${DownloadDirectoryPath}/data.csv`;
      await writeFile(path, csvData, 'utf8');
      console.log('file downloaded in :', `${DownloadDirectoryPath}/data.csv`);
    } catch (error) {
      console.error(error);
    }
  };

  const importFile = async () => {
    try {
      // Define the file path and name
      //const path = `${DocumentDirectoryPath}/data.csv`;
      const res: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('------------res', res);
      if (res.type === 'cancel') {
        // User canceled the file selection
        return;
      }
      // Read the CSV file
      const fileData = await readFile(res.uri, 'utf8');

      // Parse the CSV data using papaparse
      const parsedData = Papa.parse(fileData, {header: true});
      console.log('Parsed CSV data:', parsedData);

      // Use the parsed data as needed
      // For example, you can store it in state or display it in the component
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
