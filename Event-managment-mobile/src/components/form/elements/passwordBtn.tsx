import React from 'react';
import {TouchableOpacity} from 'react-native';
import EyeIcon from '../../../../resources/assets/eye.svg';
import EyeInactiveIcon from '../../../../resources/assets/eye-off.svg';
import {Size} from '../../../utils/size';
export function PasswordBtn(props: any) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      {props.show ? (
        <EyeInactiveIcon height={Size(24)} width={Size(24)} />
      ) : (
        <EyeIcon height={Size(24)} width={Size(24)} />
      )}
    </TouchableOpacity>
  );
}
