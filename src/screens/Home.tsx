import React from 'react';
import {RefreshControl, SafeAreaView, ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';
import {List, Portal, useTheme, IconButton} from 'react-native-paper';
import {getAllPasswords} from './utils/dbQueryHandler';
import {decryptPassword} from './utils/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import {DatabaseContext} from './providers/DatabaseProvide';
import {Password} from './utils/types';
import {SecreteKeyContext} from './providers/SecreteKeyProvider';
import {EmptyComponent} from './components/EmptyComponent';
import {FabContainerComponent} from './components/FabContainerComponent';
import {useNavigation} from '@react-navigation/native';
import HomeHeaderComponent from './components/HomeHeaderComponent';
import ReportComponent from './components/ReportComponent';

export const HomeComponent = () => {
  const theme = useTheme();
  const [passwordList, setPasswordList] = React.useState<Password[]>([]);
  const [dataList, setDataList] = React.useState<Password[]>([]);
  const secreteKey = React.useContext(SecreteKeyContext);
  const dbInstance = React.useContext(DatabaseContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const [openReport, setOpenReport] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');

  const fetchAllPasswords = React.useCallback(async () => {
    if (!dbInstance) return;
    const data: Password[] = await getAllPasswords(dbInstance);
    setPasswordList(data);
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Code to run when the screen comes into focus (navigated to).
      fetchAllPasswords();
    });

    // Clean up the event listener when the component unmounts.
    return () => unsubscribe();
  }, [navigation]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllPasswords();
  }, []);

  const debounceSearch = () => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        clearTimeout(timer);
        const data = passwordList.filter(item =>
          item.title
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()),
        );
        setPasswordList(data);
      }, 1000);
    };
  };

  const searchPasswords = debounceSearch();

  React.useEffect(() => {
    if (!searchText.trim()) return;
    searchPasswords();
  }, [searchText]);

  return (
    <Portal.Host>
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.background,
          ...styles.viewContainer,
        }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <HomeHeaderComponent
            openReportModal={() => setOpenReport(true)}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          {passwordList.length > 0 ? (
            passwordList.map((item, index) => (
              <List.Item
                key={item._id}
                title={item.title}
                onPress={() => navigation.navigate('Detail', {data: item})}
                description={item.note}
                right={props => (
                  <IconButton
                    icon="content-copy"
                    size={20}
                    onPress={() =>
                      Clipboard.setString(
                        decryptPassword(item.password, secreteKey),
                      )
                    }
                  />
                )}
              />
            ))
          ) : (
            <EmptyComponent />
          )}

          <FabContainerComponent refreshPasswordList={fetchAllPasswords} />
          <ReportComponent
            visible={openReport}
            closeReportModal={() => setOpenReport(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </Portal.Host>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
});
