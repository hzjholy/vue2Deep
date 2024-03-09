# 深入学习vue2


1.使用rollup搭建开发环境
 cnpm i rollup rollup-plugin-babel @babel/core @babel/preset-env --save-dev

 rollup -cw 打包文件并监听变化


 为什么vue2只能支持ie9以及以上
 Object.defineProperty【es5】不支持低版本

 proxy是es6的  也没有替代方案


cnpm i @rollup/plugin-node-resolve