import React, {useState, useRef} from 'react';
import {View, Text, FlatList, SectionList, TouchableOpacity, StyleSheet} from 'react-native';
import {Size} from '../../utils/size';

const GroupTabList = (props: GroupTabList) => {
  const [activeGroup, setActiveGroup] = useState(props.data[0].name);
  const sectionListRef: any = useRef(null);
  const tabListRef: any = useRef(null);
  const sections = props.data.map(item => ({
    title: item.name,
    data: item.data || [],
  }));

  const handleTabPress = (group: any, index: any) => {
    sectionListRef.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      viewOffset: 0,
    });
    tabListRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleViewableItemsChanged = ({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      const section = viewableItems[0].section;
      if (section && section.title !== activeGroup) {
        setActiveGroup(section.title);
        const index = props.data.findIndex(item => item.name === section.title);
        if (index >= 0) {
          tabListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }
    }
  };

  // Render each tab
  const renderTab = ({item, index}: any) => (
    <TouchableOpacity
      style={[styles.tab, activeGroup === item.name && styles.activeTab]}
      onPress={() => handleTabPress(item.name, index)}>
      <Text style={[styles.tabText, activeGroup === item.name && styles.activeTabText]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={tabListRef}
        data={props.data}
        renderItem={props.renderTab || renderTab}
        keyExtractor={item => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabList}
        extraData={activeGroup}
      />
      <SectionList
        ref={sectionListRef}
        sections={sections}
        //   ListHeaderComponent={
        //      <FlatList
        //   ref={tabListRef}
        //   data={props.data}
        //   renderItem={props.renderTab || renderTab}
        //   keyExtractor={item => item.name}
        //   horizontal
        //   showsHorizontalScrollIndicator={false}
        //   style={styles.tabList}
        //   extraData={activeGroup}
        // />
        //   }
        keyExtractor={(item, index) => item.name + index}
        renderItem={props.renderItem || RenderItem}
        renderSectionHeader={props.renderSectionHeader || RenderSectionHeader}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
function RenderItem({item}: any) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );
}
function RenderSectionHeader({section: {title}}: any) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

interface GroupTabList {
  data: {name: string; data: {name: string}[]}[];
  renderItem?: (item: any, index?: number) => React.JSX.Element;
  renderTab?: (item: any, index?: number) => React.JSX.Element;
  renderSectionHeader?: (item: any, index?: number) => React.JSX.Element;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabList: {
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    height: Size(50),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: Size(16),
    color: '#333',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeaderText: {
    fontSize: Size(18),
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: Size(16),
    color: '#333',
  },
});

export default GroupTabList;
