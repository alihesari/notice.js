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
var noticeJsHeader = "";
var noticeJsBody = "";

/**
 * Default options
 */
var options = {
  type: 'success',
  position: 'topRight',
  close: true,
  autoClose: true
};

/**
 * Create NoticeJs container
 */
var createContainer = function createContainer(position) {
  var element_class = 'noticejs-' + position;
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
var createHeader = function createHeader(title, options) {
  var element = document.createElement('div');
  element.setAttribute('class', 'heading');
  element.textContent = title;
  if (options.close === true) {
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
* Append NoticeJs item
*/
var appendNoticeJs = function appendNoticeJs(header, body, options) {
  var target_class = '.noticejs-' + options.position;
  // Create NoticeJs item
  var noticeJsItem = document.createElement('div');
  noticeJsItem.classList.add('item');
  noticeJsItem.classList.add(options.type);
  if (header) {
    noticeJsItem.appendChild(header);
  }
  noticeJsItem.appendChild(body);
  document.querySelector(target_class).appendChild(noticeJsItem);

  // Close event click
  var noticeItems = document.querySelectorAll('.noticejs .item .close');
  Array.from(noticeItems).forEach(function (item) {
    if (typeof item !== 'undefined' && item !== null) {
      item.addEventListener('click', function (event) {
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
    }
  });
};

var init = function init(data, settings) {
  options = Object.assign(options, settings);

  // Create Noticejs container
  createContainer(options.position);

  // Create NoticeJs header
  if (data.title !== 'undefined' && data.title !== '') {
    noticeJsHeader = createHeader(data.title, options);
  }

  // Create NoticeJs body
  var content = (typeof data === "undefined" ? "undefined" : _typeof(data)) === 'object' ? data.content : data;
  noticeJsBody = createBody(content);

  //Append NoticeJs
  appendNoticeJs(noticeJsHeader, noticeJsBody, options);
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