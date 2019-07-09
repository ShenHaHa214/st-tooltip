import Vue from 'vue'
import main from './main.vue'

const StipConstructor = Vue.extend(main)

const props = main.props
const defaultOptions = {}
Object.keys(props).forEach(key => {
  const prop = props[key]
  const dv = prop.default
  if (prop && prop.default != null) {
    defaultOptions[key] = typeof dv === 'function' ? dv() : dv
  }
})

let tipInstance = null

export default function tip (options) {
  options = options || {}
  // 如果已经存在 tip 的实例,直接更新属性值
  if (tipInstance && tipInstance.$el.parentNode) {
    Object.assign(tipInstance, defaultOptions, options)
    if (tipInstance.target) {
      tipInstance.updateTip()
    } else {
      tipInstance.hiddenTip()
    }
    return tipInstance
  }
  // 否则创建一个 tip 实例
  tipInstance = new StipConstructor({
    propsData: options
  }).$mount()
  tipInstance.updateTip()
  return tipInstance
}
