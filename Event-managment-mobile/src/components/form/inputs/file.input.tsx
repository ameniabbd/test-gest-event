/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MediaPickerType, showMediaPicker} from '../../utils/mediapicker';
import {Size} from '../../../utils/size';
import Button from '../elements/button';
import appColors from '../../../colors';
import Label from '../elements/label';
import {InputStyle} from '../../../style';
import Text from '../../utils/text';

export default function FileInput(props: {
  label: string;
  btnTitle?: string;
  editBtnTitle?: string;
  allowClearFile?: boolean;
  hideFileName?: boolean;
  showImageInside?: boolean;
  fileName?: string;
  url?: string;
  type?: any;
  disabled?: boolean;
  onChange?: Function;
  pickerProps?: MediaPickerType;
}) {
  const [file, setfile]: any = useState(null);

  async function onSelect() {
    const res: any = await showMediaPicker(props.pickerProps);
    if (props.onChange) props.onChange(res);
    if (!res.uri) res.uri = res.path;
    if (!res.name && !res.filename) {
      const tab = res.uri.split('/');
      res.name = tab[tab.length - 1];
      res.filename = tab[tab.length - 1];
    }
    setfile(res);
    if (props.onChange) props?.onChange(res);
  }

  function onDelete() {
    setfile(null);
    if (props.onChange) props?.onChange(null);
  }
  const showImage = file && props.showImageInside && file.mime == 'image/jpeg';
  const isEdit = file || props.fileName;
  return (
    <TouchableOpacity disabled={props.disabled} activeOpacity={0.5} onPress={onSelect}>
      <View>
        <Label textStyle={InputStyle.primary.labelText}>{props.label}</Label>
        <View
          style={{
            ...styles.photoContainer,
            overflow: 'hidden',
            paddingHorizontal: showImage ? 0 : Size(20),
            paddingVertical: showImage ? 0 : Size(10),
          }}>
          {showImage ? (
            <Image
              style={{width: props.pickerProps?.cropWidth || '100%', height: props.pickerProps?.cropHeight || '100%'}}
              resizeMode="cover"
              source={{uri: file.path}}
            />
          ) : (
            <Button
              category="tertiary"
              disabled={props.disabled}
              title={(isEdit && (props.editBtnTitle || 'Modifier')) || props.btnTitle || 'Ajouter'}
              style={{pointerEvents: 'none'}}
            />
          )}
        </View>
      </View>
      {isEdit && !props.hideFileName && (
        <View style={{flexDirection: 'row', flex: 1}}>
          <Text numberOfLines={1} category="legend">
            {file?.name || file?.filename || props.fileName}
          </Text>
          {isEdit && props.allowClearFile && (
            <TouchableOpacity disabled={props.disabled} onPress={onDelete}>
              <Text>clear</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  photoContainer: {
    borderRadius: 15,
    borderColor: appColors.disabledBorder,
    borderStyle: 'dotted',
    paddingHorizontal: Size(20),
    paddingVertical: Size(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: Size(8),
  },
});
