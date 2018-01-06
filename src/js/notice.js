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
  closeButton: true,
  autoClose: true,
  closeTime: 10
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
  element.setAttribute('class', 'heading');
  element.textContent = title;
  if (options.closeButton === true) {
    let close = document.createElement('div');
    close.setAttribute('class', 'close');
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
  element.setAttribute('class', 'body');
  element.innerHTML = content;
  return element;
};

/**
* Append NoticeJs item
*/
const appendNoticeJs = (header, body, options) => {
  let target_class = '.noticejs-' + options.position;
  // Create NoticeJs item
  let noticeJsItem = document.createElement('div');
  noticeJsItem.classList.add('item');
  noticeJsItem.classList.add(options.type);
  if(header) {
    noticeJsItem.appendChild(header);
  }
  noticeJsItem.appendChild(body);
  // Empty top and bottom container
  if(['top','bottom'].includes(options.position)){
    document.querySelector(target_class).innerHTML = '';
  }
  document.querySelector(target_class).appendChild(noticeJsItem);

  // Close event click
  let noticeItems =  document.querySelectorAll('.noticejs .item .close');
  Array.from(noticeItems).forEach(item => {
    if(typeof item !== 'undefined' && item !== null) {
      item.addEventListener('click', function(event){
        let parent = event.target.closest('div.noticejs');
        // Remove the notice item
        event.target.closest('div.item').remove();
        // Remove the notice container if it does not have any item
        if(parent !== null){
          if(parent.getElementsByClassName('item').length === 0){
            parent.remove();
          }
        }
      });
    }
  });
};

const init = (data, settings) => {
  options = Object.assign(options, settings);

  // Create Noticejs container
  createContainer(options.position);

  // Create NoticeJs header
  if (data.title !== 'undefined' && data.title !== '') {
    noticeJsHeader = createHeader(data.title, options);
  }

  // Create NoticeJs body
  let content = (typeof data === 'object') ? data.content : data;
  noticeJsBody = createBody(content);

  //Append NoticeJs
  appendNoticeJs(noticeJsHeader, noticeJsBody, options);
};



module.exports = {
  init
};
