export default {
    query(el) {
        return document.querySelector(el)
    },
    queryAll(el) {
        return document.querySelectorAll(el)
    },
    addClass(el, className) {
        return this.toggleClass('add', el, className)
    },
    removeClass(el, className) {
        return this.toggleClass('remove', el, className)
    },
    toggleClass(action, el, className) {
        if (el == null) {
            return
        }
        let i = 0
        const results = []
        while (i < el.length) {
            el[i].classList[action](className)
            results.push(i++)
        }
        return results
    }
}
