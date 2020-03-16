import { Config } from 'linode-js-sdk/lib/linodes';
import * as React from 'react';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Tabs from 'src/components/core/Tabs';
import TabList from 'src/components/core/TabList';
import TabPanels from 'src/components/core/TabPanels';
import TabPanel from 'src/components/core/TabPanel';
import Tab from 'src/components/core/Tab';
import TabLink from 'src/components/TabLink';
import VolumesLanding from 'src/features/Volumes/VolumesLanding';
import { withLinodeDetailContext } from './linodeDetailContext';

import DefaultLoader from 'src/components/DefaultLoader';

const LinodeSummary = DefaultLoader({
  loader: () => import('./LinodeSummary')
});

const LinodeSettings = DefaultLoader({
  loader: () => import('./LinodeSettings')
});

const LinodeResize = DefaultLoader({
  loader: () => import('./LinodeResize')
});

const LinodeRescue = DefaultLoader({
  loader: () => import('./LinodeRescue')
});

const LinodeRebuild = DefaultLoader({
  loader: () => import('./LinodeRebuild')
});

const LinodeNetworking = DefaultLoader({
  loader: () => import('./LinodeNetworking')
});

const LinodeActivity = DefaultLoader({
  loader: () => import('./LinodeActivity')
});

const LinodeAdvanced = DefaultLoader({
  loader: () => import('./LinodeAdvanced')
});

const LinodeBackup = DefaultLoader({
  loader: () => import('./LinodeBackup')
});

type CombinedProps = ContextProps &
  RouteComponentProps<{
    linodeId: string;
  }>;

const LinodesDetailNavigation: React.StatelessComponent<CombinedProps> = props => {
  const {
    match: { url },
    linodeLabel,
    linodeConfigs,
    linodeId,
    linodeRegion,
    readOnly
  } = props;

  const tabs = [
    /* NB: These must correspond to the routes inside the Switch */
    {
      routeName: `${url}/summary`,
      title: 'Summary'
    },
    {
      routeName: `${url}/volumes`,
      title: 'Volumes'
    },
    {
      routeName: `${url}/networking`,
      title: 'Networking'
    },
    {
      routeName: `${url}/resize`,
      title: 'Resize'
    },
    {
      routeName: `${url}/rescue`,
      title: 'Rescue'
    },
    {
      routeName: `${url}/rebuild`,
      title: 'Rebuild'
    },
    {
      routeName: `${url}/backup`,
      title: 'Backups'
    },
    {
      routeName: `${url}/activity`,
      title: 'Activity'
    },
    {
      routeName: `${url}/settings`,
      title: 'Settings'
    },
    {
      routeName: `${url}/advanced`,
      title: 'Disks/Configs'
    }
  ];

  return (
    <>
      <Tabs value={tabs.findIndex(tab => matches(tab.routeName))}>
        <TabList>
          {tabs.map(tab => (
            <Tab key={tab.title}>
              <TabLink to={tab.routeName} title={tab.title} />
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <LinodeSummary />
          </TabPanel>

          <TabPanel>
            <VolumesLanding
              linodeId={linodeId}
              linodeLabel={linodeLabel}
              linodeRegion={linodeRegion}
              linodeConfigs={linodeConfigs}
              readOnly={readOnly}
              fromLinodes
              removeBreadCrumb
            />
          </TabPanel>

          <TabPanel>
            <LinodeNetworking />
          </TabPanel>

          <TabPanel>
            <LinodeResize />
          </TabPanel>

          <TabPanel>
            <LinodeRescue />
          </TabPanel>

          <TabPanel>
            <LinodeRebuild />
          </TabPanel>

          <TabPanel>
            <LinodeBackup />
          </TabPanel>
          <TabPanel>
            <LinodeActivity />
          </TabPanel>
          <TabPanel>
            <LinodeSettings />
          </TabPanel>

          <TabPanel>
            <LinodeAdvanced />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

const matches = (p: string) => {
  return Boolean(matchPath(p, { path: location.pathname }));
};

interface ContextProps {
  linodeId: number;
  linodeConfigs: Config[];
  linodeLabel: string;
  linodeRegion: string;
  readOnly: boolean;
}

const enhanced = compose<CombinedProps, {}>(
  withRouter,
  withLinodeDetailContext<ContextProps>(({ linode }) => ({
    linodeId: linode.id,
    linodeConfigs: linode._configs,
    linodeLabel: linode.label,
    linodeRegion: linode.region,
    readOnly: linode._permissions === 'read_only'
  }))
);

export default enhanced(LinodesDetailNavigation);
