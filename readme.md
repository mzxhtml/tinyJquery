# Description
A Web Front Library imitated from jQuery, based on ecmascript 2015, supported IE10 and above.

# Use
* insert into head tag
```html
<script src='./js/tinyJquery.min.js'></script>
```
or  
* `import` in commonJs
```javascript
import $ from './js/tinyJquery.min.js'
```
# Characteristics
1. Batch operation
    Change all divisions' background color:
    ```javascript
    $('div').css({background: 'green'})
    ```
2. Chain operation
    Execute another operation directly after an operation:
    ```javascript
    $('div').css({background: 'green'}).ac('green-box')
    ```
# Method
Use `$('cssSelector')` or `$(nativeDomObject)` or `$(nativeDomObjectArray)` or `$(arrayLikeObject)` to generate a `TinyJquery` obejct.
For example:
    `$('div')`, `$('.box')`, `$('#target')`, `$(document.getElementById('#target'))`, `$(document.getElementsByClassName('box'))`, `document.querySelectorAll('.box')`...
| Method | Arguments | Jquery | 
| - | :-: | - | 
| on | eventName, fn, [ bubble = false ] | bind | 
| un | eventName, fn, [ bubble = false ] | unbind | 
| ac | className | addClass |
| rc | className | removeClass |
| tc | className | toggleClass |
| cc | className | hasClass |
| css | styleObj | css |
| val | [value] | val |
| html | [html] | html |
| attr | attribute, [ attributeValue ] | attr |
| parent | ------ | parent |
| getDom | ------ | get(0) |
| getDomList | ------ | ------ |
| each | callback | each |
| append | nativeDom \|\| TinyJquery | append |
| appendTo | nativeDom \|\| TinyJquery | appendTo |
| remove | ------ | remove |
| height | ------ | height |
| width | ------ | width |
| bound | ------ | offset |