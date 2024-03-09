import { initState } from "./state";

export function initMixin(Vue) {
  // 就是给vue添加init方法
  /**
   * 用户初始化方法
   */
  Vue.prototype._init = function (options) {
    // vue vm.$options 就是获取用户的配置
    // 使用vue $nextTick $data $attr......
    const vm = this;
    vm.$options = options; // 将用户选项挂载到实例上

    // 初始化状态
    initState(vm);
    // todo...
  };
}
