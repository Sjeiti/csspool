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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var NAME = exports.NAME = 'CSS Pool';
var VERSION = exports.VERSION = '0.3.15';

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elementAndParents = elementAndParents;
exports.sluggify = sluggify;
exports.css = css;
exports.createElement = createElement;
exports.getFragment = getFragment;
exports.dispatch = dispatch;

/**
 * Returns a list with the element and its parents
 * @param {HTMLElement} element
 * @returns {HTMLElement[]}
 */
function elementAndParents(element) {
  var result = [];
  while (element && element.parentNode) {
    result.push(element);
    element = element.parentNode;
  }
  return result;
}

/**
 * Sluggifies
 * @param {string} s
 * @returns {string}
 */
function sluggify(s) {
  var slug = s.replace(/^[^a-zA-Z]*|[^a-zA-Z0-9\s]|[^a-zA-Z0-9]*$/g, '').replace(/\s(\w)/g, function (match, s) {
    return s.toUpperCase();
  });
  return slug && slug[0].toLowerCase() + slug.substr(1);
}

/**
 * from: https://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element
 * @param {HTMLElement} el
 * @returns {array}
 * todo: check //http://www.brothercake.com/site/resources/scripts/cssutilities/
 */
function css(el) {
  var sheets = document.styleSheets,
      ret = [];
  el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
  for (var i in sheets) {
    try {
      var rules = sheets[i].rules || sheets[i].cssRules;
      for (var r in rules) {
        if (el.matches(rules[r].selectorText)) {
          ret.push(rules[r].cssText);
        }
      }
    } catch (err) {
      /*err*/
    }
  }
  return ret;
}

/**
 * Create an element by querySelector and appendChild
 * @param {string} querySelector
 * @param {HTMLElement} [parentNode]
 * @param {Function} [method]
 * @returns {HTMLElement}
 */
function createElement(querySelector, parentNode, method) {
  var nodeName = querySelector.split(/[^\w]/).shift();
  var element = document.createElement(nodeName);
  // id
  var id = querySelector.match(/#-?[_a-zA-Z]+[_a-zA-Z0-9-]*/);
  id && element.setAttribute('id', id.pop().substr(1));
  // classNames
  var classNames = querySelector.match(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g);
  classNames && classNames.forEach(function (classSelector) {
    element.classList.add(classSelector.substr(1));
  });
  // attributes
  method && method(element);
  // appendChild
  parentNode && parentNode.appendChild(element);
  return element;
}

/**
 * Get documentFragment from an HTML string
 * @param {string} str
 * @returns {DocumentFragment}
 */
function getFragment(str) {
  var fragment = document.createDocumentFragment();
  Array.from(wrapHTMLString(str).childNodes).forEach(function (elm) {
    return fragment.appendChild(elm);
  });
  return fragment;
}

/**
 * Set the innerHTML of a cached div
 * Helper method for getFragment and stringToElement
 * @param {string} str
 * @returns {HTMLElement}
 */
function wrapHTMLString(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div;
}

/**
 * Dispatch an event on an element
 * @param {HTMLElement} element
 * @param {...string} eventTypes
 */
function dispatch(element) {
  for (var _len = arguments.length, eventTypes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    eventTypes[_key - 1] = arguments[_key];
  }

  if (typeof Event !== 'function') {
    // unfortunate dirty IE11 hack
    var wasDisabled = element.disabled; // IE also refuses to dispatch from disabled elements
    wasDisabled && (element.disabled = false);
    eventTypes.forEach(function (eventType) {
      var event = document.createEvent('Event');
      event.initEvent(eventType, true, true);
      element.dispatchEvent(event);
    });
    wasDisabled && (element.disabled = true);
  } else {
    // all other browsers work properly
    eventTypes.forEach(function (eventType) {
      return element.dispatchEvent(new CustomEvent(eventType, {
        bubbles: true,
        cancelable: true
      }));
    });
  }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = exports.className = undefined;

var _ = __webpack_require__(0);

var _util = __webpack_require__(1);

var name = (0, _util.sluggify)(_.NAME);

var className = exports.className = {
  main: '' + name,
  ghost: name + 'ghost',
  close: name + 'close',
  current: name + 'current',
  tree: name + 'tree',
  selectors: name + 'selectors'
};

var css = exports.css = '\n  @import url(\'https://fonts.googleapis.com/css?family=Source+Code+Pro\');\n\n\n  dialog.' + name + ' {\n  \n    --color-font: #333;\n    --color-input-background: #FFF;\n    --color-background1: #FFF;\n    --color-background2: #EEE;\n    --color-border: #CCC;\n    --color-hr: #333;\n    \n    position: absolute;\n    left: auto;\n    right: 0;\n    top: 0;\n    padding: 20px 10px 10px;\n    min-width: 200px;\n    min-height: 200px;\n    border: 0;\n    border-radius: 2px;\n    box-shadow: 1px 4px 16px rgba(0,0,0,0.3), 0 0 0 1px red;\n    background: linear-gradient(var(--color-background1), var(--color-background2));\n    overflow: hidden;\n  }\n  dialog.' + name + '::backdrop {\n    background-color: transparent;\n  }\n  dialog.' + name + ' * {\n    position: initial;\n    left: initial;\n    top: initial;\n    bottom: initial;\n    right: initial;\n    margin: initial;\n    padding: initial;\n    font-size: 12px;\n    line-height: 140%;\n    font-family: Source Code Pro,monospace;\n    color: var(--color-font);\n    border-color: var(--color-border);\n  }\n  dialog.' + name + '--dark input, dialog.' + name + '--dark textarea, dialog.' + name + '--dark select {\n    background-color: var(--color-input-background);\n  }\n  \n  dialog.' + name + '--dark {\n    --color-font: #FFC66D;\n    --color-input-background: #2B2B2B;\n    --color-background1: #3C3F41;\n    --color-background2: #313335;\n    --color-border: #333;\n    --color-hr: #FFC66D;\n  }\n  \n  dialog.' + name + ' h3, dialog.' + name + ' .' + className.close + ' {\n    position: absolute;\n    top: 2px;\n    line-height: 100%;\n    font-weight: bold;\n  }\n  dialog.' + name + ' h3 {\n    left: 4px;\n  }\n  dialog.' + name + ' .' + className.close + ' {\n    right: 4px;\n    border: 0;\n    background: transparent;\n  }\n  dialog.' + name + ' .' + className.close + ':after {\n    content: \'\u2716\';\n  }\n  dialog.' + name + ' .' + className.current + ' {\n    box-shadow: 0 0 0 1px #F04;\n  }\n  \n  dialog.' + name + ' hr {\n    margin: 8px 0;\n    border: 0;\n    height: 1px;\n    background-color: var(--color-hr);\n    box-shadow: 100px 0 0 var(--color-hr),  -100px 0 0 var(--color-hr);\n  }\n  \n  dialog.' + name + ' .' + className.tree + ' {\n    display: block;\n    padding: 0;\n  }\n  dialog.' + name + ' .' + className.tree + ' li {\n    display: inline-block;\n  }\n  dialog.' + name + ' .' + className.tree + ' li.current button {\n    font-weight: bold;\n  }\n  dialog.' + name + ' .' + className.tree + ' button, .' + className.tree + ' select, .' + className.tree + ' option {\n    text-transform: lowercase;\n  }\n  dialog.' + name + ' .' + className.tree + ' li:not(:first-child):before {\n    content: \'>\';\n  }\n  dialog.' + name + ' .' + className.tree + ' button {\n    border: 0;\n    background: transparent;\n    padding: 0;\n  }\n  \n  dialog.' + name + ' .' + className.selectors + ' .current {\n    font-weight: bold;\n  }\n  \n  dialog.' + name + ' legend {\n    display: block;\n    width: 100%;\n    box-shadow: 0 1px 0 var(--color-border), 0 -1px 0 var(--color-border);\n    cursor: pointer;\n    font-weight: bold;\n  }\n  dialog.' + name + ' .collapse+label+div {\n    display: none;\n  }\n  dialog.' + name + ' .collapse+label {\n    display: block;\n  }\n  dialog.' + name + ' .collapse+label legend:after {\n    content: \'>\';\n    display: inline-block;\n    margin-left: 10px;\n  }\n  dialog.' + name + ' .collapse:checked+label+div {\n    display: block;\n    margin: 8px 0;\n  }\n  dialog.' + name + ' .collapse:checked+label legend:after {\n    transform: rotate(90deg); \n  }\n  \n  dialog.' + name + ' label {\n    display: flex;\n  }\n  dialog.' + name + ' fieldset div label>* {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  dialog.' + name + ' fieldset div label>*:nth-child(1) {\n    flex: 30% 0 0;\n    max-width: 30%;\n    order: 1;\n  }\n  dialog.' + name + ' fieldset div label>*:nth-child(2) {\n    flex: 40px 1 0;\n    /*max-width: 40px;*/\n    order: 3;\n  }\n  dialog.' + name + ' fieldset div label>*:nth-child(3) {\n    flex: auto 1 1;\n    order: 2;\n  }\n  \n  dialog.' + name + ' textarea {\n    width: 100%;\n    min-height: 150px;\n  }\n  \n  .' + className.ghost + ' {\n    position: absolute;\n    box-shadow: 0 0 0 1px rgba(0,0,255,0.6), 0 0 8px rgba(0,0,255,0.3);\n  }\n  \n  .visually-hidden {\n    position: absolute !important;\n    clip: rect(1px, 1px, 1px, 1px);\n    padding:0 !important;\n    border:0 !important;\n    height: 1px !important; \n    width: 1px !important; \n    overflow: hidden;\n  }\n';

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {"position":["static","absolute","fixed","relative","initial","inherit"],"left":["auto","length","%","initial","inherit"],"top":["auto","length","%","initial","inherit"],"right":["auto","length","%","initial","inherit"],"bottom":["auto","length","%","initial","inherit"],"display":["inline","block","flex","inline-block","inline-flex","inline-table","list-item","run-in","table","table-caption","\r\n      table-column-group","table-header-group","table-footer-group","table-row-group","table-cell","table-column","table-row","none","initial","inherit"],"width":["auto","length","%","initial","inherit"],"height":["auto","length","%","initial","inherit"],"margin":["length","%","auto","initial","inherit"],"padding":["length","%","initial","inherit"],"font-family":["family-name\r\n      generic-family","initial","inherit"],"font-size":["medium","xx-small","x-small","small","large","x-large","xx-large","smaller","larger","length","%","initial","inherit"],"font-weight":["normal","bold","bolder","lighter","100\r\n      200\r\n      300\r\n      400\r\n      500\r\n      600\r\n      700\r\n      800\r\n      900","initial","inherit"],"font-style":["normal","italic","oblique","initial","inherit"],"line-height":["normal","number","length","%","initial","inherit"],"text-transform":["none","capitalize","uppercase","lowercase","initial","inherit"],"text-align":["left","right","center","justify","initial","inherit"],"text-indent":["length","%","initial","inherit"],"text-decoration":["none","underline","overline","line-through","initial","inherit"],"text-overflow":["clip","ellipsis","string","initial","inherit"],"color":["color","initial","inherit"],"background-color":["color","transparent","initial","inherit"],"border-color":["color","transparent","initial","inherit"],"border-width":["medium","thin","thick","length","initial","inherit"],"border-radius":["length","%","initial","inherit"]}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {"positioning":["position","left","top","right","bottom"],"dimension":["display","width","height","margin","padding"],"typography":["font-family","font-size","font-weight","font-style","line-height","text-transform","text-align","text-indent","text-decoration","text-overflow","color"],"style":["background-color","border-color","border-width","border-radius"]}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uiStyle = __webpack_require__(2);

var _config = __webpack_require__(0);

var _util = __webpack_require__(1);

var _cssProps = __webpack_require__(4);

var _cssProps2 = _interopRequireDefault(_cssProps);

var _cssPropValues = __webpack_require__(3);

var _cssPropValues2 = _interopRequireDefault(_cssPropValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultOption = '<option value="-1">…</option>';
var body = document.body;
var px = 'px';
var lengthUnits = ['ch', 'em', 'ex', 'rem', 'em', 'vh', 'vw', 'vmin', 'vmax', 'px', 'cm', 'mm', 'in', 'pc', 'pt'];

var defaultOptions = {
  lengthUnits: ['px', 'rem', 'em', 'vw', 'vh']
};

var ghosts = void 0,
    dialog = void 0,
    alterstyle = void 0,
    lastTarget = void 0,
    newTarget = void 0,
    currentQuerySelector = void 0,
    styleSheetBody = void 0;

var csspool = { init: init };
exports.default = csspool;

window && (window.csspool = csspool);
module && (module.exports = csspool);

/**
 * Initialise
 * @param {Object} options
 * @param {HTMLStyleElement} [options.styleSheet]
 * @param {string} [options.lengthUnits]
 */
function init(options) {
  options = Object.assign(options || {}, defaultOptions);
  alterstyle = options.styleSheet || (0, _util.createElement)('style', body);
  var _alterstyle = alterstyle,
      ownerDocument = _alterstyle.ownerDocument;

  styleSheetBody = ownerDocument.body;
  var uitarget = options.uitarget || body;
  //
  console.log('alterstyle', alterstyle); // todo: remove log
  console.log('body', body); // todo: remove log
  console.log('styleSheetBody', styleSheetBody); // todo: remove log
  console.log('uitarget', uitarget); // todo: remove log
  //
  setLengths(options.lengthUnits);
  ghosts = (0, _util.createElement)('div');
  dialog = (0, _util.createElement)('dialog.' + _uiStyle.className.main + '.' + _uiStyle.className.main + '--dark', uitarget);
  (0, _util.createElement)('style', uitarget, function (style) {
    return style.innerHTML = _uiStyle.css;
  });
  //
  styleSheetBody.addEventListener('mousedown', onMouseDownBody, false);
  styleSheetBody.addEventListener('click', onClickBody, false); // todo doubledialog
  dialog.addEventListener('click', onClickDialog, false); // todo doubledialog
  dialog.addEventListener('change', onChange, false);
  dialog.addEventListener('input', onInput, false);
  window.addEventListener('resize', onResize, false);
}

/**
 * Mousedown handler
 * @param {Event} e
 */
function onMouseDownBody(e) {
  console.log('onMouseDownBody'); // todo: remove log
  var target = e.target;

  newTarget = target;
}

/**
 * Click handler
 */
function onClickBody() {
  console.log('onClickBody'); // todo: remove log
  var parents = (0, _util.elementAndParents)(newTarget);
  if (!parents.includes(dialog)) {
    dialog.close();
    setDialog(newTarget);
    dialog.showModal();
  }
}

/**
 * Dialog click handler
 * @param {Event} e
 */
function onClickDialog(e) {
  console.log('onClickDialog'); // todo: remove log
  e.preventDefault();
  var parents = (0, _util.elementAndParents)(newTarget);
  if (newTarget.classList.contains(_uiStyle.className.close)) {
    styleSheetBody.removeChild(ghosts);
    dialog.close();
  } else if (newTarget.nodeName === 'BUTTON' && parents.includes(dialog.querySelector('.' + _uiStyle.className.tree))) {
    var lastPparents = (0, _util.elementAndParents)(lastTarget);
    var index = parseInt(newTarget.getAttribute('data-index'), 10);
    var element = lastPparents[lastPparents.length - 1 - index];
    setDialog(element);
  }
}

/**
 * Dialog change handler
 * @param {Event} e
 */
function onChange(e) {
  var target = e.target;

  var parents = (0, _util.elementAndParents)(target);
  var isDialog = parents.includes(dialog);
  if (isDialog) {
    var isSelectChildren = target.matches('select[data-children]');
    var isProp = target.matches('[data-prop]');
    var isCSS = target.matches('textarea');
    if (isSelectChildren) {
      var _lastTarget = lastTarget,
          children = _lastTarget.children;

      var index = parseInt(target.value, 10);
      var element = children[index];
      setDialog(element);
    } else if (isProp) {
      var name = target.getAttribute('name');
      var value = target.value + (target.getAttribute('data-unit') || '');
      addStyle(name, value);
      appendRealValueIput(target);
      target.style.maxWidth = 'auto';
    } else if (isCSS) {
      showCSS();
    }
  }
}

/**
 * Input event handler
 * @param {Event} e
 */
function onInput(e) {
  var target = e.target;

  var parents = (0, _util.elementAndParents)(target);
  var isDialog = parents.includes(dialog);
  if (isDialog) {
    var isProp = target.matches('[data-prop]');
    var isCSS = target.matches('textarea');
    if (isProp) {
      var name = target.getAttribute('name');
      var value = target.value + (target.getAttribute('data-unit') || '');
      addStyle(name, value);
      appendRealValueIput(target);
    } else if (isCSS) {
      alterstyle.textContent = target.value;
    }
  }
}

/**
 * Resize event handler
 */
function onResize() {
  moveGhosts();
}

/**
 * Map lengths to units
 * @param {string[]} lengths
 */
function setLengths(lengths) {
  Object.values(_cssPropValues2.default).forEach(function (list) {
    var index = list.indexOf('length');
    index !== -1 && list.splice.apply(list, [index, 1].concat(_toConsumableArray(lengths)));
  });
}

/**
 * Add extra input element after original
 * @param {HTMLElement} from
 */
function appendRealValueIput(from) {
  var parentNode = from.parentNode,
      value = from.value,
      nextElementSibling = from.nextElementSibling,
      name = from.name;

  nextElementSibling && parentNode.removeChild(nextElementSibling);
  var fragment = lengthUnits.includes(value) && '<input name="' + name + '" value="0" data-prop data-unit="' + value + '" type="number" />' || value === '%' && '<input name="' + name + '" value="0" data-prop data-unit="' + value + '" type="range" min="0" max="100" step="1" />' || value === 'color' && '<input name="' + name + '" value="#F4A" data-prop type="color" />';
  fragment && parentNode.appendChild((0, _util.getFragment)(fragment));
}

/**
 * Set the dialog
 * @param {HTMLElement} target
 */
function setDialog(target) {
  lastTarget = target;
  var children = target.children;

  var parents = (0, _util.elementAndParents)(target);
  //
  var appliedCSS = (0, _util.css)(target);
  // console.log('appliedCSS',appliedCSS)
  //
  currentQuerySelector = getBestQuerySelector(target);
  //
  dialog.innerHTML = '<h3>' + _config.NAME + '</h3><button class="' + _uiStyle.className.close + '"></button>\n\n      <ul class="' + _uiStyle.className.tree + '">' + (parents.reverse().map(function (elm, i, a) {
    return '<li' + (i === a.length - 1 ? ' class="current"' : '') + '><button data-index="' + i + '">' + elm.nodeName + '</button></li>';
  }).join('') + (children.length ? '&gt;<select data-children>' + (defaultOption + Array.from(children).map(function (child, j) {
    return '<option value="' + j + '">' + child.nodeName + '</option>';
  })) + '</select>' : '')) + '</ul>\n      <hr>\n\n      <ul class="' + _uiStyle.className.selectors + '">' + appliedCSS.map(function (s) {
    return '\n        <li title="' + formatCSS(s) + '"' + (s.includes(currentQuerySelector) ? ' class="current"' : '') + '>' + s.replace(/{[^}]*}/, '{ … }') + '</li>';
  }).join('') + '\n      </ul>\n      <hr>\n      \n      ' + Object.keys(_cssProps2.default).map(function (legend, i) {
    return '<fieldset>\n        <input type="checkbox" name="props" class="collapse visually-hidden" id="check' + legend + '" ' + (i === 0 ? 'checked' : '') + ' />\n        <label for="check' + legend + '"><legend>' + legend + '</legend></label>\n        <div>\n          ' + _cssProps2.default[legend].map(function (propertyName) {
      return '<label>\n            <span title="' + propertyName + '">' + propertyName + '</span>\n            <select name="' + propertyName + '" data-prop>\n              ' + (defaultOption + _cssPropValues2.default[propertyName].map(function (value) {
        return '<option value="' + value + '">' + value + '</option>';
      })) + '\n            </select>\n          </label>';
    }).join('') + '\n        </div>\n      </fieldset>';
  }).join('') + '\n\n      <hr>\n      <textarea></textarea>';

  applyFormValues();
  showCSS();
  moveGhosts();
  styleSheetBody.appendChild(ghosts);
}

/**
 * Applies the form values by analysing the current style
 */
function applyFormValues() {
  var fieldsets = Array.from(dialog.querySelectorAll('fieldset select'));
  var currentStyle = getCurrentStyle();
  console.log('applyFormValues', currentStyle); // todo: remove log
  fieldsets.forEach(function (sel) {
    var name = sel.getAttribute('name');
    var value = Array.prototype.includes.call(currentStyle, name) && currentStyle[name];
    if (value) {
      var unit = value.replace(/^\d+(\w+)$/, '$1');
      sel.value = unit;
      if (value !== unit) {
        (0, _util.dispatch)(sel, 'change');
        var amount = value.replace(unit, '');
        var sibling = sel.nextElementSibling;
        sibling && (sibling.value = amount);
      }
    }
  });
}

/**
 * Move the ghost element
 */
function moveGhosts() {
  if (lastTarget && ghosts.parentNode) {
    while (ghosts.firstChild) {
      ghosts.removeChild(ghosts.firstChild);
    }Array.from(styleSheetBody.querySelectorAll(currentQuerySelector)).forEach(function (element) {
      var rect = element.getBoundingClientRect();
      (0, _util.createElement)('div.' + _uiStyle.className.ghost, ghosts, function (elm) {
        return Object.assign(elm.style, {
          top: rect.y + px,
          left: rect.x + px,
          width: rect.width + px,
          height: rect.height + px
        });
      });
    });
  }
}

/**
 * Add a style
 * @param {string} prop
 * @param {string} value
 */
function addStyle(prop, value) {
  console.log('addStyle', { prop: prop, value: value }); // todo: remove log
  var querySelector = getBestQuerySelector(lastTarget);
  var _alterstyle2 = alterstyle,
      sheet = _alterstyle2.sheet,
      rules = _alterstyle2.sheet.rules,
      length = _alterstyle2.sheet.rules.length;

  var rule = Array.from(rules).filter(function (rule) {
    return rule.selectorText === querySelector;
  }).pop();
  if (value === '-1') {
    rule && rule.style.removeProperty(prop);
  } else if (rule) {
    rule.style[prop] = value;
  } else {
    sheet.insertRule(querySelector + ' { ' + prop + ': ' + value + ' }', length);
  }
  showCSS();
  moveGhosts();
}

/**
 * Get the best querySelector to overwrite
 * @param {HTMLElement} element
 * @returns {string}
 */
function getBestQuerySelector(element) {
  return (0, _util.css)(element).map(function (s) {
    return s.split(/\s*{/).shift();
  }).map(function (selector) {
    return { selector: selector, value: selector.split(/[.#\s]/g).length };
  }).reduce(function (highest, other) {
    return other.value >= highest.value ? other : highest;
  }, { selector: '', value: 0 }).selector || (0, _util.elementAndParents)(element).reverse().splice(2).map(function (elm) {
    var id = elm.getAttribute('id');
    var classes = elm.getAttribute('class');
    return id && '#' + id || classes && classes.split(/\s/g).map(function (c) {
      return '.' + c;
    }).join('') || elm.nodeName.toLowerCase();
  }).join(' ');
}

/**
 * Get the current style
 * @returns {CSSStyleDeclaration}
 */
function getCurrentStyle() {
  console.log('currentQuerySelector', currentQuerySelector); // todo: remove log
  var currentRule = Array.from(alterstyle.sheet.cssRules).filter(function (rule) {
    return rule.selectorText === currentQuerySelector;
  }).pop();
  return currentRule && currentRule.style;
}

/**
 * Apply the new CSS to the textarea value
 * @implement formatCSS for last two replacements
 */
function showCSS() {
  var _alterstyle3 = alterstyle,
      rules = _alterstyle3.sheet.rules;

  dialog.querySelector('textarea').value = Array.from(rules).map(function (rule) {
    return rule.cssText;
  }).join('\n').replace(/([{;])\s/g, '$1\n  ').replace(/\s*}/g, '\n}\n  ');
}

/**
 * Format CSS whitespace
 * @param {string} css
 * @returns {string}
 */
function formatCSS(css) {
  return css.replace(/([{;])\s/g, '$1\n  ').replace(/\s*}/g, '\n}\n  ');
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map