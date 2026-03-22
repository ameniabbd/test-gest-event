import React, {useEffect, useState} from 'react';
import data from './data.json';
import {FlatList, Image, ImageBackground, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../../utils/text';
import {Size} from '../../../utils/size';
import {TextInput} from '../inputs/text.input';
import {hideActionSheet, showActionSheet} from '../../utils/actionsheet';

import ArrowDown from '../../../../resources/assets/arrow-down.svg';
import ArrowUp from '../../../../resources/assets/arrow-up.svg';
import appColors from '../../../colors';
import {getCountry} from 'react-native-localize';
import {strings} from '../../../contexts/app.context';
import {getCountryCallingCode} from 'libphonenumber-js';

export default function CountryPicker(props?: {
  countryCode?: string;
  id?: string;
  disabled?: boolean;
  locale?: string;
  hideDropDown?: boolean;
  hideFlag?: boolean;
  hideCountryName?: boolean;
  hideCountryCode?: boolean;
  style?: any;
  onSelectCountry?: Function;
}) {
  const [selectedItem, setSelectedItem]: any = useState({});
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let code = props?.countryCode;
    let id: any = props?.id;
    if (!code) {
      const country: any = getCountry();
      if (country == 'US') id = 231;
      code = getCountryCallingCode(country);
    }
    const item = data.find(elt => elt.callingCode == code && (!id || elt.id == id));
    if (item) setSelectedItem(item);
  }, [props?.countryCode, props?.id]);
  function onShow() {
    setOpen(true);
    showActionSheet(
      () => (
        <View style={styles.sheetStyle}>
          <CountryList
            locale={props?.locale}
            onSelect={(item: any) => {
              setSelectedItem(item);
              setOpen(false);
              if (props?.onSelectCountry) props?.onSelectCountry(item);
              hideActionSheet();
            }}
          />
        </View>
      ),
      {onClose: () => setOpen(false), gestureEnabled: false, keyboardHandlerEnabled: Platform.OS == 'ios'},
    );
  }
  return (
    <TouchableOpacity disabled={props?.disabled} style={[styles.btn, props?.style]} onPress={onShow}>
      {!props?.hideFlag &&
        (selectedItem.flag ? (
          <ImageBackground style={styles.countryImage} source={{uri: selectedItem?.flag}} />
        ) : (
          <View style={[styles.countryImage, {backgroundColor: appColors.primary50}]} />
        ))}
      {!props?.hideCountryCode && selectedItem.callingCode && (
        <Text category="legend">{'+' + selectedItem.callingCode}</Text>
      )}
      {!props?.hideDropDown &&
        (open ? (
          <ArrowUp style={styles.arrow} height={Size(14)} width={Size(14)} />
        ) : (
          <ArrowDown style={styles.arrow} height={Size(14)} width={Size(14)} />
        ))}
    </TouchableOpacity>
  );
}

export function CountryList(props: {locale?: string; showCode?: boolean; onSelect?: Function}) {
  const [search, setsearch] = useState('');
  return (
    <View style={styles.container}>
      <TextInput onChange={(val: any) => setsearch(val)} placeHolder={strings.search} />
      <FlatList
        contentContainerStyle={styles.list}
        renderItem={p => <CountryItem onSelect={props.onSelect} {...p} locale={props?.locale} />}
        data={data
          .filter((ele: any) => {
            return (
              !search ||
              ele.name[props.locale || 'en']?.toLowerCase().indexOf(search?.toLowerCase()) != -1 ||
              ('+' + ele.callingCode).indexOf(search) != -1
            );
          })
          .sort((e1: any, e2: any) => {
            return e1.name[props.locale || 'en'] - e2.name[props.locale || 'en'];
          })}
      />
    </View>
  );
}
function CountryItem({item, locale, onSelect}: any) {
  return (
    <TouchableOpacity onPress={() => onSelect(item)} style={styles.countryItem}>
      <Image style={styles.countryImage} source={{uri: item.flag}} />
      <Text category="legend" style={styles.countryCode}>
        {'(+' + item.callingCode + ')'}
      </Text>
      <Text numberOfLines={1} category="legend" style={styles.countryTitle}>
        {item.name[locale] || item.name.en}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  countryItem: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CDD3D6',
    paddingVertical: 12,
  },
  container: {flex: 1, padding: Size(16)},
  countryImage: {width: Size(30), height: Size(20), marginEnd: Size(3)},
  countryCode: {marginStart: 15, width: Size(60)},
  countryTitle: {marginStart: 20, flex: 1},
  list: {flexGrow: 1},
  sheetStyle: {minHeight: Size(450)},
  btn: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: Size(100),
  },
  arrow: {marginStart: Size(5)},
});
