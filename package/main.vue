<template>
  <transition name="st-tooltip-fade">
    <div v-show="visible"
         class="st-tooltip-container"
         :style="tooltipStyle"
         :class="tooltipClass"
         @mouseenter="showTip"
         @mouseleave="hiddenTip(true)">
      <div v-show="placement"
           class="st-tooltip-arrows"
           :class="placement"
           :style="arrowBox">
      </div>
      <span v-if="title" class="st-tooltip-title">
        {{ title }}
      </span>
      <p v-if="content"
         class="st-tooltip-content"
         :style="contentHeight">
        {{ content }}
      </p>
      <component
        v-if="customComponent"
        v-bind="customProps"
        v-on="customListeners"
        :is="customComponent"
        @hidden-tip="hiddenTip"
        @update-tip="updateTip">
      </component>
    </div>
  </transition>
</template>

<script>
import './main.scss'
import {
  debounce,
  checkScrollable,
  getScrollContainer,
  computeArrowPos,
  computePlacementInfo,
  computeCoordinateBaseMid,
  computeCoordinateBaseEdge
} from './common'
  // passive support check
// let supportsPassive = false
// document.addEventListener('passive-check', () => {}, {
//   get passive () { supportsPassive = { passive: true } }
// })
export default {
  name: 'st-tooltip',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 显示的内容
    content: {
      type: String,
      default: ''
    },
    // 工具函数调用时附加到自定义组件 props 上面的
    customProps: {
      type: Object,
      default () {
        return {}
      }
    },
    // 对应 <component> 组件 is 属性
    customComponent: {
      type: [String, Function, Object],
      default: ''
    },
    // 用于监听自定义组件 emit 的事件
    customListeners: Object,
    // tooltip 绑定的目标元素
    target: null,
    // tooltip 的容器，默认插入 body 中
    container: null,
    // 用于限制 tooltip 展示的方向，优先级按顺序
    placements: {
      type: Array,
      default () {
        return ['top', 'right', 'bottom', 'left']
      }
    },
    // tooltip 窗口多久后自动消失，为 <=0 不消失
    duration: {
      type: Number,
      default: 300
    },
    // 是否为 tooltip 添加 transfrom 过渡
    transition: Boolean,
    // 提示用的小箭头大小
    arrowsSize: {
      type: Number,
      default: 8
    },
    // 组件的宽度
    width: {
      type: [String, Number],
      default: 'auto'
    },
    // 内容的高度
    height: {
      type: [String, Number],
      default: 'auto'
    },
    // tip 的 z-index
    zIndex: {
      type: Number,
      default: 999
    },
    // 主题 light dark 默认为 light
    theme: {
      type: String,
      default: 'light'
    },
    // 自定义 class 的类名
    // customClass: {
    //   type: String,
    //   default: ''
    // }
  },
  data () {
    this.containerNode = null
    this.targetParentNode = null
    this.visibleTimer = null
    return {
      // tip 的展示方向（小箭头的方向）
      placement: '',
      visible: false,
      arrowsPos: {}
    }
  },
  computed: {
    arrowBox () {
      return Object.assign({
        borderWidth: `${this.arrowsSize}px`
      }, this.arrowsPos)
    },
    tooltipStyle () {
      const width = this.width
      return {
        width: typeof width === 'string' ? width : `${width}px`,
        zIndex: this.zIndex
      }
    },
    tooltipClass () {
      const { customClass, theme, transition } = this
      const tsClass = transition ? 'transition-transfrom' : ''
      return [customClass, theme, tsClass]
    },
    contentHeight () {
      const height = this.height
      return {
        height: typeof height === 'string' ? height : `${height}px`
      }
    }
  },
  methods: {
    // 显示tooltip
    showTip () {
      clearTimeout(this.visibleTimer)
      this.visible = true
    },
    // 隐藏tooltip,参数immedia表示是否立刻隐藏
    hiddenTip (immedia) {
      if (immedia) {
        this.visible = false
      } else {
        this.setVisible(false)
      }
    },
    // 更新 tooltip 位置
    updateTip () {
      this.setContainerNode()
      this.showTip()
      this.asynSetCoordinate()
    },
    // 设置 tooltip 的容器
    setContainerNode () {
      const {
        $el,
        target,
        container,
        targetParentNode,
        containerNode: oldNode
      } = this
      // 目标元素的父级节点相同则不需要重新计算容器
      if (!target || target.parentNode === targetParentNode) return
      this.targetParentNode = target.parentNode
      const newNode = container || getScrollContainer(target)
      if (newNode === oldNode) return
      if ($el.parentNode !== newNode) {
        newNode.appendChild($el)
      }
      const position = window.getComputedStyle(newNode, null).position
      if (!position || position === 'static') {
        newNode.style.position = 'relative'
      }
      if (oldNode) {
        oldNode.removeEventListener('scroll', this.scrollHandler, supportsPassive)
      }
      if (checkScrollable(newNode)) {
        newNode.addEventListener('scroll', this.scrollHandler, supportsPassive)
      }
      this.containerNode = newNode
    },
    setCoordinate () {
      const { $el, target, containerNode, placements, arrowsSize } = this
      if (!$el || !target || !containerNode) return
      const placementInfo = computePlacementInfo(target, containerNode, $el, placements, arrowsSize)
      const coordinate = placementInfo.mod === 'mid'
        ? computeCoordinateBaseMid(placementInfo, arrowsSize)
        : computeCoordinateBaseEdge(placementInfo, arrowsSize)
      this.setArrowsPos(coordinate)
      this.placement = coordinate.placement
      const x = coordinate.x + containerNode.scrollLeft
      const y = coordinate.y + containerNode.scrollTop
      this.$el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    },
    asynSetCoordinate () {
      this.$nextTick(this.setCoordinate)
    },
    // 设置小三角形的位置
    setArrowsPos ({ placement, arrowsOffset }) {
      this.arrowsPos = computeArrowPos(placement, arrowsOffset, this.arrowsSize)
    },
    // 设置 tooltip 经过 duration ms 后的状态
    setVisible (state) {
      clearTimeout(this.visibleTimer)
      this.visibleTimer = setTimeout(() => {
        this.visible = state
        this.visibleTimer = null
      }, this.duration)
    },
    // 参考元素父级容器发生滚动时的处理
    scrollHandler: debounce(function () {
      this.setCoordinate()
    }, 200),
    clearScrollEvent () {
      if (this.containerNode) {
        this.containerNode.removeEventListener('scroll', this.scrollHandler, supportsPassive)
      }
    },
    removeParentNode () {
      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    },
    destroy () {
      this.clearScrollEvent()
      this.removeParentNode()
      this.$destroy()
    }
  }
}
</script>
