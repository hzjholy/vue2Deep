<!--
 * @Description: 
 * @Version: 1.0
 * @Author: hzj
 * @Date: 2024-03-09 23:50:31
 * @LastEditors: hzj
 * @LastEditTime: 2024-03-16 22:26:35
-->
# 深入学习vue2


1.使用rollup搭建开发环境
 cnpm i rollup rollup-plugin-babel @babel/core @babel/preset-env --save-dev

 rollup -cw 打包文件并监听变化


 为什么vue2只能支持ie9以及以上
 Object.defineProperty【es5】不支持低版本

 proxy是es6的  也没有替代方案


cnpm i @rollup/plugin-node-resolve

vue使用注意事项

el元素需要考虑是否渲染后的问题
el元素显示隐藏之后，需要考虑相关属性设置计算