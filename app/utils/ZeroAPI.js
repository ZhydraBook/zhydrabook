import ZeroFrame from 'zeroframe';

export default class ZeroAPI extends ZeroFrame {
  function getBooks() {
    var books;
    this.cmd("DbQuery", ["SELECT b.isbn,b.title, b.subtitle, b.lang, b.publisher, b.magnet, b.year, a.name, a.surname,e.name, e.surname FROM  books b, authors a, editors e, book_authors ba,book_editors be WHERE b.isbn = ba.bookID AND ba.authorID = a.id AND b.isbn = be.bookID AND be.editorID = e.id "], (query) => {
      books = query;
    });
    return books;
  };
}
