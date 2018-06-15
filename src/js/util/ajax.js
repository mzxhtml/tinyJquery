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
export function ajax({ url, method, headers, data, success, error }) {
    headers = headers || 'application/x-www-form-urlencoded; charset=UTF-8'
    // conver JSON Object to String
    if(data && typeof data != 'string') data = JSON.stringify(data)
    let request = new XMLHttpRequest()
    request.open(method, url, true)
    request.setRequestHeader('Content-type', headers)
    request.onload = function(progressEvent) {
        let response = progressEvent.currentTarget
        let {status, statusText, responseText, responseUrl} = response
        if(status > 199 && status < 400) {
            if(success) success(responseText)
        } else {
            if(error) error(statusText)
        }
    }
    request.onerror = function(error) {
        console.error(error)
    }
    request.send(data)
}

/**
 * ajax function like $.get in jquery
 *
 * @export
 * @param {String} url
 * @param {Function} success
 */
export function get(url, success){
    ajax({
        url,
        method: 'get',
        success: function(responseText) {
            success(responseText)
        }
    })
}

/**
 * ajax function like $.post in jquery
 *
 * @export
 * @param {String} url
 * @param {String} data
 * @param {Function} success
 */
export function post(url, data, success) {
    ajax({
        url,
        method: 'post',
        data,
        success: function(responseText) {
            success(responseText)
        }
    })
}