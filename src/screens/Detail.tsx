import React from 'react';
import {SafeAreaView, View, Platform, StyleSheet} from 'react-native';
import {
  Appbar,
  Text,
  Divider,
  Menu,
  useTheme,
  List,
  IconButton,
} from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import {decryptPassword} from './utils/utils';
import {SecreteKeyContext} from './providers/SecreteKeyProvider';
import {DatabaseContext} from './providers/DatabaseProvide';
import {deletePassword} from './utils/dbQueryHandler';
import {NotificationContext} from './providers/NotificationProvider';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const DetailComponent = ({route, navigation}) => {
  const theme = useTheme();
  const {data} = route.params;
  const [visible, setVisible] = React.useState(false);
  const secreteKey = React.useContext(SecreteKeyContext);
  const [isPasswordShow, setIsPasswordShow] = React.useState(false);
  const dbInstance = React.useContext(DatabaseContext);
  const dispatchNotification = React.useContext(NotificationContext);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const copyText = text => {
    Clipboard.setString(text);
  };

  const handleDelete = React.useCallback(async () => {
    try {
      if (!dbInstance) throw new Error('DB isntance not found, please report');

      const response = await deletePassword(dbInstance, data._id);
      setVisible(false);
      // set success snackbar
      dispatchNotification &&
        dispatchNotification('This password deleted successfully');
      navigation.goBack();
    } catch (error) {
      // set error snackbar
      dispatchNotification &&
        dispatchNotification('Something went wront, please report');
    }
  }, [dispatchNotification]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        ...styles.viewContainer,
      }}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Appbar.Content title="Detail" />
        <Appbar.Action icon={MORE_ICON} onPress={openMenu} />
      </Appbar.Header>
      <View style={styles.viewStyle}>
        <Text variant="titleLarge" style={styles.textStyle}>
          {data.title}
        </Text>
        <Divider />

        <List.Item
          onPress={() => copyText(data.email)}
          title="Email"
          description={data.email}
          left={props => <List.Icon {...props} icon="email" />}
        />
        <List.Item
          onPress={() => copyText(decryptPassword(data.password, secreteKey))}
          title="Password"
          description={
            isPasswordShow
              ? decryptPassword(data.password, secreteKey)
              : '. . . . . . . . .'
          }
          left={props => <List.Icon {...props} icon="lock" />}
          right={props => (
            <IconButton
              icon={isPasswordShow ? 'eye' : 'eye-off'}
              size={20}
              onPress={() => setIsPasswordShow(!isPasswordShow)}
            />
          )}
        />
        <List.Item
          onPress={() => copyText(data.username)}
          title="User Name"
          description={data.username}
          left={props => <List.Icon {...props} icon="face-man" />}
        />
        <List.Item
          onPress={() => copyText(data.website)}
          title="Website"
          description={data.website}
          left={props => <List.Icon {...props} icon="web" />}
        />
        <List.Item
          onPress={() => copyText(data.Note)}
          title="Note"
          description={data.note}
          descriptionNumberOfLines={5}
          left={props => <List.Icon {...props} icon="pencil" />}
        />

        <Menu visible={visible} onDismiss={closeMenu} anchor={{x: 10000, y: 0}}>
          <Menu.Item
            leadingIcon="pencil"
            onPress={() => {
              navigation.navigate('Add', {data: data});
            }}
            title="Edit"
          />
          <Menu.Item
            leadingIcon="delete"
            onPress={handleDelete}
            title="Delete"
          />
        </Menu>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'start',
    justifyContent: 'start',
    paddingHorizontal: 0,
  },
  viewStyle: {
    flex: 1,
    marginHorizontal: 10,
  },
  appBar: {
    width: '100%',
  },
  textStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 50,
    padding: 15,
    marginBottom: 10,
  },
});
