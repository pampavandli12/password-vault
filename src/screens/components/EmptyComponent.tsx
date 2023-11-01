import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const EmptyComponent = (): JSX.Element => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '50%',
      }}>
      <Icon name="flask-empty-outline" size={55} style={{marginBottom: 10}} />

      <Text
        style={{
          color: theme.colors.onSurface,
        }}>
        No passwords found
      </Text>
      <Text
        style={{
          color: theme.colors.onSurface,
        }}>
        Click on Add New to add password
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  imgStyle: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
