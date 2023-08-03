import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailComponent} from './Detail';
import {useNavigation} from '@react-navigation/native';
import {NavigationComponent} from './Navigation';

const Stack = createStackNavigator();

export const StackNav = () => {
  const navigation = useNavigation();
  React.useEffect(() => {
    console.log('This is calling in stack navigator');
    navigation.navigate('Tabs');
  }, [navigation]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Tabs"
        component={NavigationComponent}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Detail"
        component={DetailComponent}
      />
    </Stack.Navigator>
  );
};
