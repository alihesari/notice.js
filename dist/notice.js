(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("NoticeJs", [], factory);
	else if(typeof exports === 'object')
		exports["NoticeJs"] = factory();
	else
		root["NoticeJs"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var noticeJsModalClassName = exports.noticeJsModalClassName = 'noticejs-modal';
var closeAnimation = exports.closeAnimation = 'noticejs-fadeOut';

var Defaults = exports.Defaults = {
    title: '',
    text: '',
    type: 'success',
    position: 'topRight',
    timeout: 30,
    progressBar: true,
    closeWith: ['button'],
    animation: null,
    modal: false
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _noticejs = __webpack_require__(2);

var _noticejs2 = _interopRequireDefault(_noticejs);

var _api = __webpack_require__(0);

var API = _interopRequireWildcard(_api);

var _components = __webpack_require__(3);

var _helpers = __webpack_require__(4);

var element = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NoticeJs = function () {
  /**
   * @param {object} options 
   * @returns {Noty}
   */
  function NoticeJs() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, NoticeJs);

    this.options = Object.assign(API.Defaults, options);
    this.component = new _components.Components();

    return this;
  }

  _createClass(NoticeJs, [{
    key: 'show',
    value: function show() {
      var container = this.component.createContainer(this.options.position);
      if (document.querySelector('.noticejs-' + this.options.position) === null) {
        document.body.appendChild(container);
      }

      var noticeJsHeader = void 0;
      var noticeJsBody = void 0;
      var noticeJsProgressBar = void 0;

      // Create NoticeJs header
      if (this.options.title !== 'undefined' && this.options.title !== '') {
        noticeJsHeader = this.component.createHeader(this.options.title, this.options.closeWith);
      }

      // Create NoticeJs body
      noticeJsBody = this.component.createBody(this.options.text);

      // Create NoticeJs progressBar
      if (this.options.progressBar === true) {
        noticeJsProgressBar = this.component.createProgressBar();
      }

      //Append NoticeJs
      element.appendNoticeJs(this.options, noticeJsHeader, noticeJsBody, noticeJsProgressBar);
    }
  }]);

  return NoticeJs;
}();

exports.default = NoticeJs;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Components = exports.Components = function () {
  function Components() {
    _classCallCheck(this, Components);
  }

  _createClass(Components, [{
    key: 'createContainer',
    value: function createContainer(position) {
      var element_class = 'noticejs-' + position;
      // Create element
      var element = document.createElement('div');
      element.classList.add('noticejs');
      element.classList.add(element_class);

      return element;
    }
  }, {
    key: 'createHeader',
    value: function createHeader(title) {
      var closeWith = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var element = document.createElement('div');
      element.setAttribute('class', 'heading');
      element.textContent = title;

      // Add close button
      if (closeWith.includes('button')) {
        var close = document.createElement('div');
        close.setAttribute('class', 'close');
        close.innerHTML = '&times;';
        element.appendChild(close);
      }

      return element;
    }
  }, {
    key: 'createBody',
    value: function createBody(content) {
      var element = document.createElement('div');
      element.setAttribute('class', 'body');
      element.innerHTML = content;
      return element;
    }
  }, {
    key: 'createProgressBar',
    value: function createProgressBar(progressBar, timeout, animation) {
      var element = document.createElement('div');
      element.setAttribute('class', 'progressbar');
      var bar = document.createElement('div');
      bar.setAttribute('class', 'bar');
      element.appendChild(bar);

      // Progress bar animation
      if (progressBar === true && typeof timeout !== 'boolean' && timeout !== false) {
        var frame = function frame() {
          if (width <= 0) {
            clearInterval(id);

            var item = element.closest('div.item');
            // Add close animation
            if (animation !== null && animation.close !== null) {

              // Remove open animation class
              item.className = item.className.replace(new RegExp('(?:^|\\s)' + animation.open + '(?:\\s|$)'), ' ');
              // Add close animation class
              item.className += ' ' + animation.close;

              // Close notification after 0.5s + timeout
              var close_time = parseInt(timeout) + 500;
              setTimeout(function () {
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
        };

        var width = 100;
        var id = setInterval(frame, timeout);
      }

      return element;
    }
  }]);

  return Components;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.appendNoticeJs = exports.addListener = exports.CloseItem = exports.AddModal = undefined;

var _api = __webpack_require__(0);

var API = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var AddModal = exports.AddModal = function AddModal() {
    if (document.getElementsByClassName(API.noticeJsModalClassName).length <= 0) {
        var element = document.createElement('div');
        element.classList.add(API.noticeJsModalClassName);
        element.classList.add('noticejs-modal-open');
        document.body.appendChild(element);
        // Remove class noticejs-modal-open
        setTimeout(function () {
            element.className = API.noticeJsModalClassName;
        }, 200);
    }
};

var CloseItem = exports.CloseItem = function CloseItem(item) {
    var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var modal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    // Set animation to close notification item
    var closeAnimation = API.closeAnimation;
    if (animation !== null && animation.close !== null) {
        closeAnimation = animation.close;
    }
    // Close notification item
    item.className += ' ' + closeAnimation;
    setTimeout(function () {
        item.remove();
    }, 200);

    // Close modal
    if (modal === true && document.querySelectorAll("[noticejs-modal='true']").length <= 1) {
        document.querySelector('.noticejs-modal').className += ' noticejs-modal-close';
        setTimeout(function () {
            document.querySelector('.noticejs-modal').remove();
        }, 500);
    }
};

var addListener = exports.addListener = function addListener(item, closeWith) {
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
};

var appendNoticeJs = exports.appendNoticeJs = function appendNoticeJs(options, noticeJsHeader, noticeJsBody, noticeJsProgressBar) {
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

    // Add Modal
    if (options.modal === true) {
        noticeJsItem.setAttribute('noticejs-modal', 'true');
        AddModal();
    }

    // Add Listener
    addListener(noticeJsItem, options.closeWith);

    document.querySelector(target_class).appendChild(noticeJsItem);
};

/***/ })
/******/ ]);
});