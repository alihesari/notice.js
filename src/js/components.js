import * as API from './api';
import * as helper from './helpers';
let options = API.Defaults;

export class Components {
  
  createContainer () {
    let element_class = 'noticejs-' + options.position;
    // Create element
    let element = document.createElement('div');
    element.classList.add('noticejs');
    element.classList.add(element_class);

    return element;
  }

  createHeader () {
    let element;
    if (options.title && 
        options.title !== ''
    ) {
      element = document.createElement('div');
      element.setAttribute('class', 'heading');
      element.textContent = options.title;
    }
    
    // Add close button
    if (options.closeWith.includes('button')) {
      let close = document.createElement('div');
      close.setAttribute('class', 'close');
      close.innerHTML = '&times;';
      if(element) {
        element.appendChild(close);
      } else {
        element = close;
      }
    }
    
    return element;
  }

  createBody () {
    let element = document.createElement('div');
    element.setAttribute('class', 'body');
    element.innerHTML = options.text;
    return element;
  }

  createProgressBar () {
    let element = document.createElement('div');
    element.setAttribute('class','progressbar');
    let bar = document.createElement('div');
    bar.setAttribute('class','bar');
    element.appendChild(bar);
    
    // Progress bar animation
    if(options.progressBar === true &&
      typeof options.timeout !== 'boolean' && 
      options.timeout !== false
    ) {
      let width = 100;
      let id = setInterval(frame, options.timeout);
      function frame() {
        if (width <= 0) {
          clearInterval(id);
          
          let item = element.closest('div.item');
          // Add close animation
          if(options.animation !== null &&
            options.animation.close !== null
          ) {
  
            // Remove open animation class
            item.className = item.className.replace(new RegExp('(?:^|\\s)'+ options.animation.open + '(?:\\s|$)'), ' ');
            // Add close animation class
            item.className += ' ' + options.animation.close;
  
            // Close notification after 0.5s + timeout
            let close_time = parseInt(options.timeout) + 500;
            setTimeout(() => {
              helper.CloseItem(item);
            }, close_time);
  
          } else {
            // Close notification when progress bar completed
            helper.CloseItem(item);
          }
        } else {
          width--; 
          bar.style.width = width + '%'; 
        }
      }
    }
  
    return element;
  }
}