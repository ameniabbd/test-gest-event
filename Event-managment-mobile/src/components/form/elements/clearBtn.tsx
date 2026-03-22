import {TouchableOpacity} from 'react-native';
import React from 'react';
import CloseIcon from '../../../../resources/assets/close.svg';
import {Size} from '../../../utils/size';

const ClearBtn = (props: any) => {
  return (
    <TouchableOpacity onPress={props.onClear} activeOpacity={1}>
      <CloseIcon width={props.width || Size(24)} height={props.height || Size(24)} />
    </TouchableOpacity>
  );
};

export default ClearBtn;
