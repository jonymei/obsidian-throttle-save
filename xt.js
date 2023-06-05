/* eslint-disable */
export function xt(e, t, n) {
  void 0 === t && (t = 0), void 0 === n && (n = !1)
  var i = null,
    r = null,
    o = null,
    a = 0,
    s = function () {
      var t = r,
        n = o
      return (r = null), (o = null), e.apply(t, n)
    },
    l = function () {
      if (a) {
        var e = Date.now()
        if (e < a) return (i = window.setTimeout(l, a - e)), void (a = 0)
      }
      ;(i = null), s()
    },
    c = function () {
      for (var e = [], s = 0; s < arguments.length; s++) e[s] = arguments[s]
      return (
        (r = this),
        (o = e),
        i ? n && (a = Date.now() + t) : (i = window.setTimeout(l, t)),
        c
      )
    }
  return (
    (c.cancel = function () {
      return i && (clearTimeout(i), (i = null)), c
    }),
    (c.run = function () {
      if (i) return clearTimeout(i), (i = null), s()
    }),
    c
  )
}
