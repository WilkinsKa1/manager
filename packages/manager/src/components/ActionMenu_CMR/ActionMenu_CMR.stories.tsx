import { storiesOf } from '@storybook/react';
import * as React from 'react';
import ActionMenu, { Action } from './ActionMenu_CMR';

interface Props {
  style?: any;
}

type CombinedProps = Props;

class StoryActionMenu extends React.Component<CombinedProps> {
  createActions = () => (): Action[] => {
    return [
      {
        title: 'Reboot',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Power Off',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Launch Console',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Clone',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Migrate',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Resize',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'View Backups',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Settings',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Delete',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      }
    ];
  };

  render() {
    return (
      <ActionMenu createActions={this.createActions()} ariaLabel="label" />
    );
  }
}

class StoryActionMenuWithTooltip extends React.Component<CombinedProps> {
  createActions = () => (): Action[] => {
    return [
      {
        title: 'First Action',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Another Action',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      },
      {
        title: 'Disabled Action',
        disabled: true,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        },
        tooltip: 'An explanation as to why this item is disabled'
      }
    ];
  };

  render() {
    return (
      <ActionMenu createActions={this.createActions()} ariaLabel="label" />
    );
  }
}

class StoryActionMenuWithInlineLabel extends React.Component<CombinedProps> {
  createActions = () => (): Action[] => {
    return [
      {
        title: 'Single Action',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
        }
      }
    ];
  };
  render() {
    return (
      <ActionMenu
        createActions={this.createActions()}
        ariaLabel="label"
        inlineLabel="More Actions"
      />
    );
  }
}

storiesOf('CMR Action Menu', module)
  .add('Action Menu', () => (
    <div style={{ textAlign: 'center' }}>
      <StoryActionMenu />
    </div>
  ))
  .add('Action Menu with disabled menu item & tooltip', () => (
    <div style={{ textAlign: 'center' }}>
      <StoryActionMenuWithTooltip />
    </div>
  ))
  .add('Action Menu with inline label', () => (
    <div style={{ textAlign: 'center' }}>
      <StoryActionMenuWithInlineLabel />
    </div>
  ));
