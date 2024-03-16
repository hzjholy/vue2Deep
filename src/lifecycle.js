/*
 * @Description: 组件挂载
 * @Version: 1.0
 * @Author: hzj
 * @Date: 2024-03-16 21:08:25
 * @LastEditors: hzj
 * @LastEditTime: 2024-03-16 22:08:04
 */

import { createElementVNode, createTextVNode } from "./vdom";

function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag === "string") {
    // 标签
    // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了
    vnode.el = document.createElement(tag);
    patchProps(vnode.el, data);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function patchProps(el, props) {
  for (let key in props) {
    if (key === "style") {
      // style{color:'red'}
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}

function patch(oldVNode, vnode) {
  // 写的是初渲染流程
  const isRealElement = oldVNode.nodeType;
  if (isRealElement) {
    const elm = oldVNode; // 获取真实元素
    const parentElm = elm.parentNode; // 拿到父元素
    let newElm = createElm(vnode);
    parentElm.insertBefore(newElm, elm.nextSibling);
    parentElm.removeChild(elm); // 删除老节点
    console.log("newElm", newElm);

    return newElm;
  } else {
    // diff算法
  }
}

export function initLifeCycle(Vue) {
  // 将vnode转为真实DOM
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    console.log(vnode, el);
    // patch 既有初始化功能，又有更新的逻辑
    vm.$el = patch(el, vnode);
  };
  //  _c('div',{},...children)
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  //  _v(text)
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value;
    return JSON.stringify(value);
  };
  Vue.prototype._render = function () {
    console.log("render");
    // 当渲染的时候，会去实例中取值，我们可以将属性和视图绑定在一起
    // 让with中的this指向vm
    return this.$options.render.call(this); // 通过ast语法转义后执行的render方法
  };
}

export function mountComponent(vm, el) {
  // 这里的el是通过querySelector处理过的
  vm.$el = el;
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
