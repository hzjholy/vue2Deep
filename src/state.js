export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

export function initData(vm) {
  let data = vm.$options.data;
  // vue3中data必须是函数，vue2可以是对象或者函数 注意:call
  data = typeof data === "function" ? data.call(vm) : data;
  console.log("data", data);
}
