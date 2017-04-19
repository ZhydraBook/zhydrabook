// @flow
import React, { Component } from 'react';
import { Progress, Segment, Button, Item, Icon, Statistic } from 'semantic-ui-react';

export default class Home extends Component {
  componentDidMount() {
    const { client } = this.props;

    const torrentId = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4';

    client.add(torrentId);

    const torrent = client.get(torrentId);
    console.log(torrent);

    torrent.on('download', () =>
      this.props.onDownload({
        downloaded: torrent.downloaded,
        downloadSpeed: torrent.downloadSpeed,
        progress: torrent.progress * 100,
        timeRemaining: torrent.timeRemaining,
        numPeers: torrent.numPeers,
        uploaded: torrent.uploaded,
        uploadSpeed: torrent.uploadSpeed,
        isbn: this.props.isbn,
      })
    );
    torrent.on('upload', () =>
      this.props.onUpload({
        downloaded: torrent.downloaded,
        downloadSpeed: torrent.downloadSpeed,
        progress: torrent.progress * 100,
        timeRemaining: torrent.timeRemaining,
        numPeers: torrent.numPeers,
        uploaded: torrent.uploaded,
        uploadSpeed: torrent.uploadSpeed,
        isbn: this.props.isbn,
      })
    );
  }

  render() {
    return (
      <Item>
        <Item.Image src={this.props.cover} />
        <Item.Content>
          <Item.Header>{this.props.title}</Item.Header>
          <Item.Meta>
            <span>{this.props.author} - {this.props.publication.year}</span>
          </Item.Meta>
          <Item.Description>
            <Progress percent={this.props.progress} color="olive" progress="percent" size="small" />
            <Statistic.Group size="mini">
              <Statistic>
                <Statistic.Value>
                  <Icon name="user" />
                  {this.props.numPeers}
                </Statistic.Value>
                <Statistic.Label>Peers</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  <Icon name="download" />
                  {this.props.downloadSpeed}
                </Statistic.Value>
                <Statistic.Label>Download</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  <Icon name="upload" />
                  {this.props.uploadSpeed}
                </Statistic.Value>
                <Statistic.Label>Upload</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Item.Description>
          <Item.Extra>
            <Button content="Pause" icon="pause" labelPosition="left" />
            <Button negative content="Delete" icon="delete" labelPosition="left" />
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}
