//webpack loader replace className with regex like 'color/surface/1/fg/default/idle'
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require('@babel/generator').default;
const path = require('path');
const t = require("@babel/types");

module.exports = function (source, sourceMap,meta) {
  const ast = parser.parse(source, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript",
      "classProperties",
      "objectRestSpread",
      "dynamicImport",
    ],
  });
  traverse(ast, {
    ImportDeclaration(path) {},
    CallExpression(path) {},
    JSXElement(path) {
      if(path.node.openingElement.attributes.length) {
        let agTokenClassName = ''
        path.node.openingElement.attributes.forEach((attr) => {
          if(attr.name && attr.name.name && attr.name.name === 'agToken') {
            const value = attr.value.value;
            if(value) {
              //if agToken value is like 'txt/us-en/fluid-root/utility-sm' then split / and get last value
              let colorVal, bgVal, fontVal;
              fontVal = value.replace(/\b(txt.+)\b/g, (match, p1, p2) => {
                if(p1) {
                  return `font-${p1.split('/').pop().replace(/\//g, '-')}`;
                }
              });
              console.log(fontVal, ';fontVal')
              colorVal = fontVal.replace(/\b(color\/.+)\b/g, (match, p1, p2) => {
                if(p1) {
                  console.log(match, p1, p2, ';colorVal')

                  return p1.replace(/\//g, '-').replace("color", "text")
                }
              });
              bgVal = colorVal.replace(/\b(bg.+)\b/g, (match, p1, p2) => {
                if(p1) {
                  console.log(p1, ';bgVal')

                  return p1.replace(/\//g, '-')
                }
              });
              
              console.log(bgVal, 'fontVal')
              agTokenClassName = `${fontVal}`;
            }
          }
        });
        //remove agToken attribute
        path.node.openingElement.attributes = path.node.openingElement.attributes.filter((attr) => {
          return attr.name && attr.name.name && attr.name.name !== 'agToken';
        });
        if(agTokenClassName) {
          path.node.openingElement.attributes.forEach((attr) => {
            if(attr.name.name === 'className') {
              attr.value.value = `${attr.value.value} ${agTokenClassName}`;
            }
          });
        }
      }
    },
    JSXAttribute(path) {
      // console.log(path.node.name.name, 'JSXAttribute name');
      // if(path.node.name.name === 'className') {
      //   const value = path.node.value.value;
      //   if(value) {
      //     const newValue = value.replace(/\b(color\/.+)\b/g, (match, p1, p2) => {
      //       if(p1) {
      //         return p1.replace(/\//g, '-');
      //       }
      //     });
      //     path.node.value.value = newValue;
      //   }
      // }
    }
  });
  this.callback(null,generate(ast).code,sourceMap,meta);
  
  return source;
}
