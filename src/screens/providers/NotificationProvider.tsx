import React from 'react';
import {Snackbar} from 'react-native-paper';

export const NotificationContext = React.createContext<
  null | ((message: string) => void)
>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactElement;
}): JSX.Element => {
  const [snackbarVisible, setSnackbarVisible] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');

  const dispatchNotification = (message: string) => {
    setSnackbarVisible(true);
    setSnackbarMessage(message);
  };
  const handleSnakbarDismiss = () => setSnackbarVisible(false);
  return (
    <NotificationContext.Provider value={dispatchNotification}>
      <Snackbar
        wrapperStyle={{bottom: 150}}
        visible={snackbarVisible}
        style={{position: 'absolute', zIndex: 9999}}
        onDismiss={handleSnakbarDismiss}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  );
};
