<template>
  <section id="app">
    <ul class="test-list">
      <li v-for="item in test" :key="item.id"
          v-stTip="item.name">
        {{ item.name }}
      </li>
    </ul>
  </section>
</template>

<script>
import Vue from 'vue'
import stTip from '../package/index.js'
import test from './test.js'

Vue.use(stTip.directive)

export default {
  data () {
    return {
      test
    }
  }
}
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  html,
  body {
    width: 100%;
    height: 100%;
    font-family: PingFang SC, Verdana, Helvetica Neue, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
    font-size: 12px;
  }
  #app {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .test-list {
    width: 100px;
    position: relative;
    margin: 0 auto;
    li {
      font-size: 12px;
      list-style: none;
      padding: 10px;
    }
  }
</style>
