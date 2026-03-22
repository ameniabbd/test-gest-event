/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {TextInput} from '..';
import axios from 'axios';
import {TextInputProps} from './text.input';
import {useController, useFormContext} from 'react-hook-form';
import {ActivityIndicator} from 'react-native';
import appColors from '../../../colors';
import Config from 'react-native-config';
import {debounce} from 'lodash';

interface PlacesInputProps extends TextInputProps {
  language?: string;
  default?: any;
  countries?: string[];
  onData?: Function;
  onChooseAddress?: Function;
  hideLoading?: boolean;
  showlocationBtn?: boolean;
}
const PlacesInput = PlacesInputController((props: PlacesInputProps) => {
  const APIKEY = Config.GOOGLE_API_KEY;
  const [val, setval] = useState('');
  const [loading, setloading] = useState(false);
  const [places, setPlaces] = useState([]);
  const countrieslist = props.countries?.map(elt => 'country:' + elt).join('|') || 'country:fr';
  const error = props.controller?.fieldState?.invalid;
  const errorMSg = props.controller?.fieldState?.error?.message;
  const disabled = props.disabled || props?.controller?.field?.disabled;
  useEffect(() => {
    if (props.default) setval(props?.default?.address || '');
  }, [props.default]);
  const getAdresses = useCallback(
    debounce(async (value: any) => {
      setloading(true);
      try {
        const {data} = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${APIKEY}&input=${value}&language=${
            props.language || 'fr'
          }&components=${countrieslist}`,
        );
        const addresses = data?.predictions;
        setPlaces(
          addresses.map((i: any) => {
            return {label: i.description, value: i.place_id};
          }),
        );
        if (props.onData) props.onData(addresses);
      } catch (e) {
        if (props.onData) props.onData([]);
      }
      setloading(false);
    }, 500),
    [],
  );

  function onChange(value: any) {
    setval(value);
    getAdresses(value);
    if (props.onChange) props.onChange(value);
    props.controller?.field?.onChange(value);
  }

  async function onSelectItem(item: any) {
    try {
      const placeId = item.value;
      const {data} = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${APIKEY}`,
      );
      const place = data.result;
      const adress = {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        street: place.address_components.find((elt: any) => elt.types.indexOf('route') != -1)?.long_name,
        street_number: place.address_components.find((elt: any) => elt.types.indexOf('street_number') != -1)?.long_name,
        country: place.address_components.find((elt: any) => elt.types.indexOf('country') != -1)?.short_name,
        postal_code: place.address_components.find((elt: any) => elt.types.indexOf('postal_code') != -1)?.short_name,
        administrative_area_level_1: place.address_components.find(
          (elt: any) => elt.types.indexOf('administrative_area_level_1') != -1,
        )?.long_name,
        administrative_area_level_2: place.address_components.find(
          (elt: any) => elt.types.indexOf('administrative_area_level_2') != -1,
        )?.long_name,
        formatted_address: place.formatted_address,
        city: place.address_components.find(
          (elt: any) => elt.types.includes('locality') || elt.types.includes('sublocality'),
        )?.long_name,
        state: place.address_components.find((elt: any) => elt.types.includes('administrative_area_level_1')),
      };
      props.controller?.field?.onChange(adress);
      props.controller?.field?.onBlur();
      if (props.onChooseAddress) {
        props.onChooseAddress(adress);
      }
    } catch (e) {
      /* empty */
    }
  }

  return (
    <>
      <TextInput
        onBlur={props.controller?.field?.onBlur}
        {...props}
        onSelectItem={onSelectItem}
        dataList={places}
        default={val}
        error={error ? errorMSg : ''}
        onChange={onChange}
        renderEnd={loading && !props.hideLoading ? () => <ActivityIndicator color={appColors.primary100} /> : undefined}
        controller={undefined}
        name={undefined}
        disabled={disabled}
      />
      {/* {props.showlocationBtn && (
        <Button
          onPress={getAddressFromPosition}
          style={{marginStart: Size(-20)}}
          textStyle={{marginStart: Size(-45)}}
          renderStart={() => <PositionIcon height={Size(24)} width={Size(24)} />}
          category="tertiary"
          title="Utiliser ma position actuelle"
          // eslint-disable-next-line prettier/prettier
      />)} */}
    </>
  );
});
function PlacesInputController(Input: any) {
  return function (props: PlacesInputProps) {
    return InputControl(Input, props);
  };
}
function InputControl(Input: any, p: PlacesInputProps) {
  const formContext = useFormContext();
  let controller: any;
  if (p.name && formContext)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    controller = useController({
      name: p.name,
      rules: {
        validate: (val: any) => {
          if (p.required) {
            return !isNaN(val?.latitude) ? true : p.required;
          }
          if (p.validate) return p.validate(val);
          return !val || !isNaN(val?.latitude) ? true : 'Adresse invalide';
        },
      },
      defaultValue: p?.default,
    });
  return <Input {...p} controller={controller} />;
}
export default PlacesInput;
