import * as API from './api';

export const AddModal = () => {
    if (document.getElementsByClassName(API.noticeJsModalClassName).length <= 0) {
        let element = document.createElement('div');
        element.classList.add(API.noticeJsModalClassName);
        element.classList.add('noticejs-modal-open');
        document.body.appendChild(element);
        // Remove class noticejs-modal-open
        setTimeout(() => {
            element.className = API.noticeJsModalClassName;
        }, 200);
    }
}

export const CloseItem = (item, animation = null, modal = false) => {
    // Set animation to close notification item
    let closeAnimation = API.closeAnimation;
    if (animation !== null && 
        animation.close !== null
    ) {
        closeAnimation = animation.close;
    }
    // Close notification item
    item.className += ' ' + closeAnimation;
    setTimeout(() => {
        item.remove();
    }, 200);

    // Close modal
    if (modal === true && document.querySelectorAll("[noticejs-modal='true']").length <= 1) {
        document.querySelector('.noticejs-modal').className += ' noticejs-modal-close';
        setTimeout(() => {
            document.querySelector('.noticejs-modal').remove();
        }, 500);
    }
}

export const addListener = (item, closeWith) => {
    // Add close button Event
    if (closeWith.includes('button')) {
        item.querySelector('.close').addEventListener('click', function () {
            CloseItem(item);
        });
    }

    // Add close by click Event
    if (closeWith.includes('click')) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
            CloseItem(item);
        });
    }
}

export const appendNoticeJs = (options, noticeJsHeader, noticeJsBody, noticeJsProgressBar) => {
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