import styles from './../sass/noticejs.scss';

/**
 * Private variable
 */
let noticeJsHeader = '';
let noticeJsBody = '';
let noticeJsProgressBar = '';
let noticeJsModalClassName = 'noticejs-modal';

/**
 * Default options
 */
let options = {
  title: '',
  text: '',
  type: 'success',
  position: 'topRight',
  timeout: 30,
  progressBar: true,
  closeWith: ['button'],
  animation: null,
  modal: false
}

/**
 * Create NoticeJs container
 */
const createContainer = () => {
  let element_class = 'noticejs-' + options.position;
  // Create element
  let element = document.createElement('div');
  element.classList.add('noticejs');
  element.classList.add(element_class);
  if (document.querySelector('.' + element_class) === null) {
    document.body.appendChild(element);
  }
}

/**
 * Create NoticeJs header
 */
const createHeader = (title) => {
  let element = document.createElement('div');
  element.setAttribute('class', 'heading');
  element.textContent = title;

  // Add close button
  if (options.closeWith.includes('button')) {
    let close = document.createElement('div');
    close.setAttribute('class', 'close');
    close.innerHTML = '&times;';
    element.appendChild(close);
  }

  return element;
}

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
 * Create NoticeJs progress bar
 */
const createProgressBar = () => {
  let element = document.createElement('div');
  element.setAttribute('class','progressbar');
  let bar = document.createElement('div');
  bar.setAttribute('class','bar');
  element.appendChild(bar);
  
  // Progress bar animation
  if(options.progressBar === true && typeof options.timeout !== 'boolean' && options.timeout !== false) {
    var width = 100;
    var id = setInterval(frame, options.timeout);
    function frame() {
      if (width <= 0) {
        clearInterval(id);
        
        let item = element.closest('div.item');
        // Add close animation
        if(options.animation !== null && options.animation.close !== null) {

          // Remove open animation class
          item.className = item.className.replace(new RegExp('(?:^|\\s)'+ options.animation.open + '(?:\\s|$)'), ' ');
          // Add close animation class
          item.className += ' ' + options.animation.close;

          // Close notification after 0.5s + timeout
          let close_time = parseInt(options.timeout) + 500;
          setTimeout(() => {
            CloseItem(item);
          }, close_time);

        } else {
          // Close notification when progress bar completed
          CloseItem(item);
        }
      } else {
        width--; 
        bar.style.width = width + '%'; 
      }
    }
  }

  return element;
}

/**
 * Add Modal
 */
const AddModal = () => {
  if (document.getElementsByClassName(noticeJsModalClassName).length <= 0) {
    let element = document.createElement('div');
    element.classList.add(noticeJsModalClassName);
    element.classList.add('noticejs-modal-open');
    document.body.appendChild(element);
    // Remove class noticejs-modal-open
    setTimeout(() => {
      element.className = noticeJsModalClassName;
    },200);
  }
}

/**
 * 
 * @param {Noticejs item} item 
 */
const CloseItem = (item) => {
  // Set animation to close notification item
  let closeAnimation = 'noticejs-fadeOut';
  if (options.animation !== null && options.animation.close !== null) {
    closeAnimation = options.animation.close;
  }
  // Close notification item
  item.className += ' '+closeAnimation;
  setTimeout(() => {
    item.remove();
  },200);

  // Close modal
  if(options.modal === true && document.querySelectorAll("[noticejs-modal='true']").length <= 1) {
    document.querySelector('.noticejs-modal').className += ' noticejs-modal-close';
    setTimeout(() => {
      document.querySelector('.noticejs-modal').remove();
    }, 500);
  }
}

/**
 * 
 * @param {Notification item} item 
 */
const addListener = (item) => {
  // Add close button
  if(options.closeWith.includes('button')) {
    item.querySelector('.close').addEventListener('click', function() {
      CloseItem(item);
    });
  }

  // Add close by click
  if(options.closeWith.includes('click')) {
    item.style.cursor = 'pointer';
    item.addEventListener('click',function() {
      CloseItem(item);
    });
  }
}

/**
* Append NoticeJs item
*/
const appendNoticeJs = () => {
  let target_class = '.noticejs-' + options.position;
  // Create NoticeJs item
  let noticeJsItem = document.createElement('div');
  noticeJsItem.classList.add('item');
  noticeJsItem.classList.add(options.type);

  // Add Header
  if(noticeJsHeader !== '') {
    noticeJsItem.appendChild(noticeJsHeader);
  }

  // Add body
  noticeJsItem.appendChild(noticeJsBody);

  // Add progress bar
  if(noticeJsProgressBar !== ''){
    noticeJsItem.appendChild(noticeJsProgressBar);  
  }

  // Empty top and bottom container
  if(['top','bottom'].includes(options.position)){
    document.querySelector(target_class).innerHTML = '';
  }

  // Add open animation
  if(options.animation !== null && options.animation.open !== null) {
    noticeJsItem.className += ' ' + options.animation.open;
  }

  // Add Modal
  if(options.modal === true) {
    noticeJsItem.setAttribute('noticejs-modal','true');
    AddModal();
  }

  // Add Listener
  addListener(noticeJsItem);

  document.querySelector(target_class).appendChild(noticeJsItem);
}

/**
 * show 
 * @param {Noticejs options} data 
 */
const show = (data) => {
  options = Object.assign(options, data);

  // Create Noticejs container
  createContainer();

  // Create NoticeJs header
  if (options.title !== 'undefined' && options.title !== '') {
    noticeJsHeader = createHeader(options.title);
  }

  // Create NoticeJs body
  noticeJsBody = createBody(options.text);

  // Create NoticeJs progressBar
  if(options.progressBar === true) {
    noticeJsProgressBar = createProgressBar();
  }

  //Append NoticeJs
  appendNoticeJs();
}

/**
 * Define modules
 */
module.exports = {
  show
}
