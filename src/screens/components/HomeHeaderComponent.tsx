import React, {useState} from 'react';
import {View} from 'react-native';
import {Appbar, Searchbar} from 'react-native-paper';

export default function HomeHeaderComponent({
  openReportModal,
  setSearchText,
  searchText,
}: {
  openReportModal: () => void;
  setSearchText: (value: string) => void;
  searchText: string;
}) {
  const [showSearchbar, setShowSearchbar] = useState<boolean>(false);
  const handleSearchClose = () => {
    setSearchText('');
    setShowSearchbar(false);
  };
  return (
    <View style={{height: 64}}>
      {showSearchbar ? (
        <Searchbar
          icon="arrow-left"
          onIconPress={handleSearchClose}
          placeholder="Search"
          onChangeText={event => setSearchText(event)}
          value={searchText}
          onClearIconPress={() => setSearchText('')}
        />
      ) : (
        <Appbar.Header>
          <Appbar.Content title="Home" />
          <Appbar.Action icon="email" onPress={openReportModal} />
          <Appbar.Action
            icon="magnify"
            onPress={() => setShowSearchbar(true)}
          />
        </Appbar.Header>
      )}
    </View>
  );
}
