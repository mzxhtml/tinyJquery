(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.$ = factory());
}(this, (function () { 'use strict';

    // Production steps of ECMA-262, Edition 5, 15.4.4.18 Reference:
    // http://es5.github.io/#x15.4.4.18
    if (!Array.prototype.forEach) {

            Array.prototype.forEach = function (callback, thisArg) {

                    var T, k;

                    if (this == null) {
                            throw new TypeError(' this is null or not defined');
                    }

                    // 1. Let O be the result of calling toObject() passing the |this| value as the
                    // argument.
                    var O = Object(this);

                    // 2. Let lenValue be the result of calling the Get() internal method of O with
                    // the argument "length".
                    // 3. Let len be toUint32(lenValue).
                    var len = O.length >>> 0;

                    // 4. If isCallable(callback) is false, throw a TypeError exception. See:
                    // http://es5.github.com/#x9.11
                    if (typeof callback !== "function") {
                            throw new TypeError(callback + ' is not a function');
                    }

                    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 1) {
                            T = thisArg;
                    }

                    // 6. Let k be 0
                    k = 0;

                    // 7. Repeat, while k < len
                    while (k < len) {

                            var kValue;

                            // a. Let Pk be ToString(k).    This is implicit for LHS operands of the in
                            // operator b. Let kPresent be the result of calling the HasProperty    internal
                            // method of O with argument Pk.    This step can be combined with c c. If
                            // kPresent is true, then
                            if (k in O) {

                                    // i. Let kValue be the result of calling the Get internal method of O with
                                    // argument Pk.
                                    kValue = O[k];

                                    // ii. Call the Call internal method of callback with T as the this value and
                                    // argument list containing kValue, k, and O.
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
            // get html dom

        }, {
            key: 'getDom',
            value: function getDom() {
                return this.$el[0];
            }
            // get html dom list

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
            // append target node to node

        }, {
            key: 'append',
            value: function append(val) {
                val = isTJ(val) ? val.getDom() : val;
                this.$el.forEach(function (i) {
                    return i.appendChild(val);
                });
                return this;
            }
            // append node to target node

        }, {
            key: 'appendTo',
            value: function appendTo(val) {
                val = isTJ(val) ? val.getDom() : val;
                this.$el.forEach(function (i) {
                    return val.appendChild(i);
                });
                return this;
            }
            // remove dom

        }, {
            key: 'remove',
            value: function remove() {
                this.$el.forEach(function (i) {
                    i.parentNode.removeChild(i);
                });
                return this;
            }
            // get the el's height

        }, {
            key: 'height',
            value: function height() {
                if (this.$el[0] == window) {
                    return window.innerHeight;
                } else {
                    return this.$el[0].offsetHeight;
                }
            }
            // get the el's width

        }, {
            key: 'width',
            value: function width() {
                if (this.$el[0] == window) {
                    return window.innerWidth;
                } else {
                    return this.$el[0].offsetWidth;
                }
            }
            // get the el's bound relative to document

        }, {
            key: 'bound',
            value: function bound() {
                return this.$el[0].getBoundingClientRect();
            }
        }]);

        return TinyJquery;
    }();

    /**
     * to judge whether an object is TinyJquery or not
     * 
     * @param {*} obj
     * @returns Boolean
     */


    function isTJ(obj) {
        return obj instanceof TinyJquery;
    }

    /**
     * to construct a TinyJquery object
     *
     * @param {*} el    css selectors or javascript dom
     * @returns
     */
    function $(el) {
        return new TinyJquery(el);
    }

    /**
     * ajax function like $.ajax in jquery
     *
     * @export
     * @param {String} url
     * @param {String} method
     * @param {String} headers
     * @param {String} data
     * @param {Function} success
     * @param {Function} error
     */
    function ajax(_ref) {
        var url = _ref.url,
            method = _ref.method,
            headers = _ref.headers,
            data = _ref.data,
            success = _ref.success,
            error = _ref.error;

        headers = headers || 'application/x-www-form-urlencoded; charset=UTF-8';
        // conver JSON Object to String
        if (data && typeof data != 'string') data = JSON.stringify(data);
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

    /**
     * ajax function like $.get in jquery
     *
     * @export
     * @param {String} url
     * @param {Function} success
     */
    function get(url, _success) {
        ajax({
            url: url,
            method: 'get',
            success: function success(responseText) {
                _success(responseText);
            }
        });
    }

    /**
     * ajax function like $.post in jquery
     *
     * @export
     * @param {String} url
     * @param {String} data
     * @param {Function} success
     */
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

    // this is the entry file

    $.ajax = ajax;

    $.get = get;

    $.post = post;

    return $;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueUpxdWVyeS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2pzL3V0aWwvcG9seWZpbGwuanMiLCIuLi8uLi9zcmMvanMvdXRpbC9UaW55SnF1ZXJ5LmpzIiwiLi4vLi4vc3JjL2pzL3V0aWwvYWpheC5qcyIsIi4uLy4uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQcm9kdWN0aW9uIHN0ZXBzIG9mIEVDTUEtMjYyLCBFZGl0aW9uIDUsIDE1LjQuNC4xOCBSZWZlcmVuY2U6XHJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE4XHJcbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcclxuXHJcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc0FyZykge1xyXG5cclxuICAgICAgICB2YXIgVCxcclxuICAgICAgICAgICAgaztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcgdGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdG9PYmplY3QoKSBwYXNzaW5nIHRoZSB8dGhpc3wgdmFsdWUgYXMgdGhlXHJcbiAgICAgICAgLy8gYXJndW1lbnQuXHJcbiAgICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCgpIGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGhcclxuICAgICAgICAvLyB0aGUgYXJndW1lbnQgXCJsZW5ndGhcIi5cclxuICAgICAgICAvLyAzLiBMZXQgbGVuIGJlIHRvVWludDMyKGxlblZhbHVlKS5cclxuICAgICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XHJcblxyXG4gICAgICAgIC8vIDQuIElmIGlzQ2FsbGFibGUoY2FsbGJhY2spIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uIFNlZTpcclxuICAgICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjExXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyA1LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXQgVCBiZSB1bmRlZmluZWQuXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIFQgPSB0aGlzQXJnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gNi4gTGV0IGsgYmUgMFxyXG4gICAgICAgIGsgPSAwO1xyXG5cclxuICAgICAgICAvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cclxuICAgICAgICB3aGlsZSAoayA8IGxlbikge1xyXG5cclxuICAgICAgICAgICAgdmFyIGtWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS4gICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpblxyXG4gICAgICAgICAgICAvLyBvcGVyYXRvciBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBIYXNQcm9wZXJ0eSAgICBpbnRlcm5hbFxyXG4gICAgICAgICAgICAvLyBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLiAgICBUaGlzIHN0ZXAgY2FuIGJlIGNvbWJpbmVkIHdpdGggYyBjLiBJZlxyXG4gICAgICAgICAgICAvLyBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXHJcbiAgICAgICAgICAgIGlmIChrIGluIE8pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGhcclxuICAgICAgICAgICAgICAgIC8vIGFyZ3VtZW50IFBrLlxyXG4gICAgICAgICAgICAgICAga1ZhbHVlID0gT1trXTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpaS4gQ2FsbCB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2sgd2l0aCBUIGFzIHRoZSB0aGlzIHZhbHVlIGFuZFxyXG4gICAgICAgICAgICAgICAgLy8gYXJndW1lbnQgbGlzdCBjb250YWluaW5nIGtWYWx1ZSwgaywgYW5kIE8uXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxyXG4gICAgICAgICAgICBrKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDguIHJldHVybiB1bmRlZmluZWRcclxuICAgIH07XHJcbn0iLCJjbGFzcyBUaW55SnF1ZXJ5IHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICAgICAgbGV0ICRlbFxyXG4gICAgICAgIGlmKHR5cGVvZiBlbCA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAkZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsKVxyXG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2YgZWwgPT0gJ2FycmF5JyB8fCBlbC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGVsID0gZWxcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkZWwgPSBbZWxdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVsID0gW10uc2xpY2UuY2FsbCgkZWwpXHJcbiAgICB9XHJcbiAgICAvLyBhZGRFdmVudExpc3RlbmVyXHJcbiAgICBvbihldmVudE5hbWUsIGZuLCBidWJibGUgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIGkuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCAhYnViYmxlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaS5hdHRhY2hFdmVudChgb24ke2V2ZW50TmFtZX1gLCBmbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIHJlbW92ZUV2ZW50TGlzdGVuZXJcclxuICAgIHVuKGV2ZW50TmFtZSwgZm4sIGJ1YmJsZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaWYoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgaS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZm4sICFidWJibGUpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpLmRldGFjaEV2ZW50KGBvbiR7ZXZlbnROYW1lfWAsIGZuKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gYWRkQ2xhc3NcclxuICAgIGFjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGkuY2xhc3NMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaS5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyByZW1vdmVDbGFzc1xyXG4gICAgcmMoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaWYoaS5jbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTmFtZSA9IGkuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gdG9nZ2xlQ2xhc3NcclxuICAgIHRjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGkuY2xhc3NMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsID0gaS5jbGFzc05hbWUuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgICAgICAgaWYoY2wuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJjKGNsYXNzTmFtZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hYyhjbGFzc05hbWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBjb250YWluQ2xhc3NcclxuICAgIGNjKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIGxldCBmbGFnID0gZmFsc2VcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpZihpLmNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgZmxhZyA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbCA9IGkuY2xhc3NOYW1lLnNwbGl0KCcgJylcclxuICAgICAgICAgICAgICAgIGlmKGNsLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSBmbGFnID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gZmxhZ1xyXG4gICAgfVxyXG4gICAgLy8gc2V0IGlubGluZSBzdHlsZVxyXG4gICAgY3NzKG9iaiwgcHNldWRvRWx0ID0gbnVsbCkge1xyXG4gICAgICAgIGlmKHR5cGVvZiBvYmogPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRlbFswXSwgcHNldWRvRWx0KVtvYmpdXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0uY3VycmVudFN0eWxlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHYuc3R5bGVbaV0gPSBvYmpbaV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBnZXQgb3Igc2V0IGlucHV0IHZhbHVlXHJcbiAgICB2YWwodmFsKSB7XHJcbiAgICAgICAgaWYodmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsWzBdLnZhbHVlID0gdmFsXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IG9yIHNldCBkb20gaW5uZXJIdG1sXHJcbiAgICBodG1sKHZhbCkge1xyXG4gICAgICAgIGlmKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaS5pbm5lckhUTUwgPSB2YWxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0uaW5uZXJIVE1MXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IG9yIHNldCBhdHRyaWJ1dGVcclxuICAgIGF0dHIoa2V5LCB2YWwpIHtcclxuICAgICAgICBpZihrZXkgJiYgIXZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWxbMF0uZ2V0QXR0cmlidXRlKGtleSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoa2V5LCB2YWwpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IEpTT05EYXRhXHJcbiAgICBzZXJpYWxpemVPYmplY3QoKSB7XHJcbiAgICAgICAgbGV0IG9iaiA9IHt9XHJcbiAgICAgICAgdGhpcy4kZWxbMF0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKS5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBpZigkKGkpLmF0dHIoJ3R5cGUnKSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbJChpKS5hdHRyKCduYW1lJyldID0gJChpKS5hdHRyKCd2YWx1ZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZigkKGkpLmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihvYmpbJChpKS5hdHRyKCduYW1lJyldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialskKGkpLmF0dHIoJ25hbWUnKV0ucHVzaCgkKGkpLmF0dHIoJ3ZhbHVlJykpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqWyQoaSkuYXR0cignbmFtZScpXSA9IFskKGkpLmF0dHIoJ3ZhbHVlJyldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb2JqWyQoaSkuYXR0cignbmFtZScpXSA9ICQoaSkudmFsKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG4gICAgLy8gcGFyZW50XHJcbiAgICBwYXJlbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuICQodGhpcy4kZWxbMF0ucGFyZW50Tm9kZSlcclxuICAgIH1cclxuICAgIC8vIHNpYmxpbmdzXHJcbiAgICBzaWJsaW5ncygpIHtcclxuICAgICAgICBsZXQgZG9tID0gdGhpcy4kZWxbMF1cclxuICAgICAgICB2YXIgYSA9IFtdO1xyXG4gICAgICAgIHZhciBwID0gZG9tLnBhcmVudE5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHBsID0gcC5sZW5ndGg7IGkgPCBwbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwW2ldICE9PSBkb20pIGEucHVzaChwW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coQXJyYXkuaXNBcnJheShhKSlcclxuICAgICAgICByZXR1cm4gJChhKVxyXG4gICAgfVxyXG4gICAgLy8gZ2V0IGh0bWwgZG9tXHJcbiAgICBnZXREb20oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdXHJcbiAgICB9XHJcbiAgICAvLyBnZXQgaHRtbCBkb20gbGlzdFxyXG4gICAgZ2V0RG9tTGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZWxcclxuICAgIH1cclxuICAgIC8vIGVhY2hcclxuICAgIGVhY2goY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICAvLyBhcHBlbmQgdGFyZ2V0IG5vZGUgdG8gbm9kZVxyXG4gICAgYXBwZW5kKHZhbCkge1xyXG4gICAgICAgIHZhbCA9IGlzVEoodmFsKSA/IHZhbC5nZXREb20oKSA6IHZhbFxyXG4gICAgICAgIHRoaXMuJGVsLmZvckVhY2goaSA9PiBpLmFwcGVuZENoaWxkKHZhbCkpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIGFwcGVuZCBub2RlIHRvIHRhcmdldCBub2RlXHJcbiAgICBhcHBlbmRUbyh2YWwpIHtcclxuICAgICAgICB2YWwgPSBpc1RKKHZhbCkgPyB2YWwuZ2V0RG9tKCkgOiB2YWxcclxuICAgICAgICB0aGlzLiRlbC5mb3JFYWNoKGkgPT4gdmFsLmFwcGVuZENoaWxkKGkpKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyByZW1vdmUgZG9tXHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGkpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gZ2V0IHRoZSBlbCdzIGhlaWdodFxyXG4gICAgaGVpZ2h0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuJGVsWzBdID09IHdpbmRvdykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLm9mZnNldEhlaWdodFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGdldCB0aGUgZWwncyB3aWR0aFxyXG4gICAgd2lkdGgoKSB7XHJcbiAgICAgICAgaWYodGhpcy4kZWxbMF0gPT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbFswXS5vZmZzZXRXaWR0aFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGdldCB0aGUgZWwncyBib3VuZCByZWxhdGl2ZSB0byBkb2N1bWVudFxyXG4gICAgYm91bmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiB0byBqdWRnZSB3aGV0aGVyIGFuIG9iamVjdCBpcyBUaW55SnF1ZXJ5IG9yIG5vdFxyXG4gKiBcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHJldHVybnMgQm9vbGVhblxyXG4gKi9cclxuZnVuY3Rpb24gaXNUSihvYmopIHtcclxuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBUaW55SnF1ZXJ5XHJcbn1cclxuXHJcbi8qKlxyXG4gKiB0byBjb25zdHJ1Y3QgYSBUaW55SnF1ZXJ5IG9iamVjdFxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IGVsICAgIGNzcyBzZWxlY3RvcnMgb3IgamF2YXNjcmlwdCBkb21cclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uICQoZWwpIHtcclxuICAgIHJldHVybiBuZXcgVGlueUpxdWVyeShlbClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgJCIsIi8qKlxyXG4gKiBhamF4IGZ1bmN0aW9uIGxpa2UgJC5hamF4IGluIGpxdWVyeVxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcclxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVyc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWNjZXNzXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVycm9yXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWpheCh7IHVybCwgbWV0aG9kLCBoZWFkZXJzLCBkYXRhLCBzdWNjZXNzLCBlcnJvciB9KSB7XHJcbiAgICBoZWFkZXJzID0gaGVhZGVycyB8fCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04J1xyXG4gICAgLy8gY29udmVyIEpTT04gT2JqZWN0IHRvIFN0cmluZ1xyXG4gICAgaWYoZGF0YSAmJiB0eXBlb2YgZGF0YSAhPSAnc3RyaW5nJykgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXHJcbiAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcbiAgICByZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwsIHRydWUpXHJcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsIGhlYWRlcnMpXHJcbiAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKHByb2dyZXNzRXZlbnQpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBwcm9ncmVzc0V2ZW50LmN1cnJlbnRUYXJnZXRcclxuICAgICAgICBsZXQge3N0YXR1cywgc3RhdHVzVGV4dCwgcmVzcG9uc2VUZXh0LCByZXNwb25zZVVybH0gPSByZXNwb25zZVxyXG4gICAgICAgIGlmKHN0YXR1cyA+IDE5OSAmJiBzdGF0dXMgPCA0MDApIHtcclxuICAgICAgICAgICAgaWYoc3VjY2Vzcykgc3VjY2VzcyhyZXNwb25zZVRleHQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYoZXJyb3IpIGVycm9yKHN0YXR1c1RleHQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgfVxyXG4gICAgcmVxdWVzdC5zZW5kKGRhdGEpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBhamF4IGZ1bmN0aW9uIGxpa2UgJC5nZXQgaW4ganF1ZXJ5XHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWNjZXNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0KHVybCwgc3VjY2Vzcyl7XHJcbiAgICBhamF4KHtcclxuICAgICAgICB1cmwsXHJcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZVRleHQpIHtcclxuICAgICAgICAgICAgc3VjY2VzcyhyZXNwb25zZVRleHQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIGFqYXggZnVuY3Rpb24gbGlrZSAkLnBvc3QgaW4ganF1ZXJ5XHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWNjZXNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcG9zdCh1cmwsIGRhdGEsIHN1Y2Nlc3MpIHtcclxuICAgIGFqYXgoe1xyXG4gICAgICAgIHVybCxcclxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlVGV4dClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59IiwiLy8gdGhpcyBpcyB0aGUgZW50cnkgZmlsZVxyXG5cclxuaW1wb3J0ICcuL3V0aWwvcG9seWZpbGwnXHJcblxyXG5pbXBvcnQgJCBmcm9tICcuL3V0aWwvVGlueUpxdWVyeSdcclxuXHJcbmltcG9ydCAqIGFzIHJlcXVlc3RzIGZyb20gJy4vdXRpbC9hamF4J1xyXG5cclxuJC5hamF4ID0gcmVxdWVzdHMuYWpheFxyXG5cclxuJC5nZXQgPSByZXF1ZXN0cy5nZXRcclxuXHJcbiQucG9zdCA9IHJlcXVlc3RzLnBvc3RcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICQiXSwibmFtZXMiOlsiQXJyYXkiLCJwcm90b3R5cGUiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwiVCIsImsiLCJUeXBlRXJyb3IiLCJPIiwiT2JqZWN0IiwibGVuIiwibGVuZ3RoIiwiYXJndW1lbnRzIiwia1ZhbHVlIiwiY2FsbCIsIlRpbnlKcXVlcnkiLCJlbCIsIiRlbCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInNsaWNlIiwiZXZlbnROYW1lIiwiZm4iLCJidWJibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiaSIsImF0dGFjaEV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRldGFjaEV2ZW50IiwiY2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwicmVwbGFjZSIsIlJlZ0V4cCIsInNwbGl0Iiwiam9pbiIsInRvZ2dsZSIsImNsIiwiaW5kZXhPZiIsInJjIiwiYWMiLCJmbGFnIiwiY29udGFpbnMiLCJvYmoiLCJwc2V1ZG9FbHQiLCJ3aW5kb3ciLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwidiIsInN0eWxlIiwidmFsIiwidmFsdWUiLCJpbm5lckhUTUwiLCJrZXkiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCIkIiwiYXR0ciIsImNoZWNrZWQiLCJwdXNoIiwicGFyZW50Tm9kZSIsImRvbSIsImEiLCJwIiwiY2hpbGRyZW4iLCJwbCIsImlzVEoiLCJnZXREb20iLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiaW5uZXJIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJpbm5lcldpZHRoIiwib2Zmc2V0V2lkdGgiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJhamF4IiwidXJsIiwibWV0aG9kIiwiaGVhZGVycyIsImRhdGEiLCJzdWNjZXNzIiwiZXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwicmVxdWVzdCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJwcm9ncmVzc0V2ZW50IiwicmVzcG9uc2UiLCJjdXJyZW50VGFyZ2V0Iiwic3RhdHVzIiwic3RhdHVzVGV4dCIsInJlc3BvbnNlVGV4dCIsInJlc3BvbnNlVXJsIiwib25lcnJvciIsImNvbnNvbGUiLCJzZW5kIiwiZ2V0IiwicG9zdCIsInJlcXVlc3RzIl0sIm1hcHBpbmdzIjoiOzs7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
