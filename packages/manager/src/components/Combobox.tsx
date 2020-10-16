import React from 'react';
import { useCombobox } from 'downshift';
import { makeStyles, Theme } from 'src/components/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  IconButton,
  Input,
  FormLabel,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  }
}));

interface Props {
  label: string;
  placeholder?: string;
  items: any[];
}

export const Combobox: React.FC<Props> = props => {
  const { label, placeholder, items } = props;
  const classes = useStyles();

  const itemToString = (item: any) => (item ? item.primary : '');

  const [inputItems, setInputItems] = React.useState(items);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    getInputProps,
    getComboboxProps
  } = useCombobox({
    items: inputItems,
    itemToString,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items?.filter((item: any) =>
          itemToString(item)
            .toLowerCase()
            .startsWith(inputValue?.toLowerCase())
        )
      );
    }
  });
  return (
    <div>
      <FormLabel {...getLabelProps()}>{label}</FormLabel>
      <div {...getComboboxProps()}>
        <Input
          placeholder={placeholder}
          {...getInputProps({ refKey: 'inputRef' })}
        />
        <IconButton {...getToggleButtonProps()}>
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <List className={classes.root} {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item: any, index: number) => {
            return (
              <ListItem
                key={`${item}-${index}`}
                {...getItemProps({
                  item,
                  index
                })}
              >
                <ListItemText>{item}</ListItemText>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

export default Combobox;
