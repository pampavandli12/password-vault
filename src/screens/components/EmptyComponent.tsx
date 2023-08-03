import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {useTheme} from 'react-native-paper';

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
      <Image
        style={styles.imgStyle}
        source={require('../../assets/empty.png')}
      />
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
