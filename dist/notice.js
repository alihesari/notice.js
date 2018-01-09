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


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  if (options.closeButton === true) {
    var close = document.createElement('div');
    close.setAttribute('class', 'close');
    close.innerHTML = '&times;';
    close.addEventListener('click', function (event) {
      var parent = event.target.closest('div.noticejs');
      // Remove the notice item
      event.target.closest('div.item').remove();
      // Remove the notice container if it does not have any item
      if (parent !== null) {
        if (parent.getElementsByClassName('item').length === 0) {
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
        // Close notification when progress bar completed
        element.closest('div.item').remove();
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
 * Add animation
 */
var addAnimation = function addAnimation(item) {};

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
  document.querySelector(target_class).appendChild(noticeJsItem);
};

/**
 * init 
 * @param {*} data 
 * @param {*} settings 
 */
var init = function init(data, settings) {
  options = Object.assign(options, settings);

  // Create Noticejs container
  createContainer();

  // Create NoticeJs header
  if (data.title !== 'undefined' && data.title !== '') {
    noticeJsHeader = createHeader(data.title);
  }

  // Create NoticeJs body
  var content = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? data.content : data;
  noticeJsBody = createBody(content);

  // Create NoticeJs progressBar
  if (options.progressBar === true) {
    noticeJsProgressBar = createProgressBar();
  }

  //Append NoticeJs
  appendNoticeJs();
};

module.exports = {
  init: init
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);