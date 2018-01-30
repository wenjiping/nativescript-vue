import { makeMap, once } from 'shared/util'
import { isKnownView, getViewMeta } from '../element-registry'

export const isReservedTag = makeMap('template', true)

let _Vue

export function setVue(Vue) {
  _Vue = Vue
}

export const canBeLeftOpenTag = function(el) {
  return getViewMeta(el).canBeLeftOpenTag
}

export const isUnaryTag = function(el) {
  return getViewMeta(el).isUnaryTag
}

export function mustUseProp() {
  // console.log('mustUseProp')
}

export function getTagNamespace(el) {
  return getViewMeta(el).tagNamespace
}

export function isUnknownElement(el) {
  return !isKnownView(el)
}

export function isPage(el) {
  return el && el.tagName === 'page'
}

export function query(el, renderer, document) {
  // Todo
}

export const VUE_VERSION = process.env.VUE_VERSION
export const NS_VUE_VERSION = process.env.NS_VUE_VERSION

const infoTrace = once(() => {
  console.log(
    `NativeScript-Vue has "Vue.config.silent" set to true, to see output logs set it to false.`
  )
})

export function trace(message) {
  if (_Vue && _Vue.config.silent) {
    return infoTrace()
  }

  console.log(
    `{NSVue (Vue: ${VUE_VERSION} | NSVue: ${NS_VUE_VERSION})} -> ${message}`
  )
}

export function before(original, thisArg, wrap) {
  const __slice = Array.prototype.slice
  return function() {
    const args = __slice.call(arguments)
    wrap.apply(null, args)
    original.apply(thisArg, args)
  }
}

export function after(original, thisArg, wrap) {
  const __slice = Array.prototype.slice
  return function() {
    const args = __slice.call(arguments)
    wrap.apply(null, args)
    original.apply(thisArg, args)
  }
}

export function deepProxy(object, depth = 0) {
  return new Proxy(object, {
    get(target, key) {
      if (key === 'toString') {
        return () => ''
      }

      if (depth > 10) {
        throw new Error('deepProxy over 10 deep.')
      }
      return deepProxy({}, depth + 1)
    }
  })
}
