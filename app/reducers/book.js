
import { VisibilityFilters, SET_VISIBILITY_FILTER, ADD_DOWNLOAD, QUERY_UPDATE, QUERY_RESET, UPDATE_DOWNLOAD } from '../actions';
import ZeroAPI from '../utils/ZeroAPI';

var zhydra = new ZeroAPI();
var sampleBooks = zhydra.getBooks();


const { SHOW_ALL } = VisibilityFilters;

export function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

export function books(state = sampleBooks, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const defaultQuery = {
  isbn: '',
  queried: false,
  isLoading: false,
};

export function query(state = defaultQuery, action) {
  switch (action.type) {
    case QUERY_UPDATE:
      return {
        ...defaultQuery,
        ...action.query
      };

    case QUERY_RESET:
      return defaultQuery;
    default:
      return state;
  }
}

export function updateDownload(state = {}, action) {
  switch (action.type) {
    case UPDATE_DOWNLOAD:
      if (action.update.isbn !== state.isbn) {
        return state;
      }

      return Object.assign({}, state, {
        ...action.update
      });
    default:
      return state;
  }
}

export function downloads(state = [], action) {
  switch (action.type) {
    case ADD_DOWNLOAD:
      return [
        ...state,
        {
          ...action.book,
          downloaded: 0,
          downloadSpeed: 0,
          progress: 0,
          timeRemaining: 0,
          uploaded: 0,
          uploadSpeed: 0,
        }
      ];
    case UPDATE_DOWNLOAD:
      return state.map(d =>
        updateDownload(d, action)
      );
    default:
      return state;
  }
}
