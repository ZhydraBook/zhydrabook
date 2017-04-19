// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'semantic-ui-react';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item as={Link} to="/" name="Home" active={this.props.location.pathname === '/'} />
          <Menu.Item as={Link} to="/search" name="plus" active={this.props.location.pathname === '/search'}>
            <Icon name="plus" color="violet" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item as={Link} to="/search" name="Search" active={this.props.location.pathname === '/search'}>
              <Icon name="wrench" />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        {this.props.children}
      </div>
    );
  }
}
