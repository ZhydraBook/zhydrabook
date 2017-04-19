// @flow
import React, { Component } from 'react';
import { Segment, Card } from 'semantic-ui-react';
import Book from './Book';
import SearchForm from './Form';


export default class BookList extends Component {
  render() {
    return (
      <Segment>
        <SearchForm onSubmit={this.props.handleUpdate} />
        {
          (this.props.books.length > 0 && this.props.query.isbn) ?
            <Card.Group style={{ justifyContent: 'center' }}>
              {this.props.books.map(book =>
                <Book
                  key={book.isbn}
                  {...book}
                  handleClick={() => this.props.onBookClick(book)}
                />
              )}
            </Card.Group> :
            (!this.props.query.isbn) ?
              <p> Prova a cercare un isbn </p> :
              <p> Nessun isbn trovato </p>
        }
      </Segment>
    );
  }
}
