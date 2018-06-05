export function ajax({ url, method, headers, data, success, error }) {
    headers = headers || 'application/x-www-form-urlencoded; charset=UTF-8'
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

export function get(url, success){
    ajax({
        url,
        method: 'get',
        success: function(responseText) {
            success(responseText)
        }
    })
}

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