import { observe } from "./observe/index";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    // vm.name
    get() {
      return vm[target][key]; // vm._data.name
    },
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}

export function initData(vm) {
  let data = vm.$options.data;
  // vue3中data必须是函数，vue2可以是对象或者函数 注意:call
  // data是用户返回的对象
  data = typeof data === "function" ? data.call(vm) : data;

  vm._data = data; // 使用_data存储值
  // 对数据进行劫持 vue2 采用了api defineProperty
  observe(data);

  // 将vm._data 用vm来代理即可
  for (const key in data) {
    proxy(vm, "_data", key);
  }
}
