(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-polyfill')) :
  typeof define === 'function' && define.amd ? define(['babel-polyfill'], factory) :
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
  // 用ES6写的微型仿JQuery库，支持链式操作, IE滚粗

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
                  i.addEventListener(eventName, fn, !bubble);
              });
              return this;
          }
          // removeEventListener

      }, {
          key: 'un',
          value: function un(eventName, fn) {
              var bubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

              this.$el.forEach(function (i) {
                  i.removeEventListener(eventName, fn, !bubble);
              });
              return this;
          }
          // addClass

      }, {
          key: 'ac',
          value: function ac(className) {
              this.$el.forEach(function (i) {
                  i.classList.add(className);
              });
              return this;
          }
          // removeClass

      }, {
          key: 'rc',
          value: function rc(className) {
              this.$el.forEach(function (i) {
                  i.classList.remove(className);
              });
              return this;
          }
          // toggleClass

      }, {
          key: 'tc',
          value: function tc(className) {
              this.$el.forEach(function (i) {
                  i.classList.toggle(className);
              });
              return this;
          }
          // containClass

      }, {
          key: 'cc',
          value: function cc(className) {
              var flag = false;
              this.$el.forEach(function (i) {
                  if (i.classList.contains(className)) flag = true;
              });
              return flag;
          }
          // set inline style

      }, {
          key: 'css',
          value: function css(obj) {
              this.$el.forEach(function (v) {
                  Object.keys(obj).forEach(function (i) {
                      v.style[i] = obj[i];
                  });
              });
              return this;
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
      }]);

      return TinyJquery;
  }();

  function isTJ(obj) {
      return obj.constructor.name == 'TinyJquery';
  }

  function $(el) {
      return new TinyJquery(el);
  }

  return $;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueUpxdWVyeS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2pzL3BvbHlmaWxsLmpzIiwiLi4vLi4vc3JjL2pzL1RpbnlKcXVlcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUHJvZHVjdGlvbiBzdGVwcyBvZiBFQ01BLTI2MiwgRWRpdGlvbiA1LCAxNS40LjQuMThcclxuLy8gUmVmZXJlbmNlOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjQuNC4xOFxyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XHJcblxyXG4gIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuXHJcbiAgICB2YXIgVCwgaztcclxuXHJcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJyB0aGlzIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdG9PYmplY3QoKSBwYXNzaW5nIHRoZVxyXG4gICAgLy8gfHRoaXN8IHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cclxuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG5cclxuICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCgpIGludGVybmFsXHJcbiAgICAvLyBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxyXG4gICAgLy8gMy4gTGV0IGxlbiBiZSB0b1VpbnQzMihsZW5WYWx1ZSkuXHJcbiAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XHJcblxyXG4gICAgLy8gNC4gSWYgaXNDYWxsYWJsZShjYWxsYmFjaykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi4gXHJcbiAgICAvLyBTZWU6IGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuMTFcclxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNhbGxiYWNrICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDUuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldFxyXG4gICAgLy8gVCBiZSB1bmRlZmluZWQuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgVCA9IHRoaXNBcmc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNi4gTGV0IGsgYmUgMFxyXG4gICAgayA9IDA7XHJcblxyXG4gICAgLy8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXHJcbiAgICB3aGlsZSAoayA8IGxlbikge1xyXG5cclxuICAgICAgdmFyIGtWYWx1ZTtcclxuXHJcbiAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cclxuICAgICAgLy8gICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxyXG4gICAgICAvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBIYXNQcm9wZXJ0eVxyXG4gICAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxyXG4gICAgICAvLyAgICBUaGlzIHN0ZXAgY2FuIGJlIGNvbWJpbmVkIHdpdGggY1xyXG4gICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXHJcbiAgICAgIGlmIChrIGluIE8pIHtcclxuXHJcbiAgICAgICAgLy8gaS4gTGV0IGtWYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbFxyXG4gICAgICAgIC8vIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXHJcbiAgICAgICAga1ZhbHVlID0gT1trXTtcclxuXHJcbiAgICAgICAgLy8gaWkuIENhbGwgdGhlIENhbGwgaW50ZXJuYWwgbWV0aG9kIG9mIGNhbGxiYWNrIHdpdGggVCBhc1xyXG4gICAgICAgIC8vIHRoZSB0aGlzIHZhbHVlIGFuZCBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcga1ZhbHVlLCBrLCBhbmQgTy5cclxuICAgICAgICBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxyXG4gICAgICBrKys7XHJcbiAgICB9XHJcbiAgICAvLyA4LiByZXR1cm4gdW5kZWZpbmVkXHJcbiAgfTtcclxufSIsImltcG9ydCAnLi9wb2x5ZmlsbCdcclxuLy8g55SoRVM25YaZ55qE5b6u5Z6L5Lu/SlF1ZXJ55bqT77yM5pSv5oyB6ZO+5byP5pON5L2cLCBJRea7mueyl1xyXG5jbGFzcyBUaW55SnF1ZXJ5IHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICAgICAgbGV0ICRlbFxyXG4gICAgICAgIGlmKHR5cGVvZiBlbCA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAkZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsKVxyXG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2YgZWwgPT0gJ2FycmF5JyB8fCBlbC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGVsID0gZWxcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkZWwgPSBbZWxdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVsID0gW10uc2xpY2UuY2FsbCgkZWwpXHJcbiAgICB9XHJcbiAgICAvLyBhZGRFdmVudExpc3RlbmVyXHJcbiAgICBvbihldmVudE5hbWUsIGZuLCBidWJibGUgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGkuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCAhYnViYmxlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIHJlbW92ZUV2ZW50TGlzdGVuZXJcclxuICAgIHVuKGV2ZW50TmFtZSwgZm4sIGJ1YmJsZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZm4sICFidWJibGUpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gYWRkQ2xhc3NcclxuICAgIGFjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGkuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gcmVtb3ZlQ2xhc3NcclxuICAgIHJjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gdG9nZ2xlQ2xhc3NcclxuICAgIHRjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGkuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gY29udGFpbkNsYXNzXHJcbiAgICBjYyhjbGFzc05hbWUpIHtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaWYoaS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgZmxhZyA9IHRydWVcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBmbGFnXHJcbiAgICB9XHJcbiAgICAvLyBzZXQgaW5saW5lIHN0eWxlXHJcbiAgICBjc3Mob2JqKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaCh2ID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdi5zdHlsZVtpXSA9IG9ialtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIGdldCBvciBzZXQgaW5wdXQgdmFsdWVcclxuICAgIHZhbCh2YWwpIHtcclxuICAgICAgICBpZih2YWwpIHtcclxuICAgICAgICAgICAgdGhpcy4kZWxbMF0udmFsdWUgPSB2YWxcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0udmFsdWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBnZXQgb3Igc2V0IGRvbSBpbm5lckh0bWxcclxuICAgIGh0bWwodmFsKSB7XHJcbiAgICAgICAgaWYodmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpLmlubmVySFRNTCA9IHZhbFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbFswXS5pbm5lckhUTUxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBnZXQgb3Igc2V0IGF0dHJpYnV0ZVxyXG4gICAgYXR0cihrZXksIHZhbCkge1xyXG4gICAgICAgIGlmKGtleSAmJiAhdmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbFswXS5nZXRBdHRyaWJ1dGUoa2V5KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpLnNldEF0dHJpYnV0ZShrZXksIHZhbClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBnZXQgSlNPTkRhdGFcclxuICAgIHNlcmlhbGl6ZU9iamVjdCgpIHtcclxuICAgICAgICBsZXQgb2JqID0ge31cclxuICAgICAgICB0aGlzLiRlbFswXS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCQoaSkuYXR0cigndHlwZScpID09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialskKGkpLmF0dHIoJ25hbWUnKV0gPSAkKGkpLmF0dHIoJ3ZhbHVlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmKCQoaSkuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9ialskKGkpLmF0dHIoJ25hbWUnKV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqWyQoaSkuYXR0cignbmFtZScpXS5wdXNoKCQoaSkuYXR0cigndmFsdWUnKSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbJChpKS5hdHRyKCduYW1lJyldID0gWyQoaSkuYXR0cigndmFsdWUnKV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvYmpbJChpKS5hdHRyKCduYW1lJyldID0gJChpKS52YWwoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gb2JqXHJcbiAgICB9XHJcbiAgICAvLyBwYXJlbnRcclxuICAgIHBhcmVudCgpIHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzLiRlbFswXS5wYXJlbnROb2RlKVxyXG4gICAgfVxyXG4gICAgLy8gc2libGluZ3NcclxuICAgIHNpYmxpbmdzKCkge1xyXG4gICAgICAgIGxldCBkb20gPSB0aGlzLiRlbFswXVxyXG4gICAgICAgIHZhciBhID0gW107XHJcbiAgICAgICAgdmFyIHAgPSBkb20ucGFyZW50Tm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcGwgPSBwLmxlbmd0aDsgaSA8IHBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBbaV0gIT09IGRvbSkgYS5wdXNoKHBbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhBcnJheS5pc0FycmF5KGEpKVxyXG4gICAgICAgIHJldHVybiAkKGEpXHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bljp/nlJ9Eb21cclxuICAgIGdldERvbSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF1cclxuICAgIH1cclxuICAgIC8vIOiOt+WPluWOn+eUn0RvbeWIl+ihqFxyXG4gICAgZ2V0RG9tTGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZWxcclxuICAgIH1cclxuICAgIC8vIGVhY2hcclxuICAgIGVhY2goY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBhcHBlbmQodmFsKSB7XHJcbiAgICAgICAgdmFsID0gaXNUSih2YWwpID8gdmFsLmdldERvbSgpIDogdmFsXHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IGkuYXBwZW5kQ2hpbGQodmFsKSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgYXBwZW5kVG8odmFsKSB7XHJcbiAgICAgICAgdmFsID0gaXNUSih2YWwpID8gdmFsLmdldERvbSgpIDogdmFsXHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHZhbC5hcHBlbmRDaGlsZChpKSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1RKKG9iaikge1xyXG4gICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09ICdUaW55SnF1ZXJ5J1xyXG59XHJcblxyXG5mdW5jdGlvbiAkKGVsKSB7XHJcbiAgICByZXR1cm4gbmV3IFRpbnlKcXVlcnkoZWwpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICQiXSwibmFtZXMiOlsiQXJyYXkiLCJwcm90b3R5cGUiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwiVCIsImsiLCJUeXBlRXJyb3IiLCJPIiwiT2JqZWN0IiwibGVuIiwibGVuZ3RoIiwiYXJndW1lbnRzIiwia1ZhbHVlIiwiY2FsbCIsIlRpbnlKcXVlcnkiLCJlbCIsIiRlbCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInNsaWNlIiwiZXZlbnROYW1lIiwiZm4iLCJidWJibGUiLCJpIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJ0b2dnbGUiLCJmbGFnIiwiY29udGFpbnMiLCJvYmoiLCJrZXlzIiwidiIsInN0eWxlIiwidmFsIiwidmFsdWUiLCJpbm5lckhUTUwiLCJrZXkiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCIkIiwiYXR0ciIsImNoZWNrZWQiLCJwdXNoIiwicGFyZW50Tm9kZSIsImRvbSIsImEiLCJwIiwiY2hpbGRyZW4iLCJwbCIsImlzVEoiLCJnZXREb20iLCJhcHBlbmRDaGlsZCIsImNvbnN0cnVjdG9yIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUE7RUFDQTtFQUNBLElBQUksQ0FBQ0EsTUFBTUMsU0FBTixDQUFnQkMsT0FBckIsRUFBOEI7O0VBRTVCRixVQUFNQyxTQUFOLENBQWdCQyxPQUFoQixHQUEwQixVQUFTQyxRQUFULEVBQW1CQyxPQUFuQixFQUE0Qjs7RUFFcEQsWUFBSUMsQ0FBSixFQUFPQyxDQUFQOztFQUVBLFlBQUksUUFBUSxJQUFaLEVBQWtCO0VBQ2hCLGtCQUFNLElBQUlDLFNBQUosQ0FBYyw4QkFBZCxDQUFOO0VBQ0Q7O0VBRUQ7RUFDQTtFQUNBLFlBQUlDLElBQUlDLE9BQU8sSUFBUCxDQUFSOztFQUVBO0VBQ0E7RUFDQTtFQUNBLFlBQUlDLE1BQU1GLEVBQUVHLE1BQUYsS0FBYSxDQUF2Qjs7RUFFQTtFQUNBO0VBQ0EsWUFBSSxPQUFPUixRQUFQLEtBQW9CLFVBQXhCLEVBQW9DO0VBQ2xDLGtCQUFNLElBQUlJLFNBQUosQ0FBY0osV0FBVyxvQkFBekIsQ0FBTjtFQUNEOztFQUVEO0VBQ0E7RUFDQSxZQUFJUyxVQUFVRCxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0VBQ3hCTixnQkFBSUQsT0FBSjtFQUNEOztFQUVEO0VBQ0FFLFlBQUksQ0FBSjs7RUFFQTtFQUNBLGVBQU9BLElBQUlJLEdBQVgsRUFBZ0I7O0VBRWQsZ0JBQUlHLE1BQUo7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsZ0JBQUlQLEtBQUtFLENBQVQsRUFBWTs7RUFFVjtFQUNBO0VBQ0FLLHlCQUFTTCxFQUFFRixDQUFGLENBQVQ7O0VBRUE7RUFDQTtFQUNBSCx5QkFBU1csSUFBVCxDQUFjVCxDQUFkLEVBQWlCUSxNQUFqQixFQUF5QlAsQ0FBekIsRUFBNEJFLENBQTVCO0VBQ0Q7RUFDRDtFQUNB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
