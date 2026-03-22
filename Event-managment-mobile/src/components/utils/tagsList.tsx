import React, {useState, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Size} from '../../utils/size';
const TagsList = (props: {
  items: any[];
  numberOfLines?: number;
  columGap?: number;
  rowGap?: number;
  renderItem: (item: any, index?: number) => React.JSX.Element;
  renderHiddenItem?: (hiddenCount?: number) => React.JSX.Element;
}) => {
  const [lineHeight, setLineHeight] = useState(0);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const itemWidths = useRef(new Map()).current;
  const items = props.items;
  // useEffect(() => {
  //   setWrapperWidth(0); // Reset to trigger re-measurement
  //   setLineHeight(0);
  //   itemWidths.clear(); // Clear previous widths
  // }, [items.length]);
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const calculateVisibleItems = () => {
    if (!wrapperWidth || !lineHeight) return items.length;
    if (!props.numberOfLines) return items.length;
    let currentWidth = 0;
    let currentLines = 0;
    let visibleCount = 0;
    const marg = props.columGap || 0;
    const hiddenCountWidth = itemWidths.get('hidden') + Size(10) || 50;
    for (let i = 0; i < items.length; i++) {
      const itemWidth = itemWidths.get(i) || 100;
      const isLastPossibleItem = i === items.length - 1 || currentLines === props?.numberOfLines - 1;
      const widthToCheck =
        isLastPossibleItem && items.length > visibleCount + 1
          ? currentWidth + itemWidth + hiddenCountWidth + marg
          : currentWidth + itemWidth + marg;

      if (widthToCheck > wrapperWidth) {
        if (currentLines === props?.numberOfLines - 1 && currentWidth + hiddenCountWidth + marg <= wrapperWidth) {
          break;
        }
        currentWidth = itemWidth;
        currentLines++;
      } else {
        currentWidth += itemWidth + (props.columGap || 0);
      }
      if (currentLines >= props?.numberOfLines) {
        break;
      }
      visibleCount++;
    }
    return Math.max(0, visibleCount);
  };

  const visibleCount = calculateVisibleItems();
  const visibleItems = items.slice(0, visibleCount);
  const hiddenItemsCount = Math.max(0, items.length - visibleCount);

  const onWrapperLayout = (e: any) => {
    const {width} = e.nativeEvent.layout;
    if (width && !wrapperWidth) {
      setWrapperWidth(width);
    }
  };

  const onItemLayout = (index: number) => (e: any) => {
    const {height, width} = e.nativeEvent.layout;
    if (!lineHeight) {
      setLineHeight(height);
    }
    itemWidths.set(index, width);
  };

  const onHiddenCountLayout = (e: any) => {
    const {width} = e.nativeEvent.layout;
    itemWidths.set('hidden', width);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.itemsWrapper,
          columnGap: props.columGap,
          rowGap: props.rowGap,
        }}
        onLayout={onWrapperLayout}>
        {visibleItems.map((item, index) => (
          <View key={index} onLayout={onItemLayout(index)}>
            {props.renderItem && props.renderItem(item)}
          </View>
        ))}
        {hiddenItemsCount > 0 && props.renderHiddenItem && (
          <View onLayout={onHiddenCountLayout}>{props.renderHiddenItem(hiddenItemsCount)}</View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  itemsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  itemContainer: {
    paddingVertical: Size(6),
    paddingHorizontal: Size(10),
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hiddenItem: {
    height: 0,
    overflow: 'hidden',

    display: 'none',
    margin: 0,
    padding: 0,
  },
  itemText: {
    fontSize: Size(14),
    color: '#333333',
    fontWeight: '500',
  },
  hiddenCountText: {
    fontSize: Size(14),
    color: '#666666',
    fontWeight: '600',
  },
});

export default TagsList;
