import React from 'react';
import {ActivityIndicator, View} from 'react-native';

export const LoadingComponent = (): JSX.Element => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
};
