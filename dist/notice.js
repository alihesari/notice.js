var NoticeJS =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _noticejs = __webpack_require__(1);

var _noticejs2 = _interopRequireDefault(_noticejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Private variable
 */
var noticeJsHeader = '';
var noticeJsBody = '';
var noticeJsProgressBar = '';

/**
 * Default options
 */
var options = {
  title: '',
  text: '',
  type: 'success',
  position: 'topRight',
  timeout: 30,
  progressBar: true,
  closeWith: ['button', 'click'],
  animation: null
};

/**
 * Create NoticeJs container
 */
var createContainer = function createContainer() {
  var element_class = 'noticejs-' + options.position;
  // Create element
  var element = document.createElement('div');
  element.classList.add('noticejs');
  element.classList.add(element_class);
  if (document.querySelector('.' + element_class) === null) {
    document.body.appendChild(element);
  }
};

/**
 * Create NoticeJs header
 */
var createHeader = function createHeader(title) {
  var element = document.createElement('div');
  element.setAttribute('class', 'heading');
  element.textContent = title;

  // Add close button
  if (options.closeWith.includes('button')) {
    var close = document.createElement('div');
    close.setAttribute('class', 'close');
    close.innerHTML = '&times;';
    element.appendChild(close);
  }

  return element;
};

/**
 * Create NoticeJs body
 */
var createBody = function createBody(content) {
  var element = document.createElement('div');
  element.setAttribute('class', 'body');
  element.innerHTML = content;
  return element;
};

/**
 * Create NoticeJs progress bar
 */
var createProgressBar = function createProgressBar() {
  var element = document.createElement('div');
  element.setAttribute('class', 'progressbar');
  var bar = document.createElement('div');
  bar.setAttribute('class', 'bar');
  element.appendChild(bar);

  // Progress bar animation
  if (options.progressBar === true && typeof options.timeout !== 'boolean' && options.timeout !== false) {
    var frame = function frame() {
      if (width <= 0) {
        clearInterval(id);

        var item = element.closest('div.item');
        // Add close animation
        if (options.animation !== null && options.animation.close !== null) {

          // Remove open animation class
          item.className = item.className.replace(new RegExp('(?:^|\\s)' + options.animation.open + '(?:\\s|$)'), ' ');
          // Add close animation class
          item.className += ' ' + options.animation.close;

          // Close notification after 2s + timeout
          var close_time = parseInt(options.timeout) + 2000;
          setTimeout(function () {
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
    };

    var width = 100;
    var id = setInterval(frame, options.timeout);
  }

  return element;
};

/**
 * 
 * @param {Notification item} item 
 */
var addListener = function addListener(item) {
  // Add close button
  if (options.closeWith.includes('button')) {
    item.querySelector('.close').addEventListener('click', function () {
      item.remove();
    });
  }

  // Add close by click
  if (options.closeWith.includes('click')) {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function () {
      item.remove();
    });
  }
};

/**
* Append NoticeJs item
*/
var appendNoticeJs = function appendNoticeJs() {
  var target_class = '.noticejs-' + options.position;
  // Create NoticeJs item
  var noticeJsItem = document.createElement('div');
  noticeJsItem.classList.add('item');
  noticeJsItem.classList.add(options.type);

  // Add Header
  if (noticeJsHeader !== '') {
    noticeJsItem.appendChild(noticeJsHeader);
  }

  // Add body
  noticeJsItem.appendChild(noticeJsBody);

  // Add progress bar
  if (noticeJsProgressBar !== '') {
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

  // Add Listener
  addListener(noticeJsItem);

  document.querySelector(target_class).appendChild(noticeJsItem);
};

/**
 * show 
 * @param {*} data 
 */
var show = function show(data) {
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
  if (options.progressBar === true) {
    noticeJsProgressBar = createProgressBar();
  }

  //Append NoticeJs
  appendNoticeJs();
};

module.exports = {
  show: show
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);