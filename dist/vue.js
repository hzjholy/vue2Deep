(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
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
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /*
   * @Description: html转为语法树
   * @Version: 1.0
   * @Author: hzj
   * @Date: 2024-03-16 19:53:37
   * @LastEditors: hzj
   * @LastEditTime: 2024-03-16 20:10:08
   */

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // :标签说明可能存在命名空间
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配到的分组是一个 标签名  <xxx 匹配到的是开始标签的名字
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
  // 第一个分组就是属性的key value 就是 分组3/分组4/分组五
  var startTagClose = /^\s*(\/?)>/; // <div> <br/>

  // vue3 采用的不是使用正则
  // 对模板进行编译

  /**
   *{
      tag: 'div',
      type: 1,
      attrs: [{name,age}],
      parent:null,
      children:[{
          tag: 'div',
          type: 1,
          attrs: [{name,age}],
          parent:null,
          children:[{
              
          }]
      }]
  }
   * @param {*} html
   * 每解析一个删除一个
   */

  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = []; // 用于存放元素
    var currentParent; // 指针，永远指向栈中的最后一个
    var root;

    // 最终需要转化成一颗抽象的语法树
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    //  div span
    function start(tag, attrs) {
      var node = createASTElement(tag, attrs); // 创造一个ast节点
      if (!root) {
        // 是否为空树
        root = node; // 如果为空，则为树的根节点
      }
      if (currentParent) {
        node.parent = currentParent; // 只赋值了father
        currentParent.children.push(node); // 还需将father的children赋值给自己
      }
      stack.push(node);
      currentParent = node; // currentParent为栈中的最后一个
    }
    /**
     * 文本直接放到当前指向的节点
     * @param {*} text
     */
    function chars(text) {
      text = text.replace(/\s/g, ""); // 如果空格超过2就删除两个以上
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }
    function end(tag) {
      stack.pop(); // 弹出最后一个,校验标签是否合法
      currentParent = stack[stack.length - 1];
    }
    // html最开始肯定是一个 <  <div>hello</div>
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: [] // 属性
        };
        advance(start[0].length); // 删掉已经匹配过的内容
        // 如果不是开始标签的结束，就一直匹配下去
        var attr, _end;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }
        if (_end) {
          advance(_end[0].length);
        }
        return match;
      }
      return false; // 不是开始标签
    }
    while (html) {
      // 如果textEnd为0，说明是一个开始标签或者结束标签
      // 如果textEnd>0，说明就是文本的结束位置
      var textEnd = html.indexOf("<"); // 如果indexOf中的索引是0 则说明是个标签
      // 开始标签解析
      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); // 开始标签的匹配结果
        if (startTagMatch) {
          // 解析到的开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      }
      if (textEnd > 0) {
        // 截取文本的内容
        var text = html.substring(0, textEnd); // 文本内容
        if (text) {
          chars(text);
          advance(text.length); // 解析到的文本
        }
      }
    }
    return root;
  }

  function genProps(attrs) {
    var str = ""; // {name,value}
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === "style") {
        // color:'red';background:'red'; => {color:'red'}
        var obj = {};
        attr.value.split(";").forEach(function (item) {
          // qs库
          var _item$split = item.split(":"),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ","); // a:b,a:v,
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
  function gen(node) {
    if (node.type === 1) {
      // 元素
      return codegen(node);
    } else {
      // 文本
      // console.log("node", node);
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        // _v(_s(name)+ 'hzj' + _s(name))
        console.log(node);
        var tokens = [];
        var match;
        // 如果正则需要多次匹配，并且有带“g”，捕获的情况下，只会取最后的值，需要重置一下捕获位置
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;
        // split
        while (match = defaultTagRE.exec(text)) {
          var index = match.index; // 匹配的位置
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join("+"), ")");
      }
    }
  }
  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(",");
  }
  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : "null").concat(ast.children.length ? ",".concat(children) : "", ")");
    return code;
  }

  /**
   * @deprecated 表示该函数已被弃用 test
   * @description:
   * @param {*} template
   * @return {*}
   * @author: hzj
   */
  function compileToFunction(template) {
    // 1.将template转化ast语法树
    var ast = parseHTML(template);
    // 2.生成render方法(render方法执行后的返回结果就是虚拟DOM)
    // 标签名+属性+儿子

    // 模板引擎的实现原理  with + new Function
    var code = codegen(ast);
    code = "with(this){return ".concat(code, "}");
    var redner = new Function(code); // 根据代码生成render函数
    return redner;
  }

  /*
   * @Description: 组件挂载
   * @Version: 1.0
   * @Author: hzj
   * @Date: 2024-03-16 21:08:25
   * @LastEditors: hzj
   * @LastEditTime: 2024-03-16 21:15:10
   */

  function initLifeCycle(Vue) {
    Vue.prototype._update = function () {
      console.log("update");
    };
    Vue.prototype._render = function () {
      console.log("render");
    };
  }
  function mountComponent(vm, el) {
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

  // 重写数组的部分方法

  var oldArrayProto = Array.prototype; // 获取数组的原型

  // newArrayProto.__proto__ = oldArrayProto
  var newArrayProto = Object.create(oldArrayProto);
  var methods = [
  // 找到所有的变异方法【修改原数组】
  "push", "pop", "shift", "unshift", "reverse", "sort", "splice"];
  // concat slice 都不会改变原数组
  methods.forEach(function (method) {
    // arr.push(123)
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 这里重写了数组的方法
      // push.call(arrnewArrayProto) todo...
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 内部调用原来的方法，函数的劫持， 切片编程
      // 需要对新增的数据 再次进行劫持
      var inserted;
      var ob = this.__ob__;
      switch (method) {
        case "push":
        case "unshift":
          // arr.push(1,2,3)
          inserted = args;
          break;
        case "splice":
          // arr.splice(0,1,{a:1}) 找到第0个删除第一个，新增一个对象
          inserted = args.slice(2);
      }
      console.log("新增的内容inserted", inserted);
      if (inserted) {
        // 对新增的内容再次观测
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);
      Object.defineProperty(data, "__ob__", {
        value: this,
        enumerable: false
      });
      // Object.defineProperty(data, "__ob__", {
      //   value: this,
      //   enumerable: false, // 将__ob__变成不可枚举（循环的时候无法获取到）
      // });
      // Object.defineProperty 只能劫持已经存在的属性，新增或者删除并不知道【vue2里面会为此单独写api $set $delete】
      // data.__ob__ = this; // 给数据加了一个标识，如果数据上有__ob__，则说明这个属性被观测过
      if (Array.isArray(data)) {
        // 重写数组中的方法 7个变异方法，是可以修改数组本身

        data.__proto__ = newArrayProto; // 保留数组原有的特性，并且可以重写部分方法
        this.observeArray(data); // 如果数组中存在对象，可以监控到对象的变化
      } else {
        this.walk(data); // 遍历对象劫持
      }
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
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        // 观测数组
        data.forEach(function (item) {
          return observe(item);
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
        console.log("用户取值了", key);
        // 取值的时候，会执行get
        return value;
      },
      set: function set(newValue) {
        console.log("用户设置值了", key);
        // 修改的时候，会执行set
        if (newValue === value) return;
        observe(newValue);
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
    // 说明这个对象被代理过
    if (data.__ob__ instanceof Observe) {
      return data.__ob__;
    }
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
      if (options.el) {
        vm.$mount(options.el); // 实现数据的挂载
      }
      Vue.prototype.$mount = function (el) {
        var vm = this;
        el = document.querySelector(el);
        var ops = vm.$options;
        if (!ops.render) {
          // 先进行查找是否有render函数
          var template; // 没有render，是否有写template。没写template就用外部的template
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
            var render = compileToFunction(template);
            ops.render = render; // jsx 最终会被编译成h('xxx')
          }
        }
        // ops.render; // 最终就可以获取render方法
        mountComponent(vm); // 组件的挂载
      };
      // script 标签引用的vue.global.js 这个编译过程是在浏览器运行的
      // runtime【运行时】不包含模板编译的，整个编译打包的时候通过loader来转义.vue文件
      // 用runtime的时候，不能使用template
    };
  }

  /*
   * @Description: 主文件
   * @Version: 1.0
   * @Author: hzj
   * @Date: 2024-03-09 22:00:57
   * @LastEditors: hzj
   * @LastEditTime: 2024-03-16 21:13:23
   */

  // 将所有的方法都耦合在一起
  function Vue(options) {
    this._init(options); // options就是用户的选项
  }
  initMixin(Vue);
  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
