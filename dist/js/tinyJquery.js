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

  function ajax(_ref) {
      var url = _ref.url,
          method = _ref.method,
          headers = _ref.headers,
          data = _ref.data,
          success = _ref.success,
          error = _ref.error;

      headers = headers || 'application/x-www-form-urlencoded; charset=UTF-8';
      var request = new XMLHttpRequest();
      request.open(method, url, true);
      request.setRequestHeader('Content-type', headers);
      request.onload = function (progressEvent) {
          var response = progressEvent.currentTarget;
          var status = response.status,
              statusText = response.statusText,
              responseText = response.responseText,
              responseUrl = response.responseUrl;

          if (status > 199 && status < 400) {
              if (success) success(responseText);
          } else {
              if (error) error(statusText);
          }
      };
      request.onerror = function (error) {
          console.error(error);
      };
      request.send(data);
  }

  function get(url, _success) {
      ajax({
          url: url,
          method: 'get',
          success: function success(responseText) {
              _success(responseText);
          }
      });
  }

  function post(url, data, _success2) {
      ajax({
          url: url,
          method: 'post',
          data: data,
          success: function success(responseText) {
              _success2(responseText);
          }
      });
  }

  $.ajax = ajax;

  $.get = get;

  $.post = post;

  return $;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueUpxdWVyeS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2pzL3V0aWwvcG9seWZpbGwuanMiLCIuLi8uLi9zcmMvanMvdXRpbC9UaW55SnF1ZXJ5LmpzIiwiLi4vLi4vc3JjL2pzL3V0aWwvYWpheC5qcyIsIi4uLy4uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQcm9kdWN0aW9uIHN0ZXBzIG9mIEVDTUEtMjYyLCBFZGl0aW9uIDUsIDE1LjQuNC4xOFxyXG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE4XHJcbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcclxuXHJcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xyXG5cclxuICAgIHZhciBULCBrO1xyXG5cclxuICAgIGlmICh0aGlzID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignIHRoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0b09iamVjdCgpIHBhc3NpbmcgdGhlXHJcbiAgICAvLyB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0KCkgaW50ZXJuYWxcclxuICAgIC8vIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXHJcbiAgICAvLyAzLiBMZXQgbGVuIGJlIHRvVWludDMyKGxlblZhbHVlKS5cclxuICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcclxuXHJcbiAgICAvLyA0LiBJZiBpc0NhbGxhYmxlKGNhbGxiYWNrKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLiBcclxuICAgIC8vIFNlZTogaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS4xMVxyXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNS4gSWYgdGhpc0FyZyB3YXMgc3VwcGxpZWQsIGxldCBUIGJlIHRoaXNBcmc7IGVsc2UgbGV0XHJcbiAgICAvLyBUIGJlIHVuZGVmaW5lZC5cclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICBUID0gdGhpc0FyZztcclxuICAgIH1cclxuXHJcbiAgICAvLyA2LiBMZXQgayBiZSAwXHJcbiAgICBrID0gMDtcclxuXHJcbiAgICAvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cclxuICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcblxyXG4gICAgICB2YXIga1ZhbHVlO1xyXG5cclxuICAgICAgLy8gYS4gTGV0IFBrIGJlIFRvU3RyaW5nKGspLlxyXG4gICAgICAvLyAgICBUaGlzIGlzIGltcGxpY2l0IGZvciBMSFMgb3BlcmFuZHMgb2YgdGhlIGluIG9wZXJhdG9yXHJcbiAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5XHJcbiAgICAgIC8vICAgIGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXHJcbiAgICAgIC8vICAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjXHJcbiAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cclxuICAgICAgaWYgKGsgaW4gTykge1xyXG5cclxuICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsXHJcbiAgICAgICAgLy8gbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cclxuICAgICAgICBrVmFsdWUgPSBPW2tdO1xyXG5cclxuICAgICAgICAvLyBpaS4gQ2FsbCB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2sgd2l0aCBUIGFzXHJcbiAgICAgICAgLy8gdGhlIHRoaXMgdmFsdWUgYW5kIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyBrVmFsdWUsIGssIGFuZCBPLlxyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwoVCwga1ZhbHVlLCBrLCBPKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBkLiBJbmNyZWFzZSBrIGJ5IDEuXHJcbiAgICAgIGsrKztcclxuICAgIH1cclxuICAgIC8vIDguIHJldHVybiB1bmRlZmluZWRcclxuICB9O1xyXG59IiwiY2xhc3MgVGlueUpxdWVyeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbCkge1xyXG4gICAgICAgIGxldCAkZWxcclxuICAgICAgICBpZih0eXBlb2YgZWwgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgJGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbClcclxuICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGVsID09ICdhcnJheScgfHwgZWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICRlbCA9IGVsXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGVsID0gW2VsXVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbCA9IFtdLnNsaWNlLmNhbGwoJGVsKVxyXG4gICAgfVxyXG4gICAgLy8gYWRkRXZlbnRMaXN0ZW5lclxyXG4gICAgb24oZXZlbnROYW1lLCBmbiwgYnViYmxlID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmbiwgIWJ1YmJsZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGkuYXR0YWNoRXZlbnQoYG9uJHtldmVudE5hbWV9YCwgZm4pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyByZW1vdmVFdmVudExpc3RlbmVyXHJcbiAgICB1bihldmVudE5hbWUsIGZuLCBidWJibGUgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIGkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCAhYnViYmxlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaS5kZXRhY2hFdmVudChgb24ke2V2ZW50TmFtZX1gLCBmbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIGFkZENsYXNzXHJcbiAgICBhYyhjbGFzc05hbWUpIHtcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpZihpLmNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGkuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gcmVtb3ZlQ2xhc3NcclxuICAgIHJjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGkuY2xhc3NMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaS5jbGFzc05hbWUgPSBpLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIHRvZ2dsZUNsYXNzXHJcbiAgICB0YyhjbGFzc05hbWUpIHtcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpZihpLmNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbCA9IGkuY2xhc3NOYW1lLnNwbGl0KCcgJylcclxuICAgICAgICAgICAgICAgIGlmKGNsLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYyhjbGFzc05hbWUpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWMoY2xhc3NOYW1lKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gY29udGFpbkNsYXNzXHJcbiAgICBjYyhjbGFzc05hbWUpIHtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaWYoaS5jbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIGZsYWcgPSB0cnVlXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2wgPSBpLmNsYXNzTmFtZS5zcGxpdCgnICcpXHJcbiAgICAgICAgICAgICAgICBpZihjbC5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkgZmxhZyA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGZsYWdcclxuICAgIH1cclxuICAgIC8vIHNldCBpbmxpbmUgc3R5bGVcclxuICAgIGNzcyhvYmosIHBzZXVkb0VsdCA9IG51bGwpIHtcclxuICAgICAgICBpZih0eXBlb2Ygb2JqID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy4kZWxbMF0sIHBzZXVkb0VsdClbb2JqXVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLmN1cnJlbnRTdHlsZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy4kZWwuZm9yRWFjaCh2ID0+IHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB2LnN0eWxlW2ldID0gb2JqW2ldXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IG9yIHNldCBpbnB1dCB2YWx1ZVxyXG4gICAgdmFsKHZhbCkge1xyXG4gICAgICAgIGlmKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbFswXS52YWx1ZSA9IHZhbFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbFswXS52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGdldCBvciBzZXQgZG9tIGlubmVySHRtbFxyXG4gICAgaHRtbCh2YWwpIHtcclxuICAgICAgICBpZih2YWwpIHtcclxuICAgICAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgICAgIGkuaW5uZXJIVE1MID0gdmFsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLmlubmVySFRNTFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGdldCBvciBzZXQgYXR0cmlidXRlXHJcbiAgICBhdHRyKGtleSwgdmFsKSB7XHJcbiAgICAgICAgaWYoa2V5ICYmICF2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLmdldEF0dHJpYnV0ZShrZXkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgICAgIGkuc2V0QXR0cmlidXRlKGtleSwgdmFsKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGdldCBKU09ORGF0YVxyXG4gICAgc2VyaWFsaXplT2JqZWN0KCkge1xyXG4gICAgICAgIGxldCBvYmogPSB7fVxyXG4gICAgICAgIHRoaXMuJGVsWzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0JykuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaWYoJChpKS5hdHRyKCd0eXBlJykgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqWyQoaSkuYXR0cignbmFtZScpXSA9ICQoaSkuYXR0cigndmFsdWUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoJChpKS5hdHRyKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYob2JqWyQoaSkuYXR0cignbmFtZScpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbJChpKS5hdHRyKCduYW1lJyldLnB1c2goJChpKS5hdHRyKCd2YWx1ZScpKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialskKGkpLmF0dHIoJ25hbWUnKV0gPSBbJChpKS5hdHRyKCd2YWx1ZScpXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9ialskKGkpLmF0dHIoJ25hbWUnKV0gPSAkKGkpLnZhbCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBvYmpcclxuICAgIH1cclxuICAgIC8vIHBhcmVudFxyXG4gICAgcGFyZW50KCkge1xyXG4gICAgICAgIHJldHVybiAkKHRoaXMuJGVsWzBdLnBhcmVudE5vZGUpXHJcbiAgICB9XHJcbiAgICAvLyBzaWJsaW5nc1xyXG4gICAgc2libGluZ3MoKSB7XHJcbiAgICAgICAgbGV0IGRvbSA9IHRoaXMuJGVsWzBdXHJcbiAgICAgICAgdmFyIGEgPSBbXTtcclxuICAgICAgICB2YXIgcCA9IGRvbS5wYXJlbnROb2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwbCA9IHAubGVuZ3RoOyBpIDwgcGw7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocFtpXSAhPT0gZG9tKSBhLnB1c2gocFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKEFycmF5LmlzQXJyYXkoYSkpXHJcbiAgICAgICAgcmV0dXJuICQoYSlcclxuICAgIH1cclxuICAgIC8vIOiOt+WPluWOn+eUn0RvbVxyXG4gICAgZ2V0RG9tKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbFswXVxyXG4gICAgfVxyXG4gICAgLy8g6I635Y+W5Y6f55SfRG9t5YiX6KGoXHJcbiAgICBnZXREb21MaXN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbFxyXG4gICAgfVxyXG4gICAgLy8gZWFjaFxyXG4gICAgZWFjaChjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGkpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGFwcGVuZCh2YWwpIHtcclxuICAgICAgICB2YWwgPSBpc1RKKHZhbCkgPyB2YWwuZ2V0RG9tKCkgOiB2YWxcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4gaS5hcHBlbmRDaGlsZCh2YWwpKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICBhcHBlbmRUbyh2YWwpIHtcclxuICAgICAgICB2YWwgPSBpc1RKKHZhbCkgPyB2YWwuZ2V0RG9tKCkgOiB2YWxcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4gdmFsLmFwcGVuZENoaWxkKGkpKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGkpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgaGVpZ2h0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuJGVsWzBdID09IHdpbmRvdykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLm9mZnNldEhlaWdodFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHdpZHRoKCkge1xyXG4gICAgICAgIGlmKHRoaXMuJGVsWzBdID09IHdpbmRvdykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGhcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0ub2Zmc2V0V2lkdGhcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBib3VuZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNUSihvYmopIHtcclxuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBUaW55SnF1ZXJ5XHJcbn1cclxuXHJcbmZ1bmN0aW9uICQoZWwpIHtcclxuICAgIHJldHVybiBuZXcgVGlueUpxdWVyeShlbClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgJCIsImV4cG9ydCBmdW5jdGlvbiBhamF4KHsgdXJsLCBtZXRob2QsIGhlYWRlcnMsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yIH0pIHtcclxuICAgIGhlYWRlcnMgPSBoZWFkZXJzIHx8ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXHJcbiAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcbiAgICByZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwsIHRydWUpXHJcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsIGhlYWRlcnMpXHJcbiAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKHByb2dyZXNzRXZlbnQpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBwcm9ncmVzc0V2ZW50LmN1cnJlbnRUYXJnZXRcclxuICAgICAgICBsZXQge3N0YXR1cywgc3RhdHVzVGV4dCwgcmVzcG9uc2VUZXh0LCByZXNwb25zZVVybH0gPSByZXNwb25zZVxyXG4gICAgICAgIGlmKHN0YXR1cyA+IDE5OSAmJiBzdGF0dXMgPCA0MDApIHtcclxuICAgICAgICAgICAgaWYoc3VjY2Vzcykgc3VjY2VzcyhyZXNwb25zZVRleHQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYoZXJyb3IpIGVycm9yKHN0YXR1c1RleHQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgfVxyXG4gICAgcmVxdWVzdC5zZW5kKGRhdGEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQodXJsLCBzdWNjZXNzKXtcclxuICAgIGFqYXgoe1xyXG4gICAgICAgIHVybCxcclxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlVGV4dClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcG9zdCh1cmwsIGRhdGEsIHN1Y2Nlc3MpIHtcclxuICAgIGFqYXgoe1xyXG4gICAgICAgIHVybCxcclxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlVGV4dClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59IiwiaW1wb3J0ICcuL3V0aWwvcG9seWZpbGwnXHJcblxyXG5pbXBvcnQgJCBmcm9tICcuL3V0aWwvVGlueUpxdWVyeSdcclxuXHJcbmltcG9ydCAqIGFzIHJlcXVlc3RzIGZyb20gJy4vdXRpbC9hamF4J1xyXG5cclxuJC5hamF4ID0gcmVxdWVzdHMuYWpheFxyXG5cclxuJC5nZXQgPSByZXF1ZXN0cy5nZXRcclxuXHJcbiQucG9zdCA9IHJlcXVlc3RzLnBvc3RcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICQiXSwibmFtZXMiOlsiQXJyYXkiLCJwcm90b3R5cGUiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwiVCIsImsiLCJUeXBlRXJyb3IiLCJPIiwiT2JqZWN0IiwibGVuIiwibGVuZ3RoIiwiYXJndW1lbnRzIiwia1ZhbHVlIiwiY2FsbCIsIlRpbnlKcXVlcnkiLCJlbCIsIiRlbCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInNsaWNlIiwiZXZlbnROYW1lIiwiZm4iLCJidWJibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiaSIsImF0dGFjaEV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRldGFjaEV2ZW50IiwiY2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwicmVwbGFjZSIsIlJlZ0V4cCIsInNwbGl0Iiwiam9pbiIsInRvZ2dsZSIsImNsIiwiaW5kZXhPZiIsInJjIiwiYWMiLCJmbGFnIiwiY29udGFpbnMiLCJvYmoiLCJwc2V1ZG9FbHQiLCJ3aW5kb3ciLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwidiIsInN0eWxlIiwidmFsIiwidmFsdWUiLCJpbm5lckhUTUwiLCJrZXkiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCIkIiwiYXR0ciIsImNoZWNrZWQiLCJwdXNoIiwicGFyZW50Tm9kZSIsImRvbSIsImEiLCJwIiwiY2hpbGRyZW4iLCJwbCIsImlzVEoiLCJnZXREb20iLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiaW5uZXJIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJpbm5lcldpZHRoIiwib2Zmc2V0V2lkdGgiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJhamF4IiwidXJsIiwibWV0aG9kIiwiaGVhZGVycyIsImRhdGEiLCJzdWNjZXNzIiwiZXJyb3IiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsIm9ubG9hZCIsInByb2dyZXNzRXZlbnQiLCJyZXNwb25zZSIsImN1cnJlbnRUYXJnZXQiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwicmVzcG9uc2VUZXh0IiwicmVzcG9uc2VVcmwiLCJvbmVycm9yIiwiY29uc29sZSIsInNlbmQiLCJnZXQiLCJwb3N0IiwicmVxdWVzdHMiXSwibWFwcGluZ3MiOiI7Ozs7OztFQUFBO0VBQ0E7RUFDQSxJQUFJLENBQUNBLE1BQU1DLFNBQU4sQ0FBZ0JDLE9BQXJCLEVBQThCOztFQUU1QkYsVUFBTUMsU0FBTixDQUFnQkMsT0FBaEIsR0FBMEIsVUFBU0MsUUFBVCxFQUFtQkMsT0FBbkIsRUFBNEI7O0VBRXBELFlBQUlDLENBQUosRUFBT0MsQ0FBUDs7RUFFQSxZQUFJLFFBQVEsSUFBWixFQUFrQjtFQUNoQixrQkFBTSxJQUFJQyxTQUFKLENBQWMsOEJBQWQsQ0FBTjtFQUNEOztFQUVEO0VBQ0E7RUFDQSxZQUFJQyxJQUFJQyxPQUFPLElBQVAsQ0FBUjs7RUFFQTtFQUNBO0VBQ0E7RUFDQSxZQUFJQyxNQUFNRixFQUFFRyxNQUFGLEtBQWEsQ0FBdkI7O0VBRUE7RUFDQTtFQUNBLFlBQUksT0FBT1IsUUFBUCxLQUFvQixVQUF4QixFQUFvQztFQUNsQyxrQkFBTSxJQUFJSSxTQUFKLENBQWNKLFdBQVcsb0JBQXpCLENBQU47RUFDRDs7RUFFRDtFQUNBO0VBQ0EsWUFBSVMs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
