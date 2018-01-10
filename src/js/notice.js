import styles from './../sass/noticejs.scss';

/**
 * Private variable
 */
let noticeJsHeader = '';
let noticeJsBody = '';
let noticeJsProgressBar = '';

/**
 * Default options
 */
let options = {
  title: '',
  text: '',
  type: 'success',
  position: 'topRight',
  closeButton: true,
  progressBar: true,
  timeout: 30,
  animation: null
};

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
};

/**
 * Create NoticeJs header
 */
const createHeader = (title) => {
  let element = document.createElement('div');
  element.setAttribute('class', 'heading');
  element.textContent = title;
  if (options.closeButton === true) {
    let close = document.createElement('div');
    close.setAttribute('class', 'close');
    close.innerHTML = '&times;';
    close.addEventListener('click', function(event){
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
        if(options.animation.close !== null) {

          // Remove open animation class
          item.className = item.className.replace(new RegExp('(?:^|\\s)'+ options.animation.open + '(?:\\s|$)'), ' ');
          // Add close animation class
          item.className += ' ' + options.animation.close;

          // Close notification after 2s + timeout
          let close_time = parseInt(options.timeout) + 2000;
          setTimeout(()=>{
            item.remove();
          }, close_time);

        } else {
          // Close notification when progress bar completed
          item.remove();
        }
      } else {
        width--; 
        bar.style.width = width + '%'; 
      }
    }
  }

  return element;
};

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
  if(options.animation.open !== null) {
    noticeJsItem.className += ' ' + options.animation.open;
  }

  document.querySelector(target_class).appendChild(noticeJsItem);
};

/**
 * show 
 * @param {*} data 
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
};

module.exports = {
  show
};
