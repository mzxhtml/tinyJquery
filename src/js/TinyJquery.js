// 用ES6写的微型仿JQuery库，支持链式操作, 支持IE10及以上
class TinyJquery {
    constructor(el) {
        let $el
        if(typeof el == 'string') {
            $el = document.querySelectorAll(el)
        } else if(typeof el == 'array' || el.length) {
            $el = el
        } else {
            $el = [el]
        }
        this.$el = [].slice.call($el)
    }
    // addEventListener
    on(eventName, fn, bubble = false) {
        this.$el.forEach(i => {
            i.addEventListener(eventName, fn, !bubble)
        })
        return this
    }
    // removeEventListener
    un(eventName, fn, bubble = false) {
        this.$el.forEach(i => {
            i.removeEventListener(eventName, fn, !bubble)
        })
        return this
    }
    // addClass
    ac(className) {
        this.$el.forEach(i => {
            i.classList.add(className)
        })
        return this
    }
    // removeClass
    rc(className) {
        this.$el.forEach(i => {
            i.classList.remove(className)
        })
        return this
    }
    // toggleClass
    tc(className) {
        this.$el.forEach(i => {
            i.classList.toggle(className)
        })
        return this
    }
    // containClass
    cc(className) {
        let flag = false
        this.$el.forEach(i => {
            if(i.classList.contains(className)) flag = true
        })
        return flag
    }
    // set inline style
    css(obj) {
        this.$el.forEach(v => {
            Object.keys(obj).forEach(i => {
                v.style[i] = obj[i]
            })
        })
        return this
    }
    // get or set input value
    val(val) {
        if(val) {
            this.$el[0].value = val
            return this
        } else {
            return this.$el[0].value
        }
    }
    // get or set dom innerHtml
    html(val) {
        if(val) {
            this.$el.forEach(i => {
                i.innerHTML = val
            })
            return this
        } else {
            return this.$el[0].innerHTML
        }
    }
    // get or set attribute
    attr(key, val) {
        if(key && !val) {
            return this.$el[0].getAttribute(key)
        } else {
            this.$el.forEach(i => {
                i.setAttribute(key, val)
            })
            return this
        }
    }
    // get JSONData
    serializeObject() {
        let obj = {}
        this.$el[0].querySelectorAll('input').forEach(i => {
            if($(i).attr('type') == 'radio') {
                if(i.checked) {
                    obj[$(i).attr('name')] = $(i).attr('value')
                }
            } else if($(i).attr('type') == 'checkbox') {
                if(i.checked) {
                    if(obj[$(i).attr('name')]) {
                        obj[$(i).attr('name')].push($(i).attr('value'))
                    } else {
                        obj[$(i).attr('name')] = [$(i).attr('value')]
                    }
                }
            } else {
                obj[$(i).attr('name')] = $(i).val()
            }
        })
        return obj
    }
    // parent
    parent() {
        return $(this.$el[0].parentNode)
    }
    // siblings
    siblings() {
        let dom = this.$el[0]
        var a = [];
        var p = dom.parentNode.children;
        for (var i = 0, pl = p.length; i < pl; i++) {
            if (p[i] !== dom) a.push(p[i]);
        }
        // console.log(Array.isArray(a))
        return $(a)
    }
    // 获取原生Dom
    getDom() {
        return this.$el[0]
    }
    // 获取原生Dom列表
    getDomList() {
        return this.$el
    }
    // each
    each(callback) {
        this.$el.forEach(i => {
            callback(i)
        })
    }
    append(val) {
        val = isTJ(val) ? val.getDom() : val
        this.$el.forEach(i => i.appendChild(val))
        return this
    }
    appendTo(val) {
        val = isTJ(val) ? val.getDom() : val
        this.$el.forEach(i => val.appendChild(i))
        return this
    }
    remove() {
        this.$el.forEach(i => {
            i.parentNode.removeChild(i)
        })
        return this
    }
    height() {
        if(this.$el[0] == window) {
            return window.innerHeight
        } else {
            return this.$el[0].offsetHeight
        }
    }
    width() {
        if(this.$el[0] == window) {
            return window.innerWidth
        } else {
            return this.$el[0].offsetWidth
        }
    }
    bound() {
        return this.$el[0].getBoundingClientRect()
    }
}

function isTJ(obj) {
    return obj.constructor.name == 'TinyJquery'
}

function $(el) {
    return new TinyJquery(el)
}

export default $