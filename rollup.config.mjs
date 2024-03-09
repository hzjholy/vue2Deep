// rollup默认可以导出一个对象作为打包的配置文件
import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "./src/index.js", // 入口
  output: {
    file: "./dist/vue.js", // 出口
    // new Vue【全局新增】
    name: "Vue", // global.vue
    format: "umd", // esm es6模块 commonjs模块（node） iife(自执行函数) umd(统一模块规范,兼容commonjs amd)
    sourcemap: true, // 希望可以调试源代码
  },
  plugins: [
    babel({
      exclude: "node_modules/**", // 排除node_modules所有文件 **代表任意文件夹
    }),
    resolve(),
  ],
};
