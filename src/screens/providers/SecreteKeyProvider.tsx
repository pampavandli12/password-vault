import React from 'react';
import {generateString} from '../utils/utils';
import EncryptedStorage from 'react-native-encrypted-storage';
import {LoadingComponent} from '../components/LoadingComponent';

export const SecreteKeyContext = React.createContext<string>('');

export const SecreteKeyProvider = ({
  children,
}: {
  children: React.ReactElement;
}): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [secreteKey, setSecreteKey] = React.useState<string>('');
  const generateSecreteKey = async () => {
    try {
      const secretKeyValue: string = generateString(35);
      await EncryptedStorage.setItem(
        'SECRETEKEY',
        JSON.stringify(secretKeyValue),
      );
      setSecreteKey(secretKeyValue);
      // Congrats! You've just stored your first value!
    } catch (error) {
      // There was an error on the native side
      console.log('Error setting secrete key');
    }
  };
  const handleSecreteKey = React.useCallback(async () => {
    try {
      let secretKeyValue: string | null = await EncryptedStorage.getItem(
        'SECRETEKEY',
      );
      if (secretKeyValue) {
        // Congrats! You've just retrieved your first value!
        setSecreteKey(secretKeyValue);
        setLoading(false);
      } else {
        await generateSecreteKey();
        setLoading(false);
      }
    } catch (error) {
      // There was an error on the native side
      console.log('Error fetching secrete key');
    }
  }, []);
  React.useEffect(() => {
    handleSecreteKey();
  }, [handleSecreteKey]);

  return loading ? (
    <LoadingComponent />
  ) : (
    <SecreteKeyContext.Provider value={secreteKey}>
      {children}
    </SecreteKeyContext.Provider>
  );
};
