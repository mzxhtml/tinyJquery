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
<table>
<thead>
<tr>
<th>Method</th>
<th style="text-align:center">Arguments</th>
<th>Jquery</th>
</tr>
</thead>
<tbody>
<tr>
<td>on</td>
<td style="text-align:center">eventName, fn, [ bubble = false ]</td>
<td>bind</td>
</tr>
<tr>
<td>un</td>
<td style="text-align:center">eventName, fn, [ bubble = false ]</td>
<td>unbind</td>
</tr>
<tr>
<td>ac</td>
<td style="text-align:center">className</td>
<td>addClass</td>
</tr>
<tr>
<td>rc</td>
<td style="text-align:center">className</td>
<td>removeClass</td>
</tr>
<tr>
<td>tc</td>
<td style="text-align:center">className</td>
<td>toggleClass</td>
</tr>
<tr>
<td>cc</td>
<td style="text-align:center">className</td>
<td>hasClass</td>
</tr>
<tr>
<td>css</td>
<td style="text-align:center">styleObj</td>
<td>css</td>
</tr>
<tr>
<td>val</td>
<td style="text-align:center">[value]</td>
<td>val</td>
</tr>
<tr>
<td>html</td>
<td style="text-align:center">[html]</td>
<td>html</td>
</tr>
<tr>
<td>attr</td>
<td style="text-align:center">attribute, [ attributeValue ]</td>
<td>attr</td>
</tr>
<tr>
<td>parent</td>
<td style="text-align:center">------</td>
<td>parent</td>
</tr>
<tr>
<td>getDom</td>
<td style="text-align:center">------</td>
<td>get(0)</td>
</tr>
<tr>
<td>getDomList</td>
<td style="text-align:center">------</td>
<td>------</td>
</tr>
<tr>
<td>each</td>
<td style="text-align:center">callback</td>
<td>each</td>
</tr>
<tr>
<td>append</td>
<td style="text-align:center">nativeDom || TinyJquery</td>
<td>append</td>
</tr>
<tr>
<td>appendTo</td>
<td style="text-align:center">nativeDom || TinyJquery</td>
<td>appendTo</td>
</tr>
<tr>
<td>remove</td>
<td style="text-align:center">------</td>
<td>remove</td>
</tr>
<tr>
<td>height</td>
<td style="text-align:center">------</td>
<td>height</td>
</tr>
<tr>
<td>width</td>
<td style="text-align:center">------</td>
<td>width</td>
</tr>
<tr>
<td>bound</td>
<td style="text-align:center">------</td>
<td>offset</td>
</tr>
</tbody>
</table>
