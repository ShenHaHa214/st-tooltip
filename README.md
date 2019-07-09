# st-tooltip

> 基于Vue实现的简单tooltip组件

## 安装
```
npm install st-tooltip
```
## 开始使用
```
import toolTip from 'st-tooltip'
//利用指令来调用
Vue.use(toolTip.directive)
```
默认的指令名称为v-stTip，可自定义directiveName

### 修饰符
触发方式：click || hover（默认）
主题：dark || light (默认)
显示位置：top || right || bottom || left (默认为top)

###tooltip内容显示
只是显示文字信息可绑定字符串变量

更多内容，可绑定一个对象
```
const tooltipObjects = {
  title：'标题'，
  content： '内容'，
  theme 'dark || light'
  placements :['top','right','bottom','left']
  transiton: true,
  duration: 400,
  arrowsSize:6,
  zIndex: 999,
  target: tooltip绑定的元素，
  customComponent:自定义内容，
  customProps: 自定义组件props上的值，
  width: 组件的高度，
  height:组件的宽度，
  customClass:自定义样式，
}
```



For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
