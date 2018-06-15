// this is the entry file

import './util/polyfill'

import $ from './util/TinyJquery'

import * as requests from './util/ajax'

$.ajax = requests.ajax

$.get = requests.get

$.post = requests.post

export default $