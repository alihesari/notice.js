import styles from './../sass/noticejs.scss';
import * as API from './api';
import { Components } from './components';
import * as element from './helpers';

export default class NoticeJs {
  /**
   * @param {object} options 
   * @returns {Noty}
   */
  constructor (options = {}) {
    console.log(options);
    this.options = Object.assign(API.Defaults, options);
    this.component = new Components();
    return this;
  }
  
  show () {
    let container = this.component.createContainer(this.options.position);
    let noticeJsHeader;
    let noticeJsBody;
    let noticeJsProgressBar;
    
    // Create NoticeJs header
    if (this.options.title !== 'undefined' && 
        this.options.title !== ''
    ) {
      noticeJsHeader = this.component.createHeader(this.options.title);
    }

    // Create NoticeJs body
    noticeJsBody = this.component.createBody(this.options.text);
  
    // Create NoticeJs progressBar
    if(this.options.progressBar === true) {
      noticeJsProgressBar = this.component.createProgressBar();
    }
  
    //Append NoticeJs
    helpers.appendNoticeJs(this.options, noticeJsHeader, noticeJsBody, noticeJsProgressBar);
  }
}