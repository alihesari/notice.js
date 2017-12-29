import styles from './../sass/noticejs.scss';

/**
 * Private variable
 */
let noticeJsHeader = "";
let noticeJsBody = "";

/**
 * Default options
 */
let options = {
  type: 'success',
  position: 'topRight',
  close: true,
  autoClose: true
};

/**
 * Create NoticeJs container
 */
const createContainer = (position) => {
  let element_class = 'noticejs-' + position;
  // Create element
  let element = document.createElement('div');
  element.classList.add('noticejs');
  element.classList.add(element_class);
  if (document.querySelector('.' + element_class) === null) {
    document.body.appendChild(element);
  }
};

/**
 * Create NoticeJs header
 */
const createHeader = (title, options) => {
  let element = document.createElement('div');
  element.setAttribute('class', 'noticejs-header');
  element.textContent = title;
  if (options.close === true) {
    let close = document.createElement('div');
    close.setAttribute('class', 'noticejs-close');
    close.innerHTML = '&times;';
    element.appendChild(close);
  }
  return element;
};

/**
 * Create NoticeJs body
 */
const createBody = (content) => {
  let element = document.createElement('div');
  element.setAttribute('class', 'noticejs-body');
  element.textContent = content;
  return element;
};

/**
* Append NoticeJs item
*/
const appendNoticeJs = (header, body, position) => {
  let target_class = '.noticejs-' + position;
  // Create NoticeJs item
  let noticeJsItem = document.createElement('div');
  noticeJsItem.setAttribute('class','noticejs-item');
  noticeJsItem.appendChild(header);
  noticeJsItem.appendChild(body);
  document.querySelector(target_class).appendChild(noticeJsItem);
};

const init = (data, settings) => {
  options = Object.assign(options, settings);

  // Create Noticejs container
  createContainer(options.position);

  // Create NoticeJs header
  if (data.title !== 'undefined') {
    noticeJsHeader = createHeader(data.title, options);
  }

  // Create NoticeJs body
  let content = (typeof data === 'object') ? data.content : data;
  noticeJsBody = createBody(content);

  //Append NoticeJs
  appendNoticeJs(noticeJsHeader, noticeJsBody, options.position);
};

module.exports = {
  init
};
