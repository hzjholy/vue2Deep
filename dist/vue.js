(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function initState(vm) {
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    // vue3中data必须是函数，vue2可以是对象或者函数 注意:call
    data = typeof data === "function" ? data.call(vm) : data;
    console.log("data", data);
  }

  function initMixin(Vue) {
    // 就是给vue添加init方法
    /**
     * 用户初始化方法
     */
    Vue.prototype._init = function (options) {
      // vue vm.$options 就是获取用户的配置
      // 使用vue $nextTick $data $attr......
      var vm = this;
      vm.$options = options; // 将用户选项挂载到实例上

      // 初始化状态
      initState(vm);
      // todo...
    };
  }

  // 将所有的方法都耦合在一起
  function Vue(options) {
    this._init(options); // options就是用户的选项
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
