/*
 * @Description: html转为语法树
 * @Version: 1.0
 * @Author: hzj
 * @Date: 2024-03-16 19:53:37
 * @LastEditors: hzj
 * @LastEditTime: 2024-03-16 20:10:08
 */

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // :标签说明可能存在命名空间
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配到的分组是一个 标签名  <xxx 匹配到的是开始标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/; // <div> <br/>

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

export function parseHTML(html) {
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  const stack = []; // 用于存放元素
  let currentParent; // 指针，永远指向栈中的最后一个
  let root;

  // 最终需要转化成一颗抽象的语法树
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    };
  }
  //  div span
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs); // 创造一个ast节点
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
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      });
  }
  function end(tag) {
    let node = stack.pop(); // 弹出最后一个,校验标签是否合法
    currentParent = stack[stack.length - 1];
  }
  // html最开始肯定是一个 <  <div>hello</div>
  function advance(n) {
    html = html.substring(n);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1], // 标签名
        attrs: [], // 属性
      };
      advance(start[0].length); // 删掉已经匹配过的内容
      // 如果不是开始标签的结束，就一直匹配下去
      let attr, end;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        });
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false; // 不是开始标签
  }
  while (html) {
    // 如果textEnd为0，说明是一个开始标签或者结束标签
    // 如果textEnd>0，说明就是文本的结束位置
    let textEnd = html.indexOf("<"); // 如果indexOf中的索引是0 则说明是个标签
    // 开始标签解析
    if (textEnd == 0) {
      const startTagMatch = parseStartTag(); // 开始标签的匹配结果
      if (startTagMatch) {
        // 解析到的开始标签
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }
    if (textEnd > 0) {
      // 截取文本的内容
      let text = html.substring(0, textEnd); // 文本内容
      if (text) {
        chars(text);
        advance(text.length); // 解析到的文本
      }
    }
  }

  return root;
}
