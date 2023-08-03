/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StackNav} from './src/screens/StackNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import {DataBaseProvider} from './src/screens/providers/DatabaseProvide';
import {SecreteKeyProvider} from './src/screens/providers/SecreteKeyProvider';
import {NotificationProvider} from './src/screens/providers/NotificationProvider';

function App(): JSX.Element {
  return (
    <>
      <PaperProvider>
        <DataBaseProvider>
          <SecreteKeyProvider>
            <NotificationProvider>
              <NavigationContainer>
                <StackNav />
              </NavigationContainer>
            </NotificationProvider>
          </SecreteKeyProvider>
        </DataBaseProvider>
      </PaperProvider>
    </>
  );
}

export default App;
