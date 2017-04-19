// @flow
import React, { Component } from 'react';
import { Card, Button, Image } from 'semantic-ui-react';

const descriptionCut = descr => {
  if (!descr) {
    return '';
  }
  const cutted = descr.split(' ').slice(0, 50).join(' ');
  return `${cutted}...`;
};

export default class Book extends Component {
  render() {
    const description = descriptionCut(this.props.description)
    return (
      <Card>
        <Image src={this.props.cover} />
        <Card.Content>
          <Card.Header>{this.props.title}</Card.Header>
          <Card.Meta>{this.props.author}</Card.Meta>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button positive fluid onClick={() => this.props.handleClick()}>Download</Button>
        </Card.Content>
      </Card>
    );
  }
}
