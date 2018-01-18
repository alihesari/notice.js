import * as API from './api';
let options = API.Defaults;

/**
 * @param {NoticeJs} ref
 * @param {string} eventName
 * @return {void}
 */
export function getCallback(ref, eventName) {
    if (ref.callbacks.hasOwnProperty(eventName)) {
        ref.callbacks[eventName].forEach(cb => {
            if (typeof cb === 'function') {
                cb.apply(ref);
            }
        })
    }
}

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

export const CloseItem = (item) => {
    getCallback(options, 'onClose');
    
    // Set animation to close notification item
    if (options.animation !== null &&
        options.animation.close !== null
    ) {
        item.className += ' ' + options.animation.close;
    }
    setTimeout(() => {
        item.remove();
    }, 200);

    // Close modal
    if (options.modal === true &&
        document.querySelectorAll("[noticejs-modal='true']").length >= 1
    ) {
        document.querySelector('.noticejs-modal').className += ' noticejs-modal-close';
        setTimeout(() => {
            document.querySelector('.noticejs-modal').remove();
        }, 500);
    }

    // Remove container
    let position = '.' + item.closest('.noticejs').className.replace('noticejs', '').trim();
    setTimeout(() => {
        if (document.querySelectorAll(position + ' .item').length <= 0) {
            document.querySelector(position).remove();
        }
    }, 500);
}

export const addListener = (item) => {
    // Add close button Event
    if (options.closeWith.includes('button')) {
        item.querySelector('.close').addEventListener('click', function () {
            CloseItem(item);
        });
    }

    // Add close by click Event
    if (options.closeWith.includes('click')) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function (e) {
            if (e.target.className !== 'close') {
                getCallback(options, 'onClick');
                CloseItem(item);
            }
        });
    } else {
        item.addEventListener('click', function (e) {
            if (e.target.className !== 'close') {
                getCallback(options, 'onClick');
            }
        });
    }

    item.addEventListener('mouseover', function(){
        getCallback(options, 'onHover');
    });
}

export const appendNoticeJs = (noticeJsHeader, noticeJsBody, noticeJsProgressBar) => {
    let target_class = '.noticejs-' + options.position;
    // Create NoticeJs item
    let noticeJsItem = document.createElement('div');
    noticeJsItem.classList.add('item');
    noticeJsItem.classList.add(options.type);

    // Add Header
    if (noticeJsHeader && noticeJsHeader !== '') {
        noticeJsItem.appendChild(noticeJsHeader);
    }

    // Add body
    noticeJsItem.appendChild(noticeJsBody);

    // Add progress bar
    if (noticeJsProgressBar && noticeJsProgressBar !== '') {
        noticeJsItem.appendChild(noticeJsProgressBar);
    }

    // Empty top and bottom container
    if (['top', 'bottom'].includes(options.position)) {
        document.querySelector(target_class).innerHTML = '';
    }

    // Add open animation
    if (options.animation !== null && options.animation.open !== null) {
        noticeJsItem.className += ' ' + options.animation.open;
    }

    // Add Modal
    if (options.modal === true) {
        noticeJsItem.setAttribute('noticejs-modal', 'true');
        AddModal();
    }

    // Add Listener
    addListener(noticeJsItem, options.closeWith);

    getCallback(options, 'beforeShow');
    getCallback(options, 'onShow');
    document.querySelector(target_class).appendChild(noticeJsItem);
    getCallback(options, 'afterShow');

    return noticeJsItem;
}