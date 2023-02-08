const axiso = require('axios');
const accessToken = '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';
const fs = require('fs');
const path = require('path');
// const constants = require('../server/utils/constants')
const exec = require('child_process').exec;
// const md5 = require('../src/utils/md5');
//解析enki的样式文件
// const enkiLangPrefixs = {
//   "-us-en-": constants.LANGUAGE_EN,
//   "-us-es-": constants.LANGUAGE_ES,
//   "-us-zh-sc-": constants.LANGUAGE_CHINESE,
//   "-us-zh-tc-": constants.LANGUAGE_CHINESE_T,
//   "-us-kr-": constants.LANGUAGE_KO,
//   "-us-jp-": constants.LANGUAGE_JA,
//   "-us-vi-": constants.LANGUAGE_VI,
// };
// const enkiLangReg = new RegExp(Object.keys(enkiLangPrefixs).join('|'), 'g');
//统计所有产出文件的数量(7个语言+1个common)
// const writeFileLength = Object.values(enkiLangPrefixs).length + 1;
// let writeFileCount = 0;
//简单的样式变量
const commonStyle = [];
//多语言的导出样式映射表
// const intlStyle = {};


function getWeeeUiScssFileFromAccessToken(callback) {
  axiso
    .get(`https://api.github.com/repos/sayweee/weee-ui/contents/dist/css/_variables.css`, {
      method: 'GET',
      headers: {
        Authorization: `token ${accessToken}`
      }
    })
    .then(res => {
      const { data } = res;
      console.log('文件内容长度', data?.size);
      //base46 decode
      const buff = Buffer.from(data.content, 'base64');
      const textContent = buff.toString('utf-8');
      //split data to array
      const textArray = textContent.trim().split('\n');
      //遍历数组，去掉注释, 去掉无用的字符串, 解析出变量名和值
      textArray.forEach((item, index) => {
        //过滤掉无用的字符串,包含$的字符串是符合的
        if (item.includes('--')) {
          //处理多语言的样式情况
          if (item.includes('--locale')) {
            handleIntlStyle(item, index);
          } else {
            handleCommonStyle(item, index);
          }
        }
      });
      callback();
    })
    .catch(err => {
      if(err.message.includes('401')) {
        console.error(`github access token is invalid, please regenerate it (accessToken:${accessToken})`);
      }
      console.error(err.message, 'err');
    });
}

function generateColorClass(item) {
  const [classKey, classVal] = item.replace(/--root-/, '').split(':');
  const _replaced = classKey
    .replace(/--/g, '')
    .trim();
  //字符串模板的格式不能动, 否则写入时会出现空格
  //暂时需要转换2次,一次是color的, 一次是background的
  return `
${transformFinalMd5String('.', _replaced, 'color', classVal)}
`;
}

/**
 * 
 * @param {*} exactlyKey 不做任何处理的值
 * @param {*} str md5d的值
 * @param {*} val 最终的值
 * @returns 
 */
function transformFinalMd5String (exactlyKey, str, cssKey, cssValue) {
  return `${exactlyKey}${str}{
  ${cssKey}: ${cssValue}
}`;
}

//兼容字体处理
function compatibleFontSize(classVal) {
  return eval(classVal.replace(/px/g, '').replace(';', '').trim());
}

//兼容letter-spacing处理
function compatibleLetterSpacing(classVal) {
  if (classVal.includes('%')) {
    return `${eval(parseFloat(classVal.replace(';', '').trim()) / 100)};`;
  }
  return classVal;
}

/**
 *  处理字体的样式, 目前字体会跟5个样式, 下面是比较临时的方案, 如果字体构建出现变化, 需要重新调整下面的逻辑
--txt-us-en-fluid-root-utility-base-bold: Poppins;
--txt-us-en-fluid-root-utility-base-bold-font-family: Poppins;
--txt-us-en-fluid-root-utility-base-bold-font-weight: 700;
--txt-us-en-fluid-root-utility-base-bold-line-height: 125%;
--txt-us-en-fluid-root-utility-base-bold-font-size: 14px;
--txt-us-en-fluid-root-utility-base-bold-letter-spacing: 0;
  */
function generateFontClass(item, lang) {
  const [classKey, classVal] = item.replace(/--txt-/, '').split(':');
  const _replaced = classKey.replace(/-/g, '').replace('txt', '').trim();

  if (classKey.includes('-font-family')) {
    //$符号需要在非英文和西语环境下使用 SFC 的字体处理
    if(![constants.LANGUAGE_EN, constants.LANGUAGE_ES].includes(lang)) {
      const _fontFamily = `${classVal.replace(/\"/g, '').split(',').filter(item => !['Roboto', "'Poppins'"].includes(item.trim())).join(',').toString()}`;
      return `
.enki-txt-${_replaced.replace(/fontfamily/g, '')} {
  font-family: ${_fontFamily}
`;
    } 
    return `
.enki-txt-${_replaced.replace(/fontfamily/g, '')} {
  font-family: ${classVal.replace(/\"/g, '').split(',').filter(item => item.trim() !== 'Roboto').join(',').toString()}
`;
  }
  if (classKey.includes('-font-weight')) {
    return `  font-weight:${classVal}
`;
  }
  if (classKey.includes('-line-height')) {
    return `  line-height:${classVal}
`;
  }
  if (classKey.includes('-font-size')) {
    const _fontSize = compatibleFontSize(classVal);
    return `  font-size:${_fontSize}px;
`;
  }
  if (classKey.includes('-letter-spacing')) {
    return `  letter-spacing:${classVal}
}`;
  }
}

/**
 * 处理一些额外的字体样式
--font-fixed-brand-sm-size: 14px;
--font-fixed-brand-sm-weight: 600;
--font-fixed-brand-sm-letter-spacing: -2%;
--font-fixed-brand-sm-line-height: 100%;
--font-fixed-brand-sm-bold-size: 14px;
--font-fixed-brand-sm-bold-weight: 700;
--font-fixed-brand-sm-bold-letter-spacing: -2%;
--font-fixed-brand-sm-bold-line-height: 100%;
--font-fixed-brand-sm-subdued-size: 14px;
--font-fixed-brand-sm-subdued-weight: 400;
--font-fixed-brand-sm-subdued-letter-spacing: -2%;
--font-fixed-brand-sm-subdued-line-height: 100%;
  */
function generateOtherFontClass(item) {
  const [classKey, classVal] = item.replace(/--font-/, '').split(':');
  const _replaced = classKey.replace(/-/g, '').trim();
  if (classKey.includes('-size')) {
    const _fontSize = compatibleFontSize(classVal);
    return `
.enki-font-${_replaced.replace(/size/g, '')} {
  font-size:${_fontSize}px;
`;
  }
  if (classKey.includes('-weight')) {
    return `  font-weight:${classVal}
`;
  }
  if (classKey.includes('-letter-spacing')) {
    return `  letter-spacing:${compatibleLetterSpacing(classVal)}
`;
  }
  if (classKey.includes('-line-height')) {
    return `  line-height:${classVal}
}`;
  }
  //处理单个字体属性样式
  if (classKey.includes('size')) {
    const _fontSize = compatibleFontSize(classVal);
    return `
.enki-font-${_replaced} {
  font-size:${_fontSize}px;
}`;
  }
  if (classKey.includes('weight')) {
    return `
.enki-font-${_replaced} {
  font-weight:${classVal}
}`;
  }
  if (classKey.includes('letter-spacing')) {
    return `
.enki-font-${_replaced} {
  letter-spacing:${compatibleLetterSpacing(classVal)}
}`;
  }
  if (classKey.includes('line-height')) {
    return `
.enki-font-${_replaced} {
  line-height:${classVal}
}`;
  }
}

function handleCommonStyle(item, index) {
  let classContent = '';
  //处理颜色的样式
  if (item.includes('-color-')) {
    classContent = generateColorClass(item);
  }
  //处理其他文字的样式
  if (item.includes('--font-')) {
    // classContent = generateOtherFontClass(item);
  }
  if(classContent) {
    commonStyle.push(classContent);
  }
  //处理多语言文字字体的样式
  // if (item.includes('--txt-')) {
  //   const regResult = item.match(enkiLangReg);
  //   //匹配到语言位置
  //   if(regResult && regResult[0]) {
  //     //转换成项目中的语言位 zh/en/es/ja
  //     const lang = regResult[0];
  //     const projecAssetstLang = enkiLangPrefixs[lang];
  //     //放入对应的语言数组中, 并且剔除掉语言前缀
  //     if(!intlStyle[projecAssetstLang]) {
  //       intlStyle[projecAssetstLang] = [];
  //     }
  //     classContent = generateFontClass(item.replace(lang, ''), projecAssetstLang);
  //     intlStyle[projecAssetstLang].push(classContent);
  //   } else {
  //     console.log('处理多语言文字字体的样式 匹配错误, 数据是: ', item)
  //   }
  // }
}

function handleIntlStyle(item, index) {}

function compressCss() {
  //shell命令调用css-minify压缩css;
  exec('css-minify --dir public/enki/styles --output public/enki/styles', function (err, stdout, stderr) {
    if (err) {
      console.log('css-minify 压缩css失败, 原因是: ', err);
      return;
    }
    console.log('css-minify 压缩css成功');
  });
}

function writeDataToFile(enkiScssPath, dataStyle) {
  fs.openSync(enkiScssPath, 'w');
  fs.writeFile(
    enkiScssPath,
    `
/** 
 * this file is auto generate by bin/sync-enki-style.js
 * please do not modify it
 * generated time: ${new Date().toLocaleString()}
 */
${dataStyle.join('')}
`,
      function (err) {
        if (err) {
          console.log('写入文件失败, 文件路径是: ', enkiScssPath)
          return console.error(err);
        }
        console.log(`${enkiScssPath} 数据写入文件成功！`);
        // writeFileCount++;
        // if(writeFileCount === writeFileLength) {
          console.log('所有文件写入完成');
          //将所有的产出的css文件压缩成.min.css文件
          // compressCss();
        // }
      }
    );
}

getWeeeUiScssFileFromAccessToken(() => {
  if (!commonStyle.length) return;
  //将数组内容写入文件中, 如果文件不存在则创建, 区分通用的样式, 和多语言的样式
  const commPath = path.join(__dirname, '../public/enki/styles');
  const enkiScssPath = path.join(commPath, 'enki-common.css');
  // const intlScssPaths = Object.values(enkiLangPrefixs).map(lang => path.join(commPath, `enki-${lang}.css`));
  try {
    fs.rmdir(commPath, {
      recursive: true
    }, () => {
      fs.mkdirSync(commPath, { recursive: true });
      writeDataToFile(enkiScssPath, commonStyle);
      // intlScssPaths.forEach((path, index) => {
      //   writeDataToFile(path, intlStyle[Object.values(enkiLangPrefixs)[index]]);
      // });
    })
  } catch (err) {
    console.error(err);
  }
});