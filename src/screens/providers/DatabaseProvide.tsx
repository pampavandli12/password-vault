import React, {ReactNode} from 'react';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {createTable, getDBConnection} from '../utils/dbQueryHandler';
import {LoadingComponent} from '../components/LoadingComponent';

export const DatabaseContext = React.createContext<SQLiteDatabase | null>(null);

export const DataBaseProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [dbInstance, setDbInstance] = React.useState<SQLiteDatabase | null>(
    null,
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    setDbHandler();
  }, []);

  const setDbHandler = async () => {
    try {
      const db: SQLiteDatabase = await getDBConnection();
      createTable(db);
      setDbInstance(db);
      setLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  };
  return loading ? (
    <LoadingComponent />
  ) : (
    <DatabaseContext.Provider value={dbInstance}>
      {children}
    </DatabaseContext.Provider>
  );
};
