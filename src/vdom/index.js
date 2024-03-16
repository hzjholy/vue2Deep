/*
 * @Description: 虚拟DOM
 * @Version: 1.0
 * @Author: hzj
 * @Date: 2024-03-16 21:23:44
 * @LastEditors: hzj
 * @LastEditTime: 2024-03-16 21:37:24
 */
// h()  _c()
export function createElementVNode(vm, tag, data, ...children) {
  if (data == null) {
    data = {};
  }
  let key = data.key;
  if (key) {
    delete data.key;
  }
  return vnode(vm, tag, key, data, children);
}

// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

// ast一样吗？ ast做的是语法层面的转化，描述的是语法本身（可以描述js css html）
// 虚拟DOM描述的是 DOM元素，可以增加一些自定义的属性(描述DOM)
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
    //  ...
  };
}
