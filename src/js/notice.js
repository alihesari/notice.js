
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
    
    return this;
  }
  
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
    helper.appendNoticeJs(noticeJsHeader, noticeJsBody, noticeJsProgressBar);
  }
}