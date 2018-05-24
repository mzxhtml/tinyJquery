import './util/polyfill'

import ajax from './util/ajax'
// 用ES6写的微型仿JQuery库，支持链式操作, 支持IE10及以上
import $ from './util/TinyJquery'
// console.log(ajax)
$.ajax = ajax

export default $