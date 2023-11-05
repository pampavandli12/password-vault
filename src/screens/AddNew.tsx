import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {
  TextInput,
  useTheme,
  Button,
  HelperText,
  Appbar,
  MD3Theme,
} from 'react-native-paper';
import {Formik, useFormikContext} from 'formik';
import * as Yup from 'yup';
import {addNewPassword, updatePassword} from './utils/dbQueryHandler';
import {decryptPassword, encryptPassword, generateString} from './utils/utils';
import {Password} from './utils/types';
import {DatabaseContext} from './providers/DatabaseProvide';
import {SecreteKeyContext} from './providers/SecreteKeyProvider';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NotificationContext} from './providers/NotificationProvider';
import {database} from '../model/schema';

const intialState: Password = {
  email: '',
  title: '',
  username: '',
  password: '',
  website: '',
  note: '',
};

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email'),
  username: Yup.string()
    .min(2, 'Username is too short')
    .max(50, 'Username is too long'),
  title: Yup.string()
    .min(2, 'Title is too Short!')
    .max(50, 'Title is too Long!')
    .required(),
  password: Yup.string()
    .min(6, 'Your password is too short!')
    .max(50, 'Your password is too long!'),
});

export const AddNewComponent = ({navigation, route}) => {
  const [formValues, setFormValues] = React.useState<Password>(intialState);
  const [isPassword, setIsPassword] = React.useState<boolean>(true);
  const secreteKey = React.useContext(SecreteKeyContext);
  const theme = useTheme<MD3Theme>();
  const dbInstance = React.useContext(DatabaseContext);
  const dispatchNotification = React.useContext(NotificationContext);

  React.useEffect(() => {
    if (!route.params) return;
    const formData: Password = route.params['data'];
    formData.password = decryptPassword(formData.password, secreteKey);
    setFormValues(formData);
  }, [route.params]);

  const handleSubmit = React.useCallback(
    async (values: Password, actions) => {
      if (values.password) {
        values.password = encryptPassword(values.password, secreteKey);
      }
      if (values._id) {
        handleUpdatePassword(values);
      } else {
        try {
          const response = await addNewPassword(values, dbInstance);
          dispatchNotification &&
            dispatchNotification('New password is created!!');
        } catch (error) {
          dispatchNotification &&
            dispatchNotification('Something went wrong, please report');
        }

        const test_add = await database.get('passwords').create(password => {
          password.title = values.title;
          password.email = values.email;
          password.username = values.username;
          password.title = values.title;
          password.website = values.website;
          password.notes = values.note;
        });
        console.log('----------------test_add', test_add);
      }
      console.log('is reset calling?');
      actions.resetForm({
        values: intialState,
      });
      navigation.navigate('Home');
    },
    [secreteKey],
  );

  const handleUpdatePassword = async (values: Password) => {
    try {
      await updatePassword(values, dbInstance);
      dispatchNotification &&
        dispatchNotification('Password updated successfully!!');
    } catch (error) {
      dispatchNotification &&
        dispatchNotification('Something went wrong, please report');
    }
  };
  const generatePassword = React.useCallback((values: Password) => {
    setFormValues({...values, password: generateString(10)});
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.Content title="Add New Password" />
      </Appbar.Header>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={64}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Formik
          initialValues={formValues}
          enableReinitialize={true}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              style={styles.viewContainer}>
              <TextInput
                label="Title"
                value={values.title}
                onChangeText={handleChange('title')}
                style={styles.textField}
              />

              <HelperText type="error" visible={errors.title && touched.title}>
                {errors.title}
              </HelperText>
              <TextInput
                label="Username"
                value={values.username}
                onChangeText={handleChange('username')}
                style={styles.textField}
              />
              <HelperText
                type="error"
                visible={errors.username && touched.username}>
                {errors.username}
              </HelperText>
              <TextInput
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                style={styles.textField}
              />
              <HelperText type="error" visible={errors.email && touched.email}>
                {errors.email}
              </HelperText>
              <TextInput
                label="Password"
                textContentType="password"
                secureTextEntry={isPassword}
                value={values.password}
                onChangeText={handleChange('password')}
                style={styles.textField}
                right={
                  <TextInput.Icon
                    icon={isPassword ? 'eye' : 'eye-off'}
                    onPress={() => setIsPassword(!isPassword)}
                  />
                }
              />
              <HelperText
                type="error"
                visible={errors.password && touched.password}>
                {errors.password}
              </HelperText>
              <Button
                icon="reload"
                mode="contained-tonal"
                style={styles.textField}
                onPress={() => generatePassword(values)}>
                Generate Password
              </Button>
              <TextInput
                label="website"
                value={values.website}
                style={styles.textField}
                onChangeText={handleChange('website')}
              />
              <TextInput
                label="Note"
                multiline={true}
                value={values.note}
                style={styles.textField}
                onChangeText={handleChange('note')}
              />

              <Button
                mode="contained-tonal"
                compact={true}
                onPress={handleSubmit}
                type="submit">
                Create Password
              </Button>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    padding: 10,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  textField: {
    width: '100%',
    marginBottom: 10,
  },
});
