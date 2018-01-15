export class Components {
  createContainer (position){
    let element_class = 'noticejs-' + position;
    // Create element
    let element = document.createElement('div');
    element.classList.add('noticejs');
    element.classList.add(element_class);

    return element;
  }

  createHeader (title) {
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

  createBody (content) {
    let element = document.createElement('div');
    element.setAttribute('class', 'body');
    element.innerHTML = content;
    return element;
  }

  createProgressBar (progressBar, timeout, animation) {
    let element = document.createElement('div');
    element.setAttribute('class','progressbar');
    let bar = document.createElement('div');
    bar.setAttribute('class','bar');
    element.appendChild(bar);
    
    // Progress bar animation
    if(progressBar === true &&
      typeof timeout !== 'boolean' && 
      timeout !== false
    ) {
      let width = 100;
      let id = setInterval(frame, timeout);
      function frame() {
        if (width <= 0) {
          clearInterval(id);
          
          let item = element.closest('div.item');
          // Add close animation
          if(animation !== null &&
            animation.close !== null
          ) {
  
            // Remove open animation class
            item.className = item.className.replace(new RegExp('(?:^|\\s)'+ animation.open + '(?:\\s|$)'), ' ');
            // Add close animation class
            item.className += ' ' + animation.close;
  
            // Close notification after 0.5s + timeout
            let close_time = parseInt(timeout) + 500;
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
}