import React from 'react';
import {AddNewComponent} from './AddNew';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import {HomeComponent} from './Home';

const Tab = createMaterialBottomTabNavigator();

export const NavigationComponent = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeComponent}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddNewComponent}
        options={{
          tabBarLabel: 'Add New',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="add" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
