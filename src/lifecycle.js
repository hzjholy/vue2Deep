/*
 * @Description: 组件挂载
 * @Version: 1.0
 * @Author: hzj
 * @Date: 2024-03-16 21:08:25
 * @LastEditors: hzj
 * @LastEditTime: 2024-03-16 21:15:10
 */

export function initLifeCycle(Vue) {
  Vue.prototype._update = function () {
    console.log("update");
  };
  Vue.prototype._render = function () {
    console.log("render");
  };
}

export function mountComponent(vm, el) {
  // 1.调用render方法产生虚拟DOM
  vm._update(vm._render()); // vm.$options.render() 返回虚拟节点  _update将虚拟节点生成真实节点
  // 2.根据虚拟DOM产生真实DOM
  // 3.插入el的元素中
}

/**
 * vue的核心流程
 * 1. 创造了响应式数据  once
 * 2. 将模板转换为ast语法树 once
 * 3. 将ast语法树转换了render函数
 * 4. 后续每次数据更新只执行render函数（无需再次执行ast转化的过程）
 * 5. render函数会产生虚拟节点(使用响应式数据)
 * 6. 根据生成的虚拟节点创造真实的DOM
 */
