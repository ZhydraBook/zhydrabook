// @flow
import React, { Component } from 'react';
import { Segment, Item } from 'semantic-ui-react';
import WebTorrent from 'webtorrent/webtorrent.min';
import Download from './Download';

const client = new WebTorrent();

export default class DownloadList extends Component {
  render() {
    return (
      <Segment basic>
        <Item.Group divided>
          {this.props.downloads.map(download =>
            <Download
              onDownload={this.props.update}
              onUpload={this.props.update}
              key={download.isbn}
              {...download}
              client={client}
            />
          )}
        </Item.Group>
      </Segment>
    );
  }
}
