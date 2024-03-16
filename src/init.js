import { compileToFunction } from "./complier";
import { mountComponent } from "./lifecycle";
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
    if (options.el) {
      vm.$mount(options.el); // 实现数据的挂载
    }
    Vue.prototype.$mount = function (el) {
      const vm = this;
      el = document.querySelector(el);
      let ops = vm.$options;
      if (!ops.render) {
        // 先进行查找是否有render函数
        let template; // 没有render，是否有写template。没写template就用外部的template
        if (!ops.template && el) {
          // 没有写模板，但是写了el
          template = el.outerHTML;
        } else {
          if (el) {
            template = ops.template; // 如果有el则采用模板的内容
          }
        }
        // 写了template就用写了的template
        if (template) {
          // 有了模板进行模板编译
          const render = compileToFunction(template);
          ops.render = render; // jsx 最终会被编译成h('xxx')
        }
      }
      // ops.render; // 最终就可以获取render方法
      mountComponent(vm,el); // 组件的挂载
    };
    // script 标签引用的vue.global.js 这个编译过程是在浏览器运行的
    // runtime【运行时】不包含模板编译的，整个编译打包的时候通过loader来转义.vue文件
    // 用runtime的时候，不能使用template
  };
}
