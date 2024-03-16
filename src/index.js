/*
 * @Description: 主文件
 * @Version: 1.0
 * @Author: hzj
 * @Date: 2024-03-09 22:00:57
 * @LastEditors: hzj
 * @LastEditTime: 2024-03-16 21:13:23
 */
import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";

// 将所有的方法都耦合在一起
function Vue(options) {
  this._init(options); // options就是用户的选项
}

initMixin(Vue);
initLifeCycle(Vue);

export default Vue;
