(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : String(i);
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);
      // Object.defineProperty 只能劫持已经存在的属性，新增或者删除并不知道【vue2里面会为此单独写api $set $delete】
      this.walk(data); // 遍历对象劫持
    }
    /**
     * 循环对象 对属性依次劫持
     * @param {*} data
     */
    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        // "重新定义"属性 【注意：性能差】
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observe;
  }();
  /**
   * 属性劫持
   * @param {*} target
   * @param {*} key
   * @param {*} value
   */
  function defineReactive(target, key, value) {
    // 闭包 属性劫持 递归操作对所有的对象进行属性劫持
    observe(value);

    // 最后一个参数是闭包，value并不会销毁
    Object.defineProperty(target, key, {
      get: function get() {
        console.log("用户取值了");
        // 取值的时候，会执行get
        return value;
      },
      set: function set(newValue) {
        console.log("用户设置值了");
        // 修改的时候，会执行set
        if (newValue === value) return;
        value = newValue;
      }
    });
  }
  function observe(data) {
    // 对这个对象进行劫持
    if (_typeof(data) !== "object" || data == null) {
      return; // 只对【对象】进行劫持
    }
    // 如果一个对象被劫持过了，那就不需要再被劫持
    // 【要判断对象是否被劫持过,可以增添一个实例，用实例判断是否被劫持】

    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      // vm.name
      get: function get() {
        return vm[target][key]; // vm._data.name
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data;
    // vue3中data必须是函数，vue2可以是对象或者函数 注意:call
    // data是用户返回的对象
    data = typeof data === "function" ? data.call(vm) : data;
    vm._data = data; // 使用_data存储值
    // 对数据进行劫持 vue2 采用了api defineProperty
    observe(data);

    // 将vm._data 用vm来代理即可
    for (var key in data) {
      proxy(vm, "_data", key);
    }
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
