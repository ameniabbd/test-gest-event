/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CheckBox, TextInput} from '..';
import {Size} from '../../../utils/size';
import appColors from '../../../colors';
import SearchIcon from '../../../../resources/assets/search.svg';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
const Dropdown = (props: any) => {
  const [layout, setLayout] = useState<any>({x: 0, y: 0, width: 0});
  useEffect(() => {
    props.elementRef.current?.measure(
      (fx: number, fy: number, width: number, height: number, px: number, py: number) => {
        setLayout({x: px, y: fy + height, py: py, width: width});
        if (props.onReady) {
          props.onReady({zIndex: Math.floor(Math.abs(10000 - py))});
        }
      },
    );
  }, [props.values]);
  return (
    layout.py && (
      <>
        {
          <TouchableOpacity
            activeOpacity={1}
            onPress={props.hide}
            style={{
              ...styles.outsideZone,
              top: -layout.py,
              start: -layout.x,
            }}
          />
        }
        <View
          style={{
            top: layout.y,
            ...styles.dropDownStyle,
            ...props.dropDownCategoryStyle?.container,
            ...props.dropDownStyle,
          }}>
          {props.search && (
            <TextInput
              renderEnd={() => <SearchIcon width={Size(24)} height={Size(24)} />}
              placeHolder={'search'}
              placeHolderColor={'gray'}
              onChange={props.onSearch}
              inputTextStyle={{fontSize: Size(15)}}
              subContainerStyle={styles.searchInput}
              {...props.searchInputProps}
            />
          )}
          <ScrollView keyboardShouldPersistTaps="handled" horizontal contentContainerStyle={styles.flatlist}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={props.options}
              contentContainerStyle={styles.flatlistcontainer}
              renderItem={p => (
                <RenderItem
                  categoryStyle={props.dropDownCategoryStyle}
                  {...p}
                  disabled={props.disabled}
                  values={props.values}
                  onSelect={props.onSelect}
                  {...props}
                />
              )}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: any) => item.value || item}
            />
          </ScrollView>
        </View>
      </>
    )
  );
};
function RenderItem(props: any) {
  const disabled =
    props.disabled ||
    props.item.disabled ||
    (props?.maxItems &&
      props.values?.length >= props?.maxItems &&
      props.values?.indexOf(props.item.value || props.item) == -1);
  const selected = !props.multiple && props.values?.find((item: any) => item == (props.item.value || props.item));
  return (
    <CheckBox
      label={props.item.label || props.item}
      labelStart
      fullyTouchable
      disabled={disabled}
      onChange={props.onSelect?.bind(props.onSelect, props.item)}
      default={props.values?.find((item: any) => item == (props.item.value || props.item)) != undefined}
      hideCheck={!props.multiple}
      subContainerStyle={styles.itemsubContainer}
      containerStyle={{
        ...styles.itemContainerStyle,
        paddingHorizontal: props.multiple ? Size(10) : 0,
      }}
      labelStyle={{
        ...styles.itemStyle,
        paddingHorizontal: !props.multiple ? Size(10) : 0,
        ...props.itemStyle,
        ...props.categoryStyle?.item,
        ...(disabled ? {...props.categoryStyle?.itemDisabled, ...props.activeItemStyle} : {}),
        ...(selected ? {...props.categoryStyle?.itemSelected, ...props.activeItemStyle} : {}),
      }}
    />
  );
}

export default Dropdown;

const styles = StyleSheet.create({
  itemStyle: {
    marginStart: 0,
    fontSize: Size(17),
    flex: 1,
    paddingVertical: Size(5),
    color: appColors.text100,
  },
  outsideZone: {
    ...(StyleSheet.absoluteFill as any),
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
  },
  flatlist: {flex: 1},
  dropDownStyle: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
  },
  flatlistcontainer: {width: '100%', flexGrow: 1},

  itemContainerStyle: {
    paddingVertical: 0,
    marginBottom: 0,
  },
  itemsubContainer: {justifyContent: 'space-between'},
  searchInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
});
