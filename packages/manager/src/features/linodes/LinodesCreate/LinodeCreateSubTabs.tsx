import { APIError } from 'linode-js-sdk/lib/types';
import { parse } from 'querystring';
import * as React from 'react';
import Paper from 'src/components/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import TabbedPanel from 'src/components/TabbedPanel';

import Grid from 'src/components/Grid';
import Notice from 'src/components/Notice';
import { CreateTypes } from 'src/store/linodeCreate/linodeCreate.actions';
import { getErrorMap } from 'src/utilities/errorUtils';

type ClassNames = 'root' | 'inner';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.color.white
    },
    inner: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 ${theme.spacing(
        2
      )}px`,
      [theme.breakpoints.up('sm')]: {
        padding: `${theme.spacing(3)}px ${theme.spacing(3)}px 0 ${theme.spacing(
          3
        )}px`
      }
    }
  });

export interface Tab {
  title: string;
  render: () => JSX.Element;
  type?: string;
}

interface Props {
  errors?: APIError[];
  history: any;
  reset: () => void;
  tabs: Tab[];
  handleClick: (value: CreateTypes) => void;
  name: string;
}

interface State {
  selectedTab: number;
}

type CombinedProps = Props & WithStyles<ClassNames>;

export const determinePreselectedTab = (tabsToRender: Tab[]): number => {
  /** get the query params as an object, excluding the "?" */
  const queryParams = parse(location.search.replace('?', ''));

  /** will be -1 if the query param is not found */
  const preSelectedTab = tabsToRender.findIndex((eachTab, index) => {
    return eachTab.title === queryParams.subtype;
  });

  return preSelectedTab !== -1 ? preSelectedTab : 0;
};

const errorMap = [
  'backup_id',
  'linode_id',
  'stackscript_id',
  'region',
  'type',
  'root_pass',
  'label',
  'image'
];

class LinodeCreateSubTabs extends React.Component<CombinedProps, State> {
  constructor(props: CombinedProps) {
    super(props);

    this.state = {
      selectedTab: determinePreselectedTab(props.tabs)
    };
  }

  handleTabChange = (
    event: React.ChangeEvent<HTMLDivElement>,
    value: number
  ) => {
    /** Reset the top-level creation flow state */
    this.props.reset();
    /** get the query params as an object, excluding the "?" */
    const queryParams = parse(location.search.replace('?', ''));

    /** set the type in redux state */
    // this.props.handleClick(this.props.tabs[value].type);

    this.props.history.push({
      search: `?type=${queryParams.type}&subtype=${event.target.textContent}`
    });
    this.setState({
      selectedTab: value
    });
  };

  render() {
    const { tabs, classes, errors } = this.props;
    // const { selectedTab: selectedTabFromState } = this.state;

    // const queryParams = parse(location.search.replace('?', ''));

    /**
     * doing this check here to reset the sub-tab if the
     * query string doesn't exist to solve the issue where the user
     * clicks on tab 2, subtab 3 - THEN clicks on tab 1 which only has 2 subtabs.
     *
     * In this case, tab 1 has only 2 subtabs so, we need to reset the selected sub-tab
     * or else we get an error
     */
    // const selectedTab = !queryParams.subtype ? 0 : selectedTabFromState;

    // const selectedTabContentRender = safeGetTabRender(tabs, selectedTab);
    const generalError = getErrorMap(errorMap, errors).none;

    return (
      <React.Fragment>
        <Grid item>
          {generalError && <Notice error spacingTop={8} text={generalError} />}
          <Paper className={`${classes.root}`}>
            <div className={`${classes.inner}`}>
              <TabbedPanel header="Create From:" tabs={tabs} />
            </div>
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(LinodeCreateSubTabs);
