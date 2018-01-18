
import styles from './../sass/noticejs.scss';
import * as API from './api';
import { Components } from './components';
import * as helper from './helpers';

export default class NoticeJs {
  /**
   * @param {object} options 
   * @returns {Noty}
   */
  constructor (options = {}) {
    this.options = Object.assign(API.Defaults, options);
    this.component = new Components();
    
    this.on('beforeShow', this.options.callbacks.beforeShow);
    this.on('onShow', this.options.callbacks.onShow);
    this.on('afterShow', this.options.callbacks.afterShow);
    this.on('onClose', this.options.callbacks.onClose);
    this.on('afterClose', this.options.callbacks.afterClose);
    this.on('onClick', this.options.callbacks.onClick);
    this.on('onHover', this.options.callbacks.onHover);
    
    return this;
  }
  
  /**
   * @returns {NoticeJs}
   */
  show () {
    let container = this.component.createContainer();
    if (document.querySelector('.noticejs-' + this.options.position) === null) {
      document.body.appendChild(container);
    }

    let noticeJsHeader;
    let noticeJsBody;
    let noticeJsProgressBar;
    
    // Create NoticeJs header
    noticeJsHeader = this.component.createHeader(this.options.title, this.options.closeWith);

    // Create NoticeJs body
    noticeJsBody = this.component.createBody(this.options.text);
  
    // Create NoticeJs progressBar
    if(this.options.progressBar === true) {
      noticeJsProgressBar = this.component.createProgressBar();
    }
  
    //Append NoticeJs
    let noticeJs = helper.appendNoticeJs(noticeJsHeader, noticeJsBody, noticeJsProgressBar);

    return noticeJs;
  }

  /**
   * @param {string} eventName
   * @param {function} cb
   * @return {NoticeJs}
   */
  on (eventName, cb = () => {}) {
    if (typeof cb === 'function' && this.options.callbacks.hasOwnProperty(eventName)) {
      this.options.callbacks[eventName].push(cb);
    }
    
    return this;
  }

}