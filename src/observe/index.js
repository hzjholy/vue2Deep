import { newArrayProto } from "./array";

class Observe {
  constructor(data) {
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
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
  walk(data) {
    // "重新定义"属性 【注意：性能差】
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  observeArray(data) {
    // 观测数组
    data.forEach((item) => observe(item));
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
      console.log("用户取值了", key);
      // 取值的时候，会执行get
      return value;
    },
    set(newValue) {
      console.log("用户设置值了", key);
      // 修改的时候，会执行set
      if (newValue === value) return;
      observe(newValue);
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
  // 说明这个对象被代理过
  if (data.__ob__ instanceof Observe) {
    return data.__ob__;
  }

  return new Observe(data);
}
