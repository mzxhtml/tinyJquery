(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.$ = factory());
}(this, (function () { 'use strict';

  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.io/#x15.4.4.18
  if (!Array.prototype.forEach) {

      Array.prototype.forEach = function (callback, thisArg) {

          var T, k;

          if (this == null) {
              throw new TypeError(' this is null or not defined');
          }

          // 1. Let O be the result of calling toObject() passing the
          // |this| value as the argument.
          var O = Object(this);

          // 2. Let lenValue be the result of calling the Get() internal
          // method of O with the argument "length".
          // 3. Let len be toUint32(lenValue).
          var len = O.length >>> 0;

          // 4. If isCallable(callback) is false, throw a TypeError exception. 
          // See: http://es5.github.com/#x9.11
          if (typeof callback !== "function") {
              throw new TypeError(callback + ' is not a function');
          }

          // 5. If thisArg was supplied, let T be thisArg; else let
          // T be undefined.
          if (arguments.length > 1) {
              T = thisArg;
          }

          // 6. Let k be 0
          k = 0;

          // 7. Repeat, while k < len
          while (k < len) {

              var kValue;

              // a. Let Pk be ToString(k).
              //    This is implicit for LHS operands of the in operator
              // b. Let kPresent be the result of calling the HasProperty
              //    internal method of O with argument Pk.
              //    This step can be combined with c
              // c. If kPresent is true, then
              if (k in O) {

                  // i. Let kValue be the result of calling the Get internal
                  // method of O with argument Pk.
                  kValue = O[k];

                  // ii. Call the Call internal method of callback with T as
                  // the this value and argument list containing kValue, k, and O.
                  callback.call(T, kValue, k, O);
              }
              // d. Increase k by 1.
              k++;
          }
          // 8. return undefined
      };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var type = function type(obj) {
      return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  };

  var jsonpID = 0,
      document$1 = window.document,
      key,
      name,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/;

  var ajax = function ajax(options) {
      var settings = extend({}, options || {});
      for (key in ajax.settings) {
          if (settings[key] === undefined) settings[key] = ajax.settings[key];
      }ajaxStart(settings);

      if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;

      var dataType = settings.dataType,
          hasPlaceholder = /=\?/.test(settings.url);
      if (dataType == 'jsonp' || hasPlaceholder) {
          if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?');
          return ajax.JSONP(settings);
      }

      if (!settings.url) settings.url = window.location.toString();
      serializeData(settings);

      var mime = settings.accepts[dataType],
          baseHeaders = {},
          protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
          xhr = ajax.settings.xhr(),
          abortTimeout;

      if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
      if (mime) {
          baseHeaders['Accept'] = mime;
          if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
          xhr.overrideMimeType && xhr.overrideMimeType(mime);
      }
      if (settings.contentType || settings.data && settings.type.toUpperCase() != 'GET') baseHeaders['Content-Type'] = settings.contentType || 'application/x-www-form-urlencoded';
      settings.headers = extend(baseHeaders, settings.headers || {});

      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              clearTimeout(abortTimeout);
              var result,
                  error = false;
              if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
                  dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
                  result = xhr.responseText;

                  try {
                      if (dataType == 'script') (0, eval)(result);else if (dataType == 'xml') result = xhr.responseXML;else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result);
                  } catch (e) {
                      error = e;
                  }

                  if (error) ajaxError(error, 'parsererror', xhr, settings);else ajaxSuccess(result, xhr, settings);
              } else {
                  ajaxError(null, 'error', xhr, settings);
              }
          }
      };

      var async = 'async' in settings ? settings.async : true;
      xhr.open(settings.type, settings.url, async);

      for (name in settings.headers) {
          xhr.setRequestHeader(name, settings.headers[name]);
      }if (ajaxBeforeSend(xhr, settings) === false) {
          xhr.abort();
          return false;
      }

      if (settings.timeout > 0) abortTimeout = setTimeout(function () {
          xhr.onreadystatechange = empty;
          xhr.abort();
          ajaxError(null, 'timeout', xhr, settings);
      }, settings.timeout);

      // avoid sending empty string (#319)
      xhr.send(settings.data ? settings.data : null);
      return xhr;
  };

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
      // todo: Fire off some events var event = $.Event(eventName)
      // $(context).trigger(event, data)
      return true; //!event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
      if (settings.global) return triggerAndReturn(context || document$1, eventName, data);
  }

  // Number of active Ajax requests
  ajax.active = 0;

  function ajaxStart(settings) {
      if (settings.global && ajax.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
  }
  function ajaxStop(settings) {
      if (settings.global && ! --ajax.active) triggerGlobal(settings, null, 'ajaxStop');
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but
  // cancelable
  function ajaxBeforeSend(xhr, settings) {
      var context = settings.context;
      if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) return false;

      triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
  }
  function ajaxSuccess(data, xhr, settings) {
      var context = settings.context,
          status = 'success';
      settings.success.call(context, data, status, xhr);
      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
      ajaxComplete(status, xhr, settings);
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
      var context = settings.context;
      settings.error.call(context, xhr, type, error);
      triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);
      ajaxComplete(type, xhr, settings);
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
      var context = settings.context;
      settings.complete.call(context, xhr, status);
      triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
      ajaxStop(settings);
  }

  // Empty function, used as default callback
  function empty() {}

  ajax.JSONP = function (options) {
      if (!('type' in options)) return ajax(options);

      var callbackName = 'jsonp' + ++jsonpID,
          script = document$1.createElement('script'),
          abort = function abort() {
          //todo: remove script $(script).remove()
          if (callbackName in window) window[callbackName] = empty;
          ajaxComplete('abort', xhr, options);
      },
          xhr = {
          abort: abort
      },
          abortTimeout,
          head = document$1.getElementsByTagName("head")[0] || document$1.documentElement;

      if (options.error) script.onerror = function () {
          xhr.abort();
          options.error();
      };

      window[callbackName] = function (data) {
          clearTimeout(abortTimeout);
          //todo: remove script $(script).remove()
          delete window[callbackName];
          ajaxSuccess(data, xhr, options);
      };

      serializeData(options);
      script.src = options.url.replace(/=\?/, '=' + callbackName);

      // Use insertBefore instead of appendChild to circumvent an IE6 bug. This arises
      // when a base node is used (see jQuery bugs #2709 and #4378).
      head.insertBefore(script, head.firstChild);

      if (options.timeout > 0) abortTimeout = setTimeout(function () {
          xhr.abort();
          ajaxComplete('timeout', xhr, options);
      }, options.timeout);

      return xhr;
  };

  ajax.settings = {
      // Default type of request
      type: 'GET',
      // Callback that is executed before request
      beforeSend: empty,
      // Callback that is executed if the request succeeds
      success: empty,
      // Callback that is executed the the server drops error
      error: empty,
      // Callback that is executed on request complete (both: error and success)
      complete: empty,
      // The context for the callbacks
      context: null,
      // Whether to trigger "global" Ajax events
      global: true,
      // Transport
      xhr: function xhr() {
          return new window.XMLHttpRequest();
      },
      // MIME types mapping
      accepts: {
          script: 'text/javascript, application/javascript',
          json: jsonType,
          xml: 'application/xml, text/xml',
          html: htmlType,
          text: 'text/plain'
      },
      // Whether the request is to another domain
      crossDomain: false,
      // Default timeout
      timeout: 0
  };

  function mimeToDataType(mime) {
      return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
  }

  function appendQuery(url, query) {
      return (url + '&' + query).replace(/[&?]{1,2}/, '?');
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
      if (type(options.data) === 'object') options.data = param(options.data);
      if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) options.url = appendQuery(options.url, options.data);
  }

  ajax.get = function (url, success) {
      return ajax({ url: url, success: success });
  };

  ajax.post = function (url, data, success, dataType) {
      if (type(data) === 'function') dataType = dataType || success, success = data, data = null;
      return ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };

  ajax.getJSON = function (url, success) {
      return ajax({ url: url, success: success, dataType: 'json' });
  };

  var escape = encodeURIComponent;

  function serialize(params, obj, traditional, scope) {
      var array = type(obj) === 'array';
      for (var key in obj) {
          var value = obj[key];

          if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
          // handle data in serializeArray() format
          if (!scope && array) params.add(value.name, value.value);
          // recurse into nested objects
          else if (traditional ? type(value) === 'array' : type(value) === 'object') serialize(params, value, traditional, key);else params.add(key, value);
      }
  }

  function param(obj, traditional) {
      var params = [];
      params.add = function (k, v) {
          this.push(escape(k) + '=' + escape(v));
      };
      serialize(params, obj, traditional);
      return params.join('&').replace('%20', '+');
  }

  function extend(target) {
      var slice = Array.prototype.slice;
      slice.call(arguments, 1).forEach(function (source) {
          for (key in source) {
              if (source[key] !== undefined) target[key] = source[key];
          }
      });
      return target;
  }

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var TinyJquery = function () {
      function TinyJquery(el) {
          _classCallCheck(this, TinyJquery);

          var $el = void 0;
          if (typeof el == 'string') {
              $el = document.querySelectorAll(el);
          } else if (typeof el == 'array' || el.length) {
              $el = el;
          } else {
              $el = [el];
          }
          this.$el = [].slice.call($el);
      }
      // addEventListener


      _createClass(TinyJquery, [{
          key: 'on',
          value: function on(eventName, fn) {
              var bubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

              this.$el.forEach(function (i) {
                  if (document.addEventListener) {
                      i.addEventListener(eventName, fn, !bubble);
                  } else {
                      i.attachEvent('on' + eventName, fn);
                  }
              });
              return this;
          }
          // removeEventListener

      }, {
          key: 'un',
          value: function un(eventName, fn) {
              var bubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

              this.$el.forEach(function (i) {
                  if (document.removeEventListener) {
                      i.removeEventListener(eventName, fn, !bubble);
                  } else {
                      i.detachEvent('on' + eventName, fn);
                  }
              });
              return this;
          }
          // addClass

      }, {
          key: 'ac',
          value: function ac(className) {
              this.$el.forEach(function (i) {
                  if (i.classList) {
                      i.classList.add(className);
                  } else {
                      i.className += ' ' + className;
                  }
              });
              return this;
          }
          // removeClass

      }, {
          key: 'rc',
          value: function rc(className) {
              this.$el.forEach(function (i) {
                  if (i.classList) {
                      i.classList.remove(className);
                  } else {
                      i.className = i.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                  }
              });
              return this;
          }
          // toggleClass

      }, {
          key: 'tc',
          value: function tc(className) {
              var _this = this;

              this.$el.forEach(function (i) {
                  if (i.classList) {
                      i.classList.toggle(className);
                  } else {
                      var cl = i.className.split(' ');
                      if (cl.indexOf(className) > -1) {
                          _this.rc(className);
                      } else {
                          _this.ac(className);
                      }
                  }
              });
              return this;
          }
          // containClass

      }, {
          key: 'cc',
          value: function cc(className) {
              var flag = false;
              this.$el.forEach(function (i) {
                  if (i.classList) {
                      if (i.classList.contains(className)) flag = true;
                  } else {
                      var cl = i.className.split(' ');
                      if (cl.indexOf(className) > -1) flag = true;
                  }
              });
              return flag;
          }
          // set inline style

      }, {
          key: 'css',
          value: function css(obj) {
              var pseudoElt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

              if (typeof obj == 'string') {
                  if (window.getComputedStyle) {
                      return window.getComputedStyle(this.$el[0], pseudoElt)[obj];
                  } else {
                      return this.$el[0].currentStyle;
                  }
              } else {
                  this.$el.forEach(function (v) {
                      for (var i in obj) {
                          v.style[i] = obj[i];
                      }
                  });
                  return this;
              }
          }
          // get or set input value

      }, {
          key: 'val',
          value: function val(_val) {
              if (_val) {
                  this.$el[0].value = _val;
                  return this;
              } else {
                  return this.$el[0].value;
              }
          }
          // get or set dom innerHtml

      }, {
          key: 'html',
          value: function html(val) {
              if (val) {
                  this.$el.forEach(function (i) {
                      i.innerHTML = val;
                  });
                  return this;
              } else {
                  return this.$el[0].innerHTML;
              }
          }
          // get or set attribute

      }, {
          key: 'attr',
          value: function attr(key, val) {
              if (key && !val) {
                  return this.$el[0].getAttribute(key);
              } else {
                  this.$el.forEach(function (i) {
                      i.setAttribute(key, val);
                  });
                  return this;
              }
          }
          // get JSONData

      }, {
          key: 'serializeObject',
          value: function serializeObject() {
              var obj = {};
              this.$el[0].querySelectorAll('input').forEach(function (i) {
                  if ($(i).attr('type') == 'radio') {
                      if (i.checked) {
                          obj[$(i).attr('name')] = $(i).attr('value');
                      }
                  } else if ($(i).attr('type') == 'checkbox') {
                      if (i.checked) {
                          if (obj[$(i).attr('name')]) {
                              obj[$(i).attr('name')].push($(i).attr('value'));
                          } else {
                              obj[$(i).attr('name')] = [$(i).attr('value')];
                          }
                      }
                  } else {
                      obj[$(i).attr('name')] = $(i).val();
                  }
              });
              return obj;
          }
          // parent

      }, {
          key: 'parent',
          value: function parent() {
              return $(this.$el[0].parentNode);
          }
          // siblings

      }, {
          key: 'siblings',
          value: function siblings() {
              var dom = this.$el[0];
              var a = [];
              var p = dom.parentNode.children;
              for (var i = 0, pl = p.length; i < pl; i++) {
                  if (p[i] !== dom) a.push(p[i]);
              }
              // console.log(Array.isArray(a))
              return $(a);
          }
          // 获取原生Dom

      }, {
          key: 'getDom',
          value: function getDom() {
              return this.$el[0];
          }
          // 获取原生Dom列表

      }, {
          key: 'getDomList',
          value: function getDomList() {
              return this.$el;
          }
          // each

      }, {
          key: 'each',
          value: function each(callback) {
              this.$el.forEach(function (i) {
                  callback(i);
              });
          }
      }, {
          key: 'append',
          value: function append(val) {
              val = isTJ(val) ? val.getDom() : val;
              this.$el.forEach(function (i) {
                  return i.appendChild(val);
              });
              return this;
          }
      }, {
          key: 'appendTo',
          value: function appendTo(val) {
              val = isTJ(val) ? val.getDom() : val;
              this.$el.forEach(function (i) {
                  return val.appendChild(i);
              });
              return this;
          }
      }, {
          key: 'remove',
          value: function remove() {
              this.$el.forEach(function (i) {
                  i.parentNode.removeChild(i);
              });
              return this;
          }
      }, {
          key: 'height',
          value: function height() {
              if (this.$el[0] == window) {
                  return window.innerHeight;
              } else {
                  return this.$el[0].offsetHeight;
              }
          }
      }, {
          key: 'width',
          value: function width() {
              if (this.$el[0] == window) {
                  return window.innerWidth;
              } else {
                  return this.$el[0].offsetWidth;
              }
          }
      }, {
          key: 'bound',
          value: function bound() {
              return this.$el[0].getBoundingClientRect();
          }
      }]);

      return TinyJquery;
  }();

  function isTJ(obj) {
      return obj instanceof TinyJquery;
  }

  function $(el) {
      return new TinyJquery(el);
  }

  // console.log(ajax)
  $.ajax = ajax;

  return $;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueUpxdWVyeS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2pzL3V0aWwvcG9seWZpbGwuanMiLCIuLi8uLi9zcmMvanMvdXRpbC9hamF4LmpzIiwiLi4vLi4vc3JjL2pzL3V0aWwvVGlueUpxdWVyeS5qcyIsIi4uLy4uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQcm9kdWN0aW9uIHN0ZXBzIG9mIEVDTUEtMjYyLCBFZGl0aW9uIDUsIDE1LjQuNC4xOFxyXG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE4XHJcbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcclxuXHJcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xyXG5cclxuICAgIHZhciBULCBrO1xyXG5cclxuICAgIGlmICh0aGlzID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignIHRoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0b09iamVjdCgpIHBhc3NpbmcgdGhlXHJcbiAgICAvLyB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0KCkgaW50ZXJuYWxcclxuICAgIC8vIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXHJcbiAgICAvLyAzLiBMZXQgbGVuIGJlIHRvVWludDMyKGxlblZhbHVlKS5cclxuICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcclxuXHJcbiAgICAvLyA0LiBJZiBpc0NhbGxhYmxlKGNhbGxiYWNrKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLiBcclxuICAgIC8vIFNlZTogaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS4xMVxyXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNS4gSWYgdGhpc0FyZyB3YXMgc3VwcGxpZWQsIGxldCBUIGJlIHRoaXNBcmc7IGVsc2UgbGV0XHJcbiAgICAvLyBUIGJlIHVuZGVmaW5lZC5cclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICBUID0gdGhpc0FyZztcclxuICAgIH1cclxuXHJcbiAgICAvLyA2LiBMZXQgayBiZSAwXHJcbiAgICBrID0gMDtcclxuXHJcbiAgICAvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cclxuICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcblxyXG4gICAgICB2YXIga1ZhbHVlO1xyXG5cclxuICAgICAgLy8gYS4gTGV0IFBrIGJlIFRvU3RyaW5nKGspLlxyXG4gICAgICAvLyAgICBUaGlzIGlzIGltcGxpY2l0IGZvciBMSFMgb3BlcmFuZHMgb2YgdGhlIGluIG9wZXJhdG9yXHJcbiAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5XHJcbiAgICAgIC8vICAgIGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXHJcbiAgICAgIC8vICAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjXHJcbiAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cclxuICAgICAgaWYgKGsgaW4gTykge1xyXG5cclxuICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsXHJcbiAgICAgICAgLy8gbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cclxuICAgICAgICBrVmFsdWUgPSBPW2tdO1xyXG5cclxuICAgICAgICAvLyBpaS4gQ2FsbCB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2sgd2l0aCBUIGFzXHJcbiAgICAgICAgLy8gdGhlIHRoaXMgdmFsdWUgYW5kIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyBrVmFsdWUsIGssIGFuZCBPLlxyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwoVCwga1ZhbHVlLCBrLCBPKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBkLiBJbmNyZWFzZSBrIGJ5IDEuXHJcbiAgICAgIGsrKztcclxuICAgIH1cclxuICAgIC8vIDguIHJldHVybiB1bmRlZmluZWRcclxuICB9O1xyXG59IiwidmFyIHR5cGUgPSAob2JqKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmpcclxuICAgIH1cclxuXHJcbiAgICB2YXIganNvbnBJRCA9IDAsXHJcbiAgICAgICAgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXHJcbiAgICAgICAga2V5LFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgcnNjcmlwdCA9IC88c2NyaXB0XFxiW148XSooPzooPyE8XFwvc2NyaXB0Pik8W148XSopKjxcXC9zY3JpcHQ+L2dpLFxyXG4gICAgICAgIHNjcmlwdFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC9qYXZhc2NyaXB0L2ksXHJcbiAgICAgICAgeG1sVHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL3htbC9pLFxyXG4gICAgICAgIGpzb25UeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIGh0bWxUeXBlID0gJ3RleHQvaHRtbCcsXHJcbiAgICAgICAgYmxhbmtSRSA9IC9eXFxzKiQvXHJcblxyXG4gICAgdmFyIGFqYXggPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBzZXR0aW5ncyA9IGV4dGVuZCh7fSwgb3B0aW9ucyB8fCB7fSlcclxuICAgICAgICAgICAgZm9yIChrZXkgaW4gYWpheC5zZXR0aW5ncykgXHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3Nba2V5XSA9PT0gdW5kZWZpbmVkKSBcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nc1trZXldID0gYWpheC5zZXR0aW5nc1trZXldXHJcblxyXG4gICAgICAgIGFqYXhTdGFydChzZXR0aW5ncylcclxuXHJcbiAgICAgICAgICAgIGlmICghc2V0dGluZ3MuY3Jvc3NEb21haW4pIFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY3Jvc3NEb21haW4gPSAvXihbXFx3LV0rOik/XFwvXFwvKFteXFwvXSspLy50ZXN0KHNldHRpbmdzLnVybCkgJiYgUmVnRXhwLiQyICE9IHdpbmRvdy5sb2NhdGlvbi5ob3N0XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YVR5cGUgPSBzZXR0aW5ncy5kYXRhVHlwZSxcclxuICAgICAgICAgICAgICAgIGhhc1BsYWNlaG9sZGVyID0gLz1cXD8vLnRlc3Qoc2V0dGluZ3MudXJsKVxyXG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT0gJ2pzb25wJyB8fCBoYXNQbGFjZWhvbGRlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNQbGFjZWhvbGRlcikgXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudXJsID0gYXBwZW5kUXVlcnkoc2V0dGluZ3MudXJsLCAnY2FsbGJhY2s9PycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWpheC5KU09OUChzZXR0aW5ncylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy51cmwpIFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MudXJsID0gd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgc2VyaWFsaXplRGF0YShzZXR0aW5ncylcclxuXHJcbiAgICAgICAgICAgIHZhciBtaW1lID0gc2V0dGluZ3MuYWNjZXB0c1tkYXRhVHlwZV0sXHJcbiAgICAgICAgICAgICAgICBiYXNlSGVhZGVycyA9IHt9LFxyXG4gICAgICAgICAgICAgICAgcHJvdG9jb2wgPSAvXihbXFx3LV0rOilcXC9cXC8vLnRlc3Qoc2V0dGluZ3MudXJsKVxyXG4gICAgICAgICAgICAgICAgICAgID8gUmVnRXhwLiQxXHJcbiAgICAgICAgICAgICAgICAgICAgOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wsXHJcbiAgICAgICAgICAgICAgICB4aHIgPSBhamF4XHJcbiAgICAgICAgICAgICAgICAgICAgLnNldHRpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgLnhocigpLFxyXG4gICAgICAgICAgICAgICAgYWJvcnRUaW1lb3V0XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNldHRpbmdzLmNyb3NzRG9tYWluKSBcclxuICAgICAgICAgICAgICAgIGJhc2VIZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ10gPSAnWE1MSHR0cFJlcXVlc3QnXHJcbiAgICAgICAgICAgIGlmIChtaW1lKSB7XHJcbiAgICAgICAgICAgICAgICBiYXNlSGVhZGVyc1snQWNjZXB0J10gPSBtaW1lXHJcbiAgICAgICAgICAgICAgICBpZiAobWltZS5pbmRleE9mKCcsJykgPiAtMSkgXHJcbiAgICAgICAgICAgICAgICAgICAgbWltZSA9IG1pbWUuc3BsaXQoJywnLCAyKVswXVxyXG4gICAgICAgICAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUgJiYgeGhyLm92ZXJyaWRlTWltZVR5cGUobWltZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgKHNldHRpbmdzLmRhdGEgJiYgc2V0dGluZ3MudHlwZS50b1VwcGVyQ2FzZSgpICE9ICdHRVQnKSkgXHJcbiAgICAgICAgICAgICAgICBiYXNlSGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXHJcbiAgICAgICAgICAgIHNldHRpbmdzLmhlYWRlcnMgPSBleHRlbmQoYmFzZUhlYWRlcnMsIHNldHRpbmdzLmhlYWRlcnMgfHwge30pXHJcblxyXG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHx8IHhoci5zdGF0dXMgPT0gMzA0IHx8ICh4aHIuc3RhdHVzID09IDAgJiYgcHJvdG9jb2wgPT0gJ2ZpbGU6JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBtaW1lVG9EYXRhVHlwZSh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4aHIucmVzcG9uc2VUZXh0XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09ICdzY3JpcHQnKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMSwgZXZhbCkocmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT0gJ3htbCcpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVhNTFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT0gJ2pzb24nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBibGFua1JFLnRlc3QocmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBKU09OLnBhcnNlKHJlc3VsdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWpheEVycm9yKGVycm9yLCAncGFyc2VyZXJyb3InLCB4aHIsIHNldHRpbmdzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWpheFN1Y2Nlc3MocmVzdWx0LCB4aHIsIHNldHRpbmdzKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFqYXhFcnJvcihudWxsLCAnZXJyb3InLCB4aHIsIHNldHRpbmdzKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGFzeW5jID0gJ2FzeW5jJyBpbiBzZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgPyBzZXR0aW5ncy5hc3luY1xyXG4gICAgICAgICAgICAgICAgOiB0cnVlXHJcbiAgICAgICAgICAgIHhoci5vcGVuKHNldHRpbmdzLnR5cGUsIHNldHRpbmdzLnVybCwgYXN5bmMpXHJcblxyXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gc2V0dGluZ3MuaGVhZGVycykgXHJcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBzZXR0aW5ncy5oZWFkZXJzW25hbWVdKVxyXG5cclxuICAgICAgICAgICAgaWYgKGFqYXhCZWZvcmVTZW5kKHhociwgc2V0dGluZ3MpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgeGhyLmFib3J0KClcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MudGltZW91dCA+IDApIFxyXG4gICAgICAgICAgICAgICAgYWJvcnRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGVtcHR5XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KClcclxuICAgICAgICAgICAgICAgICAgICBhamF4RXJyb3IobnVsbCwgJ3RpbWVvdXQnLCB4aHIsIHNldHRpbmdzKVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0dGluZ3MudGltZW91dClcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBhdm9pZCBzZW5kaW5nIGVtcHR5IHN0cmluZyAoIzMxOSlcclxuICAgICAgICAgICAgeGhyLnNlbmQoc2V0dGluZ3MuZGF0YVxyXG4gICAgICAgICAgICAgICAgPyBzZXR0aW5ncy5kYXRhXHJcbiAgICAgICAgICAgICAgICA6IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB4aHJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgYW5kIHJldHVybiBmYWxzZSBpZiBpdCB3YXMgY2FuY2VsbGVkXHJcbiAgICAgICAgZnVuY3Rpb24gdHJpZ2dlckFuZFJldHVybihjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gdG9kbzogRmlyZSBvZmYgc29tZSBldmVudHMgdmFyIGV2ZW50ID0gJC5FdmVudChldmVudE5hbWUpXHJcbiAgICAgICAgICAgIC8vICQoY29udGV4dCkudHJpZ2dlcihldmVudCwgZGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRyaWdnZXIgYW4gQWpheCBcImdsb2JhbFwiIGV2ZW50XHJcbiAgICAgICAgZnVuY3Rpb24gdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5nbG9iYWwpIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyaWdnZXJBbmRSZXR1cm4oY29udGV4dCB8fCBkb2N1bWVudCwgZXZlbnROYW1lLCBkYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTnVtYmVyIG9mIGFjdGl2ZSBBamF4IHJlcXVlc3RzXHJcbiAgICAgICAgYWpheC5hY3RpdmUgPSAwXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFqYXhTdGFydChzZXR0aW5ncykge1xyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmIGFqYXguYWN0aXZlKysgPT09IDApIFxyXG4gICAgICAgICAgICAgICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgbnVsbCwgJ2FqYXhTdGFydCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGFqYXhTdG9wKHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5nbG9iYWwgJiYgISgtLWFqYXguYWN0aXZlKSkgXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0b3AnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdHJpZ2dlcnMgYW4gZXh0cmEgZ2xvYmFsIGV2ZW50IFwiYWpheEJlZm9yZVNlbmRcIiB0aGF0J3MgbGlrZSBcImFqYXhTZW5kXCIgYnV0XHJcbiAgICAgICAgLy8gY2FuY2VsYWJsZVxyXG4gICAgICAgIGZ1bmN0aW9uIGFqYXhCZWZvcmVTZW5kKHhociwgc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5iZWZvcmVTZW5kLmNhbGwoY29udGV4dCwgeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlIHx8IHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4QmVmb3JlU2VuZCcsIFt4aHIsIHNldHRpbmdzXSkgPT09IGZhbHNlKSBcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgICAgICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTZW5kJywgW3hociwgc2V0dGluZ3NdKVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBhamF4U3VjY2VzcyhkYXRhLCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdzdWNjZXNzJ1xyXG4gICAgICAgICAgICBzZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgIC5jYWxsKGNvbnRleHQsIGRhdGEsIHN0YXR1cywgeGhyKVxyXG4gICAgICAgICAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFN1Y2Nlc3MnLCBbeGhyLCBzZXR0aW5ncywgZGF0YV0pXHJcbiAgICAgICAgICAgIGFqYXhDb21wbGV0ZShzdGF0dXMsIHhociwgc2V0dGluZ3MpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHR5cGU6IFwidGltZW91dFwiLCBcImVycm9yXCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXHJcbiAgICAgICAgZnVuY3Rpb24gYWpheEVycm9yKGVycm9yLCB0eXBlLCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxyXG4gICAgICAgICAgICBzZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgLmVycm9yXHJcbiAgICAgICAgICAgICAgICAuY2FsbChjb250ZXh0LCB4aHIsIHR5cGUsIGVycm9yKVxyXG4gICAgICAgICAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheEVycm9yJywgW3hociwgc2V0dGluZ3MsIGVycm9yXSlcclxuICAgICAgICAgICAgYWpheENvbXBsZXRlKHR5cGUsIHhociwgc2V0dGluZ3MpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHN0YXR1czogXCJzdWNjZXNzXCIsIFwibm90bW9kaWZpZWRcIiwgXCJlcnJvclwiLCBcInRpbWVvdXRcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcclxuICAgICAgICBmdW5jdGlvbiBhamF4Q29tcGxldGUoc3RhdHVzLCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxyXG4gICAgICAgICAgICBzZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgLmNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAuY2FsbChjb250ZXh0LCB4aHIsIHN0YXR1cylcclxuICAgICAgICAgICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhDb21wbGV0ZScsIFt4aHIsIHNldHRpbmdzXSlcclxuICAgICAgICAgICAgYWpheFN0b3Aoc2V0dGluZ3MpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBFbXB0eSBmdW5jdGlvbiwgdXNlZCBhcyBkZWZhdWx0IGNhbGxiYWNrXHJcbiAgICAgICAgZnVuY3Rpb24gZW1wdHkoKSB7fVxyXG5cclxuICAgICAgICBhamF4LkpTT05QID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKCEoJ3R5cGUnIGluIG9wdGlvbnMpKSBcclxuICAgICAgICAgICAgICAgIHJldHVybiBhamF4KG9wdGlvbnMpXHJcblxyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tOYW1lID0gJ2pzb25wJyArICgrK2pzb25wSUQpLFxyXG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXHJcbiAgICAgICAgICAgICAgICBhYm9ydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3RvZG86IHJlbW92ZSBzY3JpcHQgJChzY3JpcHQpLnJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrTmFtZSBpbiB3aW5kb3cpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGVtcHR5XHJcbiAgICAgICAgICAgICAgICAgICAgYWpheENvbXBsZXRlKCdhYm9ydCcsIHhociwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB4aHIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWJvcnQ6IGFib3J0XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYWJvcnRUaW1lb3V0LFxyXG4gICAgICAgICAgICAgICAgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yKSBcclxuICAgICAgICAgICAgICAgIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hYm9ydCgpXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvcigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxyXG4gICAgICAgICAgICAgICAgLy90b2RvOiByZW1vdmUgc2NyaXB0ICQoc2NyaXB0KS5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja05hbWVdXHJcbiAgICAgICAgICAgICAgICBhamF4U3VjY2VzcyhkYXRhLCB4aHIsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZURhdGEob3B0aW9ucylcclxuICAgICAgICAgICAgc2NyaXB0LnNyYyA9IG9wdGlvbnNcclxuICAgICAgICAgICAgICAgIC51cmxcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC89XFw/LywgJz0nICsgY2FsbGJhY2tOYW1lKVxyXG5cclxuICAgICAgICAgICAgLy8gVXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIGFwcGVuZENoaWxkIHRvIGNpcmN1bXZlbnQgYW4gSUU2IGJ1Zy4gVGhpcyBhcmlzZXNcclxuICAgICAgICAgICAgLy8gd2hlbiBhIGJhc2Ugbm9kZSBpcyB1c2VkIChzZWUgalF1ZXJ5IGJ1Z3MgIzI3MDkgYW5kICM0Mzc4KS5cclxuICAgICAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBoZWFkLmZpcnN0Q2hpbGQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudGltZW91dCA+IDApIFxyXG4gICAgICAgICAgICAgICAgYWJvcnRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KClcclxuICAgICAgICAgICAgICAgICAgICBhamF4Q29tcGxldGUoJ3RpbWVvdXQnLCB4aHIsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICB9LCBvcHRpb25zLnRpbWVvdXQpXHJcblxyXG4gICAgICAgICAgICByZXR1cm4geGhyXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhamF4LnNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICAvLyBEZWZhdWx0IHR5cGUgb2YgcmVxdWVzdFxyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBiZWZvcmUgcmVxdWVzdFxyXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBlbXB0eSxcclxuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkc1xyXG4gICAgICAgICAgICBzdWNjZXNzOiBlbXB0eSxcclxuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCB0aGUgdGhlIHNlcnZlciBkcm9wcyBlcnJvclxyXG4gICAgICAgICAgICBlcnJvcjogZW1wdHksXHJcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgb24gcmVxdWVzdCBjb21wbGV0ZSAoYm90aDogZXJyb3IgYW5kIHN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBlbXB0eSxcclxuICAgICAgICAgICAgLy8gVGhlIGNvbnRleHQgZm9yIHRoZSBjYWxsYmFja3NcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgLy8gV2hldGhlciB0byB0cmlnZ2VyIFwiZ2xvYmFsXCIgQWpheCBldmVudHNcclxuICAgICAgICAgICAgZ2xvYmFsOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBUcmFuc3BvcnRcclxuICAgICAgICAgICAgeGhyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIE1JTUUgdHlwZXMgbWFwcGluZ1xyXG4gICAgICAgICAgICBhY2NlcHRzOiB7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQ6ICd0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQnLFxyXG4gICAgICAgICAgICAgICAganNvbjoganNvblR5cGUsXHJcbiAgICAgICAgICAgICAgICB4bWw6ICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJyxcclxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxUeXBlLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ3RleHQvcGxhaW4nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFdoZXRoZXIgdGhlIHJlcXVlc3QgaXMgdG8gYW5vdGhlciBkb21haW5cclxuICAgICAgICAgICAgY3Jvc3NEb21haW46IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyBEZWZhdWx0IHRpbWVvdXRcclxuICAgICAgICAgICAgdGltZW91dDogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWltZVRvRGF0YVR5cGUobWltZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWltZSAmJiAobWltZSA9PSBodG1sVHlwZVxyXG4gICAgICAgICAgICAgICAgPyAnaHRtbCdcclxuICAgICAgICAgICAgICAgIDogbWltZSA9PSBqc29uVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgID8gJ2pzb24nXHJcbiAgICAgICAgICAgICAgICAgICAgOiBzY3JpcHRUeXBlUkUudGVzdChtaW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdzY3JpcHQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogeG1sVHlwZVJFLnRlc3QobWltZSkgJiYgJ3htbCcpIHx8ICd0ZXh0J1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXBwZW5kUXVlcnkodXJsLCBxdWVyeSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHVybCArICcmJyArIHF1ZXJ5KS5yZXBsYWNlKC9bJj9dezEsMn0vLCAnPycpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXJpYWxpemUgcGF5bG9hZCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBVUkwgZm9yIEdFVCByZXF1ZXN0c1xyXG4gICAgICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodHlwZShvcHRpb25zLmRhdGEpID09PSAnb2JqZWN0JykgXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmRhdGEgPSBwYXJhbShvcHRpb25zLmRhdGEpXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgKCFvcHRpb25zLnR5cGUgfHwgb3B0aW9ucy50eXBlLnRvVXBwZXJDYXNlKCkgPT0gJ0dFVCcpKSBcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gYXBwZW5kUXVlcnkob3B0aW9ucy51cmwsIG9wdGlvbnMuZGF0YSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFqYXguZ2V0ID0gZnVuY3Rpb24gKHVybCwgc3VjY2Vzcykge1xyXG4gICAgICAgICAgICByZXR1cm4gYWpheCh7dXJsOiB1cmwsIHN1Y2Nlc3M6IHN1Y2Nlc3N9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWpheC5wb3N0ID0gZnVuY3Rpb24gKHVybCwgZGF0YSwgc3VjY2VzcywgZGF0YVR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGUoZGF0YSkgPT09ICdmdW5jdGlvbicpIFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBzdWNjZXNzLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IGRhdGEsXHJcbiAgICAgICAgICAgICAgICBkYXRhID0gbnVsbFxyXG4gICAgICAgICAgICByZXR1cm4gYWpheCh7dHlwZTogJ1BPU1QnLCB1cmw6IHVybCwgZGF0YTogZGF0YSwgc3VjY2Vzczogc3VjY2VzcywgZGF0YVR5cGU6IGRhdGFUeXBlfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFqYXguZ2V0SlNPTiA9IGZ1bmN0aW9uICh1cmwsIHN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFqYXgoe3VybDogdXJsLCBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhVHlwZTogJ2pzb24nfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlc2NhcGUgPSBlbmNvZGVVUklDb21wb25lbnRcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VyaWFsaXplKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbCwgc2NvcGUpIHtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gdHlwZShvYmopID09PSAnYXJyYXknO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUpIFxyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHRyYWRpdGlvbmFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gc2NvcGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBzY29wZSArICdbJyArIChhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBrZXkpICsgJ10nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlIGRhdGEgaW4gc2VyaWFsaXplQXJyYXkoKSBmb3JtYXRcclxuICAgICAgICAgICAgICAgIGlmICghc2NvcGUgJiYgYXJyYXkpIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5hZGQodmFsdWUubmFtZSwgdmFsdWUudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVjdXJzZSBpbnRvIG5lc3RlZCBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0cmFkaXRpb25hbFxyXG4gICAgICAgICAgICAgICAgICAgID8gKHR5cGUodmFsdWUpID09PSAnYXJyYXknKVxyXG4gICAgICAgICAgICAgICAgICAgIDogKHR5cGUodmFsdWUpID09PSAnb2JqZWN0JykpIFxyXG4gICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZShwYXJhbXMsIHZhbHVlLCB0cmFkaXRpb25hbCwga2V5KVxyXG4gICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMuYWRkKGtleSwgdmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBhcmFtKG9iaiwgdHJhZGl0aW9uYWwpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdXHJcbiAgICAgICAgICAgIHBhcmFtcy5hZGQgPSBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGVzY2FwZShrKSArICc9JyArIGVzY2FwZSh2KSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXJpYWxpemUocGFyYW1zLCBvYmosIHRyYWRpdGlvbmFsKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAuam9pbignJicpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgnJTIwJywgJysnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xyXG4gICAgICAgICAgICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbiAgICAgICAgICAgIHNsaWNlXHJcbiAgICAgICAgICAgICAgICAuY2FsbChhcmd1bWVudHMsIDEpXHJcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gc291cmNlKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZVtrZXldICE9PSB1bmRlZmluZWQpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhhamF4KVxyXG4gICAgICAgIGV4cG9ydCBkZWZhdWx0IGFqYXgiLCJjbGFzcyBUaW55SnF1ZXJ5IHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICAgICAgbGV0ICRlbFxyXG4gICAgICAgIGlmKHR5cGVvZiBlbCA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAkZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsKVxyXG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2YgZWwgPT0gJ2FycmF5JyB8fCBlbC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGVsID0gZWxcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkZWwgPSBbZWxdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVsID0gW10uc2xpY2UuY2FsbCgkZWwpXHJcbiAgICB9XHJcbiAgICAvLyBhZGRFdmVudExpc3RlbmVyXHJcbiAgICBvbihldmVudE5hbWUsIGZuLCBidWJibGUgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIGkuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCAhYnViYmxlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaS5hdHRhY2hFdmVudChgb24ke2V2ZW50TmFtZX1gLCBmbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIHJlbW92ZUV2ZW50TGlzdGVuZXJcclxuICAgIHVuKGV2ZW50TmFtZSwgZm4sIGJ1YmJsZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaWYoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgaS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZm4sICFidWJibGUpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpLmRldGFjaEV2ZW50KGBvbiR7ZXZlbnROYW1lfWAsIGZuKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gYWRkQ2xhc3NcclxuICAgIGFjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGkuY2xhc3NMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaS5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyByZW1vdmVDbGFzc1xyXG4gICAgcmMoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaWYoaS5jbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTmFtZSA9IGkuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gdG9nZ2xlQ2xhc3NcclxuICAgIHRjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGkuY2xhc3NMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsID0gaS5jbGFzc05hbWUuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgICAgICAgaWYoY2wuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJjKGNsYXNzTmFtZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hYyhjbGFzc05hbWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBjb250YWluQ2xhc3NcclxuICAgIGNjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIGxldCBmbGFnID0gZmFsc2VcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpZihpLmNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgZmxhZyA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbCA9IGkuY2xhc3NOYW1lLnNwbGl0KCcgJylcclxuICAgICAgICAgICAgICAgIGlmKGNsLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSBmbGFnID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gZmxhZ1xyXG4gICAgfVxyXG4gICAgLy8gc2V0IGlubGluZSBzdHlsZVxyXG4gICAgY3NzKG9iaiwgcHNldWRvRWx0ID0gbnVsbCkge1xyXG4gICAgICAgIGlmKHR5cGVvZiBvYmogPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRlbFswXSwgcHNldWRvRWx0KVtvYmpdXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0uY3VycmVudFN0eWxlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHYuc3R5bGVbaV0gPSBvYmpbaV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBnZXQgb3Igc2V0IGlucHV0IHZhbHVlXHJcbiAgICB2YWwodmFsKSB7XHJcbiAgICAgICAgaWYodmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsWzBdLnZhbHVlID0gdmFsXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IG9yIHNldCBkb20gaW5uZXJIdG1sXHJcbiAgICBodG1sKHZhbCkge1xyXG4gICAgICAgIGlmKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaS5pbm5lckhUTUwgPSB2YWxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0uaW5uZXJIVE1MXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IG9yIHNldCBhdHRyaWJ1dGVcclxuICAgIGF0dHIoa2V5LCB2YWwpIHtcclxuICAgICAgICBpZihrZXkgJiYgIXZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0uZ2V0QXR0cmlidXRlKGtleSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoa2V5LCB2YWwpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IEpTT05EYXRhXHJcbiAgICBzZXJpYWxpemVPYmplY3QoKSB7XHJcbiAgICAgICAgbGV0IG9iaiA9IHt9XHJcbiAgICAgICAgdGhpcy4kZWxbMF0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKS5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpZigkKGkpLmF0dHIoJ3R5cGUnKSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbJChpKS5hdHRyKCduYW1lJyldID0gJChpKS5hdHRyKCd2YWx1ZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZigkKGkpLmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihvYmpbJChpKS5hdHRyKCduYW1lJyldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialskKGkpLmF0dHIoJ25hbWUnKV0ucHVzaCgkKGkpLmF0dHIoJ3ZhbHVlJykpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqWyQoaSkuYXR0cignbmFtZScpXSA9IFskKGkpLmF0dHIoJ3ZhbHVlJyldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb2JqWyQoaSkuYXR0cignbmFtZScpXSA9ICQoaSkudmFsKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG4gICAgLy8gcGFyZW50XHJcbiAgICBwYXJlbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuICQodGhpcy4kZWxbMF0ucGFyZW50Tm9kZSlcclxuICAgIH1cclxuICAgIC8vIHNpYmxpbmdzXHJcbiAgICBzaWJsaW5ncygpIHtcclxuICAgICAgICBsZXQgZG9tID0gdGhpcy4kZWxbMF1cclxuICAgICAgICB2YXIgYSA9IFtdO1xyXG4gICAgICAgIHZhciBwID0gZG9tLnBhcmVudE5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHBsID0gcC5sZW5ndGg7IGkgPCBwbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwW2ldICE9PSBkb20pIGEucHVzaChwW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coQXJyYXkuaXNBcnJheShhKSlcclxuICAgICAgICByZXR1cm4gJChhKVxyXG4gICAgfVxyXG4gICAgLy8g6I635Y+W5Y6f55SfRG9tXHJcbiAgICBnZXREb20oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdXHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bljp/nlJ9Eb23liJfooahcclxuICAgIGdldERvbUxpc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsXHJcbiAgICB9XHJcbiAgICAvLyBlYWNoXHJcbiAgICBlYWNoKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2soaSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgYXBwZW5kKHZhbCkge1xyXG4gICAgICAgIHZhbCA9IGlzVEoodmFsKSA/IHZhbC5nZXREb20oKSA6IHZhbFxyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiBpLmFwcGVuZENoaWxkKHZhbCkpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIGFwcGVuZFRvKHZhbCkge1xyXG4gICAgICAgIHZhbCA9IGlzVEoodmFsKSA/IHZhbC5nZXREb20oKSA6IHZhbFxyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB2YWwuYXBwZW5kQ2hpbGQoaSkpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICBoZWlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy4kZWxbMF0gPT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0ub2Zmc2V0SGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2lkdGgoKSB7XHJcbiAgICAgICAgaWYodGhpcy4kZWxbMF0gPT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbFswXS5vZmZzZXRXaWR0aFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGJvdW5kKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1RKKG9iaikge1xyXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIFRpbnlKcXVlcnlcclxufVxyXG5cclxuZnVuY3Rpb24gJChlbCkge1xyXG4gICAgcmV0dXJuIG5ldyBUaW55SnF1ZXJ5KGVsKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAkIiwiaW1wb3J0ICcuL3V0aWwvcG9seWZpbGwnXHJcblxyXG5pbXBvcnQgYWpheCBmcm9tICcuL3V0aWwvYWpheCdcclxuLy8g55SoRVM25YaZ55qE5b6u5Z6L5Lu/SlF1ZXJ55bqT77yM5pSv5oyB6ZO+5byP5pON5L2cLCDmlK/mjIFJRTEw5Y+K5Lul5LiKXHJcbmltcG9ydCAkIGZyb20gJy4vdXRpbC9UaW55SnF1ZXJ5J1xyXG4vLyBjb25zb2xlLmxvZyhhamF4KVxyXG4kLmFqYXggPSBhamF4XHJcblxyXG5leHBvcnQgZGVmYXVsdCAkIl0sIm5hbWVzIjpbIkFycmF5IiwicHJvdG90eXBlIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwidGhpc0FyZyIsIlQiLCJrIiwiVHlwZUVycm9yIiwiTyIsIk9iamVjdCIsImxlbiIsImxlbmd0aCIsImFyZ3VtZW50cyIsImtWYWx1ZSIsImNhbGwiLCJ0eXBlIiwib2JqIiwianNvbnBJRCIsImRvY3VtZW50Iiwid2luZG93Iiwia2V5IiwibmFtZSIsInJzY3JpcHQiLCJzY3JpcHRUeXBlUkUiLCJ4bWxUeXBlUkUiLCJqc29uVHlwZSIsImh0bWxUeXBlIiwiYmxhbmtSRSIsImFqYXgiLCJvcHRpb25zIiwic2V0dGluZ3MiLCJleHRlbmQiLCJ1bmRlZmluZWQiLCJhamF4U3RhcnQiLCJjcm9zc0RvbWFpbiIsInRlc3QiLCJ1cmwiLCJSZWdFeHAiLCIkMiIsImxvY2F0aW9uIiwiaG9zdCIsImRhdGFUeXBlIiwiaGFzUGxhY2Vob2xkZXIiLCJhcHBlbmRRdWVyeSIsIkpTT05QIiwidG9TdHJpbmciLCJzZXJpYWxpemVEYXRhIiwibWltZSIsImFjY2VwdHMiLCJiYXNlSGVhZGVycyIsInByb3RvY29sIiwiJDEiLCJ4aHIiLCJhYm9ydFRpbWVvdXQiLCJpbmRleE9mIiwic3BsaXQiLCJvdmVycmlkZU1pbWVUeXBlIiwiY29udGVudFR5cGUiLCJkYXRhIiwidG9VcHBlckNhc2UiLCJoZWFkZXJzIiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsImNsZWFyVGltZW91dCIsInJlc3VsdCIsImVycm9yIiwic3RhdHVzIiwibWltZVRvRGF0YVR5cGUiLCJnZXRSZXNwb25zZUhlYWRlciIsInJlc3BvbnNlVGV4dCIsImV2YWwiLCJyZXNwb25zZVhNTCIsIkpTT04iLCJwYXJzZSIsImUiLCJhamF4RXJyb3IiLCJhamF4U3VjY2VzcyIsImFzeW5jIiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJhamF4QmVmb3JlU2VuZCIsImFib3J0IiwidGltZW91dCIsInNldFRpbWVvdXQiLCJlbXB0eSIsInNlbmQiLCJ0cmlnZ2VyQW5kUmV0dXJuIiwiY29udGV4dCIsImV2ZW50TmFtZSIsInRyaWdnZXJHbG9iYWwiLCJnbG9iYWwiLCJhY3RpdmUiLCJhamF4U3RvcCIsImJlZm9yZVNlbmQiLCJzdWNjZXNzIiwiYWpheENvbXBsZXRlIiwiY29tcGxldGUiLCJjYWxsYmFja05hbWUiLCJzY3JpcHQiLCJjcmVhdGVFbGVtZW50IiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZG9jdW1lbnRFbGVtZW50Iiwib25lcnJvciIsInNyYyIsInJlcGxhY2UiLCJpbnNlcnRCZWZvcmUiLCJmaXJzdENoaWxkIiwiWE1MSHR0cFJlcXVlc3QiLCJqc29uIiwieG1sIiwiaHRtbCIsInRleHQiLCJxdWVyeSIsInBhcmFtIiwiZ2V0IiwicG9zdCIsImdldEpTT04iLCJlc2NhcGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzZXJpYWxpemUiLCJwYXJhbXMiLCJ0cmFkaXRpb25hbCIsInNjb3BlIiwiYXJyYXkiLCJ2YWx1ZSIsImFkZCIsInYiLCJwdXNoIiwiam9pbiIsInRhcmdldCIsInNsaWNlIiwic291cmNlIiwiVGlueUpxdWVyeSIsImVsIiwiJGVsIiwicXVlcnlTZWxlY3RvckFsbCIsImZuIiwiYnViYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImkiLCJhdHRhY2hFdmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZXRhY2hFdmVudCIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsInJlbW92ZSIsInRvZ2dsZSIsImNsIiwicmMiLCJhYyIsImZsYWciLCJjb250YWlucyIsInBzZXVkb0VsdCIsImdldENvbXB1dGVkU3R5bGUiLCJjdXJyZW50U3R5bGUiLCJzdHlsZSIsInZhbCIsImlubmVySFRNTCIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIiQiLCJhdHRyIiwiY2hlY2tlZCIsInBhcmVudE5vZGUiLCJkb20iLCJhIiwicCIsImNoaWxkcmVuIiwicGwiLCJpc1RKIiwiZ2V0RG9tIiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCIsImlubmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiaW5uZXJXaWR0aCIsIm9mZnNldFdpZHRoIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBQTtFQUNBO0VBQ0EsSUFBSSxDQUFDQSxNQUFNQyxTQUFOLENBQWdCQyxPQUFyQixFQUE4Qjs7RUFFNUJGLFVBQU1DLFNBQU4sQ0FBZ0JDLE9BQWhCLEdBQTBCLFVBQVNDLFFBQVQsRUFBbUJDLE9BQW5CLEVBQTRCOztFQUVwRCxZQUFJQyxDQUFKLEVBQU9DLENBQVA7O0VBRUEsWUFBSSxRQUFRLElBQVosRUFBa0I7RUFDaEIsa0JBQU0sSUFBSUMsU0FBSixDQUFjLDhCQUFkLENBQU47RUFDRDs7RUFFRDtFQUNBO0VBQ0EsWUFBSUMsSUFBSUMsT0FBTyxJQUFQLENBQVI7O0VBRUE7RUFDQTtFQUNBO0VBQ0EsWUFBSUMsTUFBTUYsRUFBRUcsTUFBRixLQUFhLENBQXZCOztFQUVBO0VBQ0E7RUFDQSxZQUFJLE9BQU9SLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7RUFDbEMsa0JBQU0sSUFBSUksU0FBSixDQUFjSixXQUFXLG9CQUF6QixDQUFOO0VBQ0Q7O0VBRUQ7RUFDQTtFQUNBLFlBQUlTLFVBQVVELE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7RUFDeEJOLGdCQUFJRCxPQUFKO0VBQ0Q7O0VBRUQ7RUFDQUUsWUFBSSxDQUFKOztFQUVBO0VBQ0EsZUFBT0EsSUFBSUksR0FBWCxFQUFnQjs7RUFFZCxnQkFBSUcsTUFBSjs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxnQkFBSVAsS0FBS0UsQ0FBVCxFQUFZOztFQUVWO0VBQ0E7RUFDQUsseUJBQVNMLEVBQUVGLENBQUYsQ0FBVDs7RUFFQTtFQUNBO0VBQ0FILHlCQUFTVyxJQUFULENBQWNULENBQWQsRUFBaUJRLE1BQWpCLEVBQXlCUCxDQUF6QixFQUE0QkUsQ0FBNUI7RUFDRDtFQUNEO0VBQ0FGO0VBQ0Q7RUFDRDtFQUNELEtBekREO0VBMEREOzs7O0VDOURELElBQUlTLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxHQUFELEVBQVM7RUFDWixrQkFBY0EsR0FBZCx5Q0FBY0EsR0FBZDtFQUNILENBRkw7O0FBSUksTUFBSUMsVUFBVSxDQUFkO0VBQUEsSUFDSUMsYUFBV0MsT0FBT0QsUUFEdEI7RUFBQSxJQUVJRSxHQUZKO0VBQUEsSUFHSUMsSUFISjtFQUFBLElBSUlDLEFBQ0FDLGVBQWUsb0NBTG5CO0VBQUEsSUFNSUMsWUFBWSw2QkFOaEI7RUFBQSxJQU9JQyxXQUFXLGtCQVBmO0VBQUEsSUFRSUMsV0FBVyxXQVJmO0VBQUEsSUFTSUMsVUFBVSxPQVRkOztFQVdBLElBQUlDLE9BQU8sU0FBUEEsSUFBTyxDQUFVQyxPQUFWLEVBQW1CO0VBQzFCLFFBQUlDLFdBQVdDLE9BQU8sRUFBUCxFQUFXRixXQUFXLEVBQXRCLENBQWY7RUFDSSxTQUFLVCxHQUFMLElBQVlRLEtBQUtFLFFBQWpCO0VBQ0ksWUFBSUEsU0FBU1YsR0FBVCxNQUFrQlksU0FBdEIsRUFDSUYsU0FBU1YsR0FBVCxJQUFnQlEsS0FBS0UsUUFBTCxDQUFjVixHQUFkLENBQWhCO0VBRlIsS0FJSmEsVUFBVUgsUUFBVjs7RUFFSSxRQUFJLENBQUNBLFNBQVNJLFdBQWQsRUFDSUosU0FBU0ksV0FBVCxHQUF1QiwwQkFBMEJDLElBQTFCLENBQStCTCxTQUFTTSxHQUF4QyxLQUFnREMsT0FBT0MsRUFBUCxJQUFhbkIsT0FBT29CLFFBQVAsQ0FBZ0JDLElBQXBHOztFQUVKLFFBQUlDLFdBQVdYLFNBQVNXLFFBQXhCO0VBQUEsUUFDSUMsaUJBQWlCLE1BQU1QLElBQU4sQ0FBV0wsU0FBU00sR0FBcEIsQ0FEckI7RUFFQSxRQUFJSyxZQUFZLE9BQVosSUFBdUJDLGNBQTNCLEVBQTJDO0VBQ3ZDLFlBQUksQ0FBQ0EsY0FBTCxFQUNJWixTQUFTTSxHQUFULEdBQWVPLFlBQVliLFNBQVNNLEdBQXJCLEVBQTBCLFlBQTFCLENBQWY7RUFDSixlQUFPUixLQUFLZ0IsS0FBTCxDQUFXZCxRQUFYLENBQVA7RUFDSDs7RUFFRCxRQUFJLENBQUNBLFNBQVNNLEdBQWQsRUFDSU4sU0FBU00sR0FBVCxHQUFlakIsT0FBT29CLFFBQVAsQ0FBZ0JNLFFBQWhCLEVBQWY7RUFDSkMsa0JBQWNoQixRQUFkOztFQUVBLFFBQUlpQixPQUFPakIsU0FBU2tCLE9BQVQsQ0FBaUJQLFFBQWpCLENBQVg7RUFBQSxRQUNJUSxjQUFjLEVBRGxCO0VBQUEsUUFFSUMsV0FBVyxpQkFBaUJmLElBQWpCLENBQXNCTCxTQUFTTSxHQUEvQixJQUNMQyxPQUFPYyxFQURGLEdBRUxoQyxPQUFPb0IsUUFBUCxDQUFnQlcsUUFKMUI7RUFBQSxRQUtJRSxNQUFNeEIsS0FDREUsUUFEQyxDQUVEc0IsR0FGQyxFQUxWO0VBQUEsUUFRSUMsWUFSSjs7RUFVQSxRQUFJLENBQUN2QixTQUFTSSxXQUFkLEVBQ0llLFlBQVksa0JBQVosSUFBa0MsZ0JBQWxDO0VBQ0osUUFBSUYsSUFBSixFQUFVO0VBQ05FLG9CQUFZLFFBQVosSUFBd0JGLElBQXhCO0VBQ0EsWUFBSUEsS0FBS08sT0FBTCxDQUFhLEdBQWIsSUFBb0IsQ0FBQyxDQUF6QixFQUNJUCxPQUFPQSxLQUFLUSxLQUFMLENBQVcsR0FBWCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFQO0VBQ0pILFlBQUlJLGdCQUFKLElBQXdCSixJQUFJSSxnQkFBSixDQUFxQlQsSUFBckIsQ0FBeEI7RUFDSDtFQUNELFFBQUlqQixTQUFTMkIsV0FBVCxJQUF5QjNCLFNBQVM0QixJQUFULElBQWlCNUIsU0FBU2YsSUFBVCxDQUFjNEMsV0FBZCxNQUErQixLQUE3RSxFQUNJVixZQUFZLGNBQVosSUFBK0JuQixTQUFTMkIsV0FBVCxJQUF3QixtQ0FBdkQ7RUFDSjNCLGFBQVM4QixPQUFULEdBQW1CN0IsT0FBT2tCLFdBQVAsRUFBb0JuQixTQUFTOEIsT0FBVCxJQUFvQixFQUF4QyxDQUFuQjs7RUFFQVIsUUFBSVMsa0JBQUosR0FBeUIsWUFBWTtFQUNqQyxZQUFJVCxJQUFJVSxVQUFKLElBQWtCLENBQXRCLEVBQXlCO0VBQ3JCQyx5QkFBYVYsWUFBYjtFQUNBLGdCQUFJVyxNQUFKO0VBQUEsZ0JBQ0lDLFFBQVEsS0FEWjtFQUVBLGdCQUFLYixJQUFJYyxNQUFKLElBQWMsR0FBZCxJQUFxQmQsSUFBSWMsTUFBSixHQUFhLEdBQW5DLElBQTJDZCxJQUFJYyxNQUFKLElBQWMsR0FBekQsSUFBaUVkLElBQUljLE1BQUosSUFBYyxDQUFkLElBQW1CaEIsWUFBWSxPQUFwRyxFQUE4RztFQUMxR1QsMkJBQVdBLFlBQVkwQixlQUFlZixJQUFJZ0IsaUJBQUosQ0FBc0IsY0FBdEIsQ0FBZixDQUF2QjtFQUNBSix5QkFBU1osSUFBSWlCLFlBQWI7O0VBRUEsb0JBQUk7RUFDQSx3QkFBSTVCLFlBQVksUUFBaEIsRUFDSSxDQUFDLEdBQUc2QixJQUFKLEVBQVVOLE1BQVYsRUFESixLQUVLLElBQUl2QixZQUFZLEtBQWhCLEVBQ0R1QixTQUFTWixJQUFJbUIsV0FBYixDQURDLEtBRUEsSUFBSTlCLFlBQVksTUFBaEIsRUFDRHVCLFNBQVNyQyxRQUFRUSxJQUFSLENBQWE2QixNQUFiLElBQ0gsSUFERyxHQUVIUSxLQUFLQyxLQUFMLENBQVdULE1BQVgsQ0FGTjtFQUdILGlCQVRMLENBU00sT0FBT1UsQ0FBUCxFQUFVO0VBQ1pULDRCQUFRUyxDQUFSO0VBQ0g7O0VBRUQsb0JBQUlULEtBQUosRUFDSVUsVUFBVVYsS0FBVixFQUFpQixhQUFqQixFQUFnQ2IsR0FBaEMsRUFBcUN0QixRQUFyQyxFQURKLEtBR0k4QyxZQUFZWixNQUFaLEVBQW9CWixHQUFwQixFQUF5QnRCLFFBQXpCO0VBQ1AsYUFyQkQsTUFxQk87RUFDSDZDLDBCQUFVLElBQVYsRUFBZ0IsT0FBaEIsRUFBeUJ2QixHQUF6QixFQUE4QnRCLFFBQTlCO0VBQ0g7RUFDSjtFQUNKLEtBOUJEOztFQWdDQSxRQUFJK0MsUUFBUSxXQUFXL0MsUUFBWCxHQUNOQSxTQUFTK0MsS0FESCxHQUVOLElBRk47RUFHQXpCLFFBQUkwQixJQUFKLENBQVNoRCxTQUFTZixJQUFsQixFQUF3QmUsU0FBU00sR0FBakMsRUFBc0N5QyxLQUF0Qzs7RUFFQSxTQUFLeEQsSUFBTCxJQUFhUyxTQUFTOEIsT0FBdEI7RUFDSVIsWUFBSTJCLGdCQUFKLENBQXFCMUQsSUFBckIsRUFBMkJTLFNBQVM4QixPQUFULENBQWlCdkMsSUFBakIsQ0FBM0I7RUFESixLQUdBLElBQUkyRCxlQUFlNUIsR0FBZixFQUFvQnRCLFFBQXBCLE1BQWtDLEtBQXRDLEVBQTZDO0VBQ3pDc0IsWUFBSTZCLEtBQUo7RUFDQSxlQUFPLEtBQVA7RUFDSDs7RUFFRCxRQUFJbkQsU0FBU29ELE9BQVQsR0FBbUIsQ0FBdkIsRUFDSTdCLGVBQWU4QixXQUFXLFlBQVk7RUFDbEMvQixZQUFJUyxrQkFBSixHQUF5QnVCLEtBQXpCO0VBQ0FoQyxZQUFJNkIsS0FBSjtFQUNBTixrQkFBVSxJQUFWLEVBQWdCLFNBQWhCLEVBQTJCdkIsR0FBM0IsRUFBZ0N0QixRQUFoQztFQUNILEtBSmMsRUFJWkEsU0FBU29ELE9BSkcsQ0FBZjs7RUFNQTtFQUNKOUIsUUFBSWlDLElBQUosQ0FBU3ZELFNBQVM0QixJQUFULEdBQ0g1QixTQUFTNEIsSUFETixHQUVILElBRk47RUFHQSxXQUFPTixHQUFQO0VBQ0gsQ0F0R0w7O0VBd0dJO0VBQ0EsU0FBU2tDLGdCQUFULENBQTBCQyxPQUExQixFQUFtQ0MsU0FBbkMsRUFBOEM5QixJQUE5QyxFQUFvRDtFQUNoRDtFQUNBO0VBQ0EsV0FBTyxJQUFQLENBSGdEO0VBSW5EOztFQUVEO0VBQ0EsU0FBUytCLGFBQVQsQ0FBdUIzRCxRQUF2QixFQUFpQ3lELE9BQWpDLEVBQTBDQyxTQUExQyxFQUFxRDlCLElBQXJELEVBQTJEO0VBQ3ZELFFBQUk1QixTQUFTNEQsTUFBYixFQUNJLE9BQU9KLGlCQUFpQkMsV0FBV3JFLFVBQTVCLEVBQXNDc0UsU0FBdEMsRUFBaUQ5QixJQUFqRCxDQUFQO0VBQ1A7O0VBRUQ7RUFDQTlCLEtBQUsrRCxNQUFMLEdBQWMsQ0FBZDs7RUFFQSxTQUFTMUQsU0FBVCxDQUFtQkgsUUFBbkIsRUFBNkI7RUFDekIsUUFBSUEsU0FBUzRELE1BQVQsSUFBbUI5RCxLQUFLK0QsTUFBTCxPQUFrQixDQUF6QyxFQUNJRixjQUFjM0QsUUFBZCxFQUF3QixJQUF4QixFQUE4QixXQUE5QjtFQUNQO0VBQ0QsU0FBUzhELFFBQVQsQ0FBa0I5RCxRQUFsQixFQUE0QjtFQUN4QixRQUFJQSxTQUFTNEQsTUFBVCxJQUFtQixJQUFJOUQsS0FBSytELE1BQWhDLEVBQ0lGLGNBQWMzRCxRQUFkLEVBQXdCLElBQXhCLEVBQThCLFVBQTlCO0VBQ1A7O0VBRUQ7RUFDQTtFQUNBLFNBQVNrRCxjQUFULENBQXdCNUIsR0FBeEIsRUFBNkJ0QixRQUE3QixFQUF1QztFQUNuQyxRQUFJeUQsVUFBVXpELFNBQVN5RCxPQUF2QjtFQUNBLFFBQUl6RCxTQUFTK0QsVUFBVCxDQUFvQi9FLElBQXBCLENBQXlCeUUsT0FBekIsRUFBa0NuQyxHQUFsQyxFQUF1Q3RCLFFBQXZDLE1BQXFELEtBQXJELElBQThEMkQsY0FBYzNELFFBQWQsRUFBd0J5RCxPQUF4QixFQUFpQyxnQkFBakMsRUFBbUQsQ0FBQ25DLEdBQUQsRUFBTXRCLFFBQU4sQ0FBbkQsTUFBd0UsS0FBMUksRUFDSSxPQUFPLEtBQVA7O0VBRUoyRCxrQkFBYzNELFFBQWQsRUFBd0J5RCxPQUF4QixFQUFpQyxVQUFqQyxFQUE2QyxDQUFDbkMsR0FBRCxFQUFNdEIsUUFBTixDQUE3QztFQUNIO0VBQ0QsU0FBUzhDLFdBQVQsQ0FBcUJsQixJQUFyQixFQUEyQk4sR0FBM0IsRUFBZ0N0QixRQUFoQyxFQUEwQztFQUN0QyxRQUFJeUQsVUFBVXpELFNBQVN5RCxPQUF2QjtFQUFBLFFBQ0lyQixTQUFTLFNBRGI7RUFFQXBDLGFBQ0tnRSxPQURMLENBRUtoRixJQUZMLENBRVV5RSxPQUZWLEVBRW1CN0IsSUFGbkIsRUFFeUJRLE1BRnpCLEVBRWlDZCxHQUZqQztFQUdBcUMsa0JBQWMzRCxRQUFkLEVBQXdCeUQsT0FBeEIsRUFBaUMsYUFBakMsRUFBZ0QsQ0FBQ25DLEdBQUQsRUFBTXRCLFFBQU4sRUFBZ0I0QixJQUFoQixDQUFoRDtFQUNBcUMsaUJBQWE3QixNQUFiLEVBQXFCZCxHQUFyQixFQUEwQnRCLFFBQTFCO0VBQ0g7RUFDRDtFQUNBLFNBQVM2QyxTQUFULENBQW1CVixLQUFuQixFQUEwQmxELElBQTFCLEVBQWdDcUMsR0FBaEMsRUFBcUN0QixRQUFyQyxFQUErQztFQUMzQyxRQUFJeUQsVUFBVXpELFNBQVN5RCxPQUF2QjtFQUNBekQsYUFDS21DLEtBREwsQ0FFS25ELElBRkwsQ0FFVXlFLE9BRlYsRUFFbUJuQyxHQUZuQixFQUV3QnJDLElBRnhCLEVBRThCa0QsS0FGOUI7RUFHQXdCLGtCQUFjM0QsUUFBZCxFQUF3QnlELE9BQXhCLEVBQWlDLFdBQWpDLEVBQThDLENBQUNuQyxHQUFELEVBQU10QixRQUFOLEVBQWdCbUMsS0FBaEIsQ0FBOUM7RUFDQThCLGlCQUFhaEYsSUFBYixFQUFtQnFDLEdBQW5CLEVBQXdCdEIsUUFBeEI7RUFDSDtFQUNEO0VBQ0EsU0FBU2lFLFlBQVQsQ0FBc0I3QixNQUF0QixFQUE4QmQsR0FBOUIsRUFBbUN0QixRQUFuQyxFQUE2QztFQUN6QyxRQUFJeUQsVUFBVXpELFNBQVN5RCxPQUF2QjtFQUNBekQsYUFDS2tFLFFBREwsQ0FFS2xGLElBRkwsQ0FFVXlFLE9BRlYsRUFFbUJuQyxHQUZuQixFQUV3QmMsTUFGeEI7RUFHQXVCLGtCQUFjM0QsUUFBZCxFQUF3QnlELE9BQXhCLEVBQWlDLGNBQWpDLEVBQWlELENBQUNuQyxHQUFELEVBQU10QixRQUFOLENBQWpEO0VBQ0E4RCxhQUFTOUQsUUFBVDtFQUNIOztFQUVEO0VBQ0EsU0FBU3NELEtBQVQsR0FBaUI7O0VBRWpCeEQsS0FBS2dCLEtBQUwsR0FBYSxVQUFVZixPQUFWLEVBQW1CO0VBQzVCLFFBQUksRUFBRSxVQUFVQSxPQUFaLENBQUosRUFDSSxPQUFPRCxLQUFLQyxPQUFMLENBQVA7O0VBRUosUUFBSW9FLGVBQWUsVUFBVyxFQUFFaEYsT0FBaEM7RUFBQSxRQUNJaUYsU0FBU2hGLFdBQVNpRixhQUFULENBQXVCLFFBQXZCLENBRGI7RUFBQSxRQUVJbEIsUUFBUSxTQUFSQSxLQUFRLEdBQVk7RUFDaEI7RUFDQSxZQUFJZ0IsZ0JBQWdCOUUsTUFBcEIsRUFDSUEsT0FBTzhFLFlBQVAsSUFBdUJiLEtBQXZCO0VBQ0pXLHFCQUFhLE9BQWIsRUFBc0IzQyxHQUF0QixFQUEyQnZCLE9BQTNCO0VBQ0gsS0FQTDtFQUFBLFFBUUl1QixNQUFNO0VBQ0Y2QixlQUFPQTtFQURMLEtBUlY7RUFBQSxRQVdJNUIsWUFYSjtFQUFBLFFBWUkrQyxPQUFPbEYsV0FBU21GLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEtBQTRDbkYsV0FBU29GLGVBWmhFOztFQWNBLFFBQUl6RSxRQUFRb0MsS0FBWixFQUNJaUMsT0FBT0ssT0FBUCxHQUFpQixZQUFZO0VBQ3pCbkQsWUFBSTZCLEtBQUo7RUFDQXBELGdCQUFRb0MsS0FBUjtFQUNILEtBSEQ7O0VBS0o5QyxXQUFPOEUsWUFBUCxJQUF1QixVQUFVdkMsSUFBVixFQUFnQjtFQUNuQ0sscUJBQWFWLFlBQWI7RUFDQTtFQUNBLGVBQU9sQyxPQUFPOEUsWUFBUCxDQUFQO0VBQ0FyQixvQkFBWWxCLElBQVosRUFBa0JOLEdBQWxCLEVBQXVCdkIsT0FBdkI7RUFDSCxLQUxEOztFQU9BaUIsa0JBQWNqQixPQUFkO0VBQ0FxRSxXQUFPTSxHQUFQLEdBQWEzRSxRQUNSTyxHQURRLENBRVJxRSxPQUZRLENBRUEsS0FGQSxFQUVPLE1BQU1SLFlBRmIsQ0FBYjs7RUFJQTtFQUNBO0VBQ0FHLFNBQUtNLFlBQUwsQ0FBa0JSLE1BQWxCLEVBQTBCRSxLQUFLTyxVQUEvQjs7RUFFQSxRQUFJOUUsUUFBUXFELE9BQVIsR0FBa0IsQ0FBdEIsRUFDSTdCLGVBQWU4QixXQUFXLFlBQVk7RUFDbEMvQixZQUFJNkIsS0FBSjtFQUNBYyxxQkFBYSxTQUFiLEVBQXdCM0MsR0FBeEIsRUFBNkJ2QixPQUE3QjtFQUNILEtBSGMsRUFHWkEsUUFBUXFELE9BSEksQ0FBZjs7RUFLSixXQUFPOUIsR0FBUDtFQUNILENBL0NEOztFQWlEQXhCLEtBQUtFLFFBQUwsR0FBZ0I7RUFDWjtFQUNBZixVQUFNLEtBRk07RUFHWjtFQUNBOEUsZ0JBQVlULEtBSkE7RUFLWjtFQUNBVSxhQUFTVixLQU5HO0VBT1o7RUFDQW5CLFdBQU9tQixLQVJLO0VBU1o7RUFDQVksY0FBVVosS0FWRTtFQVdaO0VBQ0FHLGFBQVMsSUFaRztFQWFaO0VBQ0FHLFlBQVEsSUFkSTtFQWVaO0VBQ0F0QyxTQUFLLGVBQVk7RUFDYixlQUFPLElBQUlqQyxPQUFPeUYsY0FBWCxFQUFQO0VBQ0gsS0FsQlc7RUFtQlo7RUFDQTVELGFBQVM7RUFDTGtELGdCQUFRLHlDQURIO0VBRUxXLGNBQU1wRixRQUZEO0VBR0xxRixhQUFLLDJCQUhBO0VBSUxDLGNBQU1yRixRQUpEO0VBS0xzRixjQUFNO0VBTEQsS0FwQkc7RUEyQlo7RUFDQTlFLGlCQUFhLEtBNUJEO0VBNkJaO0VBQ0FnRCxhQUFTO0VBOUJHLENBQWhCOztFQWlDQSxTQUFTZixjQUFULENBQXdCcEIsSUFBeEIsRUFBOEI7RUFDMUIsV0FBT0EsU0FBU0EsUUFBUXJCLFFBQVIsR0FDVixNQURVLEdBRVZxQixRQUFRdEIsUUFBUixHQUNJLE1BREosR0FFSUYsYUFBYVksSUFBYixDQUFrQlksSUFBbEIsSUFDSSxRQURKLEdBRUl2QixVQUFVVyxJQUFWLENBQWVZLElBQWYsS0FBd0IsS0FOL0IsS0FNeUMsTUFOaEQ7RUFPSDs7RUFFRCxTQUFTSixXQUFULENBQXFCUCxHQUFyQixFQUEwQjZFLEtBQTFCLEVBQWlDO0VBQzdCLFdBQU8sQ0FBQzdFLE1BQU0sR0FBTixHQUFZNkUsS0FBYixFQUFvQlIsT0FBcEIsQ0FBNEIsV0FBNUIsRUFBeUMsR0FBekMsQ0FBUDtFQUNIOztFQUVEO0VBQ0EsU0FBUzNELGFBQVQsQ0FBdUJqQixPQUF2QixFQUFnQztFQUM1QixRQUFJZCxLQUFLYyxRQUFRNkIsSUFBYixNQUF1QixRQUEzQixFQUNJN0IsUUFBUTZCLElBQVIsR0FBZXdELE1BQU1yRixRQUFRNkIsSUFBZCxDQUFmO0VBQ0osUUFBSTdCLFFBQVE2QixJQUFSLEtBQWlCLENBQUM3QixRQUFRZCxJQUFULElBQWlCYyxRQUFRZCxJQUFSLENBQWE0QyxXQUFiLE1BQThCLEtBQWhFLENBQUosRUFDSTlCLFFBQVFPLEdBQVIsR0FBY08sWUFBWWQsUUFBUU8sR0FBcEIsRUFBeUJQLFFBQVE2QixJQUFqQyxDQUFkO0VBQ1A7O0VBRUQ5QixLQUFLdUYsR0FBTCxHQUFXLFVBQVUvRSxHQUFWLEVBQWUwRCxPQUFmLEVBQXdCO0VBQy9CLFdBQU9sRSxLQUFLLEVBQUNRLEtBQUtBLEdBQU4sRUFBVzBELFNBQVNBLE9BQXBCLEVBQUwsQ0FBUDtFQUNILENBRkQ7O0VBSUFsRSxLQUFLd0YsSUFBTCxHQUFZLFVBQVVoRixHQUFWLEVBQWVzQixJQUFmLEVBQXFCb0MsT0FBckIsRUFBOEJyRCxRQUE5QixFQUF3QztFQUNoRCxRQUFJMUIsS0FBSzJDLElBQUwsTUFBZSxVQUFuQixFQUNJakIsV0FBV0EsWUFBWXFELE9BQXZCLEVBQ0FBLFVBQVVwQyxJQURWLEVBRUFBLE9BQU8sSUFGUDtFQUdKLFdBQU85QixLQUFLLEVBQUNiLE1BQU0sTUFBUCxFQUFlcUIsS0FBS0EsR0FBcEIsRUFBeUJzQixNQUFNQSxJQUEvQixFQUFxQ29DLFNBQVNBLE9BQTlDLEVBQXVEckQsVUFBVUEsUUFBakUsRUFBTCxDQUFQO0VBQ0gsQ0FORDs7RUFRQWIsS0FBS3lGLE9BQUwsR0FBZSxVQUFVakYsR0FBVixFQUFlMEQsT0FBZixFQUF3QjtFQUNuQyxXQUFPbEUsS0FBSyxFQUFDUSxLQUFLQSxHQUFOLEVBQVcwRCxTQUFTQSxPQUFwQixFQUE2QnJELFVBQVUsTUFBdkMsRUFBTCxDQUFQO0VBQ0gsQ0FGRDs7RUFJQSxJQUFJNkUsU0FBU0Msa0JBQWI7O0VBRUEsU0FBU0MsU0FBVCxDQUFtQkMsTUFBbkIsRUFBMkJ6RyxHQUEzQixFQUFnQzBHLFdBQWhDLEVBQTZDQyxLQUE3QyxFQUFvRDtFQUNoRCxRQUFJQyxRQUFRN0csS0FBS0MsR0FBTCxNQUFjLE9BQTFCO0VBQ0EsU0FBSyxJQUFJSSxHQUFULElBQWdCSixHQUFoQixFQUFxQjtFQUNqQixZQUFJNkcsUUFBUTdHLElBQUlJLEdBQUosQ0FBWjs7RUFFQSxZQUFJdUcsS0FBSixFQUNJdkcsTUFBTXNHLGNBQ0FDLEtBREEsR0FFQUEsUUFBUSxHQUFSLElBQWVDLFFBQ1gsRUFEVyxHQUVYeEcsR0FGSixJQUVXLEdBSmpCO0VBS0E7RUFDSixZQUFJLENBQUN1RyxLQUFELElBQVVDLEtBQWQsRUFDSUgsT0FBT0ssR0FBUCxDQUFXRCxNQUFNeEcsSUFBakIsRUFBdUJ3RyxNQUFNQSxLQUE3QjtFQUNBO0VBRkosYUFHSyxJQUFJSCxjQUNGM0csS0FBSzhHLEtBQUwsTUFBZ0IsT0FEZCxHQUVGOUcsS0FBSzhHLEtBQUwsTUFBZ0IsUUFGbEIsRUFHREwsVUFBVUMsTUFBVixFQUFrQkksS0FBbEIsRUFBeUJILFdBQXpCLEVBQXNDdEcsR0FBdEMsRUFIQyxLQUtEcUcsT0FBT0ssR0FBUCxDQUFXMUcsR0FBWCxFQUFnQnlHLEtBQWhCO0VBQ1A7RUFDSjs7RUFFRCxTQUFTWCxLQUFULENBQWVsRyxHQUFmLEVBQW9CMEcsV0FBcEIsRUFBaUM7RUFDN0IsUUFBSUQsU0FBUyxFQUFiO0VBQ0FBLFdBQU9LLEdBQVAsR0FBYSxVQUFVeEgsQ0FBVixFQUFheUgsQ0FBYixFQUFnQjtFQUN6QixhQUFLQyxJQUFMLENBQVVWLE9BQU9oSCxDQUFQLElBQVksR0FBWixHQUFrQmdILE9BQU9TLENBQVAsQ0FBNUI7RUFDSCxLQUZEO0VBR0FQLGNBQVVDLE1BQVYsRUFBa0J6RyxHQUFsQixFQUF1QjBHLFdBQXZCO0VBQ0EsV0FBT0QsT0FDRlEsSUFERSxDQUNHLEdBREgsRUFFRnhCLE9BRkUsQ0FFTSxLQUZOLEVBRWEsR0FGYixDQUFQO0VBR0g7O0VBRUQsU0FBUzFFLE1BQVQsQ0FBZ0JtRyxNQUFoQixFQUF3QjtFQUNwQixRQUFJQyxRQUFRbkksTUFBTUMsU0FBTixDQUFnQmtJLEtBQTVCO0VBQ0FBLFVBQ0tySCxJQURMLENBQ1VGLFNBRFYsRUFDcUIsQ0FEckIsRUFFS1YsT0FGTCxDQUVhLFVBQVVrSSxNQUFWLEVBQWtCO0VBQ3ZCLGFBQUtoSCxHQUFMLElBQVlnSCxNQUFaO0VBQ0ksZ0JBQUlBLE9BQU9oSCxHQUFQLE1BQWdCWSxTQUFwQixFQUNJa0csT0FBTzlHLEdBQVAsSUFBY2dILE9BQU9oSCxHQUFQLENBQWQ7RUFGUjtFQUdILEtBTkw7RUFPQSxXQUFPOEcsTUFBUDtFQUNIOzs7Ozs7TUMvVkhHO0VBQ0Ysd0JBQVlDLEVBQVosRUFBZ0I7RUFBQTs7RUFDWixZQUFJQyxZQUFKO0VBQ0EsWUFBRyxPQUFPRCxFQUFQLElBQWEsUUFBaEIsRUFBMEI7RUFDdEJDLGtCQUFNckgsU0FBU3NILGdCQUFULENBQTBCRixFQUExQixDQUFOO0VBQ0gsU0FGRCxNQUVPLElBQUcsT0FBT0EsRUFBUCxJQUFhLE9BQWIsSUFBd0JBLEdBQUczSCxNQUE5QixFQUFzQztFQUN6QzRILGtCQUFNRCxFQUFOO0VBQ0gsU0FGTSxNQUVBO0VBQ0hDLGtCQUFNLENBQUNELEVBQUQsQ0FBTjtFQUNIO0VBQ0QsYUFBS0MsR0FBTCxHQUFXLEdBQUdKLEtBQUgsQ0FBU3JILElBQVQsQ0FBY3lILEdBQWQsQ0FBWDtFQUNIO0VBQ0Q7Ozs7OzZCQUNHL0MsV0FBV2lELElBQW9CO0VBQUEsZ0JBQWhCQyxNQUFnQix1RUFBUCxLQUFPOztFQUM5QixpQkFBS0gsR0FBTCxDQUFTckksT0FBVCxDQUFpQixhQUFLO0VBQ2xCLG9CQUFHZ0IsU0FBU3lILGdCQUFaLEVBQThCO0VBQzFCQyxzQkFBRUQsZ0JBQUYsQ0FBbUJuRCxTQUFuQixFQUE4QmlELEVBQTlCLEVBQWtDLENBQUNDLE1BQW5DO0VBQ0gsaUJBRkQsTUFFTztFQUNIRSxzQkFBRUMsV0FBRixRQUFtQnJELFNBQW5CLEVBQWdDaUQsRUFBaEM7RUFDSDtFQUNKLGFBTkQ7RUFPQSxtQkFBTyxJQUFQO0VBQ0g7RUFDRDs7Ozs2QkFDR2pELFdBQVdpRCxJQUFvQjtFQUFBLGdCQUFoQkMsTUFBZ0IsdUVBQVAsS0FBTzs7RUFDOUIsaUJBQUtILEdBQUwsQ0FBU3JJLE9BQVQsQ0FBaUIsYUFBSztFQUNsQixvQkFBR2dCLFNBQVM0SCxtQkFBWixFQUFpQztFQUM3QkYsc0JBQUVFLG1CQUFGLENBQXNCdEQsU0FBdEIsRUFBaUNpRCxFQUFqQyxFQUFxQyxDQUFDQyxNQUF0QztFQUNILGlCQUZELE1BRU87RUFDSEUsc0JBQUVHLFdBQUYsUUFBbUJ2RCxTQUFuQixFQUFnQ2lELEVBQWhDO0VBQ0g7RUFDSixhQU5EO0VBT0EsbUJBQU8sSUFBUDtFQUNIO0VBQ0Q7Ozs7NkJBQ0dPLFdBQVc7RUFDVixpQkFBS1QsR0FBTCxDQUFTckksT0FBVCxDQUFpQixhQUFLO0VBQ2xCLG9CQUFHMEksRUFBRUssU0FBTCxFQUFnQjtFQUNaTCxzQkFBRUssU0FBRixDQUFZbkIsR0FBWixDQUFnQmtCLFNBQWhCO0VBQ0gsaUJBRkQsTUFFTztFQUNISixzQkFBRUksU0FBRixJQUFlLE1BQU1BLFNBQXJCO0VBQ0g7RUFDSixhQU5EO0VBT0EsbUJBQU8sSUFBUDtFQUNIO0VBQ0Q7Ozs7NkJBQ0dBLFdBQVc7RUFDVixpQkFBS1QsR0FBTCxDQUFTckksT0FBVCxDQUFpQixhQUFLO0VBQ2xCLG9CQUFHMEksRUFBRUssU0FBTCxFQUFnQjtFQUNaTCxzQkFBRUssU0FBRixDQUFZQyxNQUFaLENBQW1CRixTQUFuQjtFQUNILGlCQUZELE1BRU87RUFDSEosc0JBQUVJLFNBQUYsR0FBY0osRUFBRUksU0FBRixDQUFZdkMsT0FBWixDQUFvQixJQUFJcEUsTUFBSixDQUFXLFlBQVkyRyxVQUFVekYsS0FBVixDQUFnQixHQUFoQixFQUFxQjBFLElBQXJCLENBQTBCLEdBQTFCLENBQVosR0FBNkMsU0FBeEQsRUFBbUUsSUFBbkUsQ0FBcEIsRUFBOEYsR0FBOUYsQ0FBZDtFQUNIO0VBQ0osYUFORDtFQU9BLG1CQUFPLElBQVA7RUFDSDtFQUNEOzs7OzZCQUNHZSxXQUFXO0VBQUE7O0VBQ1YsaUJBQUtULEdBQUwsQ0FBU3JJLE9BQVQsQ0FBaUIsYUFBSztFQUNsQixvQkFBRzBJLEVBQUVLLFNBQUwsRUFBZ0I7RUFDWkwsc0JBQUVLLFNBQUYsQ0FBWUUsTUFBWixDQUFtQkgsU0FBbkI7RUFDSCxpQkFGRCxNQUVPO0VBQ0gsd0JBQUlJLEtBQUtSLEVBQUVJLFNBQUYsQ0FBWXpGLEtBQVosQ0FBa0IsR0FBbEIsQ0FBVDtFQUNBLHdCQUFHNkYsR0FBRzlGLE9BQUgsQ0FBVzBGLFNBQVgsSUFBd0IsQ0FBQyxDQUE1QixFQUErQjtFQUMzQiw4QkFBS0ssRUFBTCxDQUFRTCxTQUFSO0VBQ0gscUJBRkQsTUFFTztFQUNILDhCQUFLTSxFQUFMLENBQVFOLFNBQVI7RUFDSDtFQUNKO0VBQ0osYUFYRDtFQVlBLG1CQUFPLElBQVA7RUFDSDtFQUNEOzs7OzZCQUNHQSxXQUFXO0VBQ1YsZ0JBQUlPLE9BQU8sS0FBWDtFQUNBLGlCQUFLaEIsR0FBTCxDQUFTckksT0FBVCxDQUFpQixhQUFLO0VBQ2xCLG9CQUFHMEksRUFBRUssU0FBTCxFQUFnQjtFQUNaLHdCQUFHTCxFQUFFSyxTQUFGLENBQVlPLFFBQVosQ0FBcUJSLFNBQXJCLENBQUgsRUFBb0NPLE9BQU8sSUFBUDtFQUN2QyxpQkFGRCxNQUVPO0VBQ0gsd0JBQUlILEtBQUtSLEVBQUVJLFNBQUYsQ0FBWXpGLEtBQVosQ0FBa0IsR0FBbEIsQ0FBVDtFQUNBLHdCQUFHNkYsR0FBRzlGLE9BQUgsQ0FBVzBGLFNBQVgsSUFBd0IsQ0FBQyxDQUE1QixFQUErQk8sT0FBTyxJQUFQO0VBQ2xDO0VBQ0osYUFQRDtFQVFBLG1CQUFPQSxJQUFQO0VBQ0g7RUFDRDs7Ozs4QkFDSXZJLEtBQXVCO0VBQUEsZ0JBQWxCeUksU0FBa0IsdUVBQU4sSUFBTTs7RUFDdkIsZ0JBQUcsT0FBT3pJLEdBQVAsSUFBYyxRQUFqQixFQUEyQjtFQUN2QixvQkFBR0csT0FBT3VJLGdCQUFWLEVBQTRCO0VBQ3hCLDJCQUFPdkksT0FBT3VJLGdCQUFQLENBQXdCLEtBQUtuQixHQUFMLENBQVMsQ0FBVCxDQUF4QixFQUFxQ2tCLFNBQXJDLEVBQWdEekksR0FBaEQsQ0FBUDtFQUNILGlCQUZELE1BRU87RUFDSCwyQkFBTyxLQUFLdUgsR0FBTCxDQUFTLENBQVQsRUFBWW9CLFlBQW5CO0VBQ0g7RUFDSixhQU5ELE1BTU87RUFDSCxxQkFBS3BCLEdBQUwsQ0FBU3JJLE9BQVQsQ0FBaUIsYUFBSztFQUNsQix5QkFBSSxJQUFJMEksQ0FBUixJQUFhNUgsR0FBYixFQUFrQjtFQUNkK0csMEJBQUU2QixLQUFGLENBQVFoQixDQUFSLElBQWE1SCxJQUFJNEgsQ0FBSixDQUFiO0VBQ0g7RUFDSixpQkFKRDtFQUtBLHVCQUFPLElBQVA7RUFDSDtFQUNKO0VBQ0Q7Ozs7OEJBQ0lpQixNQUFLO0VBQ0wsZ0JBQUdBLElBQUgsRUFBUTtFQUNKLHFCQUFLdEIsR0FBTCxDQUFTLENBQVQsRUFBWVYsS0FBWixHQUFvQmdDLElBQXBCO0VBQ0EsdUJBQU8sSUFBUDtFQUNILGFBSEQsTUFHTztFQUNILHVCQUFPLEtBQUt0QixHQUFMLENBQVMsQ0FBVCxFQUFZVixLQUFuQjtFQUNIO0VBQ0o7RUFDRDs7OzsrQkFDS2dDLEtBQUs7RUFDTixnQkFBR0EsR0FBSCxFQUFRO0VBQ0oscUJBQUt0QixHQUFMLENBQVNySSxPQUFULENBQWlCLGFBQUs7RUFDbEIwSSxzQkFBRWtCLFNBQUYsR0FBY0QsR0FBZDtFQUNILGlCQUZEO0VBR0EsdUJBQU8sSUFBUDtFQUNILGFBTEQsTUFLTztFQUNILHVCQUFPLEtBQUt0QixHQUFMLENBQVMsQ0FBVCxFQUFZdUIsU0FBbkI7RUFDSDtFQUNKO0VBQ0Q7Ozs7K0JBQ0sxSSxLQUFLeUksS0FBSztFQUNYLGdCQUFHekksT0FBTyxDQUFDeUksR0FBWCxFQUFnQjtFQUNaLHVCQUFPLEtBQUt0QixHQUFMLENBQVMsQ0FBVCxFQUFZd0IsWUFBWixDQUF5QjNJLEdBQXpCLENBQVA7RUFDSCxhQUZELE1BRU87RUFDSCxxQkFBS21ILEdBQUwsQ0FBU3JJLE9BQVQsQ0FBaUIsYUFBSztFQUNsQjBJLHNCQUFFb0IsWUFBRixDQUFlNUksR0FBZixFQUFvQnlJLEdBQXBCO0VBQ0gsaUJBRkQ7RUFHQSx1QkFBTyxJQUFQO0VBQ0g7RUFDSjtFQUNEOzs7OzRDQUNrQjtFQUNkLGdCQUFJN0ksTUFBTSxFQUFWO0VBQ0EsaUJBQUt1SCxHQUFMLENBQVMsQ0FBVCxFQUFZQyxnQkFBWixDQUE2QixPQUE3QixFQUFzQ3RJLE9BQXRDLENBQThDLGFBQUs7RUFDL0Msb0JBQUcrSixFQUFFckIsQ0FBRixFQUFLc0IsSUFBTCxDQUFVLE1BQVYsS0FBcUIsT0FBeEIsRUFBaUM7RUFDN0Isd0JBQUd0QixFQUFFdUIsT0FBTCxFQUFjO0VBQ1ZuSiw0QkFBSWlKLEVBQUVyQixDQUFGLEVBQUtzQixJQUFMLENBQVUsTUFBVixDQUFKLElBQXlCRCxFQUFFckIsQ0FBRixFQUFLc0IsSUFBTCxDQUFVLE9BQVYsQ0FBekI7RUFDSDtFQUNKLGlCQUpELE1BSU8sSUFBR0QsRUFBRXJCLENBQUYsRUFBS3NCLElBQUwsQ0FBVSxNQUFWLEtBQXFCLFVBQXhCLEVBQW9DO0VBQ3ZDLHdCQUFHdEIsRUFBRXVCLE9BQUwsRUFBYztFQUNWLDRCQUFHbkosSUFBSWlKLEVBQUVyQixDQUFGLEVBQUtzQixJQUFMLENBQVUsTUFBVixDQUFKLENBQUgsRUFBMkI7RUFDdkJsSixnQ0FBSWlKLEVBQUVyQixDQUFGLEVBQUtzQixJQUFMLENBQVUsTUFBVixDQUFKLEVBQXVCbEMsSUFBdkIsQ0FBNEJpQyxFQUFFckIsQ0FBRixFQUFLc0IsSUFBTCxDQUFVLE9BQVYsQ0FBNUI7RUFDSCx5QkFGRCxNQUVPO0VBQ0hsSixnQ0FBSWlKLEVBQUVyQixDQUFGLEVBQUtzQixJQUFMLENBQVUsTUFBVixDQUFKLElBQXlCLENBQUNELEVBQUVyQixDQUFGLEVBQUtzQixJQUFMLENBQVUsT0FBVixDQUFELENBQXpCO0VBQ0g7RUFDSjtFQUNKLGlCQVJNLE1BUUE7RUFDSGxKLHdCQUFJaUosRUFBRXJCLENBQUYsRUFBS3NCLElBQUwsQ0FBVSxNQUFWLENBQUosSUFBeUJELEVBQUVyQixDQUFGLEVBQUtpQixHQUFMLEVBQXpCO0VBQ0g7RUFDSixhQWhCRDtFQWlCQSxtQkFBTzdJLEdBQVA7RUFDSDtFQUNEOzs7O21DQUNTO0VBQ0wsbUJBQU9pSixFQUFFLEtBQUsxQixHQUFMLENBQVMsQ0FBVCxFQUFZNkIsVUFBZCxDQUFQO0VBQ0g7RUFDRDs7OztxQ0FDVztFQUNQLGdCQUFJQyxNQUFNLEtBQUs5QixHQUFMLENBQVMsQ0FBVCxDQUFWO0VBQ0EsZ0JBQUkrQixJQUFJLEVBQVI7RUFDQSxnQkFBSUMsSUFBSUYsSUFBSUQsVUFBSixDQUFlSSxRQUF2QjtFQUNBLGlCQUFLLElBQUk1QixJQUFJLENBQVIsRUFBVzZCLEtBQUtGLEVBQUU1SixNQUF2QixFQUErQmlJLElBQUk2QixFQUFuQyxFQUF1QzdCLEdBQXZDLEVBQTRDO0VBQ3hDLG9CQUFJMkIsRUFBRTNCLENBQUYsTUFBU3lCLEdBQWIsRUFBa0JDLEVBQUV0QyxJQUFGLENBQU91QyxFQUFFM0IsQ0FBRixDQUFQO0VBQ3JCO0VBQ0Q7RUFDQSxtQkFBT3FCLEVBQUVLLENBQUYsQ0FBUDtFQUNIO0VBQ0Q7Ozs7bUNBQ1M7RUFDTCxtQkFBTyxLQUFLL0IsR0FBTCxDQUFTLENBQVQsQ0FBUDtFQUNIO0VBQ0Q7Ozs7dUNBQ2E7RUFDVCxtQkFBTyxLQUFLQSxHQUFaO0VBQ0g7RUFDRDs7OzsrQkFDS3BJLFVBQVU7RUFDWCxpQkFBS29JLEdBQUwsQ0FBU3JJLE9BQVQsQ0FBaUIsYUFBSztFQUNsQkMseUJBQVN5SSxDQUFUO0VBQ0gsYUFGRDtFQUdIOzs7aUNBQ01pQixLQUFLO0VBQ1JBLGtCQUFNYSxLQUFLYixHQUFMLElBQVlBLElBQUljLE1BQUosRUFBWixHQUEyQmQsR0FBakM7RUFDQSxpQkFBS3RCLEdBQUwsQ0FBU3JJLE9BQVQsQ0FBaUI7RUFBQSx1QkFBSzBJLEVBQUVnQyxXQUFGLENBQWNmLEdBQWQsQ0FBTDtFQUFBLGFBQWpCO0VBQ0EsbUJBQU8sSUFBUDtFQUNIOzs7bUNBQ1FBLEtBQUs7RUFDVkEsa0JBQU1hLEtBQUtiLEdBQUwsSUFBWUEsSUFBSWMsTUFBSixFQUFaLEdBQTJCZCxHQUFqQztFQUNBLGlCQUFLdEIsR0FBTCxDQUFTckksT0FBVCxDQUFpQjtFQUFBLHVCQUFLMkosSUFBSWUsV0FBSixDQUFnQmhDLENBQWhCLENBQUw7RUFBQSxhQUFqQjtFQUNBLG1CQUFPLElBQVA7RUFDSDs7O21DQUNRO0VBQ0wsaUJBQUtMLEdBQUwsQ0FBU3JJLE9BQVQsQ0FBaUIsYUFBSztFQUNsQjBJLGtCQUFFd0IsVUFBRixDQUFhUyxXQUFiLENBQXlCakMsQ0FBekI7RUFDSCxhQUZEO0VBR0EsbUJBQU8sSUFBUDtFQUNIOzs7bUNBQ1E7RUFDTCxnQkFBRyxLQUFLTCxHQUFMLENBQVMsQ0FBVCxLQUFlcEgsTUFBbEIsRUFBMEI7RUFDdEIsdUJBQU9BLE9BQU8ySixXQUFkO0VBQ0gsYUFGRCxNQUVPO0VBQ0gsdUJBQU8sS0FBS3ZDLEdBQUwsQ0FBUyxDQUFULEVBQVl3QyxZQUFuQjtFQUNIO0VBQ0o7OztrQ0FDTztFQUNKLGdCQUFHLEtBQUt4QyxHQUFMLENBQVMsQ0FBVCxLQUFlcEgsTUFBbEIsRUFBMEI7RUFDdEIsdUJBQU9BLE9BQU82SixVQUFkO0VBQ0gsYUFGRCxNQUVPO0VBQ0gsdUJBQU8sS0FBS3pDLEdBQUwsQ0FBUyxDQUFULEVBQVkwQyxXQUFuQjtFQUNIO0VBQ0o7OztrQ0FDTztFQUNKLG1CQUFPLEtBQUsxQyxHQUFMLENBQVMsQ0FBVCxFQUFZMkMscUJBQVosRUFBUDtFQUNIOzs7Ozs7RUFHTCxTQUFTUixJQUFULENBQWMxSixHQUFkLEVBQW1CO0VBQ2YsV0FBT0EsZUFBZXFILFVBQXRCO0VBQ0g7O0VBRUQsU0FBUzRCLENBQVQsQ0FBVzNCLEVBQVgsRUFBZTtFQUNYLFdBQU8sSUFBSUQsVUFBSixDQUFlQyxFQUFmLENBQVA7RUFDSDs7RUM1TkQ7RUFDQTJCLEVBQUVySSxJQUFGLEdBQVNBLElBQVQ7Ozs7Ozs7OyJ9
