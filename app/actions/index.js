export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_IN_DOWNLOAD: 'SHOW_IN_DOWNLOAD',
  SHOW_DOWNLODABLE: 'SHOW_DOWNLODABLE'
};

export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter };
}

export const ADD_DOWNLOAD = 'ADD_DOWNLOAD';

export function addDownload(book) {
  return { type: ADD_DOWNLOAD, book };
}

export const QUERY_UPDATE = 'UPDATE_QUERY';

export function updateQuery(query) {
  return { type: QUERY_UPDATE, query };
}

export const QUERY_RESET = 'QUERY_RESET';

export function resetQuery() {
  return { type: QUERY_RESET };
}

export const UPDATE_DOWNLOAD = 'UPDATE_DOWNLOAD';

export function updateDownload(update) {
  return { type: UPDATE_DOWNLOAD, update };
}
