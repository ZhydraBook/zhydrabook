import books from '../sample/libri';
const CMD_INNER_READY = 'innerReady';
const CMD_RESPONSE = 'response';
const CMD_WRAPPER_READY = 'wrapperReady';
const CMD_PING = 'ping';
const CMD_PONG = 'pong';
const CMD_WRAPPER_OPENED_WEBSOCKET = 'wrapperOpenedWebsocket';
const CMD_WRAPPER_CLOSE_WEBSOCKET = 'wrapperClosedWebsocket';

export default class ZeroFrame {
  constructor(url) {
    this.url = url;
    this.waiting_cb = {};
    this.wrapper_nonce = document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1");
    this.connect();
    this.next_message_id = 1;
    this.init();
  }

  init() {
    return this;
  }

  connect() {
    this.target = window.parent;
    window.addEventListener('message', e => this.onMessage(e), false);
    this.cmd(CMD_INNER_READY);
  }

  onMessage(e) {
    const message = e.data;
    const cmd = message.cmd;
    if (cmd === CMD_RESPONSE) {
      if (this.waiting_cb[message.to] !== undefined) {
        this.waiting_cb[message.to](message.result);
      } else {
        this.log('Websocket callback not found:', message);
      }
    } else if (cmd === CMD_WRAPPER_READY) {
      this.cmd(CMD_INNER_READY);
    } else if (cmd === CMD_PING) {
      this.response(message.id, CMD_PONG);
    } else if (cmd === CMD_WRAPPER_OPENED_WEBSOCKET) {
      this.onOpenWebsocket();
    } else if (cmd === CMD_WRAPPER_CLOSE_WEBSOCKET) {
      this.onCloseWebsocket();
    } else {
      this.onRequest(cmd, message);
    }
  }

  onRequest(cmd, message) {
    this.log('Unknown request', message);
  }

  response(to, result) {
    this.send({
      cmd: CMD_RESPONSE,
      to,
      result
    });
  }

  cmd(cmd, params = {}, cb = null) {
    this.send({
      cmd,
      params
    }, cb);
  }

  send(message, cb = null) {
    const msg = {
      ...message,
      wrapper_nonce: this.wrapper_nonce,
      id: this.next_message_id
    };
    this.next_message_id += 1;
    this.target.postMessage(msg, '*');
    if (cb) {
      this.waiting_cb[message.id] = cb;
    }
  }

  log = (...args) => console.log(['[ZeroFrame]'].concat(args));

  onOpenWebsocket() {
    this.log('Websocket open');
  }

  onCloseWebsocket() {
    this.log('Websocket close');
  }

  getBooks() {
    return books;
    // return this.cmd('DbQuery', ['SELECT b.isbn,b.title, b.subtitle, b.lang, b.publisher, b.magnet, b.year, a.name, a.surname,e.name, e.surname FROM  books b, authors a, editors e, book_authors ba,book_editors be WHERE b.isbn = ba.bookID AND ba.authorID = a.id AND b.isbn = be.bookID AND be.editorID = e.id '], (query) => {
    //   return query;
    // });
  }
}
