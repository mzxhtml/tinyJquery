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
            if(document.addEventListener) {
                i.addEventListener(eventName, fn, !bubble)
            } else {
                i.attachEvent(`on${eventName}`, fn)
            }
        })
        return this
    }
    // removeEventListener
    un(eventName, fn, bubble = false) {
        this.$el.forEach(i => {
            if(document.removeEventListener) {
                i.removeEventListener(eventName, fn, !bubble)
            } else {
                i.detachEvent(`on${eventName}`, fn)
            }
        })
        return this
    }
    // addClass
    ac(className) {
        this.$el.forEach(i => {
            if(i.classList) {
                i.classList.add(className)
            } else {
                i.className += ' ' + className
            }
        })
        return this
    }
    // removeClass
    rc(className) {
        this.$el.forEach(i => {
            if(i.classList) {
                i.classList.remove(className)
            } else {
                i.className = i.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
            }
        })
        return this
    }
    // toggleClass
    tc(className) {
        this.$el.forEach(i => {
            if(i.classList) {
                i.classList.toggle(className)
            } else {
                let cl = i.className.split(' ')
                if(cl.indexOf(className) > -1) {
                    this.rc(className)
                } else {
                    this.ac(className)
                }
            }
        })
        return this
    }
    // containClass
    cc(className) {
        let flag = false
        this.$el.forEach(i => {
            if(i.classList) {
                if(i.classList.contains(className)) flag = true
            } else {
                let cl = i.className.split(' ')
                if(cl.indexOf(className) > -1) flag = true
            }
        })
        return flag
    }
    // set inline style
    css(obj, pseudoElt = null) {
        if(typeof obj == 'string') {
            if(window.getComputedStyle) {
                return window.getComputedStyle(this.$el[0], pseudoElt)[obj]
            } else {
                return this.$el[0].currentStyle
            }
        } else {
            this.$el.forEach(v => {
                for(let i in obj) {
                    v.style[i] = obj[i]
                }
            })
            return this
        }
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
    // get html dom
    getDom() {
        return this.$el[0]
    }
    // get html dom list
    getDomList() {
        return this.$el
    }
    // each
    each(callback) {
        this.$el.forEach(i => {
            callback(i)
        })
    }
    // append target node to node
    append(val) {
        val = isTJ(val) ? val.getDom() : val
        this.$el.forEach(i => i.appendChild(val))
        return this
    }
    // append node to target node
    appendTo(val) {
        val = isTJ(val) ? val.getDom() : val
        this.$el.forEach(i => val.appendChild(i))
        return this
    }
    // remove dom
    remove() {
        this.$el.forEach(i => {
            i.parentNode.removeChild(i)
        })
        return this
    }
    // get the el's height
    height() {
        if(this.$el[0] == window) {
            return window.innerHeight
        } else {
            return this.$el[0].offsetHeight
        }
    }
    // get the el's width
    width() {
        if(this.$el[0] == window) {
            return window.innerWidth
        } else {
            return this.$el[0].offsetWidth
        }
    }
    // get the el's bound relative to document
    bound() {
        return this.$el[0].getBoundingClientRect()
    }
}

/**
 * to judge whether an object is TinyJquery or not
 * 
 * @param {*} obj
 * @returns Boolean
 */
function isTJ(obj) {
    return obj instanceof TinyJquery
}

/**
 * to construct a TinyJquery object
 *
 * @param {*} el    css selectors or javascript dom
 * @returns
 */
function $(el) {
    return new TinyJquery(el)
}

export default $