class Observe {
  constructor(data) {
    // Object.defineProperty 只能劫持已经存在的属性，新增或者删除并不知道【vue2里面会为此单独写api $set $delete】
    this.walk(data); // 遍历对象劫持
  }
  /**
   * 循环对象 对属性依次劫持
   * @param {*} data
   */
  walk(data) {
    // "重新定义"属性 【注意：性能差】
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
}

/**
 * 属性劫持
 * @param {*} target
 * @param {*} key
 * @param {*} value
 */
export function defineReactive(target, key, value) {
  // 闭包 属性劫持 递归操作对所有的对象进行属性劫持
  observe(value);

  // 最后一个参数是闭包，value并不会销毁
  Object.defineProperty(target, key, {
    get() {
      console.log("用户取值了");
      // 取值的时候，会执行get
      return value;
    },
    set(newValue) {
      console.log("用户设置值了");
      // 修改的时候，会执行set
      if (newValue === value) return;
      value = newValue;
    },
  });
}

export function observe(data) {
  // 对这个对象进行劫持
  if (typeof data !== "object" || data == null) {
    return; // 只对【对象】进行劫持
  }
  // 如果一个对象被劫持过了，那就不需要再被劫持
  // 【要判断对象是否被劫持过,可以增添一个实例，用实例判断是否被劫持】

  return new Observe(data);
}
