// @flow
import React, { Component } from 'react';
import { Segment, Form, Button, Divider, Icon } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';

class Isbn extends Component {
  render() {
    console.log(this.props);
    return (
      <Form.Field name="isbn" control="input" {...this.props.input} placeholder="Isbn" />
    );
  }
}

class IsbnForm extends Component {
  render() {
    console.log(this.props);
    return (
      <Form size="huge" onSubmit={this.props.handleSubmit}>
        <Field name="isbn" component={Isbn} type="text" />
        <Segment basic textAlign="center">
          <Button size="huge" positive type="submit">
            <Icon name="search" />
            Search!
          </Button>
        </Segment>
        <Divider />
      </Form>
    );
  }
}

const SearchForm = reduxForm({
  form: 'search',
  destroyOnUnmount: false,
})(IsbnForm);

export default SearchForm;
