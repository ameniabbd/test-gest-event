import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Size} from '../../utils/size';
import {hideActionSheet, showActionSheet} from './actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import appColors from '../../colors';
import {pick, types} from '@react-native-documents/picker';
import Text from './text';
import {strings} from '../../contexts/app.context';
import CameraIcon from '../../../resources/assets/camera.svg';
import GaleryIcon from '../../../resources/assets/gallery.svg';
import FileIcon from '../../../resources/assets/file.svg';

export default function MediaPicker(props?: MediaPickerType) {
  const imagePickerOptions = {
    cropperCancelText: strings.cancel,
    cropperChooseText: strings.confirm,
    cropperCircleOverlay: props?.circularCrop,
    width: props?.cropWidth,
    height: props?.cropHeight,
    mediaType: props?.mediaType,
    multiple: props?.multiple,
    maxFiles: props?.maxFile,
    cropping: props?.disableCropping ? false : true,
    useFrontCamera: props?.useFrontCamera,
    compressImageQuality: props?.compressImageQuality,
    compressImageMaxHeight: props?.compressImageMaxHeight,
    compressImageMaxWidth: props?.compressImageMaxWidth,
    cropperActiveWidgetColor: appColors.primary100,
    cropperChooseColor: appColors.primary100,
    cropperCancelColor: appColors.primary100,
    // cropperStatusBarColor: appColors.screenBackground,
    cropperToolbarColor: appColors.screenBackground,
  };

  async function onChoose(actiontype = '') {
    try {
      let res: any = null;
      if (actiontype == 'opencamera') {
        res = await ImagePicker.openCamera(imagePickerOptions);
      }
      if (actiontype == 'opengalery') {
        res = await ImagePicker.openPicker(imagePickerOptions);
      }
      if (actiontype == 'openfile') {
        res = await pick({
          type: props?.fileType || types.allFiles,
          allowMultiSelection: props?.multiple == true,
        });
      }
      res = res && !props?.multiple && Array.isArray(res) ? res[0] : res;
      if (props?.onChoose) props.onChoose(res);
    } catch (e) {
      if (props?.onError) props.onError(e);
    }
    hideActionSheet();
  }

  return (
    <View style={styles.container}>
      <ChoiceItem
        onPress={onChoose.bind(onChoose, 'opencamera')}
        title="Caméra"
        description="Prenez directement votre document en photo"
        icon={CameraIcon}
      />
      <ChoiceItem
        onPress={onChoose.bind(onChoose, 'opengalery')}
        title="Galerie photo"
        style={styles.choiceMargin}
        description="Choisissez une photo de votre galerie photo."
        icon={GaleryIcon}
      />
      {props?.showFileOption && (
        <ChoiceItem
          onPress={onChoose.bind(onChoose, 'openfile')}
          title="Fichiers"
          style={styles.choiceMargin}
          description="Sélectionnez un fichier enregistré dans votre téléphone."
          icon={FileIcon}
        />
      )}
    </View>
  );
}

function ChoiceItem(props: any) {
  const Icon = props.icon;
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.choiceContainer, props.style]}>
      {props.icon && (
        <View style={styles.iconContainer}>
          <Icon width={Size(28)} height={Size(28)} />
        </View>
      )}
      <View style={styles.item}>
        <Text category="exergue" style={styles.text}>
          {props.title}
        </Text>
        <Text category="legend" style={styles.desc}>
          {props.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function showMediaPicker(props?: MediaPickerType) {
  return new Promise((resolve, reject) => {
    showActionSheet(
      () => <MediaPicker onError={(error: any) => reject(error)} onChoose={(res: any) => resolve(res)} {...props} />,
      {
        onClose: () => reject(new Error('action sheet close')),
      },
    );
  });
}
export interface MediaPickerType {
  mediaType?: 'photo' | 'video';
  disableCropping?: boolean;
  cropWidth?: number;
  cropHeight?: number;
  circularCrop?: boolean;
  multiple?: boolean;
  fileType?: string | string[];
  maxFile?: number;
  maxFileSize?: number;
  onChoose?: Function;
  onError?: Function;
  compressImageQuality?: number;
  compressImageMaxHeight?: number;
  compressImageMaxWidth?: number;
  useFrontCamera?: boolean;
  showFileOption?: boolean;
  showGalerieOption?: boolean;
  showCameraOptions?: boolean;
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-end',
    padding: Size(16),
    alignItems: 'center',
  },
  choiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  choiceMargin: {
    marginTop: Size(20),
  },
  text: {
    fontSize: Size(18),
  },
  desc: {
    fontSize: Size(16),
  },
  item: {flex: 1, marginStart: Size(18)},
  iconContainer: {
    backgroundColor: appColors.primary10,
    width: Size(40),
    height: Size(45),
    borderRadius: Size(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
