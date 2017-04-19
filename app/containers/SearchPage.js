// @flow
import { connect } from 'react-redux';
import BookList from '../components/BookList';
import { addDownload, updateQuery, resetQuery } from '../actions';

const getDownloadableBook = (books, filter, query) => {
  const parsedBooks = Object.keys(books).map(isbn => books[isbn]);

  let fewBook = [];
  if (query.isbn) {
    fewBook = parsedBooks.filter(q => q.isbn === query.isbn);
  }

  switch (filter) {
    case 'SHOW_ALL':
      return fewBook;
    case 'SHOW_IN_DOWNLOAD':
      return fewBook.filter(t => t.completed);
    case 'SHOW_DOWNLODABLE':

      return fewBook.filter(t => !t.completed);
    default:
      return fewBook;
  }
};

const mapStateToProps = (state) => ({
  books: getDownloadableBook(state.books, state.visibilityFilter, state.query),
  query: state.query,
});

const mapDispatchToProps = (dispatch) => ({
  onBookClick: (book) => {
    dispatch(addDownload(book));
  },
  handleUpdate: (values) => {
    console.log(values);
    dispatch(updateQuery(values));
  },
  handleReset: () => {
    dispatch(resetQuery());
  }
});

const VisibleBookList = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookList);

export default VisibleBookList;
