// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { visibilityFilter, books, downloads, query } from './book';

const rootReducer = combineReducers({
  query,
  books,
  visibilityFilter,
  downloads,
  routing,
  form: formReducer,
});

export default rootReducer;
