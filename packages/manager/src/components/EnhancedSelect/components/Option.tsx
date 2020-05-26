import * as React from 'react';
import { components, OptionProps } from 'react-select';
import MenuItem from 'src/components/core/MenuItem';
import { makeStyles, Theme } from 'src/components/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: { padding: 0 },
  menuItem: {
    padding: '0 !important',
    '&:hover': {
      backgroundColor: 'transparent !important'
    },
    '& $focused': {
      backgroundColor: 'transparent !important'
    }
  }
}));

interface Props extends OptionProps<any> {
  value: number | string;
  attrs?: Record<string, string | boolean>;
}

const Option: React.StatelessComponent<Props> = props => {
  const classes = useStyles();
  return (
    <MenuItem
      data-qa-option={String(props.value)}
      key={props.value}
      {...props.attrs}
      value={props.value}
      role="option"
      className={classes.menuItem}
      dense
      disableGutters
      {...props}
    >
      <components.Option {...props} />
    </MenuItem>
  );
};

export default Option;
